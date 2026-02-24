'use client'

import { useEffect, useRef } from 'react'

const FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

interface DiceProps {
  value: number | null
  rolling: boolean
  disabled: boolean
  onRoll: () => void
  onRollComplete: (value: number) => void
}

export default function Dice({ value, rolling, disabled, onRoll, onRollComplete }: DiceProps) {
  const displayRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!rolling) return

    const finalValue = Math.floor(Math.random() * 6) + 1
    const intervalId = setInterval(() => {
      if (displayRef.current) {
        displayRef.current.textContent = FACES[Math.floor(Math.random() * 6)]
      }
    }, 80)

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId)
      if (displayRef.current) {
        displayRef.current.textContent = FACES[finalValue - 1]
      }
      onRollComplete(finalValue)
    }, 800)

    return () => {
      clearInterval(intervalId)
      clearTimeout(timeoutId)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolling])

  const face = value !== null ? FACES[value - 1] : '🎲'

  return (
    <div className="flex flex-col items-center gap-3">
      <span
        ref={displayRef}
        className={`text-6xl leading-none select-none transition-transform ${rolling ? 'animate-wiggle' : ''}`}
      >
        {face}
      </span>
      <button
        onClick={onRoll}
        disabled={disabled}
        className={`bg-dino-purple text-white font-magic text-lg px-6 py-3 rounded-2xl shadow-md transition-all
          ${disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-purple-700 hover:scale-105 active:scale-95'
          }
        `}
      >
        {rolling ? 'Rolling…' : '🎲 Roll!'}
      </button>
    </div>
  )
}
