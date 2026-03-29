# Atlas of Ages - Quick Start Guide

## Overview
Atlas of Ages is a premium web app that lets users click anywhere on a world map, select a time period (5000 BC to 2025 AD), and generate AI-powered historical images of that location.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Pure CSS (no external libraries)
- **Maps**: Leaflet.js
- **Storage**: IndexedDB (client-side)
- **Deployment**: Netlify

## Development Setup

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation
```bash
cd /tmp/atlas-v2
npm install
```

### Run Dev Server
```bash
npm run dev
# Open http://localhost:3000
```

### Build for Production
```bash
npm run build
# Output: .next/
```

### Start Production Server
```bash
npm start
```

## Project Structure

```
atlas-v2/
├── app/
│   ├── globals.css          # Global styles, animations, Leaflet overrides
│   ├── layout.tsx            # Root layout, Google Fonts
│   ├── page.tsx              # Main page, layout orchestration
│   └── api/
│       └── generate/
│           └── route.ts      # API route for image generation
│
├── components/
│   ├── Map.tsx               # Leaflet map with elegant markers
│   ├── Timeline.tsx          # Year selector with custom slider
│   ├── Gallery.tsx           # Sidebar (desktop) / bottom sheet (mobile)
│   ├── ImageModal.tsx        # Cinematic image viewer
│   └── LoadingOverlay.tsx    # Elegant loading state
│
├── lib/
│   └── storage.ts            # IndexedDB wrapper for explorations
│
├── netlify.toml              # Netlify deployment config
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
└── next.config.js            # Next.js config
```

## Key Files

### `app/globals.css`
- Global styles and animations
- Leaflet map overrides
- Custom range slider styling
- Glass-morphism utilities
- Animation keyframes library

**Don't modify**: Carefully tuned design system

### `app/layout.tsx`
- Google Fonts (Playfair Display + Inter)
- Leaflet CSS
- Metadata

**To change fonts**: Update Google Fonts link

### `app/page.tsx`
- Main layout and state management
- Header component (inline)
- Map, Timeline, Gallery, Modal orchestration

**To modify layout**: Adjust positioning here

### `components/Timeline.tsx`
- Year display (hero element)
- Custom slider
- Era pill buttons

**To add eras**: Edit `ERAS` array

### `components/Map.tsx`
- Leaflet integration (dynamic import)
- Dark map tiles (CARTO)
- Custom markers with glass-morphism

**To change map style**: Edit tile layer URL

### `lib/storage.ts`
- IndexedDB operations
- Save/load explorations

**Don't modify**: Stable storage logic

## Design System Quick Reference

### Colors
```css
Background:     #050505, #0a0a0a
Text:           #F5F0EB (primary), #8A8178 (secondary)
Accent:         #D4A574 (amber), #C9956B (gold)
Glass:          rgba(255,255,255,0.03) bg, rgba(255,255,255,0.06) border
```

### Typography
```css
Display:        'Playfair Display', serif
Body:           'Inter', sans-serif
Sizes:          48-72px (year), 28px (title), 14px (body), 11-13px (small)
Weights:        300 (light), 400 (regular), 500 (medium)
Spacing:        0.02em - 0.12em
```

### Spacing
```css
Base unit:      4px
Common:         16px, 24px, 32px, 48px, 64px
Border radius:  8px (sm), 12px (md), 16px (lg), 24px (xl)
```

### Animations
```css
Duration:       0.2s (hover), 0.3s (transitions), 0.6s (entrance)
Easing:         cubic-bezier(0.4, 0, 0.2, 1)
```

## Common Tasks

### Add a New Era
Edit `components/Timeline.tsx`:
```typescript
const ERAS = [
  // ...existing eras
  { label: 'Future', year: 2100 },  // Add here
]
```

### Change Map Tiles
Edit `components/Map.tsx`:
```typescript
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
  // Change URL here
})
```

### Adjust Timeline Position
Edit `components/Timeline.tsx` style:
```typescript
style={{
  bottom: 0,     // Change this
  padding: '64px 24px 32px',  // And this
}}
```

### Modify Gallery Width
Edit `components/Gallery.tsx`:
```typescript
style={{
  width: '320px',  // Change desktop width
}}
```

### Update Modal Max Width
Edit `components/ImageModal.tsx`:
```typescript
style={{
  maxWidth: '1200px',  // Change this
}}
```

## Responsive Breakpoints

### Mobile
```css
@media (max-width: 1023px) {
  /* Gallery: bottom sheet */
  /* Timeline: compact */
  /* Modal: full-screen */
}
```

### Desktop
```css
@media (min-width: 1024px) {
  /* Gallery: sidebar */
  /* Timeline: full width */
  /* Modal: centered */
}
```

## API Integration

### Image Generation Endpoint
```typescript
POST /api/generate
Body: { lat: number, lng: number, year: number }
Response: { success: boolean, exploration: Exploration }
```

**Current**: Placeholder implementation  
**Production**: Replace with actual AI image generation service

### Exploration Type
```typescript
interface Exploration {
  id: string
  lat: number
  lng: number
  year: number
  placeName: string
  era: string
  imageData: string  // base64 data URL
  createdAt: number
}
```

## Deployment

### Netlify
```bash
# Build command
npm run build

# Publish directory
.next/

# Environment variables
# (none required for frontend)
```

### Vercel
```bash
# Auto-detected Next.js project
# No additional config needed
```

## Browser Support
- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

**Note**: Requires backdrop-filter support (most modern browsers)

## Performance Tips

### Fonts
- Preconnected to Google Fonts
- Display swap enabled
- Only 300-600 weights loaded

### Images
- Base64 stored in IndexedDB
- Lazy loading in gallery
- Aspect ratio containers prevent layout shift

### Animations
- GPU-accelerated (transform/opacity)
- No will-change abuse
- Smooth 60fps

## Troubleshooting

### Map not loading
```typescript
// Ensure Leaflet is dynamically imported
const Map = dynamic(() => import('../components/Map'), { ssr: false })
```

### Leaflet icons missing
```typescript
// Check icon paths in Map.tsx
iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png'
```

### Slider not styled
```css
/* Check globals.css for range input styling */
/* Ensure both WebKit and Mozilla prefixes are present */
```

### Gallery not responsive
```css
/* Check media queries in Gallery.tsx */
/* Breakpoint is 1024px */
```

## Code Style

### Inline Styles
- All component styling via `style` prop
- No external CSS modules
- Global animations in `globals.css`

### TypeScript
- Strict mode enabled
- ESLint rules enforced
- No `any` types (use explicit types)

### Naming
- Components: PascalCase
- Files: PascalCase.tsx
- CSS classes: kebab-case (minimal use)

## Testing Checklist

- [ ] Map loads and is clickable
- [ ] Year slider moves smoothly
- [ ] Era pills change active state
- [ ] Loading overlay appears during generation
- [ ] Modal opens with generated image
- [ ] Gallery shows past explorations
- [ ] Close button works
- [ ] Share/Download buttons functional
- [ ] Responsive: works on mobile and desktop
- [ ] Build succeeds with zero errors

## Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Leaflet Docs**: https://leafletjs.com/reference.html
- **Google Fonts**: https://fonts.google.com
- **CARTO Tiles**: https://carto.com/basemaps

## Support

For issues or questions, refer to:
- `REDESIGN-SUMMARY.md` - Complete redesign details
- `DESIGN-SPEC.md` - Visual design system
- `BEFORE-AFTER.md` - Transformation comparison

## License
(Add your license here)

---

**Ready to explore history!** 🌍⏳
