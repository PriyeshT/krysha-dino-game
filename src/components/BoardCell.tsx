import { STAIRCASES, DINOSAURS } from '@/lib/constants'
import type { Player } from '@/lib/types'

interface BoardCellProps {
  square: number
  players: Player[]
  isCurrentPlayerCell: boolean
}

export default function BoardCell({ square, players, isCurrentPlayerCell }: BoardCellProps) {
  const isDinoStart = DINOSAURS.some(d => d.from === square)
  const isStairStart = STAIRCASES.some(s => s.from === square)

  let bgClass = square % 2 === 0 ? 'bg-amber-50' : 'bg-white'
  if (isDinoStart) bgClass = 'bg-red-100'
  else if (isStairStart) bgClass = 'bg-green-100'

  return (
    <div
      className={`relative flex flex-col justify-between border border-slate-200 ${bgClass} overflow-hidden
        ${isCurrentPlayerCell ? 'ring-2 ring-yellow-400 ring-inset z-10' : ''}
      `}
    >
      {/* Square number */}
      <span className="text-[7px] leading-none text-slate-400 px-px pt-px font-bold">
        {square}
      </span>

      {/* Player tokens — emoji, centred, as large as the cell allows */}
      {players.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center flex-wrap gap-px p-px">
          {players.map(p => (
            <span
              key={p.id}
              className={`flex items-center justify-center w-7 h-7 rounded-full ${p.color} text-[15px] leading-none shadow-md border-2 border-white`}
              title={p.name}
            >
              {p.emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
