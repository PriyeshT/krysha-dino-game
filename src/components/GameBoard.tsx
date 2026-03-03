'use client'

import { buildBoard } from '@/lib/gameLogic'
import { STAIRCASES, DINOSAURS } from '@/lib/constants'
import type { Player } from '@/lib/types'
import BoardCell from './BoardCell'

// Map square number → pixel-centre as % of board (viewBox 0 0 100 100)
function squareCenter(square: number): [number, number] {
  const rowFromBottom = Math.floor((square - 1) / 10)
  const posInRow = (square - 1) % 10
  const row = 9 - rowFromBottom
  const col = rowFromBottom % 2 === 0 ? posInRow : 9 - posInRow
  return [(col + 0.5) * 10, (row + 0.5) * 10]
}

function LadderPath({ from, to }: { from: number; to: number }) {
  const [fx, fy] = squareCenter(from)
  const [tx, ty] = squareCenter(to)
  const dx = tx - fx, dy = ty - fy
  const len = Math.sqrt(dx * dx + dy * dy)
  const ux = dx / len, uy = dy / len
  // perpendicular unit vector (for rails on each side)
  const px = -uy, py = ux
  const w = 1.1 // half-width between rails

  const rungTs = [0.12, 0.28, 0.44, 0.60, 0.76, 0.90]

  return (
    <g>
      {/* Rails */}
      <line
        x1={fx + w * px} y1={fy + w * py}
        x2={tx + w * px} y2={ty + w * py}
        stroke="#7e22ce" strokeWidth="1.0" strokeLinecap="round"
      />
      <line
        x1={fx - w * px} y1={fy - w * py}
        x2={tx - w * px} y2={ty - w * py}
        stroke="#7e22ce" strokeWidth="1.0" strokeLinecap="round"
      />
      {/* Rungs */}
      {rungTs.map((t, i) => (
        <line
          key={i}
          x1={fx + t * dx + w * px} y1={fy + t * dy + w * py}
          x2={fx + t * dx - w * px} y2={fy + t * dy - w * py}
          stroke="#7e22ce" strokeWidth="0.9" strokeLinecap="round"
        />
      ))}
      {/* Small circle at bottom (start) and arrowhead at top (end) */}
      <circle cx={fx} cy={fy} r="1.4" fill="#7e22ce" />
      <polygon
        points={`${tx},${ty - 2.2} ${tx - 1.6},${ty + 1} ${tx + 1.6},${ty + 1}`}
        fill="#7e22ce"
        transform={`rotate(${Math.atan2(dy, dx) * (180 / Math.PI) - 90}, ${tx}, ${ty})`}
      />
    </g>
  )
}

function SnakePath({ from, to }: { from: number; to: number }) {
  const [fx, fy] = squareCenter(from) // head (higher square number)
  const [tx, ty] = squareCenter(to)   // tail (lower square number)
  const dx = tx - fx, dy = ty - fy
  const len = Math.sqrt(dx * dx + dy * dy)
  const px = -dy / len, py = dx / len
  const bump = Math.min(len * 0.38, 11)

  const c1x = fx + dx * 0.3 + bump * px
  const c1y = fy + dy * 0.3 + bump * py
  const c2x = fx + dx * 0.7 - bump * px
  const c2y = fy + dy * 0.7 - bump * py

  const pathD = `M ${fx} ${fy} C ${c1x} ${c1y} ${c2x} ${c2y} ${tx} ${ty}`

  function bezierPt(t: number): [number, number] {
    const mt = 1 - t
    const bx = mt*mt*mt*fx + 3*mt*mt*t*c1x + 3*mt*t*t*c2x + t*t*t*tx
    const by = mt*mt*mt*fy + 3*mt*mt*t*c1y + 3*mt*t*t*c2y + t*t*t*ty
    return [bx, by]
  }

  function bezierTan(t: number): [number, number] {
    const mt = 1 - t
    const bx = 3*mt*mt*(c1x-fx) + 6*mt*t*(c2x-c1x) + 3*t*t*(tx-c2x)
    const by = 3*mt*mt*(c1y-fy) + 6*mt*t*(c2y-c1y) + 3*t*t*(ty-c2y)
    return [bx, by]
  }

  const scaleTs = [0.1, 0.22, 0.34, 0.46, 0.58, 0.70, 0.82, 0.92]
  const scales = scaleTs.map(t => {
    const [sx, sy] = bezierPt(t)
    const [tanX, tanY] = bezierTan(t)
    const angle = Math.atan2(tanY, tanX) * (180 / Math.PI)
    return { sx, sy, angle }
  })

  const [h0x, h0y] = bezierTan(0)
  const headAngle = Math.atan2(-h0y, -h0x) * (180 / Math.PI)

  return (
    <g>
      {/* Body — 3 stacked strokes for depth */}
      <path d={pathD} stroke="#166534" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <path d={pathD} stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d={pathD} stroke="#bbf7d0" strokeWidth="0.7" fill="none" strokeLinecap="round" strokeDasharray="1.8 1.2" />

      {/* Scale marks */}
      {scales.map(({ sx, sy, angle }, i) => (
        <ellipse
          key={i}
          cx={sx} cy={sy}
          rx="1.2" ry="0.6"
          fill="#15803d"
          opacity="0.65"
          transform={`rotate(${angle}, ${sx}, ${sy})`}
        />
      ))}

      {/* Snake head */}
      <g transform={`translate(${fx}, ${fy}) rotate(${headAngle})`}>
        <ellipse cx="0" cy="0" rx="2.4" ry="1.6" fill="#166534" />
        <circle cx="1.4" cy="-0.8" r="0.55" fill="white" />
        <circle cx="1.4" cy="-0.8" r="0.28" fill="#111" />
        <circle cx="1.4" cy="0.8" r="0.55" fill="white" />
        <circle cx="1.4" cy="0.8" r="0.28" fill="#111" />
        <line x1="2.4" y1="0" x2="3.6" y2="0" stroke="#dc2626" strokeWidth="0.35" strokeLinecap="round" />
        <line x1="3.6" y1="0" x2="4.3" y2="-0.5" stroke="#dc2626" strokeWidth="0.3" strokeLinecap="round" />
        <line x1="3.6" y1="0" x2="4.3" y2="0.5" stroke="#dc2626" strokeWidth="0.3" strokeLinecap="round" />
      </g>

      {/* Tail */}
      <circle cx={tx} cy={ty} r="1.0" fill="#166534" />
    </g>
  )
}

const BOARD = buildBoard()

export default function GameBoard({ players, currentPlayerIndex }: {
  players: Player[]
  currentPlayerIndex: number
}) {
  const currentPlayer = players[currentPlayerIndex]

  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-slate-300 shadow-xl">
      {/* Cell grid */}
      <div className="grid grid-cols-10 h-full">
        {BOARD.map(row =>
          row.map(square => {
            const playersOnCell = players.filter(p => p.position === square || (square === 1 && p.position === 0))
            const isCurrentPlayerCell = currentPlayer?.position === square && currentPlayer.position > 0
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

      {/* SVG overlay — staircases (ladders) and dinosaurs (snakes) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
      >
        {STAIRCASES.map(s => (
          <LadderPath key={`stair-${s.from}`} from={s.from} to={s.to} />
        ))}
        {DINOSAURS.map(d => (
          <SnakePath key={`dino-${d.from}`} from={d.from} to={d.to} />
        ))}
      </svg>
    </div>
  )
}
