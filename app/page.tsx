'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { lightTheme, darkTheme, Theme } from '../lib/theme'

const Map = dynamic(() => import('../components/Map'), { ssr: false })
import Timeline from '../components/Timeline'
import Gallery from '../components/Gallery'
import ImageModal from '../components/ImageModal'
import LoadingOverlay from '../components/LoadingOverlay'
import ConfirmPin from '../components/ConfirmPin'
import { Exploration, saveExploration, getExplorations } from '../lib/storage'

export default function Home() {
  const [year, setYear] = useState(1500)
  const [explorations, setExplorations] = useState<Exploration[]>([])
  const [selected, setSelected] = useState<Exploration | null>(null)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [pendingClick, setPendingClick] = useState<{lat: number, lng: number} | null>(null)

  const t: Theme = isDark ? darkTheme : lightTheme

  useEffect(() => {
    setReady(true)
    // One-time clear of old demo data
    const cleared = localStorage.getItem('atlas-cleared-v2')
    if (!cleared) {
      // Clear IndexedDB
      const req = indexedDB.deleteDatabase('atlas-of-ages')
      req.onsuccess = () => { localStorage.setItem('atlas-cleared-v2', '1') }
      req.onerror = () => { localStorage.setItem('atlas-cleared-v2', '1') }
    } else {
      getExplorations().then(setExplorations).catch(() => {})
    }
    const saved = localStorage.getItem('atlas-theme')
    if (saved === 'dark') setIsDark(true)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const handleMapClick = useCallback((lat: number, lng: number) => {
    if (loading) return
    setPendingClick({ lat, lng })
  }, [loading])

  const handleConfirm = useCallback(async () => {
    if (!pendingClick || loading) return
    const { lat, lng } = pendingClick
    setPendingClick(null)
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
  }, [pendingClick, year, loading])

  const handleCancel = useCallback(() => {
    setPendingClick(null)
  }, [])

  if (!ready) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100dvh',
      overflow: 'hidden', background: t.bg, transition: 'background 0.4s ease',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Vignette overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: `radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, ${t.bg}88 75%, ${t.bg} 100%)`,
      }} />

      {/* Header */}
      <header style={{
        position: 'relative', zIndex: 30,
        padding: '20px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        animation: 'fadeIn 0.6s ease',
        flexShrink: 0,
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '26px', fontWeight: 500, letterSpacing: '0.06em',
            color: t.text, margin: 0,
          }}>
            Atlas of Ages
          </h1>
          <p style={{
            fontSize: '12px', color: t.textSecondary, fontWeight: 400,
            letterSpacing: '0.04em', marginTop: '4px',
          }}>
            Click anywhere to explore
          </p>
        </div>
        <button
          onClick={() => { const next = !isDark; setIsDark(next); localStorage.setItem('atlas-theme', next ? 'dark' : 'light') }}
          style={{
            background: t.surface, border: `1px solid ${t.surfaceBorder}`,
            borderRadius: '10px', padding: '8px 14px', cursor: 'pointer',
            fontSize: '14px', color: t.textSecondary,
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            transition: 'all 0.3s ease', marginTop: '2px',
          }}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </header>

      {/* Map + Timeline flex container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        {/* Map */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <Map
            explorations={explorations}
            onMapClick={handleMapClick}
            onMarkerClick={setSelected}
            disabled={loading}
            theme={t}
            isDark={isDark}
            pendingClick={pendingClick}
          />
        </div>

        {/* Confirm pin popup */}
        {pendingClick && !loading && (
          <ConfirmPin
            lat={pendingClick.lat}
            lng={pendingClick.lng}
            year={year}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            theme={t}
          />
        )}

        {/* Timeline */}
        <Timeline year={year} onYearChange={setYear} theme={t} />
      </div>

      {/* Gallery */}
      {explorations.length > 0 && (
        <Gallery explorations={explorations} onSelect={setSelected} theme={t} />
      )}

      {/* Loading */}
      {loading && <LoadingOverlay year={year} theme={t} />}

      {/* Modal */}
      {selected && (
        <ImageModal exploration={selected} onClose={() => setSelected(null)} theme={t} />
      )}
    </div>
  )
}
