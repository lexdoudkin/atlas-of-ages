import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Atlas of Ages',
  description: 'Explore any location on Earth throughout 7,000 years of human history',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://unpkg.com/maplibre-gl@5.21.1/dist/maplibre-gl.css" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
