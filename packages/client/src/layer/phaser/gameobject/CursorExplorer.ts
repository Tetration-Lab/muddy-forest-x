import { createEndpoint } from 'comlink'
import { generatePath } from 'react-router-dom'
import { Position, snapToGrid } from '../../../utils/snapToGrid'
import { CHUNK_HEIGHT_SIZE, CHUNK_WIDTH_SIZE, TILE_SIZE } from '../config/chunk'

export class CursorExplorer extends Phaser.GameObjects.Sprite {
  explorerSize = 3
  currentTilePosition: Position
  centerTilePosition: Position
  path: LinkedList<Position>
  status: string
  isStop = false
  debug = false
  exploreCallback: (c: Position[]) => Promise<void>
  minedChunk = 0
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    explorerSize = 3,
    exploreCallback: (c: Position[]) => Promise<void>,
  ) {
    super(scene, x, y, texture)
    this.scene.add.existing(this)
    this.setOrigin(0)
    this.setDisplaySize(TILE_SIZE * CHUNK_WIDTH_SIZE, TILE_SIZE * CHUNK_HEIGHT_SIZE)
    this.setPosition(x, y)
    this.scene.add.rectangle(x, y, TILE_SIZE, TILE_SIZE, 0xff0000).setOrigin(0)
    this.setDepth(1000)
    this.currentTilePosition = { x, y }
    this.centerTilePosition = { x, y }
    this.path = this.makePath()
    this.explorerSize = explorerSize
    this.exploreCallback = exploreCallback
  }

  wait() {
    this.status = 'wait'
  }

  async mine() {
    if (this.status === 'run') {
      //const cursorPos = snapToGrid(this.currentTilePosition.x, this.currentTilePosition.y, 16)
      //console.log(cursorPos)
      const positions = []
      for (let height = 0; height < CHUNK_HEIGHT_SIZE; height++) {
        for (let width = 0; width < CHUNK_WIDTH_SIZE; width++) {
          positions.push({
            x: CHUNK_WIDTH_SIZE * this.currentTilePosition.x + width,
            y: CHUNK_HEIGHT_SIZE * this.currentTilePosition.y + height,
          })
        }
      }
      //console.log(cursorPos)
      //const chunkX = Math.floor(this.navigation.x / (TILE_SIZE * CHUNK_WIDTH_SIZE))
      //const chunkY = Math.floor(this.navigation.y / (TILE_SIZE * CHUNK_HEIGHT_SIZE))
      //
      //const res = await workerStore.getState().worker.HashTwo(data)
      //this.scene.events.emit('sendWorker', [cursorPos])
      await this.exploreCallback(positions)
      //await this.exploreCallback([this.currentTilePosition])
      //this.minedChunk++
      this.move()
      this.mine()
    }
  }

  run() {
    this.status = 'run'
    this.mine()
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
      this.currentTilePosition = this.getNextMove()
      this.setPosition(
        this.currentTilePosition.x * TILE_SIZE * CHUNK_WIDTH_SIZE,
        this.currentTilePosition.y * TILE_SIZE * CHUNK_HEIGHT_SIZE,
      )
      //if (this.debug) {
      //this.scene.add
      //.rectangle(this.currentTilePosition.x, this.currentTilePosition.y, TILE_SIZE, TILE_SIZE, 0xff0000, 0.1)
      //.setOrigin(0)
      //}
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
      x: this.centerTilePosition.x - Math.floor(this.explorerSize / 2),
      y: this.centerTilePosition.y - Math.floor(this.explorerSize / 2),
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
        row.push({ x: this.topLeftTile().x + j, y: this.topLeftTile().y + i })
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
    // console.log(result)
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
