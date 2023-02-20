import { TILE_SIZE } from '../layer/phaser/config/chunk'

export function snapToGrid(x, y, gridSize = TILE_SIZE / 2) {
  return { x: Math.floor(x / gridSize) * gridSize, y: Math.floor(y / gridSize) * gridSize }
}

export interface Position {
  x: number
  y: number
}

export function snapPosToGrid(pos: Position, gridSize = TILE_SIZE / 2) {
  const { x, y } = pos
  return { x: Math.floor(x / gridSize) * gridSize, y: Math.floor(y / gridSize) * gridSize }
}
