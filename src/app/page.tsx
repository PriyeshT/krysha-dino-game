'use client'

import { useReducer, useCallback, useRef } from 'react'
import type { GameState, Player } from '@/lib/types'
import { calculateMove } from '@/lib/gameLogic'
import SetupScreen from '@/components/SetupScreen'
import GameScreen from '@/components/GameScreen'
import WinScreen from '@/components/WinScreen'

type Action =
  | { type: 'START_GAME'; players: Player[] }
  | { type: 'BEGIN_ROLL' }
  | { type: 'RESOLVE_ROLL'; diceValue: number }
  | { type: 'NEXT_PLAYER' }
  | { type: 'PLAY_AGAIN' }
  | { type: 'NEW_GAME' }

const initialState: GameState = {
  phase: 'setup',
  players: [],
  currentPlayerIndex: 0,
  diceValue: null,
  rolling: false,
  lastEvent: null,
  winner: null,
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...initialState,
        phase: 'playing',
        players: action.players,
      }

    case 'BEGIN_ROLL':
      return { ...state, rolling: true, lastEvent: null }

    case 'RESOLVE_ROLL': {
      const player = state.players[state.currentPlayerIndex]
      const { finalPosition, event, landedOn } = calculateMove(player.position, action.diceValue)

      const updatedPlayers = state.players.map((p, i) =>
        i === state.currentPlayerIndex ? { ...p, position: finalPosition } : p
      )

      const lastEvent = {
        type: event,
        playerName: player.name,
        diceValue: action.diceValue,
        from: landedOn,
        to: finalPosition,
      }

      if (event === 'win') {
        return {
          ...state,
          phase: 'won',
          players: updatedPlayers,
          diceValue: action.diceValue,
          rolling: false,
          lastEvent,
          winner: updatedPlayers[state.currentPlayerIndex],
        }
      }

      return {
        ...state,
        players: updatedPlayers,
        diceValue: action.diceValue,
        rolling: false,
        lastEvent,
      }
    }

    case 'NEXT_PLAYER':
      if (state.phase === 'won') return state
      return {
        ...state,
        currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
        diceValue: null,
        lastEvent: null,
      }

    case 'PLAY_AGAIN':
      return {
        ...state,
        phase: 'playing',
        players: state.players.map(p => ({ ...p, position: 0 })),
        currentPlayerIndex: 0,
        diceValue: null,
        rolling: false,
        lastEvent: null,
        winner: null,
      }

    case 'NEW_GAME':
      return { ...initialState }

    default:
      return state
  }
}

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const nextPlayerTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleRoll = useCallback(() => {
    if (state.rolling) return
    dispatch({ type: 'BEGIN_ROLL' })
  }, [state.rolling])

  const handleRollComplete = useCallback(
    (value: number) => {
      dispatch({ type: 'RESOLVE_ROLL', diceValue: value })

      if (nextPlayerTimeout.current) clearTimeout(nextPlayerTimeout.current)
      nextPlayerTimeout.current = setTimeout(() => {
        dispatch({ type: 'NEXT_PLAYER' })
      }, 2000)
    },
    []
  )

  const handlePlayAgain = useCallback(() => {
    if (nextPlayerTimeout.current) clearTimeout(nextPlayerTimeout.current)
    dispatch({ type: 'PLAY_AGAIN' })
  }, [])

  const handleNewGame = useCallback(() => {
    if (nextPlayerTimeout.current) clearTimeout(nextPlayerTimeout.current)
    dispatch({ type: 'NEW_GAME' })
  }, [])

  if (state.phase === 'setup') {
    return (
      <SetupScreen
        initialNames={state.players.map(p => p.name)}
        onStart={players => dispatch({ type: 'START_GAME', players })}
      />
    )
  }

  return (
    <>
      <GameScreen
        state={state}
        onRoll={handleRoll}
        onRollComplete={handleRollComplete}
        onNewGame={handleNewGame}
      />
      {state.phase === 'won' && state.winner && (
        <WinScreen
          winner={state.winner}
          onPlayAgain={handlePlayAgain}
          onNewGame={handleNewGame}
        />
      )}
    </>
  )
}
