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

async function reverseGeocode(lat: number, lng: number): Promise<{
  placeName: string
  country: string
  region: string
  type: string // city, village, wilderness, ocean
}> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10&accept-language=en`,
      { headers: { 'User-Agent': 'AtlasOfAges/1.0' } }
    )
    const data = await res.json()
    if (data.error) {
      // Ocean or unmapped area
      return { placeName: 'Open Ocean', country: '', region: '', type: 'ocean' }
    }
    const addr = data.address || {}
    const placeName = addr.city || addr.town || addr.village || addr.hamlet || addr.county || addr.state || data.display_name?.split(',')[0] || 'Unknown'
    const country = addr.country || ''
    const region = addr.state || addr.region || ''
    const hasCity = !!(addr.city || addr.town)
    const hasVillage = !!(addr.village || addr.hamlet)
    const type = hasCity ? 'city' : hasVillage ? 'village' : 'wilderness'
    return { placeName, country, region, type }
  } catch {
    return { placeName: `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`, country: '', region: '', type: 'wilderness' }
  }
}

// Determine what was historically at this location
function getHistoricalContext(lat: number, lng: number, year: number, country: string, region: string): string {
  // Major civilization mapping based on coordinates and time
  const contexts: string[] = []

  // Egypt / Nile
  if (lat > 22 && lat < 32 && lng > 24 && lng < 35) {
    if (year < -3000) contexts.push('Pre-dynastic Nile settlements, mud-brick dwellings, papyrus marshes')
    else if (year < -500) contexts.push('Ancient Egyptian civilization, temples, pyramids, irrigated farmland along the Nile')
    else if (year < 640) contexts.push('Greco-Roman Egypt, Alexandria, Coptic monasteries')
    else contexts.push('Islamic Egypt, mosques, bazaars, Mamluk architecture')
  }
  // Mesopotamia / Iraq
  if (lat > 29 && lat < 38 && lng > 38 && lng < 50) {
    if (year < -2000) contexts.push('Sumerian/Akkadian civilization, ziggurats, irrigation canals, mud-brick cities')
    else if (year < -500) contexts.push('Babylonian/Assyrian empire, massive fortified cities')
  }
  // Greece
  if (lat > 35 && lat < 42 && lng > 19 && lng < 30) {
    if (year > -800 && year < -150) contexts.push('Ancient Greek city-states, marble temples, agoras, olive groves')
    else if (year < 1453) contexts.push('Byzantine Empire, Orthodox churches, fortified hilltop towns')
  }
  // Rome / Italy
  if (lat > 36 && lat < 47 && lng > 6 && lng < 19) {
    if (year > -753 && year < 476) contexts.push('Roman civilization, forums, aqueducts, roads, villas, public baths')
    else if (year > 1300 && year < 1600) contexts.push('Italian Renaissance, ornate palaces, cathedrals, piazzas')
  }
  // China
  if (lat > 18 && lat < 54 && lng > 73 && lng < 135) {
    if (year < -1000) contexts.push('Ancient Chinese Bronze Age settlements, rice paddies')
    else if (year < 220) contexts.push('Han Dynasty China, walled cities, Silk Road trading posts')
    else if (year < 1368) contexts.push('Imperial China, pagodas, terraced fields, the Great Wall')
  }
  // India
  if (lat > 6 && lat < 36 && lng > 68 && lng < 90) {
    if (year < -1500) contexts.push('Indus Valley civilization, grid-planned brick cities')
    else if (year < 300) contexts.push('Ancient India, Buddhist stupas, Mauryan empire architecture')
    else if (year < 1600) contexts.push('Medieval Indian kingdoms, Hindu temples, Mughal architecture')
  }
  // Northern Europe
  if (lat > 48 && lat < 72 && lng > -10 && lng < 40) {
    if (year < -500) contexts.push('Celtic/Germanic tribal lands, dense forests, scattered hillforts')
    else if (year < 500) contexts.push('Roman frontier or Germanic tribal territories, wooden longhouses')
    else if (year < 1400) contexts.push('Medieval European towns, stone castles, Gothic cathedrals, farming villages')
  }
  // Americas
  if (lng < -30) {
    if (year < 1492) {
      if (lat > 14 && lat < 24 && lng > -105 && lng < -85) contexts.push('Mesoamerican civilization, Aztec/Maya pyramids, jungle cities')
      else if (lat > -20 && lat < 5 && lng > -80 && lng < -65) contexts.push('Andean civilization, Inca stone architecture, terraced mountains')
      else contexts.push('Indigenous peoples, natural landscape largely untouched, forests and plains')
    } else if (year < 1800) contexts.push('Colonial era, Spanish/Portuguese/British colonial architecture')
  }
  // Sub-Saharan Africa
  if (lat > -35 && lat < 15 && lng > -20 && lng < 55) {
    if (year < 1500) contexts.push('African kingdoms, mud-brick and thatch structures, savanna and forest landscapes')
  }
  // Australia
  if (lat > -45 && lat < -10 && lng > 110 && lng < 160) {
    if (year < 1770) contexts.push('Aboriginal Australian land, pristine bushland, no European structures')
  }
  // Arctic / Siberia
  if (lat > 60) {
    if (year < 1600) contexts.push('Vast empty tundra or taiga, nomadic indigenous peoples, no permanent structures')
  }

  return contexts.length > 0 ? contexts.join('. ') : ''
}

// Determine the natural landscape based on coordinates
function getTerrainContext(lat: number, lng: number): string {
  const absLat = Math.abs(lat)
  if (absLat > 70) return 'arctic tundra, snow-covered, extremely sparse vegetation'
  if (absLat > 55) return 'boreal forest (taiga), coniferous trees, cold climate'
  if (absLat > 40) return 'temperate forest or grassland, deciduous trees'
  if (absLat > 23) {
    // Check if desert belt
    if ((lng > -20 && lng < 60) || (lng > 100 && lng < 120)) return 'arid or semi-arid landscape, sand or scrubland'
    return 'subtropical, lush vegetation, warm climate'
  }
  if (absLat > 10) return 'tropical, dense vegetation, hot and humid'
  return 'equatorial, rainforest or open savanna depending on elevation'
}

function buildPrompt(
  placeName: string, year: number, era: string,
  lat: number, lng: number,
  country: string, region: string, locationType: string
): string {
  const yearStr = formatYear(year)
  const historicalCtx = getHistoricalContext(lat, lng, year, country, region)
  const terrain = getTerrainContext(lat, lng)

  // For very ancient periods or remote areas, emphasize natural landscape
  const isPrehistoric = year < -3000
  const isRemote = locationType === 'wilderness' || locationType === 'ocean'
  const isAncient = year < -500

  let sceneDescription: string
  if (locationType === 'ocean') {
    sceneDescription = `Open ocean at coordinates ${lat.toFixed(1)}°, ${lng.toFixed(1)}°. Vast empty sea stretching to the horizon, appropriate wave conditions for the latitude. ${year < 1500 ? 'No ships visible.' : 'Perhaps a period-appropriate sailing vessel in the distance.'}`
  } else if (isPrehistoric && isRemote) {
    sceneDescription = `Pristine natural landscape of ${region || country || 'this region'} in ${yearStr}. No human structures. Pure wilderness: ${terrain}. The land as it existed before human civilization. Ground-level perspective as if you are standing there.`
  } else if (isAncient && isRemote) {
    sceneDescription = `${region || country || 'This region'} in ${yearStr}. ${historicalCtx || `Largely untouched natural landscape: ${terrain}. Very sparse or no human settlement at this exact location.`} Ground-level view.`
  } else {
    const locationDesc = placeName !== country ? `${placeName}, ${country || region}` : placeName
    sceneDescription = `${locationDesc} in ${yearStr} (${era}). ${historicalCtx || `Period-appropriate architecture and daily life for ${country || 'this region'}.`} Street-level perspective showing authentic buildings, people in period clothing, transportation methods of the era. Natural environment: ${terrain}.`
  }

  return `Ultra-realistic 4K photograph: ${sceneDescription}

CRITICAL REQUIREMENTS:
- This must look like a real photograph taken by a modern 4K camera, just transported back in time
- Photorealistic lighting (natural sunlight, accurate shadows, atmospheric haze)
- Historically accurate: no anachronistic elements whatsoever
- If this location had no major civilization in ${yearStr}, show ONLY natural landscape (forest, plains, tundra, desert) with no buildings
- Ground-level human perspective, eye-height camera angle
- Rich detail: textures of stone, wood, fabric, soil, vegetation all visible
- 16:9 landscape format, cinematic composition

Style: National Geographic documentary photograph, shot on Hasselblad medium format, natural color grading, no filters, no artistic interpretation. Pure documentary realism.`
}

function placeholderSvg(placeName: string, yearStr: string): string {
  const svg = `<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#E8E4DF"/><stop offset="100%" style="stop-color:#D4CFC8"/>
    </linearGradient></defs>
    <rect width="1280" height="720" fill="url(#g)"/>
    <text x="640" y="320" font-family="serif" font-size="36" fill="#7A7067" text-anchor="middle">${placeName}</text>
    <text x="640" y="380" font-family="serif" font-size="56" fill="#1A1612" text-anchor="middle" font-weight="300">${yearStr}</text>
    <text x="640" y="440" font-family="sans-serif" font-size="16" fill="#9A8E82" text-anchor="middle">Enable Vertex AI billing to generate images</text>
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

    if (!token) return { image: null, error: 'Failed to get access token' }

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
    return { image: null, error: 'No image in response: ' + JSON.stringify(data).substring(0, 200) }
  } catch (e) {
    return { image: null, error: `Exception: ${e instanceof Error ? e.message : String(e)}` }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { lat, lng, year } = await req.json()
    const geo = await reverseGeocode(lat, lng)
    const era = getEra(year)
    const yearStr = formatYear(year)
    const prompt = buildPrompt(geo.placeName, year, era, lat, lng, geo.country, geo.region, geo.type)

    const vertexResult = await generateWithVertex(prompt)
    let imageData = vertexResult.image
    if (!imageData) {
      imageData = placeholderSvg(geo.placeName, yearStr)
    }

    return NextResponse.json({
      success: true,
      exploration: { lat, lng, year, era, placeName: geo.placeName, imageData, prompt },
      vertexError: vertexResult.error || null,
    })
  } catch (e) {
    console.error('Generate error:', e)
    return NextResponse.json({ success: false, error: 'Generation failed' }, { status: 500 })
  }
}
