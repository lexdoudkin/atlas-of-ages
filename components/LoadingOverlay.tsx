'use client'

import type { Theme } from '../lib/theme'

function fmtYear(y: number): string {
  return y < 0 ? `${Math.abs(y)} BC` : `${y} AD`
}

export default function LoadingOverlay({ year, theme }: { year: number; theme: Theme }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: theme.modalOverlay,
      backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeInScale 0.3s ease',
    }}>
      <div style={{
        background: theme.modalBg, border: `1px solid ${theme.surfaceBorder}`,
        borderRadius: '20px', padding: '40px 48px', textAlign: 'center',
        boxShadow: theme.shadow,
        transition: 'background 0.3s, border-color 0.3s',
      }}>
        <div style={{
          width: 48, height: 48,
          border: `2px solid ${theme.surfaceBorder}`,
          borderTopColor: theme.accent,
          borderRadius: '50%', margin: '0 auto 20px',
          animation: 'spin 1s linear infinite',
        }} />
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '22px', fontWeight: 400, color: theme.text,
          letterSpacing: '0.04em',
        }}>
          Reconstructing {fmtYear(year)}
        </p>
        <p style={{
          fontSize: '13px', color: theme.textSecondary,
          marginTop: '8px', fontWeight: 300,
        }}>
          Generating historical imagery
        </p>
      </div>
    </div>
  )
}
