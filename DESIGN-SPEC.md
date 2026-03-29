# Atlas of Ages - Visual Design Specification

## Design System

### Color Palette

#### Primary Colors
```css
--bg-primary: #050505;        /* Deep black background */
--bg-secondary: #0a0a0a;      /* Slightly lighter black */
--accent-amber: #D4A574;      /* Warm amber gold */
--accent-gold: #C9956B;       /* Rich gold */
```

#### Text Colors
```css
--text-primary: #F5F0EB;      /* Warm white (not pure white) */
--text-secondary: #8A8178;    /* Warm gray */
```

#### Glass Morphism
```css
--glass-bg: rgba(255,255,255,0.03);
--glass-border: rgba(255,255,255,0.06);
--glass-hover: rgba(255,255,255,0.08);
```

#### Interactive States
```css
--active-bg: linear-gradient(135deg, rgba(212,165,116,0.2), rgba(201,149,107,0.2));
--active-border: rgba(212,165,116,0.5);
--hover-tint: rgba(212,165,116,0.08);
```

### Typography

#### Font Families
```css
--font-display: 'Playfair Display', serif;  /* Headings, years, elegant moments */
--font-body: 'Inter', sans-serif;           /* UI, body text, labels */
```

#### Font Weights
```css
--weight-light: 300;      /* Subtle text, descriptions */
--weight-regular: 400;    /* Body text, buttons */
--weight-medium: 500;     /* Emphasized UI elements */
--weight-semibold: 600;   /* Strong emphasis (rarely used) */
```

#### Scale
```css
/* Display */
--text-hero: clamp(48px, 8vw, 72px);  /* Year display (responsive) */
--text-display: 32px;                  /* Location names in modal */

/* Headings */
--text-h1: 28px;          /* Page title */
--text-h2: 24px;          /* Section headers */
--text-h3: 20px;          /* Card titles */

/* Body */
--text-base: 14px;        /* Standard body text */
--text-sm: 13px;          /* Small UI text */
--text-xs: 12px;          /* Labels, captions */
--text-xxs: 11px;         /* Tiny details, coordinates */
```

#### Letter Spacing
```css
--tracking-tight: 0.02em;    /* Body text */
--tracking-normal: 0.04em;   /* UI elements */
--tracking-wide: 0.08em;     /* Headings */
--tracking-wider: 0.12em;    /* Year display, labels */
```

### Spacing System

#### Base Unit: 4px

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

#### Component Spacing
- **Card padding**: 24px (desktop), 16px (mobile)
- **Section gaps**: 32px
- **List item gaps**: 12-14px
- **Button padding**: 10px 20px

### Border Radius

```css
--radius-sm: 8px;       /* Small elements, badges */
--radius-md: 12px;      /* Cards, buttons */
--radius-lg: 16px;      /* Panels, modals */
--radius-xl: 24px;      /* Large containers */
--radius-full: 50%;     /* Circles */
```

### Shadows

```css
/* Subtle elevation */
--shadow-sm: 0 2px 8px rgba(0,0,0,0.6);

/* Medium elevation */
--shadow-md: 0 4px 16px rgba(0,0,0,0.4);

/* Heavy elevation */
--shadow-lg: 0 16px 40px rgba(0,0,0,0.4);

/* Modal / overlay */
--shadow-xl: 0 32px 64px rgba(0,0,0,0.8);

/* Glow effects */
--glow-amber: 0 0 20px rgba(212,165,116,0.3),
              0 0 40px rgba(212,165,116,0.2);

--glow-strong: 0 0 30px rgba(212,165,116,0.5),
               0 0 60px rgba(212,165,116,0.3);
```

## Component Specifications

### 1. Header
**Location**: Top-left corner  
**Spacing**: 24px from edges  
**Animation**: Fade in 0.8s

```
Title: 28px Playfair Display, 400 weight, 0.08em spacing
Subtitle: 12px Inter, 300 weight, 0.1em spacing
Colors: Title (#F5F0EB), Subtitle (#8A8178)
Shadow: 0 2px 16px rgba(0,0,0,0.8)
```

### 2. Map
**Coverage**: Full viewport edge-to-edge  
**Tiles**: CARTO dark_nolabels  
**Filter**: brightness(0.7) contrast(1.15)  
**Cursor**: Crosshair

**Zoom Controls**:
- Glass-morphism background
- 36×36px buttons
- Amber text (#D4A574)
- Hover: scale(1.05)

**Markers**:
- 48×48px circular
- Image thumbnail inside
- 2px amber border (#D4A574, 60% opacity)
- Pulse animation (2s loop)
- Hover: scale(1.2)
- Multi-layer shadow

### 3. Timeline
**Location**: Bottom of screen  
**Padding**: 64px top, 32px bottom  
**Animation**: Slide in from bottom 0.6s

**Year Display**:
- 48-72px Playfair Display (responsive clamp)
- 300 weight
- 0.12em letter spacing
- Glow animation (3s loop)
- Color: #F5F0EB

**Slider**:
- 2px track with amber gradient
- 24×24px thumb
- Amber gradient fill
- Glow on hover (scale 1.15)
- Box shadow: multiple layers

**Era Pills**:
- Glass-morphism background
- 10px 20px padding
- 24px border radius (full pill shape)
- Active: amber gradient background, glowing border
- Inactive: subtle glass, 8% white border
- Transition: 0.3s cubic-bezier

### 4. Gallery

#### Desktop Sidebar
**Dimensions**: 320px wide, auto height  
**Location**: Left side, 140px from top, 180px from bottom  
**Background**: Glass-morphism with blur

**Header**:
- 20px 24px padding
- Amber label (#D4A574)
- Border bottom

**List Items**:
- 14px 20px padding
- 52×52px thumbnails
- 10px border radius
- Hover: amber tint background
- Staggered fade-in (0.05s increments)

#### Mobile Bottom Sheet
**Location**: Above timeline (140px from bottom)  
**Padding**: 16px  
**Background**: Glass-morphism

**Thumbnails**:
- 110×110px squares
- 12px border radius
- Horizontal scroll
- Touch-friendly spacing

### 5. Loading Overlay
**Coverage**: Full screen  
**Background**: 75% black with 12px blur  
**Animation**: Fade in 0.3s

**Card**:
- Glass-morphism
- 48px 64px padding
- 24px border radius
- Scale-in animation

**Spinner**:
- Dual concentric rings
- Outer: 64px, 2px amber, 1.2s spin
- Inner: 56px, 1px gold, 1.8s reverse
- Center empty (ring only)

**Text**:
- Title: 24px Playfair Display, shimmer animation
- Subtitle: 13px Inter, gray

### 6. Image Modal
**Coverage**: Full screen overlay  
**Background**: 92% black with 20px blur  
**Animation**: Fade + scale 0.5s

**Close Button**:
- 44×44px circle
- Glass-morphism
- Top-right (-48px offset)
- Hover: amber tint, scale(1.05)

**Image Container**:
- Max-width 1200px
- 16:9 aspect ratio
- 16px border radius
- Massive shadow (32px 64px)

**Lower-Third Overlay**:
- Gradient from bottom
- 48px 32px 24px padding
- Slide in after image loads (0.6s, 0.2s delay)

**Location Name**:
- 20-32px Playfair Display (responsive clamp)
- 400 weight
- #F5F0EB

**Year & Era**:
- 14px Inter
- Year in amber (#D4A574)
- Era in gray (#8A8178)
- Dot separator

**Coordinates Badge**:
- 11px Inter
- Glass-morphism
- 6px 12px padding
- 8px border radius

**Action Buttons**:
- Share / Download
- Glass-morphism
- 10px 16px padding
- Hover: lighten background

## Animation Library

### Timing Functions
```css
--ease-out: cubic-bezier(0.4, 0, 0.2, 1);    /* Primary easing */
--ease-in-out: cubic-bezier(0.5, 0, 0.5, 1); /* Spinner */
```

### Durations
```css
--duration-fast: 0.2s;      /* Hover states */
--duration-normal: 0.3s;    /* Most transitions */
--duration-slow: 0.6s;      /* Entrance animations */
--duration-loop: 2-3s;      /* Continuous animations */
```

### Keyframes

#### Spin (loading spinners)
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

#### Shimmer (loading text)
```css
@keyframes shimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
```

#### Fade In Scale
```css
@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

#### Slide In From Bottom
```css
@keyframes slideInFromBottom {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

#### Pulse (marker glow)
```css
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(212,165,116,0.4); }
  50% { box-shadow: 0 0 0 8px rgba(212,165,116,0); }
}
```

#### Glow Pulse (year display)
```css
@keyframes glowPulse {
  0%, 100% {
    text-shadow: 0 0 20px rgba(212,165,116,0.3),
                 0 0 40px rgba(212,165,116,0.2);
  }
  50% {
    text-shadow: 0 0 30px rgba(212,165,116,0.5),
                 0 0 60px rgba(212,165,116,0.3);
  }
}
```

## Responsive Breakpoints

### Mobile
`< 1024px`
- Gallery: Bottom sheet, horizontal scroll
- Timeline: Compact, smaller year display
- Modal: Full-screen
- Header: Smaller font sizes

### Desktop
`>= 1024px`
- Gallery: Left sidebar
- Timeline: Full width, large year display
- Modal: Centered with max-width
- Header: Full size

### Fluid Typography
```css
font-size: clamp(48px, 8vw, 72px);  /* Year display */
font-size: clamp(20px, 3vw, 32px);  /* Location name */
```

## Interaction States

### Buttons
- **Default**: Glass background, subtle border
- **Hover**: Lighten background, brighten text, scale(1.05) for close button
- **Active**: Slight scale down
- **Disabled**: Reduced opacity, cursor: not-allowed

### Era Pills
- **Default**: Glass, gray text
- **Active**: Amber gradient, glowing border, amber text
- **Hover**: Lighten if inactive

### Gallery Items
- **Default**: Transparent
- **Hover**: Amber tint background
- **Active**: (when modal open)

### Map Markers
- **Default**: Pulse animation
- **Hover**: Scale(1.2), enhanced glow
- **Click**: Open modal

## Accessibility Notes

### Contrast Ratios
- Primary text (#F5F0EB on #050505): 17.5:1 ✓
- Secondary text (#8A8178 on #050505): 5.8:1 ✓
- Accent amber (#D4A574 on #050505): 6.2:1 ✓

### Interactive Elements
- Minimum 44×44px touch targets on mobile ✓
- Focus states needed (TODO)
- ARIA labels needed (TODO)
- Keyboard navigation needed (TODO)

### Performance
- All animations use transform/opacity (GPU-accelerated) ✓
- Will-change used sparingly
- Reduced motion support needed (TODO)

## File Structure
```
app/
  globals.css          # All global styles, animations, Leaflet overrides
  layout.tsx           # Google Fonts, Leaflet CSS
  page.tsx             # Main layout, minimal header

components/
  Map.tsx              # Dark tiles, elegant markers
  Timeline.tsx         # Hero year display, custom slider, era pills
  Gallery.tsx          # Sidebar (desktop), bottom sheet (mobile)
  ImageModal.tsx       # Dramatic reveal, cinematic lower-third
  LoadingOverlay.tsx   # Dual-ring spinner, shimmer text

lib/
  storage.ts           # (unchanged) IndexedDB logic
```

## Implementation Notes

### CSS Strategy
- Pure CSS, no external libraries
- Inline styles via React style prop
- Global animations in globals.css
- Responsive via media queries in <style> tags

### Browser Support
- Modern browsers (Chrome 90+, Safari 14+, Firefox 88+)
- Backdrop-filter requires prefix for Safari
- Range slider custom styling (WebKit + Mozilla)
- Graceful degradation for older browsers

### Performance Tips
- Use transform over top/left for animations
- Lazy load images in gallery
- Debounce slider changes if needed
- Minimize repaints with will-change sparingly

## Design Inspiration

This design draws from:
- **Apple Maps**: Clean, immersive, edge-to-edge
- **Stripe**: Premium glass-morphism, subtle interactions
- **Museum exhibits**: Sophisticated typography, warm blacks
- **Luxury watches**: Attention to detail, micro-animations
- **Film UI**: Cinematic overlays, dramatic reveals

The result is a design that feels both cutting-edge and timeless, technical yet warm, powerful yet elegant.
