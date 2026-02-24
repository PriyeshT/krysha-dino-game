import { STAIRCASES, DINOSAURS } from './constants'
import type { LastEvent } from './types'

export function buildBoard(): number[][] {
  return Array.from({ length: 10 }, (_, displayRow) => {
    const rowFromBottom = 9 - displayRow
    const base = rowFromBottom * 10 + 1
    const cells = Array.from({ length: 10 }, (_, i) => base + i)
    return rowFromBottom % 2 === 1 ? [...cells].reverse() : cells
  })
}

export function calculateMove(
  position: number,
  dice: number
): {
  finalPosition: number
  event: LastEvent['type']
  landedOn: number
} {
  let newPos = position + dice

  if (newPos > 100) newPos = 200 - newPos

  const landedOn = newPos

  if (newPos === 100) return { finalPosition: 100, event: 'win', landedOn }

  const stair = STAIRCASES.find(s => s.from === newPos)
  if (stair) return { finalPosition: stair.to, event: 'staircase', landedOn }

  const dino = DINOSAURS.find(d => d.from === newPos)
  if (dino) return { finalPosition: dino.to, event: 'dinosaur', landedOn }

  const event = (position + dice > 100) ? 'overshoot' : 'normal'
  return { finalPosition: newPos, event, landedOn }
}
