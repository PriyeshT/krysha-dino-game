import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Krysha's Dino Adventure 🦕",
  description: "A fun Snakes & Ladders game with dinosaurs and staircases!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-body">{children}</body>
    </html>
  )
}
