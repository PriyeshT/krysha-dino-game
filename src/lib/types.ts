export type GamePhase = 'setup' | 'playing' | 'won'

export interface Player {
  id: number
  name: string
  color: string
  textColor: string
  emoji: string
  position: number
}

export interface LastEvent {
  type: 'normal' | 'staircase' | 'dinosaur' | 'overshoot' | 'win'
  playerName: string
  diceValue: number
  from: number
  to: number
}

export interface GameState {
  phase: GamePhase
  players: Player[]
  currentPlayerIndex: number
  diceValue: number | null
  rolling: boolean
  lastEvent: LastEvent | null
  winner: Player | null
}
