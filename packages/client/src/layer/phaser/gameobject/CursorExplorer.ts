import { releaseProxy } from 'comlink'
import _ from 'lodash'
import { HashTwoRespItem } from '../../../miner/hasher.worker'
import { MiningPattern, SpiralPattern } from '../../../miner/MiningPatterns'
import { minerStore } from '../../../store/miner'
import { HashWorker, workerStore } from '../../../store/worker'
import { Position } from '../../../utils/snapToGrid'
import { wait } from '../../../utils/utils'
import { CHUNK_HEIGHT_SIZE, CHUNK_WIDTH_SIZE, TILE_SIZE } from '../config/chunk'

export class CursorExplorer extends Phaser.GameObjects.Sprite {
  currentChunk: Position
  isExploring = false
  exploreCallback: (res: HashTwoRespItem[]) => Promise<void>
  miners: HashWorker[] = []
  isMining = false
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
      y: Math.floor(position.y / TILE_SIZE / CHUNK_HEIGHT_SIZE),
    }
    this.exploreCallback = exploreCallback
    this.miningPattern = new SpiralPattern(this.currentChunk)
    minerStore.setState({ miner: this })
    this.miners = [workerStore.getState().createWorker()]
  }

  async setMiner(miner: number) {
    const prevStatus = this.isExploring
    this.isExploring = false
    while (this.isMining) {
      await wait(50)
    }
    this.miners.forEach((e) => e[releaseProxy]())
    this.miners = []
    for (let i = 0; i < miner; i++) {
      this.miners.push(workerStore.getState().createWorker())
    }
    if (prevStatus) {
      this.run()
    }
  }

  toggle() {
    this.isExploring = !this.isExploring
    if (this.isExploring) {
      this.run()
    }
  }

  wait() {
    this.isExploring = false
  }

  async mine() {
    if (this.isExploring) {
      this.isMining = true
      const pos: Position[] = []
      while (pos.length != this.miners.length) {
        const position = this.currentChunk
        const key = `${this.currentChunk.x}-${this.currentChunk.y}`

        this.move()

        if (!this.spawnPlanetMap.has(key)) {
          pos.push(position)
          this.spawnPlanetMap.set(key, true)
        }
      }
      const res = await Promise.all(
        pos.map((p, i) => this.miners[i].HashChunk(CHUNK_WIDTH_SIZE, CHUNK_HEIGHT_SIZE, p.x, p.y)),
      )
      await this.exploreCallback(_.flatten(res))
      this.mine()
    } else {
      this.isMining = false
    }
  }

  run() {
    this.isExploring = true
    this.mine()
  }

  move() {
    if (!this.isExploring) {
      return
    }
    this.currentChunk = this.miningPattern.nextChunk(this.currentChunk)
    this.setPosition(
      this.currentChunk.x * TILE_SIZE * CHUNK_WIDTH_SIZE,
      this.currentChunk.y * TILE_SIZE * CHUNK_HEIGHT_SIZE,
    )
  }
}
