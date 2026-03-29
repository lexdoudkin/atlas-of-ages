'use client'

import type { Exploration } from '../lib/storage'

function fmtYear(y: number): string {
  return y < 0 ? `${Math.abs(y)} BC` : `${y} AD`
}

export default function Gallery({ explorations, onSelect }: { explorations: Exploration[]; onSelect: (e: Exploration) => void }) {
  return (
    <>
      {/* Desktop: elegant sidebar with glass-morphism */}
      <aside
        className="gallery-desktop"
        style={{
          position: 'absolute',
          left: 24,
          top: 140,
          bottom: 180,
          width: '320px',
          zIndex: 20,
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.06)',
          overflow: 'hidden',
          display: 'none',
          boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
          animation: 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(5,5,5,0.4)',
        }}>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '12px',
            fontWeight: 500,
            color: '#D4A574',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
          }}>
            Your Journeys
          </div>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            fontWeight: 300,
            color: '#8A8178',
            marginTop: '4px',
            letterSpacing: '0.04em',
          }}>
            {explorations.length} {explorations.length === 1 ? 'exploration' : 'explorations'}
          </div>
        </div>

        {/* Scrollable list */}
        <div style={{
          overflowY: 'auto',
          height: 'calc(100% - 80px)',
        }}>
          {explorations.map((exp, idx) => (
            <button
              key={exp.id}
              onClick={() => onSelect(exp)}
              style={{
                width: '100%',
                padding: '14px 20px',
                background: 'none',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                textAlign: 'left',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: `fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${idx * 0.05}s both`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(212,165,116,0.08)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'none'
              }}
            >
              {/* Thumbnail */}
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '10px',
                flexShrink: 0,
                backgroundImage: `url(${exp.imageData})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }} />

              {/* Text */}
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '14px',
                  color: '#F5F0EB',
                  fontWeight: 400,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginBottom: '4px',
                }}>
                  {exp.placeName}
                </div>
                <div style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '12px',
                  color: '#8A8178',
                  fontWeight: 300,
                  letterSpacing: '0.02em',
                }}>
                  {fmtYear(exp.year)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Mobile: bottom sheet with horizontal scroll */}
      <div
        className="gallery-mobile"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: '140px',
          zIndex: 20,
          display: 'none',
          padding: '0 16px',
          animation: 'slideInFromBottom 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.06)',
          padding: '16px',
          boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
        }}>
          {/* Header */}
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            fontWeight: 500,
            color: '#D4A574',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: '12px',
          }}>
            Your Journeys ({explorations.length})
          </div>

          {/* Horizontal scroll */}
          <div style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            overflowY: 'hidden',
            paddingBottom: '4px',
            WebkitOverflowScrolling: 'touch',
          }}>
            {explorations.map((exp, idx) => (
              <button
                key={exp.id}
                onClick={() => onSelect(exp)}
                style={{
                  flexShrink: 0,
                  width: '110px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  animation: `fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${idx * 0.05}s both`,
                }}
              >
                <div style={{
                  width: '110px',
                  height: '110px',
                  borderRadius: '12px',
                  backgroundImage: `url(${exp.imageData})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '1px solid rgba(255,255,255,0.1)',
                  marginBottom: '8px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(212,165,116,0.3)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
                }}
                />
                <div style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '12px',
                  color: '#F5F0EB',
                  fontWeight: 400,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginBottom: '2px',
                }}>
                  {exp.placeName}
                </div>
                <div style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '11px',
                  color: '#8A8178',
                  fontWeight: 300,
                }}>
                  {fmtYear(exp.year)}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CSS for responsive display */}
      <style>{`
        @media (min-width: 1024px) {
          .gallery-desktop { display: block !important; }
          .gallery-mobile { display: none !important; }
        }
        @media (max-width: 1023px) {
          .gallery-desktop { display: none !important; }
          .gallery-mobile { display: block !important; }
        }
      `}</style>
    </>
  )
}
