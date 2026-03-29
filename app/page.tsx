'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('../components/Map'), { ssr: false })
import Timeline from '../components/Timeline'
import Gallery from '../components/Gallery'
import ImageModal from '../components/ImageModal'
import LoadingOverlay from '../components/LoadingOverlay'
import { Exploration, saveExploration, getExplorations } from '../lib/storage'

export default function Home() {
  const [year, setYear] = useState(1500)
  const [explorations, setExplorations] = useState<Exploration[]>([])
  const [selected, setSelected] = useState<Exploration | null>(null)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
    getExplorations().then(setExplorations).catch(() => {})
  }, [])

  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng, year }),
      })
      const data = await res.json()
      if (data.success && data.exploration) {
        const saved = await saveExploration(data.exploration)
        setExplorations(prev => [saved, ...prev])
        setSelected(saved)
      }
    } catch (e) {
      console.error('Generation failed:', e)
    } finally {
      setLoading(false)
    }
  }, [year, loading])

  if (!ready) return null

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: '#050505'
    }}>
      {/* Minimal floating header */}
      <header style={{
        position: 'absolute',
        top: 24,
        left: 24,
        zIndex: 30,
        animation: 'fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '28px',
          fontWeight: 400,
          letterSpacing: '0.08em',
          color: '#F5F0EB',
          textShadow: '0 2px 16px rgba(0,0,0,0.8), 0 0 40px rgba(212,165,116,0.15)',
          margin: 0,
          lineHeight: 1.2,
        }}>
          ATLAS OF AGES
        </h1>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '12px',
          color: '#8A8178',
          fontWeight: 300,
          letterSpacing: '0.1em',
          marginTop: '6px',
          textShadow: '0 1px 8px rgba(0,0,0,0.6)',
        }}>
          Click anywhere to witness history
        </p>
      </header>

      {/* Full-screen edge-to-edge map */}
      <Map
        explorations={explorations}
        onMapClick={handleMapClick}
        onMarkerClick={setSelected}
        disabled={loading}
      />

      {/* Redesigned timeline */}
      <Timeline year={year} onYearChange={setYear} />

      {/* Elegant gallery sidebar (desktop) / bottom sheet (mobile) */}
      {explorations.length > 0 && (
        <Gallery explorations={explorations} onSelect={setSelected} />
      )}

      {/* Cinematic loading overlay */}
      {loading && <LoadingOverlay year={year} />}

      {/* Dramatic image modal */}
      {selected && (
        <ImageModal exploration={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
