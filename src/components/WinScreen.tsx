'use client'

import type { Player } from '@/lib/types'

const CONFETTI = ['🦕', '🪜', '🎲', '⭐', '🌸', '🎉', '🏆', '🌈', '🦋', '✨']
const FLOAT_CLASSES = [
  'animate-float-1', 'animate-float-2', 'animate-float-3', 'animate-float-4',
  'animate-float-5', 'animate-float-6', 'animate-float-7', 'animate-float-8',
  'animate-float-1', 'animate-float-2', 'animate-float-3', 'animate-float-4',
  'animate-float-5', 'animate-float-6', 'animate-float-7', 'animate-float-8',
  'animate-float-1', 'animate-float-2', 'animate-float-3', 'animate-float-4',
]

const POSITIONS = [
  'top-[5%] left-[8%]',   'top-[10%] right-[10%]', 'top-[20%] left-[15%]',
  'top-[30%] right-[5%]', 'top-[50%] left-[5%]',   'top-[60%] right-[12%]',
  'top-[70%] left-[10%]', 'top-[80%] right-[8%]',  'top-[15%] left-[40%]',
  'top-[85%] left-[40%]', 'top-[40%] left-[3%]',   'top-[40%] right-[3%]',
  'top-[25%] right-[30%]','top-[65%] left-[25%]',   'top-[75%] right-[25%]',
  'top-[5%] left-[55%]',  'top-[90%] left-[20%]',  'top-[90%] right-[20%]',
  'top-[50%] left-[45%]', 'top-[35%] left-[55%]',
]

interface WinScreenProps {
  winner: Player
  onPlayAgain: () => void
  onNewGame: () => void
}

export default function WinScreen({ winner, onPlayAgain, onNewGame }: WinScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Confetti */}
      {CONFETTI.map((emoji, i) => (
        <span
          key={i}
          className={`fixed text-3xl select-none pointer-events-none ${POSITIONS[i]} ${FLOAT_CLASSES[i]}`}
        >
          {emoji}
        </span>
      ))}

      <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-6 mx-4 max-w-sm w-full z-10">
        <div className="animate-bounce_magic text-7xl">{winner.emoji}</div>

        <div className="text-center">
          <h2 className="font-magic text-4xl text-dino-purple leading-tight">
            🏆 {winner.name}
          </h2>
          <p className="font-magic text-2xl text-dino-gold mt-1">WINS! 🏆</p>
        </div>

        <p className="text-slate-500 text-center text-sm">
          What an amazing adventure through Dino Land!
        </p>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onPlayAgain}
            className="w-full bg-dino-purple hover:bg-purple-700 text-white font-magic text-lg py-3 rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95"
          >
            🎲 Play Again
          </button>
          <button
            onClick={onNewGame}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-magic text-lg py-3 rounded-2xl transition-all hover:scale-105 active:scale-95"
          >
            🏠 New Game
          </button>
        </div>
      </div>
    </div>
  )
}
