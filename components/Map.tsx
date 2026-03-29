'use client'

import { useEffect, useRef, useState } from 'react'
import type { Exploration } from '../lib/storage'

interface Props {
  explorations: Exploration[]
  onMapClick: (lat: number, lng: number) => void
  onMarkerClick: (e: Exploration) => void
  disabled: boolean
}

export default function Map({ explorations, onMapClick, onMarkerClick, disabled }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([])
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Dynamic import of Leaflet (client-side only)
    import('leaflet').then((L) => {
      // Fix default icons
      delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(containerRef.current!, {
        center: [30, 20],
        zoom: 3,
        minZoom: 2,
        maxZoom: 16,
        zoomControl: false,
        attributionControl: false,
      })

      L.control.zoom({ position: 'topright' }).addTo(map)

      // Dark map tiles - using CARTO dark_nolabels for cleaner look
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)

      map.on('click', (e: { latlng: { lat: number; lng: number } }) => {
        if (!disabled) onMapClick(e.latlng.lat, e.latlng.lng)
      })

      // Crosshair cursor
      map.getContainer().style.cursor = 'crosshair'
      
      mapRef.current = { map, L }
      setMapReady(true)
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.map.remove()
        mapRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!mapRef.current || !mapReady) return
    const { map, L } = mapRef.current

    // Remove old markers
    markersRef.current.forEach((m: { remove: () => void }) => m.remove())
    markersRef.current = []

    // Add markers with elegant glass-morphism style
    explorations.forEach(exp => {
      const icon = L.divIcon({
        className: '',
        html: `
          <div style="
            position: relative;
            width: 48px;
            height: 48px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          "
          onmouseenter="this.style.transform='scale(1.2)'"
          onmouseleave="this.style.transform='scale(1)'">
            <!-- Background glow -->
            <div style="
              position: absolute;
              inset: 0;
              border-radius: 50%;
              background: radial-gradient(circle, rgba(212,165,116,0.3), transparent 70%);
              animation: pulse 2s ease-in-out infinite;
            "></div>
            <!-- Main circle with glass effect -->
            <div style="
              position: absolute;
              inset: 4px;
              border-radius: 50%;
              background-image: url(${exp.imageData});
              background-size: cover;
              background-position: center;
              border: 2px solid rgba(212,165,116,0.6);
              box-shadow:
                0 0 0 1px rgba(255,255,255,0.1),
                0 4px 16px rgba(0,0,0,0.6),
                0 0 32px rgba(212,165,116,0.2);
            "></div>
            <!-- Inner ring -->
            <div style="
              position: absolute;
              inset: 1px;
              border-radius: 50%;
              border: 1px solid rgba(255,255,255,0.1);
              pointer-events: none;
            "></div>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
      })

      const marker = L.marker([exp.lat, exp.lng], { icon }).addTo(map)
      
      marker.on('click', (e: { originalEvent: { stopPropagation: () => void } }) => {
        e.originalEvent.stopPropagation()
        onMarkerClick(exp)
      })
      
      markersRef.current.push(marker)
    })
  }, [explorations, mapReady, onMarkerClick])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        cursor: disabled ? 'wait' : 'crosshair',
      }}
    />
  )
}
