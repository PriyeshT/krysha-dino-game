import { STAIRCASES, DINOSAURS } from '@/lib/constants'
import type { Player } from '@/lib/types'

interface BoardCellProps {
  square: number
  players: Player[]
  isCurrentPlayerCell: boolean
}

export default function BoardCell({ square, players, isCurrentPlayerCell }: BoardCellProps) {
  const stair = STAIRCASES.find(s => s.from === square)
  const dino = DINOSAURS.find(d => d.from === square)

  let bgClass = 'bg-white'
  let borderClass = 'border-slate-100'

  if (dino) {
    bgClass = 'bg-red-50'
    borderClass = 'border-red-200'
  } else if (stair) {
    bgClass = 'bg-green-50'
    borderClass = 'border-green-200'
  } else if (square % 2 === 0) {
    bgClass = 'bg-slate-50'
  }

  return (
    <div
      className={`relative border ${borderClass} ${bgClass} flex flex-col items-center justify-between p-px aspect-square overflow-hidden
        ${isCurrentPlayerCell ? 'ring-2 ring-yellow-400 ring-inset' : ''}
      `}
    >
      {/* Square number */}
      <span className="text-[8px] leading-none text-slate-400 self-start pl-px">
        {square}
      </span>

      {/* Special marker */}
      {stair && (
        <span className="text-[9px] leading-none text-green-700 font-bold">
          🪜{stair.to}
        </span>
      )}
      {dino && (
        <span className="text-[9px] leading-none text-red-700 font-bold">
          🦕{dino.to}
        </span>
      )}
      {!stair && !dino && <span />}

      {/* Player tokens */}
      <div className="flex flex-wrap gap-px justify-center">
        {players.map(p => (
          <span
            key={p.id}
            className={`w-3 h-3 rounded-full ${p.color} inline-block`}
            title={p.name}
          />
        ))}
      </div>
    </div>
  )
}
