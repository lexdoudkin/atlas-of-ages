'use client'

import type { Exploration } from '../lib/storage'

function fmtYear(y: number): string {
  return y < 0 ? `${Math.abs(y)} BC` : `${y} AD`
}

export default function ImageModal({ exploration, onClose }: { exploration: Exploration; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 960, width: '100%', background: '#0f172a',
          borderRadius: 16, border: '1px solid rgba(51,65,85,0.4)', overflow: 'hidden',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16, zIndex: 10,
            width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.6)',
            color: '#cbd5e1', border: 'none', cursor: 'pointer', fontSize: 20,
          }}
        >✕</button>

        <div style={{ aspectRatio: '16/9', width: '100%', background: '#1e293b' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={exploration.imageData}
            alt={`${exploration.placeName} in ${fmtYear(exploration.year)}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 20, color: '#f1f5f9', fontWeight: 300 }}>{exploration.placeName}</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{fmtYear(exploration.year)} · {exploration.era}</div>
          </div>
          <div style={{ fontSize: 11, color: '#475569' }}>
            {exploration.lat.toFixed(2)}°, {exploration.lng.toFixed(2)}°
          </div>
        </div>
      </div>
    </div>
  )
}
