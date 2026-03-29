'use client'

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import type { Exploration } from '../lib/storage'

interface Props {
  explorations: Exploration[]
  onMapClick: (lat: number, lng: number) => void
  onMarkerClick: (e: Exploration) => void
  disabled: boolean
}

export default function Map({ explorations, onMapClick, onMarkerClick, disabled }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<maplibregl.Marker[]>([])
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8 as const,
        sources: {
          carto: {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
            ],
            tileSize: 256,
          },
        },
        layers: [{ id: 'carto', type: 'raster', source: 'carto' }],
      },
      center: [20, 35],
      zoom: 2.5,
      maxZoom: 16,
      minZoom: 1.5,
    })

    map.getCanvas().style.cursor = 'crosshair'
    map.addControl(new maplibregl.NavigationControl(), 'top-right')
    map.on('load', () => setMapReady(true))
    map.on('click', (e: maplibregl.MapMouseEvent) => { if (!disabled) onMapClick(e.lngLat.lat, e.lngLat.lng) })

    mapRef.current = map
    return () => { map.remove(); mapRef.current = null }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!mapRef.current || !mapReady) return
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    explorations.forEach(exp => {
      const el = document.createElement('div')
      Object.assign(el.style, {
        width: '40px', height: '40px', borderRadius: '50%',
        border: '2px solid rgba(148,163,184,0.7)',
        backgroundImage: `url(${exp.imageData})`, backgroundSize: 'cover', backgroundPosition: 'center',
        cursor: 'pointer', boxShadow: '0 0 12px rgba(0,0,0,0.8)', transition: 'transform 0.2s',
      })
      el.onmouseenter = () => { el.style.transform = 'scale(1.3)' }
      el.onmouseleave = () => { el.style.transform = 'scale(1)' }
      el.onclick = (e) => { e.stopPropagation(); onMarkerClick(exp) }

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([exp.lng, exp.lat])
        .addTo(mapRef.current!)
      markersRef.current.push(marker)
    })
  }, [explorations, mapReady, onMarkerClick])

  return <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
}
