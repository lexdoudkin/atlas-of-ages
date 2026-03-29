'use client'

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

export default function Timeline({ year, onYearChange }: { year: number; onYearChange: (y: number) => void }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
      background: 'linear-gradient(to top, #000 0%, rgba(0,0,0,0.9) 50%, transparent 100%)',
      padding: '50px 24px 28px',
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* Year display */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{
            fontSize: '48px', fontWeight: 300, letterSpacing: '0.08em',
            color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,0.8)',
          }}>
            {fmtYear(year)}
          </span>
        </div>

        {/* Slider */}
        <input
          type="range" min={-5000} max={2025} value={year}
          onChange={e => onYearChange(parseInt(e.target.value))}
          style={{ width: '100%', height: '20px' }}
        />

        {/* Era buttons */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          marginTop: '14px', gap: '4px',
        }}>
          {ERAS.map(era => {
            const isActive = Math.abs(year - era.year) < 300
            return (
              <button
                key={era.label}
                onClick={() => onYearChange(era.year)}
                style={{
                  background: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                  border: isActive ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#fff' : '#9ca3af',
                  transition: 'all 0.2s',
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
