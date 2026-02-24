import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Krysha's Dino Adventure",
    short_name: 'Dino Adventure',
    description: 'A fun Snakes & Ladders game with dinosaurs and staircases!',
    start_url: '/',
    display: 'standalone',
    background_color: '#fdf4ff',
    theme_color: '#7C3AED',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  }
}
