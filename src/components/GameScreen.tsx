'use client'

import GameBoard from './GameBoard'
import PlayerPanel from './PlayerPanel'
import Dice from './Dice'
import type { GameState } from '@/lib/types'

interface GameScreenProps {
  state: GameState
  onRoll: () => void
  onRollComplete: (value: number) => void
  onNewGame: () => void
}

export default function GameScreen({ state, onRoll, onRollComplete, onNewGame }: GameScreenProps) {
  const currentPlayer = state.players[state.currentPlayerIndex]

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 max-w-5xl mx-auto w-full">
      {/* Board */}
      <div className="flex-1 min-w-0">
        <GameBoard
          players={state.players}
          currentPlayerIndex={state.currentPlayerIndex}
        />
      </div>

      {/* Side panel */}
      <div className="md:w-72 flex flex-col gap-4">
        {/* Current player + dice */}
        <div className="bg-white/80 rounded-3xl shadow-lg p-5 flex flex-col items-center gap-4">
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Now rolling</p>
            <p className="font-magic text-2xl text-dino-purple">
              {currentPlayer.emoji} {currentPlayer.name}
            </p>
          </div>
          <Dice
            value={state.diceValue}
            rolling={state.rolling}
            disabled={state.rolling}
            onRoll={onRoll}
            onRollComplete={onRollComplete}
          />
        </div>

        {/* Player list + event */}
        <div className="bg-white/80 rounded-3xl shadow-lg p-4">
          <PlayerPanel
            players={state.players}
            currentPlayerIndex={state.currentPlayerIndex}
            lastEvent={state.lastEvent}
            rolling={state.rolling}
            diceValue={state.diceValue}
            onRoll={onRoll}
            onRollComplete={onRollComplete}
            onNewGame={onNewGame}
          />
        </div>
      </div>
    </div>
  )
}
