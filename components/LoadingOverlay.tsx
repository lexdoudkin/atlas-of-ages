'use client'

function fmtYear(y: number): string {
  return y < 0 ? `${Math.abs(y)} BC` : `${y} AD`
}

export default function LoadingOverlay({ year }: { year: number }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 40,
      background: 'rgba(5,5,5,0.75)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '24px',
        padding: '48px 64px',
        textAlign: 'center',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        animation: 'fadeInScale 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {/* Elegant circular progress indicator */}
        <div style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 32px',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            border: '2px solid rgba(255,255,255,0.06)',
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            border: '2px solid transparent',
            borderTopColor: '#D4A574',
            borderRadius: '50%',
            animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
          }} />
          <div style={{
            position: 'absolute',
            inset: '8px',
            border: '1px solid transparent',
            borderTopColor: '#C9956B',
            borderRadius: '50%',
            animation: 'spin 1.8s cubic-bezier(0.5, 0, 0.5, 1) infinite reverse',
            opacity: 0.6,
          }} />
        </div>

        {/* Text */}
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '24px',
          fontWeight: 300,
          color: '#F5F0EB',
          letterSpacing: '0.08em',
          marginBottom: '12px',
          animation: 'shimmer 2s ease-in-out infinite',
        }}>
          Reconstructing {fmtYear(year)}
        </div>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '13px',
          color: '#8A8178',
          fontWeight: 300,
          letterSpacing: '0.04em',
        }}>
          Generating historical imagery
        </p>
      </div>
    </div>
  )
}
