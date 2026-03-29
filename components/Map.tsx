'use client'

import { useEffect, useRef, useState } from 'react'
import type { Exploration } from '../lib/storage'
import type { Theme } from '../lib/theme'

interface Props {
  explorations: Exploration[]
  onMapClick: (lat: number, lng: number) => void
  onMarkerClick: (e: Exploration) => void
  disabled: boolean
  theme: Theme
  isDark: boolean
  pendingClick?: { lat: number; lng: number } | null
}

const COUNTRIES_URL = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson'

export default function Map({ explorations, onMapClick, onMarkerClick, disabled, theme, isDark, pendingClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tileLayerRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bordersLayerRef = useRef<any>(null)
  const [mapReady, setMapReady] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl

      const map = L.map(containerRef.current!, {
        center: [30, 20],
        zoom: 3,
        minZoom: 2,
        maxZoom: 16,
        zoomControl: false,
        attributionControl: false,
      })

      L.control.zoom({ position: 'topright' }).addTo(map)

      // Add tile layer
      const tiles = L.tileLayer(theme.mapTiles, {
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)
      tileLayerRef.current = tiles

      // Load country boundaries for outlines
      fetch(COUNTRIES_URL)
        .then(r => r.json())
        .then(geojson => {
          const borders = L.geoJSON(geojson, {
            style: {
              color: theme.countryBorder,
              weight: 1.2,
              opacity: 0.7,
              fillColor: theme.countryFill,
              fillOpacity: 0.3,
              interactive: false,
            },
          }).addTo(map)
          bordersLayerRef.current = borders
        })
        .catch(() => {}) // Silently fail if geojson doesn't load

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

  // Update tiles and borders when theme changes
  useEffect(() => {
    if (!mapRef.current || !mapReady) return
    const { map, L } = mapRef.current

    // Swap tile layer
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current)
    }
    const newTiles = L.tileLayer(theme.mapTiles, {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)
    tileLayerRef.current = newTiles
    // Move tiles to back so borders stay on top
    newTiles.bringToBack()

    // Update border colors
    if (bordersLayerRef.current) {
      bordersLayerRef.current.setStyle({
        color: theme.countryBorder,
        fillColor: theme.countryFill,
      })
    }

    // Update container bg
    map.getContainer().style.background = theme.mapBg
  }, [isDark, theme, mapReady])

  // Pending click marker
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pendingMarkerRef = useRef<any>(null)
  useEffect(() => {
    if (!mapRef.current || !mapReady) return
    const { map, L } = mapRef.current

    if (pendingMarkerRef.current) {
      map.removeLayer(pendingMarkerRef.current)
      pendingMarkerRef.current = null
    }

    if (pendingClick) {
      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:20px;height:20px;border-radius:50%;
          background:${theme.accent};
          border:3px solid #fff;
          box-shadow:0 2px 8px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })
      pendingMarkerRef.current = L.marker([pendingClick.lat, pendingClick.lng], { icon, interactive: false }).addTo(map)
    }
  }, [pendingClick, mapReady, theme])

  // Update exploration markers (clean, no animations)
  useEffect(() => {
    if (!mapRef.current || !mapReady) return
    const { map, L } = mapRef.current

    markersRef.current.forEach((m: { remove: () => void }) => m.remove())
    markersRef.current = []

    explorations.forEach(exp => {
      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:40px;height:40px;border-radius:50%;cursor:pointer;
          transition:transform 0.2s ease;
          background-image:url(${exp.imageData});background-size:cover;background-position:center;
          border:2px solid ${theme.markerBorder};
          box-shadow:0 2px 10px rgba(0,0,0,0.25);
        " onmouseenter="this.style.transform='scale(1.15)'" onmouseleave="this.style.transform='scale(1)'"></div>`,
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
  }, [explorations, mapReady, onMarkerClick, theme])

  return (
    <div ref={containerRef} style={{
      position: 'absolute', inset: 0,
      cursor: disabled ? 'wait' : 'crosshair',
      background: theme.mapBg,
      transition: 'background 0.4s ease',
    }} />
  )
}
