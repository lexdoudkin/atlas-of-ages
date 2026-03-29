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
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 30,
      background: 'linear-gradient(to top, rgba(5,5,5,0.98) 0%, rgba(5,5,5,0.92) 40%, rgba(5,5,5,0.7) 70%, transparent 100%)',
      padding: '64px 24px 32px',
      animation: 'slideInFromBottom 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        {/* Hero year display */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px',
        }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(48px, 8vw, 72px)',
            fontWeight: 300,
            letterSpacing: '0.12em',
            color: '#F5F0EB',
            textShadow: '0 2px 24px rgba(0,0,0,0.8), 0 0 60px rgba(212,165,116,0.2)',
            animation: 'glowPulse 3s ease-in-out infinite',
            lineHeight: 1,
          }}>
            {fmtYear(year)}
          </div>
        </div>

        {/* Custom styled slider */}
        <div style={{ marginBottom: '24px' }}>
          <input
            type="range"
            min={-5000}
            max={2025}
            value={year}
            onChange={e => onYearChange(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        {/* Era pills with glow effect */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          marginTop: '20px',
        }}>
          {ERAS.map(era => {
            const isActive = Math.abs(year - era.year) < 400
            return (
              <button
                key={era.label}
                onClick={() => onYearChange(era.year)}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(212,165,116,0.2), rgba(201,149,107,0.2))'
                    : 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: isActive
                    ? '1px solid rgba(212,165,116,0.5)'
                    : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '24px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? '#D4A574' : '#8A8178',
                  letterSpacing: '0.04em',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isActive
                    ? '0 4px 16px rgba(212,165,116,0.2), 0 0 32px rgba(212,165,116,0.1)'
                    : 'none',
                  textShadow: isActive ? '0 0 12px rgba(212,165,116,0.3)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                    e.currentTarget.style.color = '#F5F0EB'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.color = '#8A8178'
                  }
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
