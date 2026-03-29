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
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#000' }}>
      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
        background: 'linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.85) 60%, transparent 100%)',
        padding: '24px 28px 40px',
      }}>
        <h1 style={{
          fontSize: '32px', fontWeight: 400, letterSpacing: '0.15em',
          color: '#fff', textTransform: 'uppercase', margin: 0,
          textShadow: '0 2px 8px rgba(0,0,0,0.8)',
        }}>
          Atlas of Ages
        </h1>
        <p style={{
          fontSize: '14px', color: '#9ca3af', fontWeight: 400,
          letterSpacing: '0.05em', marginTop: '6px',
        }}>
          Click anywhere to witness history
        </p>
      </div>

      {/* Map */}
      <Map
        explorations={explorations}
        onMapClick={handleMapClick}
        onMarkerClick={setSelected}
        disabled={loading}
      />

      {/* Timeline */}
      <Timeline year={year} onYearChange={setYear} />

      {/* Gallery */}
      {explorations.length > 0 && (
        <Gallery explorations={explorations} onSelect={setSelected} />
      )}

      {/* Loading */}
      {loading && <LoadingOverlay year={year} />}

      {/* Modal */}
      {selected && (
        <ImageModal exploration={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
