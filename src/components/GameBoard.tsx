import { buildBoard } from '@/lib/gameLogic'
import type { Player } from '@/lib/types'
import BoardCell from './BoardCell'

interface GameBoardProps {
  players: Player[]
  currentPlayerIndex: number
}

const BOARD = buildBoard()

export default function GameBoard({ players, currentPlayerIndex }: GameBoardProps) {
  const currentPlayer = players[currentPlayerIndex]

  return (
    <div className="w-full aspect-square rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg">
      <div className="grid grid-cols-10 h-full">
        {BOARD.map(row =>
          row.map(square => {
            const playersOnCell = players.filter(p => p.position === square)
            const isCurrentPlayerCell = currentPlayer?.position === square

            return (
              <BoardCell
                key={square}
                square={square}
                players={playersOnCell}
                isCurrentPlayerCell={isCurrentPlayerCell}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
