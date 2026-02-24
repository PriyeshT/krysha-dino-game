'use client'

import { useState } from 'react'
import { PLAYER_CONFIGS, DEFAULT_NAMES } from '@/lib/constants'
import type { Player } from '@/lib/types'

interface SetupScreenProps {
  initialNames?: string[]
  onStart: (players: Player[]) => void
}

export default function SetupScreen({ initialNames, onStart }: SetupScreenProps) {
  const [count, setCount] = useState(2)
  const [names, setNames] = useState<string[]>(
    initialNames ?? DEFAULT_NAMES
  )

  function handleStart() {
    const players: Player[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      name: names[i].trim() || DEFAULT_NAMES[i],
      color: PLAYER_CONFIGS[i].color,
      textColor: PLAYER_CONFIGS[i].textColor,
      emoji: PLAYER_CONFIGS[i].emoji,
      position: 0,
    }))
    onStart(players)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 w-full max-w-md">
        <h1 className="font-magic text-3xl text-center text-dino-purple mb-2">
          🦕 Krysha&apos;s Dino Adventure! 🪜
        </h1>
        <p className="text-center text-slate-500 text-sm mb-8">
          Climb the staircases, dodge the dinosaurs!
        </p>

        <div className="mb-6">
          <p className="font-body font-700 text-slate-700 mb-3 font-bold">
            How many players?
          </p>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4].map(n => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`w-12 h-12 rounded-full font-magic text-xl transition-all ${
                  count === n
                    ? 'bg-dino-purple text-white shadow-lg scale-110'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-8">
          {Array.from({ length: count }, (_, i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className={`w-8 h-8 rounded-full ${PLAYER_CONFIGS[i].color} flex items-center justify-center text-white font-bold text-sm shrink-0`}
              >
                {PLAYER_CONFIGS[i].emoji}
              </span>
              <input
                type="text"
                value={names[i]}
                onChange={e => {
                  const next = [...names]
                  next[i] = e.target.value
                  setNames(next)
                }}
                placeholder={DEFAULT_NAMES[i]}
                className="flex-1 border-2 border-slate-200 rounded-xl px-3 py-2 font-body focus:outline-none focus:border-dino-purple text-slate-700"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleStart}
          className="w-full bg-dino-purple hover:bg-purple-700 text-white font-magic text-xl py-4 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          🎲 Start Game!
        </button>
      </div>
    </div>
  )
}
