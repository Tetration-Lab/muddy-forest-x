import { generatePath } from 'react-router-dom'
import { TILE_SIZE } from '../config/chunk'

interface Position {
  x: number
  y: number
}

export class CursorExplorer extends Phaser.GameObjects.Sprite {
  explorerSize = 3
  currentTilePosition: { x: number; y: number }
  centerTilePosition: { x: number; y: number }
  path: LinkedList<Position>
  status: string
  isStop = false
  debug = false
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, explorerSize = 3) {
    super(scene, x, y, texture)
    this.scene.add.existing(this)
    this.setOrigin(0)
    this.setDisplaySize(TILE_SIZE, TILE_SIZE)
    this.setPosition(x, y)
    this.scene.add.rectangle(x, y, TILE_SIZE, TILE_SIZE, 0xff0000).setOrigin(0)
    this.setDepth(1000)

    this.currentTilePosition = { x, y }
    this.centerTilePosition = { x, y }
    this.path = this.makePath()
    this.explorerSize = explorerSize
  }

  wait() {
    this.status = 'wait'
  }

  run() {
    this.status = 'run'
  }

  setDebug(debug: boolean) {
    this.debug = debug
  }

  move() {
    if (this.isStop) {
      return
    }
    if (this.status === 'wait') {
      return
    }
    if (this.path.hasNext()) {
      const nextMove = this.getNextMove()
      this.currentTilePosition = nextMove
      this.setPosition(this.currentTilePosition.x, this.currentTilePosition.y)
      if (this.debug) {
        this.scene.add
          .rectangle(this.currentTilePosition.x, this.currentTilePosition.y, TILE_SIZE, TILE_SIZE, 0xff0000, 0.1)
          .setOrigin(0)
      }
    } else {
      this.updateExplorerSize()
      this.path = this.makePath()
      this.move()
    }
  }

  centerTile() {
    return this.centerTilePosition
  }

  topLeftTile() {
    return {
      x: this.centerTilePosition.x - Math.floor(this.explorerSize / 2) * TILE_SIZE,
      y: this.centerTilePosition.y - Math.floor(this.explorerSize / 2) * TILE_SIZE,
    }
  }

  private getNextMove() {
    const nextMove = this.path.next()
    return nextMove
  }

  expandExplorerSize(size: number) {
    return size + 2
  }

  updateExplorerSize() {
    this.explorerSize = this.expandExplorerSize(this.explorerSize)
  }

  setExplorerSize(size: number) {
    this.explorerSize = size
  }

  toggleisStop() {
    this.isStop = !this.isStop
  }

  private makeTableFromSize(explorerSize: number) {
    const result = [] as Position[][]
    for (let i = 0; i < explorerSize; i++) {
      const row = []
      for (let j = 0; j < explorerSize; j++) {
        row.push({ x: this.topLeftTile().x + j * TILE_SIZE, y: this.topLeftTile().y + i * TILE_SIZE })
        // row.push({ x: j, y: i })
      }
      result.push(row)
    }
    return result
  }

  printPath(path: Position[][]) {
    for (let i = 0; i < path.length; i++) {
      for (let j = 0; j < path[i].length; j++) {
        console.log(path[i][j])
      }
    }
  }

  private makeTopPath(path: Position[][]) {
    const result = [] as Position[]
    for (let i = 0; i < path.length; i++) {
      result.push(path[0][i])
    }
    return result
  }

  private makeRightPath(path: Position[][]) {
    const result = [] as Position[]
    for (let i = 0; i < path.length; i++) {
      result.push(path[i][path.length - 1])
    }
    return result
  }

  private makeBottomPath(path: Position[][]) {
    const result = [] as Position[]
    for (let i = 0; i < path.length; i++) {
      result.push(path[path.length - 1][i])
    }
    return result.reverse()
  }

  private makeLeftPath(path: Position[][]) {
    const result = [] as Position[]
    for (let i = 0; i < path.length; i++) {
      result.push(path[i][0])
    }
    return result.reverse()
  }

  private makePath() {
    const path = this.makeTableFromSize(this.explorerSize)
    const topPath = this.makeTopPath(path)
    const rightPath = this.makeRightPath(path)
    // remove first and last element of rightPath
    rightPath.shift()
    rightPath.pop()

    const bottomPath = this.makeBottomPath(path)
    // remove last element of bottomPath
    bottomPath.pop()
    const leftPath = this.makeLeftPath(path)
    const result = [...topPath, ...rightPath, ...bottomPath, ...leftPath]
    console.log(result)
    // make result to linked list
    const linkedList = new LinkedList<Position>()
    for (let i = 0; i < result.length; i++) {
      linkedList.append(result[i])
      // console.log(result[i])
    }
    // print linked list
    return linkedList
  }
}

export class LinkedList<T> {
  head: Node<T> | null
  constructor() {
    this.head = null
  }
  append(data: T) {
    const node = new Node<T>(data)
    if (!this.head) {
      this.head = node
    } else {
      let current = this.head
      while (current.next) {
        current = current.next
      }
      current.next = node
    }
  }
  hasNext() {
    return this.head !== null && !!this.head.next
  }
  next() {
    if (this.hasNext()) {
      this.head = this.head.next
    }
    return this.head.data
  }
}
export class Node<T> {
  data: T
  next: Node<T> | null
  constructor(data) {
    this.data = data
    this.next = null
  }
}
