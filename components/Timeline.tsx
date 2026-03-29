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
      background: 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.8), transparent)',
      padding: '40px 24px 24px',
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '40px', fontWeight: 200, letterSpacing: '0.1em', color: '#f1f5f9' }}>
            {fmtYear(year)}
          </span>
        </div>
        <input
          type="range" min={-5000} max={2025} value={year}
          onChange={e => onYearChange(parseInt(e.target.value))}
          style={{ width: '100%' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          {ERAS.map(era => (
            <button
              key={era.label}
              onClick={() => onYearChange(era.year)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '11px', color: Math.abs(year - era.year) < 300 ? '#e2e8f0' : '#475569',
                transition: 'color 0.2s',
              }}
            >
              {era.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
