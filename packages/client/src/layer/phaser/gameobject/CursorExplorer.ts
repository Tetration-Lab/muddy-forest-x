import _ from 'lodash'
import { HashTwoRespItem } from '../../../miner/hasher.worker'
import { MiningPattern, SpiralPattern } from '../../../miner/MiningPatterns'
import { minerStore } from '../../../store/miner'
import { workerStore } from '../../../store/worker'
import { Position } from '../../../utils/snapToGrid'
import { wait } from '../../../utils/utils'
import { CHUNK_HEIGHT_SIZE, CHUNK_WIDTH_SIZE, TILE_SIZE } from '../config/chunk'

export class CursorExplorer extends Phaser.GameObjects.Sprite {
  currentChunk: Position
  status: string
  exploreCallback: (res: HashTwoRespItem[]) => Promise<void>
  miner = 10
  isMining = []
  miningPattern: MiningPattern
  spawnPlanetMap = new Map<string, boolean>()
  constructor(
    scene: Phaser.Scene,
    position: Position,
    texture: string,
    exploreCallback: (res: HashTwoRespItem[]) => Promise<void>,
  ) {
    super(scene, position.x, position.y, texture)
    this.scene.add.existing(this)
    this.setOrigin(0)
    this.setDisplaySize(TILE_SIZE * CHUNK_WIDTH_SIZE, TILE_SIZE * CHUNK_HEIGHT_SIZE)
    this.setPosition(position.x, position.y)
    this.scene.add.rectangle(position.x, position.y, TILE_SIZE, TILE_SIZE, 0xff0000).setOrigin(0)
    this.setDepth(1000)
    this.currentChunk = {
      x: Math.floor(position.x / TILE_SIZE / CHUNK_WIDTH_SIZE),
      y: Math.floor(position.x / TILE_SIZE / CHUNK_HEIGHT_SIZE),
    }
    this.exploreCallback = exploreCallback
    this.miningPattern = new SpiralPattern(this.currentChunk)
    minerStore.setState({ miner: this })
  }

  async setMiner(miner: number) {
    this.status = 'wait'
    while (this.isMining.every((e) => !e)) {
      console.log(this.isMining)
      await wait(100)
    }
    this.run()
  }

  wait() {
    this.status = 'wait'
  }

  async mine(i: number) {
    const position = this.currentChunk
    const key = `${this.currentChunk.x}-${this.currentChunk.y}`

    this.move()

    if (this.status === 'run') {
      this.isMining[i] = true
      if (!this.spawnPlanetMap.has(key)) {
        const res = await workerStore
          .getState()
          .worker.HashChunk(CHUNK_WIDTH_SIZE, CHUNK_HEIGHT_SIZE, position.x, position.y)
        await this.exploreCallback(res)
        this.spawnPlanetMap.set(key, true)
        this.mine(i)
      } else {
        this.mine(i)
      }
    } else {
      this.isMining[i] = false
    }
  }

  run() {
    this.status = 'run'
    this.isMining = Array(this.miner)
    for (let i = 0; i < this.miner; i++) {
      this.mine(i)
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
