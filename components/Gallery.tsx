'use client'

import type { Exploration } from '../lib/storage'
import type { Theme } from '../lib/theme'

function fmtYear(y: number): string {
  return y < 0 ? `${Math.abs(y)} BC` : `${y} AD`
}

export default function Gallery({ explorations, onSelect, theme }: { explorations: Exploration[]; onSelect: (e: Exploration) => void; theme: Theme }) {
  return (
    <>
      <style>{`
        .gallery-sidebar { display: none !important; }
        @media (min-width: 1024px) { .gallery-sidebar { display: block !important; } }
      `}</style>
      <aside className="gallery-sidebar" style={{
        position: 'absolute', left: 16, top: 80, bottom: 140, width: 280, zIndex: 20,
        background: theme.surface,
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '14px',
        border: `1px solid ${theme.surfaceBorder}`,
        overflow: 'hidden',
        boxShadow: theme.shadow,
        animation: 'fadeIn 0.4s ease',
        transition: 'background 0.3s, border-color 0.3s',
      }}>
        <div style={{
          padding: '14px 16px',
          borderBottom: `1px solid ${theme.borderColor}`,
        }}>
          <span style={{
            fontSize: '11px', fontWeight: 600, color: theme.textSecondary,
            textTransform: 'uppercase', letterSpacing: '0.1em',
          }}>
            Journeys ({explorations.length})
          </span>
        </div>
        <div style={{ overflowY: 'auto', height: 'calc(100% - 46px)' }}>
          {explorations.map(exp => (
            <button
              key={exp.id}
              onClick={() => onSelect(exp)}
              style={{
                width: '100%', padding: '10px 14px',
                background: 'none', border: 'none',
                borderBottom: `1px solid ${theme.borderColor}`,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 10,
                textAlign: 'left', transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = theme.surface}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 8, flexShrink: 0,
                backgroundImage: `url(${exp.imageData})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                border: `1px solid ${theme.surfaceBorder}`,
              }} />
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: 13, color: theme.text,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{exp.placeName}</div>
                <div style={{ fontSize: 11, color: theme.textSecondary, marginTop: 2 }}>
                  {fmtYear(exp.year)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>
    </>
  )
}
