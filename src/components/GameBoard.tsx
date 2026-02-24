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
        stroke="#15803d" strokeWidth="1.0" strokeLinecap="round"
      />
      <line
        x1={fx - w * px} y1={fy - w * py}
        x2={tx - w * px} y2={ty - w * py}
        stroke="#15803d" strokeWidth="1.0" strokeLinecap="round"
      />
      {/* Rungs */}
      {rungTs.map((t, i) => (
        <line
          key={i}
          x1={fx + t * dx + w * px} y1={fy + t * dy + w * py}
          x2={fx + t * dx - w * px} y2={fy + t * dy - w * py}
          stroke="#15803d" strokeWidth="0.9" strokeLinecap="round"
        />
      ))}
      {/* Small circle at bottom (start) and arrowhead at top (end) */}
      <circle cx={fx} cy={fy} r="1.4" fill="#15803d" />
      <polygon
        points={`${tx},${ty - 2.2} ${tx - 1.6},${ty + 1} ${tx + 1.6},${ty + 1}`}
        fill="#15803d"
        transform={`rotate(${Math.atan2(dy, dx) * (180 / Math.PI) - 90}, ${tx}, ${ty})`}
      />
    </g>
  )
}

function DinoPath({ from, to }: { from: number; to: number }) {
  const [fx, fy] = squareCenter(from) // head (higher square number, higher on screen = lower y)
  const [tx, ty] = squareCenter(to)   // tail (lower square number)
  const dx = tx - fx, dy = ty - fy
  const len = Math.sqrt(dx * dx + dy * dy)
  // perpendicular direction — bump the curve to the side for an S-shape
  const px = -dy / len, py = dx / len
  const bump = Math.min(len * 0.38, 11)

  // Cubic bezier: control points on opposite sides → S-curve
  const c1x = fx + dx * 0.3 + bump * px
  const c1y = fy + dy * 0.3 + bump * py
  const c2x = fx + dx * 0.7 - bump * px
  const c2y = fy + dy * 0.7 - bump * py

  return (
    <g>
      <path
        d={`M ${fx} ${fy} C ${c1x} ${c1y} ${c2x} ${c2y} ${tx} ${ty}`}
        stroke="#b91c1c"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        markerEnd="url(#dinoArrow)"
      />
      {/* Dino head dot */}
      <circle cx={fx} cy={fy} r="1.8" fill="#b91c1c" />
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
            const playersOnCell = players.filter(p => p.position === square)
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
        <defs>
          <marker
            id="dinoArrow"
            markerWidth="3.5" markerHeight="3.5"
            refX="1.75" refY="1.75"
            orient="auto"
          >
            <path d="M0,0 L3.5,1.75 L0,3.5 Z" fill="#b91c1c" />
          </marker>
        </defs>

        {STAIRCASES.map(s => (
          <LadderPath key={`stair-${s.from}`} from={s.from} to={s.to} />
        ))}
        {DINOSAURS.map(d => (
          <DinoPath key={`dino-${d.from}`} from={d.from} to={d.to} />
        ))}
      </svg>
    </div>
  )
}
