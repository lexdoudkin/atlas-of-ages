'use client'

function fmtYear(y: number): string {
  return y < 0 ? `${Math.abs(y)} BC` : `${y} AD`
}

export default function LoadingOverlay({ year }: { year: number }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 40,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(51,65,85,0.4)',
        borderRadius: 16, padding: 32, textAlign: 'center',
      }}>
        <div style={{
          width: 48, height: 48,
          border: '2px solid #334155', borderTopColor: '#e2e8f0',
          borderRadius: '50%', margin: '0 auto 16px',
          animation: 'spin 1s linear infinite',
        }} />
        <p style={{ fontSize: 18, color: '#e2e8f0', fontWeight: 300 }}>Reconstructing {fmtYear(year)}...</p>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>Generating historical imagery</p>
      </div>
    </div>
  )
}
