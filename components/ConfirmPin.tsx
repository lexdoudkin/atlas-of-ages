'use client'

import { useEffect, useState } from 'react'
import type { Theme } from '../lib/theme'

function fmtYear(y: number): string {
  return y < 0 ? `${Math.abs(y)} BC` : `${y} AD`
}

interface Props {
  lat: number
  lng: number
  year: number
  onConfirm: () => void
  onCancel: () => void
  theme: Theme
}

export default function ConfirmPin({ lat, lng, year, onConfirm, onCancel, theme }: Props) {
  const [placeName, setPlaceName] = useState<string>('')

  useEffect(() => {
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`, {
      headers: { 'User-Agent': 'AtlasOfAges/1.0' },
    })
      .then(r => r.json())
      .then(data => {
        const addr = data.address || {}
        setPlaceName(addr.city || addr.town || addr.village || addr.county || addr.state || addr.country || `${lat.toFixed(1)}°, ${lng.toFixed(1)}°`)
      })
      .catch(() => setPlaceName(`${lat.toFixed(1)}°, ${lng.toFixed(1)}°`))
  }, [lat, lng])

  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 35,
      background: theme.modalBg,
      border: `1px solid ${theme.surfaceBorder}`,
      borderRadius: '16px',
      padding: '24px 28px',
      boxShadow: theme.shadow,
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      animation: 'fadeInScale 0.25s ease',
      textAlign: 'center',
      minWidth: '280px',
      maxWidth: '340px',
      transition: 'background 0.3s, border-color 0.3s',
    }}>
      {/* Location pin icon */}
      <div style={{ fontSize: '28px', marginBottom: '12px' }}>📍</div>

      {/* Place name */}
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '20px', fontWeight: 400,
        color: theme.text, marginBottom: '4px',
      }}>
        {placeName || 'Loading...'}
      </div>

      {/* Year */}
      <div style={{
        fontSize: '14px', color: theme.textSecondary,
        marginBottom: '4px',
      }}>
        {fmtYear(year)}
      </div>

      {/* Coordinates */}
      <div style={{
        fontSize: '11px', color: theme.textSecondary,
        marginBottom: '20px', opacity: 0.7,
      }}>
        {lat.toFixed(4)}°, {lng.toFixed(4)}°
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={onCancel}
          style={{
            fontFamily: "'Inter', sans-serif",
            background: theme.surface,
            border: `1px solid ${theme.surfaceBorder}`,
            borderRadius: '10px', padding: '10px 24px',
            cursor: 'pointer', fontSize: '13px', fontWeight: 500,
            color: theme.textSecondary,
            transition: 'all 0.2s ease',
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            fontFamily: "'Inter', sans-serif",
            background: theme.accent,
            border: 'none',
            borderRadius: '10px', padding: '10px 24px',
            cursor: 'pointer', fontSize: '13px', fontWeight: 600,
            color: '#fff',
            boxShadow: `0 4px 12px ${theme.accentGlow}`,
            transition: 'all 0.2s ease',
          }}
        >
          Generate
        </button>
      </div>
    </div>
  )
}
