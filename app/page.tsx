'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { lightTheme, darkTheme, Theme } from '../lib/theme'

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
  const [isDark, setIsDark] = useState(false)

  const t: Theme = isDark ? darkTheme : lightTheme

  useEffect(() => {
    setReady(true)
    getExplorations().then(setExplorations).catch(() => {})
    // Check system preference
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(mq.matches)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

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
      position: 'relative', width: '100vw', height: '100vh',
      overflow: 'hidden', background: t.bg, transition: 'background 0.4s ease',
    }}>
      {/* Header */}
      <header style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
        background: t.bgGradientTop,
        padding: '20px 24px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        animation: 'fadeIn 0.6s ease',
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
            Click anywhere to witness history
          </p>
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
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

      {/* Map */}
      <Map
        explorations={explorations}
        onMapClick={handleMapClick}
        onMarkerClick={setSelected}
        disabled={loading}
        theme={t}
        isDark={isDark}
      />

      {/* Timeline */}
      <Timeline year={year} onYearChange={setYear} theme={t} />

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
