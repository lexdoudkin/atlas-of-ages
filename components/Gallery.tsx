'use client'

import type { Exploration } from '../lib/storage'

function fmtYear(y: number): string {
  return y < 0 ? `${Math.abs(y)} BC` : `${y} AD`
}

export default function Gallery({ explorations, onSelect }: { explorations: Exploration[]; onSelect: (e: Exploration) => void }) {
  return (
    <aside style={{
      position: 'absolute', left: 16, top: 80, bottom: 140, width: 280, zIndex: 20,
      background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(16px)',
      borderRadius: 12, border: '1px solid rgba(51,65,85,0.3)', overflow: 'hidden',
      display: 'none',
    }}
    className="gallery-sidebar"
    >
      <style>{`.gallery-sidebar { display: none !important; } @media (min-width: 1024px) { .gallery-sidebar { display: block !important; } }`}</style>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(51,65,85,0.3)' }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Journeys ({explorations.length})
        </span>
      </div>
      <div style={{ overflowY: 'auto', height: 'calc(100% - 48px)' }}>
        {explorations.map(exp => (
          <button
            key={exp.id}
            onClick={() => onSelect(exp)}
            style={{
              width: '100%', padding: '10px 14px', background: 'none', border: 'none',
              borderBottom: '1px solid rgba(51,65,85,0.15)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(51,65,85,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 8, flexShrink: 0,
              backgroundImage: `url(${exp.imageData})`, backgroundSize: 'cover', backgroundPosition: 'center',
              border: '1px solid rgba(71,85,105,0.4)',
            }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exp.placeName}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{fmtYear(exp.year)}</div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  )
}
