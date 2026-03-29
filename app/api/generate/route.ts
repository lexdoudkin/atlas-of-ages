import { NextRequest, NextResponse } from 'next/server'
import { GoogleAuth } from 'google-auth-library'

function getEra(year: number): string {
  if (year < -3000) return 'Prehistoric'
  if (year < -500) return 'Ancient World'
  if (year < 500) return 'Classical Antiquity'
  if (year < 1400) return 'Medieval Period'
  if (year < 1600) return 'Renaissance'
  if (year < 1800) return 'Age of Enlightenment'
  if (year < 1900) return 'Industrial Revolution'
  if (year < 1970) return 'Modern Era'
  return 'Contemporary'
}

function formatYear(y: number): string {
  return y < 0 ? `${Math.abs(y)} BC` : `${y} AD`
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`,
      { headers: { 'User-Agent': 'AtlasOfAges/1.0' } }
    )
    const data = await res.json()
    const addr = data.address || {}
    return addr.city || addr.town || addr.village || addr.county || addr.state || data.display_name?.split(',')[0] || 'Unknown Location'
  } catch {
    return `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`
  }
}

function buildPrompt(place: string, year: number, era: string, lat: number, lng: number): string {
  return `Hyperrealistic historical photograph of ${place} in ${formatYear(year)} (${era}).

Street-level perspective showing authentic architecture, infrastructure, and daily life of the period. Include period-appropriate clothing, transportation, vegetation, and technology. Geographic coordinates: ${lat.toFixed(1)}°N, ${lng.toFixed(1)}°E.

Style: National Geographic documentary photograph, cinematic lighting, rich detail, 16:9 landscape format. No modern elements, no anachronisms.`
}

function placeholderSvg(place: string, yearStr: string): string {
  const svg = `<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a"/><stop offset="100%" style="stop-color:#1e293b"/>
    </linearGradient></defs>
    <rect width="1280" height="720" fill="url(#g)"/>
    <text x="640" y="320" font-family="system-ui" font-size="36" fill="#94a3b8" text-anchor="middle">${place}</text>
    <text x="640" y="380" font-family="system-ui" font-size="56" fill="#e2e8f0" text-anchor="middle" font-weight="300">${yearStr}</text>
    <text x="640" y="440" font-family="system-ui" font-size="18" fill="#475569" text-anchor="middle">Configure Vertex AI to generate images</text>
  </svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

async function generateWithVertex(prompt: string): Promise<{image: string | null, error: string | null}> {
  const project = process.env.GOOGLE_CLOUD_PROJECT
  const region = process.env.GOOGLE_CLOUD_REGION || 'us-central1'
  if (!project) return { image: null, error: 'GOOGLE_CLOUD_PROJECT not set' }

  try {
    let token: string | null | undefined = null

    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      const creds = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
      const auth = new GoogleAuth({
        credentials: creds,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      })
      const client = await auth.getClient()
      const tokenRes = await client.getAccessToken()
      token = tokenRes.token
    }

    if (!token) return { image: null, error: 'Failed to get access token (no credentials found)' }

    const url = `https://${region}-aiplatform.googleapis.com/v1/projects/${project}/locations/${region}/publishers/google/models/imagen-3.0-generate-001:predict`

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: '16:9',
          safetySetting: 'block_some',
          personGeneration: 'allow_adult',
        },
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      return { image: null, error: `Vertex AI ${res.status}: ${errorText.substring(0, 500)}` }
    }

    const data = await res.json()
    if (data.predictions?.[0]?.bytesBase64Encoded) {
      return { image: `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`, error: null }
    }
    return { image: null, error: 'No image in Vertex AI response: ' + JSON.stringify(data).substring(0, 200) }
  } catch (e) {
    return { image: null, error: `Exception: ${e instanceof Error ? e.message : String(e)}` }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { lat, lng, year } = await req.json()
    const placeName = await reverseGeocode(lat, lng)
    const era = getEra(year)
    const yearStr = formatYear(year)
    const prompt = buildPrompt(placeName, year, era, lat, lng)

    const vertexResult = await generateWithVertex(prompt)
    let imageData = vertexResult.image
    const vertexError = vertexResult.error
    if (!imageData) {
      imageData = placeholderSvg(placeName, yearStr)
    }

    return NextResponse.json({
      success: true,
      exploration: { lat, lng, year, era, placeName, imageData, prompt },
      vertexError: vertexError || null,
    })
  } catch (e) {
    console.error('Generate error:', e)
    return NextResponse.json({ success: false, error: 'Generation failed' }, { status: 500 })
  }
}
