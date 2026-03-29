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
        center: [35, 20],
        zoom: 3,
        minZoom: 2,
        maxZoom: 16,
        zoomControl: false,
      })

      L.control.zoom({ position: 'topright' }).addTo(map)

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OSM &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)

      map.on('click', (e: { latlng: { lat: number; lng: number } }) => {
        if (!disabled) onMapClick(e.latlng.lat, e.latlng.lng)
      })

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

    markersRef.current.forEach((m: { remove: () => void }) => m.remove())
    markersRef.current = []

    explorations.forEach(exp => {
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:40px;height:40px;border-radius:50%;border:2px solid rgba(148,163,184,0.7);background-image:url(${exp.imageData});background-size:cover;background-position:center;cursor:pointer;box-shadow:0 0 12px rgba(0,0,0,0.8);transition:transform 0.2s;" onmouseenter="this.style.transform='scale(1.3)'" onmouseleave="this.style.transform='scale(1)'"></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      })

      const marker = L.marker([exp.lat, exp.lng], { icon }).addTo(map)
      marker.on('click', (e: { originalEvent: { stopPropagation: () => void } }) => {
        e.originalEvent.stopPropagation()
        onMarkerClick(exp)
      })
      markersRef.current.push(marker)
    })
  }, [explorations, mapReady, onMarkerClick])

  return <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
}
