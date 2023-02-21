import { TILE_SIZE } from '../layer/phaser/config/chunk'

export function snapToGrid(x, y, gridSize = TILE_SIZE) {
  return { x: Math.floor(x / gridSize) * gridSize, y: Math.floor(y / gridSize) * gridSize }
}

export interface Position {
  x: number
  y: number
}

export function snapPosToGrid(pos: Position, gridSize = TILE_SIZE, offset = 0) {
  const { x, y } = pos
  const xVal = Math.floor(x / gridSize) * gridSize - offset / 2
  const yVal = Math.floor(y / gridSize) * gridSize - offset / 2
  return { x: xVal, y: yVal }
}

export function snapValToGrid(val: number, gridSize = TILE_SIZE, offset = 0) {
  return Math.floor(val / gridSize) * gridSize - offset
}
