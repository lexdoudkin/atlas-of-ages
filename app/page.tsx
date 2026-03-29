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

  const S = {
    container: { position: 'relative' as const, width: '100vw', height: '100vh', overflow: 'hidden', background: '#000' },
    header: {
      position: 'absolute' as const, top: 0, left: 0, right: 0, zIndex: 30,
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.6), transparent)',
      padding: '20px 24px', pointerEvents: 'none' as const,
    },
    title: { fontSize: '28px', fontWeight: 200, letterSpacing: '0.2em', color: '#f1f5f9', textTransform: 'uppercase' as const },
    subtitle: { fontSize: '13px', color: '#64748b', fontWeight: 300, letterSpacing: '0.1em', marginTop: '4px' },
  }

  return (
    <div style={S.container}>
      <div style={S.header}>
        <h1 style={S.title}>Atlas of Ages</h1>
        <p style={S.subtitle}>Click anywhere to witness history</p>
      </div>

      <Map
        explorations={explorations}
        onMapClick={handleMapClick}
        onMarkerClick={setSelected}
        disabled={loading}
      />

      <Timeline year={year} onYearChange={setYear} />

      {explorations.length > 0 && (
        <Gallery explorations={explorations} onSelect={setSelected} />
      )}

      {loading && <LoadingOverlay year={year} />}

      {selected && (
        <ImageModal exploration={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
