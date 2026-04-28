import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Stirring Minds Ops',
  description: 'Internal operations platform — Stirring Minds',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
