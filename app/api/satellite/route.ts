import { NextRequest, NextResponse } from 'next/server'

// Google Earth Engine imagery endpoint
// Gets a satellite tile (Sentinel-2 or Landsat) for the given coordinates
// This gives us real terrain data: water, forest, urban, desert, etc.

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get('lat')
  const lon = req.nextUrl.searchParams.get('lon')
  const year = req.nextUrl.searchParams.get('year') || '2024'

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Missing lat/lon' }, { status: 400 })
  }

  const latNum = parseFloat(lat)
  const lonNum = parseFloat(lon)

  try {
    // Option 1: Sentinel Hub (free, no auth needed for preview URLs)
    // Returns a satellite image tile at 10m resolution
    // Format: https://services.sentinel-hub.com/ogc/wms?...
    
    const bbox = {
      minLon: lonNum - 0.05,
      maxLon: lonNum + 0.05,
      minLat: latNum - 0.05,
      maxLat: latNum + 0.05,
    }

    // Copernicus Data Space true color Sentinel-2 imagery
    // Uses WMS with bbox
    const wmsUrl = new URL('https://services.sentinel-hub.com/ogc/wms')
    wmsUrl.searchParams.set('SERVICE', 'WMS')
    wmsUrl.searchParams.set('VERSION', '1.1.1')
    wmsUrl.searchParams.set('REQUEST', 'GetMap')
    wmsUrl.searchParams.set('LAYERS', 'TRUE_COLOR')
    wmsUrl.searchParams.set('BBOX', `${bbox.minLon},${bbox.minLat},${bbox.maxLon},${bbox.maxLat}`)
    wmsUrl.searchParams.set('WIDTH', '512')
    wmsUrl.searchParams.set('HEIGHT', '512')
    wmsUrl.searchParams.set('CRS', 'EPSG:4326')
    wmsUrl.searchParams.set('TRANSPARENT', 'TRUE')
    wmsUrl.searchParams.set('FORMAT', 'image/png')
    wmsUrl.searchParams.set('EVALSCRIPT', Buffer.from(
      `//VERSION=3
      function setup() {
        return {
          input: ["B04", "B03", "B02"],
          output: { bands: 3 }
        };
      }
      function evaluatePixel(sample) {
        return [sample.B04, sample.B03, sample.B02];
      }`
    ).toString('base64'))

    // Fallback: static map tile from OpenStreetMap (free, no auth)
    // This is simpler and works instantly
    const osmUrl = `https://tile.openstreetmap.org/15/${Math.floor((lonNum + 180) / 360 * Math.pow(2, 15))}/${Math.floor((1 - Math.log(Math.tan(latNum * Math.PI / 180) + 1 / Math.cos(latNum * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, 15))}.png`

    // For MVP: return the OSM tile URL + metadata
    // The frontend can fetch this and pass to Claude vision
    // OR we fetch the tile server-side and return as base64

    // Actually: use StaticMap API (free map tile provider)
    const mapUrl = `https://static-maps.yandex.ru/1.x/?ll=${lonNum},${latNum}&z=14&size=512,512&l=map`

    // Best option: Maptiler or MapBox static maps (require API key, paid)
    // Fallback: construct a Leaflet tile URL that Imagen can see

    // For NOW: return a Nominatim + elevation context, plus a reference tile URL
    // The model can use this to inform the generation

    const nominatim = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latNum}&lon=${lonNum}&format=json&zoom=14&accept-language=en`,
      { headers: { 'User-Agent': 'AtlasOfAges/1.0' } }
    ).then(r => r.json()).catch(() => ({}))

    const elevation = await fetch(
      `https://api.open-meteo.com/v1/elevation?latitude=${latNum}&longitude=${lonNum}`
    ).then(r => r.json()).catch(() => ({ elevation: [0] }))

    const terrainClass = nominatim.class || 'unknown'
    const terrainType = nominatim.type || 'area'
    const place = nominatim.address?.city || nominatim.address?.town || nominatim.address?.village || nominatim.display_name?.split(',')[0] || 'unnamed location'
    const elev = elevation.elevation?.[0] || 0

    // Analyze terrain from location name + elevation + class
    let terrainDescription = ''
    if (terrainClass === 'water' || terrainType === 'water') {
      terrainDescription = 'WATER BODY: lake, river, or sea. Show ONLY water, no land, no buildings, no roads.'
    } else if (terrainClass === 'natural' && terrainType === 'forest') {
      terrainDescription = 'DENSE FOREST: thick trees, no visible roads or settlements. Show pristine wilderness.'
    } else if (elev > 2500) {
      terrainDescription = 'HIGH MOUNTAIN: alpine terrain above treeline. Show rocky peaks, sparse vegetation, extreme elevation.'
    } else if (elev < 100 && (terrainClass === 'boundary' || place.toLowerCase().includes('sea'))) {
      terrainDescription = 'COASTAL AREA: beach, dunes, sea cliffs. Show shoreline, waves, sand.'
    } else if (place.toLowerCase().includes('desert') || place.toLowerCase().includes('sahara')) {
      terrainDescription = 'DESERT: endless sand dunes, no vegetation, no water. Show arid landscape.'
    } else if (place.toLowerCase().includes('amazon') || place.toLowerCase().includes('rainforest')) {
      terrainDescription = 'RAINFOREST: extremely dense jungle, no clearings, no roads. Show untouched wilderness.'
    } else if (terrainClass === 'place') {
      terrainDescription = `SETTLEMENT: ${place}. Show buildings, streets, urban or rural architecture. MUST be historically accurate to ${year}.`
    } else {
      terrainDescription = `LANDSCAPE near ${place}. Elevation ${elev}m. Terrain class: ${terrainClass}/${terrainType}. Show accurate geography.`
    }

    // Tile providers for visual reference
    const tileUrls = {
      osm: `https://tile.openstreetmap.org/15/${Math.floor((lonNum + 180) / 360 * Math.pow(2, 15))}/${Math.floor((1 - Math.log(Math.tan(latNum * Math.PI / 180) + 1 / Math.cos(latNum * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, 15))}.png`,
      satellite: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/13/${Math.floor((lonNum + 180) / 360 * Math.pow(2, 13))}/${Math.floor((1 - Math.log(Math.tan(latNum * Math.PI / 180) + 1 / Math.cos(latNum * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, 13))}`,
    }

    return NextResponse.json({
      location: place,
      terrain: terrainDescription,
      elevation: elev,
      class: terrainClass,
      type: terrainType,
      nominatim: {
        display_name: nominatim.display_name,
        address: nominatim.address,
      },
      tiles: tileUrls,
    })
  } catch (error) {
    console.error('Satellite/terrain lookup error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch satellite/terrain data' },
      { status: 500 }
    )
  }
}
