'use client'

import { useState } from 'react'
import type { Exploration } from '../lib/storage'

function fmtYear(y: number): string {
  return y < 0 ? `${Math.abs(y)} BC` : `${y} AD`
}

export default function ImageModal({ exploration, onClose }: { exploration: Exploration; onClose: () => void }) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(5,5,5,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '1200px',
          width: '100%',
          position: 'relative',
          animation: 'fadeInScale 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-48px',
            right: '0',
            zIndex: 10,
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            color: '#F5F0EB',
            border: '1px solid rgba(255,255,255,0.08)',
            cursor: 'pointer',
            fontSize: '20px',
            fontWeight: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
            e.currentTarget.style.borderColor = 'rgba(212,165,116,0.4)'
            e.currentTarget.style.color = '#D4A574'
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
            e.currentTarget.style.color = '#F5F0EB'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          ✕
        </button>

        {/* Image container with aspect ratio */}
        <div style={{
          position: 'relative',
          width: '100%',
          background: '#0a0a0a',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 32px 64px rgba(0,0,0,0.8)',
        }}>
          {/* Main image */}
          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={exploration.imageData}
              alt={`${exploration.placeName} in ${fmtYear(exploration.year)}`}
              onLoad={() => setImageLoaded(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
            {!imageLoaded && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0a0a0a',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  border: '2px solid rgba(255,255,255,0.1)',
                  borderTopColor: '#D4A574',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }} />
              </div>
            )}

            {/* Cinematic lower-third overlay */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.85) 50%, transparent 100%)',
              padding: '48px 32px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '24px',
              animation: imageLoaded ? 'slideInFromBottom 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both' : 'none',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(20px, 3vw, 32px)',
                  color: '#F5F0EB',
                  fontWeight: 400,
                  letterSpacing: '0.04em',
                  lineHeight: 1.2,
                  marginBottom: '8px',
                  textShadow: '0 2px 16px rgba(0,0,0,0.8)',
                }}>
                  {exploration.placeName}
                </div>
                <div style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '14px',
                  color: '#8A8178',
                  fontWeight: 300,
                  letterSpacing: '0.06em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}>
                  <span style={{
                    color: '#D4A574',
                    fontWeight: 400,
                  }}>
                    {fmtYear(exploration.year)}
                  </span>
                  <span style={{ opacity: 0.5 }}>•</span>
                  <span>{exploration.era}</span>
                </div>
              </div>

              {/* Coordinates badge */}
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '11px',
                color: '#8A8178',
                fontWeight: 400,
                letterSpacing: '0.05em',
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '6px 12px',
                whiteSpace: 'nowrap',
              }}>
                {exploration.lat.toFixed(3)}°, {exploration.lng.toFixed(3)}°
              </div>
            </div>
          </div>

          {/* Action buttons (share/download) - optional future addition */}
          <div style={{
            display: 'flex',
            gap: '8px',
            padding: '16px 24px',
            background: 'rgba(5,5,5,0.8)',
            borderTop: '1px solid rgba(255,255,255,0.04)',
          }}>
            <button style={{
              flex: 1,
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: '#8A8178',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
              padding: '10px 16px',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.color = '#F5F0EB'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              e.currentTarget.style.color = '#8A8178'
            }}
            onClick={() => {
              // Share functionality placeholder
              if (navigator.share) {
                navigator.share({
                  title: `${exploration.placeName} in ${fmtYear(exploration.year)}`,
                  text: `Explore ${exploration.placeName} in ${fmtYear(exploration.year)} on Atlas of Ages`,
                }).catch(() => {})
              }
            }}
            >
              Share
            </button>
            <button style={{
              flex: 1,
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: '#8A8178',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
              padding: '10px 16px',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.color = '#F5F0EB'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              e.currentTarget.style.color = '#8A8178'
            }}
            onClick={() => {
              // Download functionality
              const link = document.createElement('a')
              link.href = exploration.imageData
              link.download = `atlas-of-ages-${exploration.placeName.replace(/\s+/g, '-')}-${exploration.year}.png`
              link.click()
            }}
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
