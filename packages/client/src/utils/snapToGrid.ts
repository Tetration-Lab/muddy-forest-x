export function snapToGrid(x, y, gridSize = 16) {
  return { x: Math.round(x / gridSize) * gridSize, y: Math.round(y / gridSize) * gridSize }
}

export interface Position {
  x: number
  y: number
}

export function snapPosToGrid(pos: Position, gridSize = 16) {
  const { x, y } = pos
  return { x: Math.round(x / gridSize) * gridSize, y: Math.round(y / gridSize) * gridSize }
}
