'use client'

import { useReducer, useCallback, useRef, useState, useEffect } from 'react'
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
      return { ...initialState, phase: 'playing', players: action.players }

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
      return { ...state, players: updatedPlayers, diceValue: action.diceValue, rolling: false, lastEvent }
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

const STEP_MS = 220         // ms per cell step
const SPECIAL_PAUSE_MS = 900 // pause at staircase/dino cell before jump
const SETTLE_MS = 600        // pause after final position before next player

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [displayPositions, setDisplayPositions] = useState<Record<number, number>>({})
  const [specialSquare, setSpecialSquare] = useState<number | null>(null)
  const [showWinScreen, setShowWinScreen] = useState(false)

  const settledPositions = useRef<Record<number, number>>({})
  const animationTimers = useRef<ReturnType<typeof setTimeout>[]>([])
  const stateRef = useRef(state)
  stateRef.current = state
  const prevPhaseRef = useRef(state.phase)

  // Initialize / reset display positions when phase transitions to 'playing'
  useEffect(() => {
    const prev = prevPhaseRef.current
    prevPhaseRef.current = state.phase
    if (state.phase === 'playing' && (prev === 'setup' || prev === 'won')) {
      const initial = Object.fromEntries(stateRef.current.players.map(p => [p.id, 0]))
      setDisplayPositions(initial)
      settledPositions.current = { ...initial }
      setShowWinScreen(false)
      setSpecialSquare(null)
    }
  }, [state.phase])

  // Step-by-step coin animation when a move is made
  useEffect(() => {
    if (!state.lastEvent) return

    const { from, to, type, diceValue, playerName } = state.lastEvent
    const player = stateRef.current.players.find(p => p.name === playerName)
    if (!player) return

    animationTimers.current.forEach(t => clearTimeout(t))
    animationTimers.current = []
    setSpecialSquare(null)

    const prevPos = settledPositions.current[player.id] ?? 0

    // Build the path of cells to step through
    const path: number[] = []
    if (type === 'overshoot') {
      for (let i = prevPos + 1; i <= 100; i++) path.push(i)
      for (let i = 99; i >= from; i--) path.push(i)
    } else {
      for (let i = prevPos + 1; i <= from; i++) path.push(i)
    }

    // Schedule per-cell step animations
    path.forEach((pos, idx) => {
      const t = setTimeout(() => {
        setDisplayPositions(prev => ({ ...prev, [player.id]: pos }))
      }, idx * STEP_MS)
      animationTimers.current.push(t)
    })

    const afterStepsMs = path.length * STEP_MS

    if (type === 'staircase' || type === 'dinosaur') {
      // Highlight the special cell while the coin pauses there
      const t0 = setTimeout(() => setSpecialSquare(from), afterStepsMs)
      animationTimers.current.push(t0)

      // Jump to final position after dramatic pause
      const t1 = setTimeout(() => {
        setSpecialSquare(null)
        setDisplayPositions(prev => ({ ...prev, [player.id]: to }))
        settledPositions.current[player.id] = to
      }, afterStepsMs + SPECIAL_PAUSE_MS)
      animationTimers.current.push(t1)

      const t2 = setTimeout(() => {
        dispatch({ type: 'NEXT_PLAYER' })
      }, afterStepsMs + SPECIAL_PAUSE_MS + SETTLE_MS)
      animationTimers.current.push(t2)

    } else if (type === 'win') {
      settledPositions.current[player.id] = to
      const t = setTimeout(() => setShowWinScreen(true), afterStepsMs + SETTLE_MS)
      animationTimers.current.push(t)

    } else {
      // normal / overshoot
      settledPositions.current[player.id] = to
      const t = setTimeout(() => {
        dispatch({ type: 'NEXT_PLAYER' })
      }, afterStepsMs + SETTLE_MS)
      animationTimers.current.push(t)
    }
  }, [state.lastEvent]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => {
    animationTimers.current.forEach(t => clearTimeout(t))
  }, [])

  const handleRoll = useCallback(() => {
    if (stateRef.current.rolling) return
    dispatch({ type: 'BEGIN_ROLL' })
  }, [])

  const handleRollComplete = useCallback((value: number) => {
    dispatch({ type: 'RESOLVE_ROLL', diceValue: value })
  }, [])

  const handlePlayAgain = useCallback(() => {
    animationTimers.current.forEach(t => clearTimeout(t))
    animationTimers.current = []
    dispatch({ type: 'PLAY_AGAIN' })
  }, [])

  const handleNewGame = useCallback(() => {
    animationTimers.current.forEach(t => clearTimeout(t))
    animationTimers.current = []
    dispatch({ type: 'NEW_GAME' })
  }, [])

  const displayPlayers = state.players.map(p => ({
    ...p,
    position: displayPositions[p.id] ?? p.position,
  }))

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
        state={{ ...state, players: displayPlayers }}
        specialSquare={specialSquare}
        onRoll={handleRoll}
        onRollComplete={handleRollComplete}
        onNewGame={handleNewGame}
      />
      {showWinScreen && state.winner && (
        <WinScreen
          winner={state.winner}
          onPlayAgain={handlePlayAgain}
          onNewGame={handleNewGame}
        />
      )}
    </>
  )
}
