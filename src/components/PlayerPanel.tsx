'use client'

import type { Player, LastEvent } from '@/lib/types'

interface PlayerPanelProps {
  players: Player[]
  currentPlayerIndex: number
  lastEvent: LastEvent | null
  rolling: boolean
  onRoll: () => void
  onRollComplete: (value: number) => void
  diceValue: number | null
  onNewGame: () => void
}

function eventMessage(e: LastEvent): string {
  switch (e.type) {
    case 'normal':
      return `✅ ${e.playerName} moved to square ${e.to}!`
    case 'staircase':
      return `🪜 Woohoo! ${e.playerName} found a staircase! ${e.from} → ${e.to}!`
    case 'dinosaur':
      return `🦕 Roar! A dinosaur got ${e.playerName}! Slid back ${e.from} → ${e.to}!`
    case 'overshoot':
      return `↩️ Almost! ${e.playerName} bounced back to ${e.to}!`
    case 'win':
      return `🏆 ${e.playerName} WINS!`
  }
}

function positionLabel(p: Player): string {
  if (p.position === 0) return 'Not started'
  if (p.position === 100) return '🏆 Won!'
  return `Square ${p.position}`
}

export default function PlayerPanel({
  players,
  currentPlayerIndex,
  lastEvent,
  onNewGame,
}: PlayerPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Player cards */}
      <div className="flex flex-col gap-2">
        {players.map((p, i) => {
          const isCurrent = i === currentPlayerIndex
          return (
            <div
              key={p.id}
              className={`rounded-2xl p-3 border-2 transition-all ${
                isCurrent
                  ? `border-yellow-400 bg-yellow-50 shadow-md`
                  : 'border-slate-100 bg-white/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-full ${p.color} flex items-center justify-center text-sm`}
                  >
                    {p.emoji}
                  </span>
                  <span className="font-bold text-slate-700 text-sm">{p.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  {isCurrent && (
                    <span className="text-xs bg-yellow-400 text-yellow-900 font-bold px-2 py-0.5 rounded-full">
                      YOUR TURN 🎲
                    </span>
                  )}
                  <span className="text-xs text-slate-500">{positionLabel(p)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Event banner */}
      {lastEvent && (
        <div
          key={`${lastEvent.playerName}-${lastEvent.to}`}
          className={`rounded-2xl p-3 text-sm font-bold text-center animate-fadeInUp ${
            lastEvent.type === 'staircase'
              ? 'bg-green-100 text-green-800'
              : lastEvent.type === 'dinosaur'
              ? 'bg-red-100 text-red-800'
              : lastEvent.type === 'overshoot'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {eventMessage(lastEvent)}
        </div>
      )}

      {/* New Game button */}
      <button
        onClick={onNewGame}
        className="mt-2 text-sm text-slate-500 hover:text-slate-700 underline text-center transition-colors"
      >
        🔄 New Game
      </button>
    </div>
  )
}
