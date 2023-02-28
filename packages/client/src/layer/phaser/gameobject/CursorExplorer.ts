import { MiningPattern, SpiralPattern } from '../../../miner/MiningPatterns'
import { Position } from '../../../utils/snapToGrid'
import { CHUNK_HEIGHT_SIZE, CHUNK_WIDTH_SIZE, TILE_SIZE } from '../config/chunk'

export class CursorExplorer extends Phaser.GameObjects.Sprite {
  currentChunk: Position
  status: string
  exploreCallback: (c: Position) => Promise<void>
  miner = 4
  miningPattern: MiningPattern
  spawnPlanetMap = new Map<string, boolean>()
  constructor(
    scene: Phaser.Scene,
    position: Position,
    texture: string,
    exploreCallback: (c: Position) => Promise<void>,
  ) {
    super(scene, position.x, position.y, texture)
    this.scene.add.existing(this)
    this.setOrigin(0)
    this.setDisplaySize(TILE_SIZE * CHUNK_WIDTH_SIZE, TILE_SIZE * CHUNK_HEIGHT_SIZE)
    this.setPosition(position.x, position.y)
    this.scene.add.rectangle(position.x, position.y, TILE_SIZE, TILE_SIZE, 0xff0000).setOrigin(0)
    this.setDepth(1000)
    this.currentChunk = { x: position.x / TILE_SIZE / CHUNK_WIDTH_SIZE, y: position.x / TILE_SIZE / CHUNK_HEIGHT_SIZE }
    this.exploreCallback = exploreCallback
    this.miningPattern = new SpiralPattern(this.currentChunk)
  }

  wait() {
    this.status = 'wait'
  }

  async mine() {
    const position = this.currentChunk
    const key = `${this.currentChunk.x}-${this.currentChunk.y}`

    this.move()

    if (this.status === 'run') {
      if (!this.spawnPlanetMap.has(key)) {
        await this.exploreCallback(position)
        this.spawnPlanetMap.set(key, true)
        this.mine()
      } else {
        this.mine()
      }
    }
  }

  run() {
    this.status = 'run'
    for (let i = 0; i < this.miner; i++) {
      this.mine()
    }
  }

  move() {
    if (this.status === 'wait') {
      return
    }
    this.currentChunk = this.miningPattern.nextChunk(this.currentChunk)
    this.setPosition(
      this.currentChunk.x * TILE_SIZE * CHUNK_WIDTH_SIZE,
      this.currentChunk.y * TILE_SIZE * CHUNK_HEIGHT_SIZE,
    )
  }
}
