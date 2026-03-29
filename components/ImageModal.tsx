'use client'

import type { Exploration } from '../lib/storage'
import type { Theme } from '../lib/theme'

function fmtYear(y: number): string {
  return y < 0 ? `${Math.abs(y)} BC` : `${y} AD`
}

export default function ImageModal({ exploration, onClose, theme }: { exploration: Exploration; onClose: () => void; theme: Theme }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: theme.modalOverlay,
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        animation: 'fadeInScale 0.3s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 900, width: '100%',
          background: theme.modalBg,
          borderRadius: '16px',
          border: `1px solid ${theme.surfaceBorder}`,
          overflow: 'hidden',
          boxShadow: theme.shadow,
          transition: 'background 0.3s, border-color 0.3s',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16, zIndex: 10,
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(0,0,0,0.4)', color: '#fff',
            border: 'none', cursor: 'pointer', fontSize: 18,
          }}
        >✕</button>

        {/* Image */}
        <div style={{ aspectRatio: '16/9', width: '100%', background: theme.surface }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={exploration.imageData}
            alt={`${exploration.placeName} in ${fmtYear(exploration.year)}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Info */}
        <div style={{
          padding: '16px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '20px', fontWeight: 400, color: theme.text,
            }}>
              {exploration.placeName}
            </div>
            <div style={{ fontSize: '13px', color: theme.textSecondary, marginTop: 4 }}>
              {fmtYear(exploration.year)} · {exploration.era}
            </div>
          </div>
          <div style={{ fontSize: '11px', color: theme.textSecondary }}>
            {exploration.lat.toFixed(2)}°, {exploration.lng.toFixed(2)}°
          </div>
        </div>
      </div>
    </div>
  )
}
