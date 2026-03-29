export interface Theme {
  bg: string
  bgGradientTop: string
  bgGradientBottom: string
  text: string
  textSecondary: string
  accent: string
  accentGlow: string
  surface: string
  surfaceBorder: string
  mapTiles: string
  mapBg: string
  borderColor: string
  countryBorder: string
  countryFill: string
  sliderTrack: string
  sliderThumb: string
  pillBg: string
  pillBgActive: string
  pillBorder: string
  pillBorderActive: string
  pillText: string
  pillTextActive: string
  modalBg: string
  modalOverlay: string
  markerBorder: string
  markerGlow: string
  shadow: string
}

export const lightTheme: Theme = {
  bg: '#F8F6F3',
  bgGradientTop: 'linear-gradient(to bottom, rgba(248,246,243,0.98) 0%, rgba(248,246,243,0.85) 60%, transparent 100%)',
  bgGradientBottom: 'linear-gradient(to top, rgba(248,246,243,0.99) 0%, rgba(248,246,243,0.92) 50%, transparent 100%)',
  text: '#1A1612',
  textSecondary: '#7A7067',
  accent: '#B07D4F',
  accentGlow: 'rgba(176,125,79,0.3)',
  surface: 'rgba(0,0,0,0.04)',
  surfaceBorder: 'rgba(0,0,0,0.1)',
  mapTiles: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  mapBg: '#E8E4DF',
  borderColor: 'rgba(0,0,0,0.08)',
  countryBorder: '#9A8E82',
  countryFill: 'rgba(0,0,0,0.02)',
  sliderTrack: '#D4CFC8',
  sliderThumb: '#B07D4F',
  pillBg: 'rgba(0,0,0,0.04)',
  pillBgActive: 'rgba(176,125,79,0.12)',
  pillBorder: 'rgba(0,0,0,0.1)',
  pillBorderActive: 'rgba(176,125,79,0.5)',
  pillText: '#7A7067',
  pillTextActive: '#8B5E2F',
  modalBg: '#FAFAF8',
  modalOverlay: 'rgba(0,0,0,0.5)',
  markerBorder: 'rgba(176,125,79,0.7)',
  markerGlow: 'rgba(176,125,79,0.25)',
  shadow: '0 8px 32px rgba(0,0,0,0.12)',
}

export const darkTheme: Theme = {
  bg: '#050505',
  bgGradientTop: 'linear-gradient(to bottom, rgba(5,5,5,0.98) 0%, rgba(5,5,5,0.85) 60%, transparent 100%)',
  bgGradientBottom: 'linear-gradient(to top, rgba(5,5,5,0.99) 0%, rgba(5,5,5,0.92) 50%, transparent 100%)',
  text: '#F5F0EB',
  textSecondary: '#8A8178',
  accent: '#D4A574',
  accentGlow: 'rgba(212,165,116,0.3)',
  surface: 'rgba(255,255,255,0.03)',
  surfaceBorder: 'rgba(255,255,255,0.08)',
  mapTiles: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  mapBg: '#0A0A0A',
  borderColor: 'rgba(255,255,255,0.06)',
  countryBorder: '#555048',
  countryFill: 'rgba(255,255,255,0.02)',
  sliderTrack: '#2A2520',
  sliderThumb: '#D4A574',
  pillBg: 'rgba(255,255,255,0.03)',
  pillBgActive: 'rgba(212,165,116,0.15)',
  pillBorder: 'rgba(255,255,255,0.08)',
  pillBorderActive: 'rgba(212,165,116,0.5)',
  pillText: '#8A8178',
  pillTextActive: '#D4A574',
  modalBg: '#0F0D0B',
  modalOverlay: 'rgba(0,0,0,0.75)',
  markerBorder: 'rgba(212,165,116,0.6)',
  markerGlow: 'rgba(212,165,116,0.2)',
  shadow: '0 8px 32px rgba(0,0,0,0.4)',
}
