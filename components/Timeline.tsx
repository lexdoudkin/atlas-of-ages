'use client'

import type { Theme } from '../lib/theme'

const ERAS = [
  { label: 'Ancient', year: -3000 },
  { label: 'Classical', year: -500 },
  { label: 'Medieval', year: 800 },
  { label: 'Renaissance', year: 1400 },
  { label: 'Industrial', year: 1800 },
  { label: 'Modern', year: 1950 },
  { label: 'Now', year: 2025 },
]

function fmtYear(y: number): string {
  return y < 0 ? `${Math.abs(y)} BC` : `${y} AD`
}

export default function Timeline({ year, onYearChange, theme }: { year: number; onYearChange: (y: number) => void; theme: Theme }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
      background: theme.bgGradientBottom,
      padding: '40px 24px 24px',
      animation: 'slideUp 0.5s ease',
    }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* Year */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(40px, 7vw, 64px)',
            fontWeight: 300, letterSpacing: '0.1em',
            color: theme.text, lineHeight: 1,
            transition: 'color 0.3s ease',
          }}>
            {fmtYear(year)}
          </span>
        </div>

        {/* Slider */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="range" min={-5000} max={2025} value={year}
            onChange={e => onYearChange(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        {/* Era pills */}
        <div style={{
          display: 'flex', justifyContent: 'center',
          flexWrap: 'wrap', gap: '8px',
        }}>
          {ERAS.map(era => {
            const isActive = Math.abs(year - era.year) < 400
            return (
              <button
                key={era.label}
                onClick={() => onYearChange(era.year)}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  background: isActive ? theme.pillBgActive : theme.pillBg,
                  border: `1px solid ${isActive ? theme.pillBorderActive : theme.pillBorder}`,
                  borderRadius: '20px', padding: '8px 18px', cursor: 'pointer',
                  fontSize: '12px', fontWeight: isActive ? 600 : 400,
                  color: isActive ? theme.pillTextActive : theme.pillText,
                  letterSpacing: '0.03em',
                  transition: 'all 0.25s ease',
                  backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                }}
              >
                {era.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
