import Phaser from 'phaser'
import { CHUNK_HEIGHT_SIZE, CHUNK_WIDTH_SIZE, TILE_SIZE } from '../config/chunk'
import { Tile } from './Tile'

export class Chunk extends Phaser.GameObjects.Container {
  scene: Phaser.Scene
  tiles: Phaser.GameObjects.Group
  isLoaded: boolean
  tileSize: number
  graphics: Phaser.GameObjects.Graphics
  groupObjects: Phaser.GameObjects.Group
  removeFlag = false
  chunkX = 0
  chunkY = 0
  id = -1
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateCb = (t: Tile) => {}

  constructor(scene: Phaser.Scene, chunkX: number, chunkY: number, id: number) {
    super(scene, chunkX, chunkY)
    this.scene = scene
    this.id = id
    this.scene.add.existing(this)
    this.chunkX = chunkX
    this.chunkX = chunkY
    this.tiles = this.scene.add.group()
    this.groupObjects = this.scene.add.group()
    this.isLoaded = false
    this.tileSize = TILE_SIZE
    this.graphics = this.scene.add.graphics()
  }

  registerUpdateCb(cb: (t: Tile) => void) {
    this.updateCb = cb
  }

  loadTile() {
    for (let row = 0; row < CHUNK_WIDTH_SIZE; row++) {
      for (let col = 0; col < CHUNK_HEIGHT_SIZE; col++) {
        const tileX = this.chunkX * (CHUNK_WIDTH_SIZE * this.tileSize) + row * this.tileSize
        const tileY = this.chunkY * (CHUNK_HEIGHT_SIZE * this.tileSize) + col * this.tileSize
        const t = new Tile(this.scene, tileX, tileY, 'tile')
        this.tiles.add(t)
      }
    }
  }

  addObjects(g: Phaser.GameObjects.GameObject) {
    this.groupObjects.add(g)
  }

  load() {
    if (!this.isLoaded) {
      this.loadTile()
      this.killAll()
      this.drawBounceRect()
      this.isLoaded = true
    }
  }

  isAlive() {
    return this.active && this.visible
  }

  drawBounceRect() {
    this.graphics.clear()
    this.graphics.strokeRect(
      this.chunkX * (CHUNK_WIDTH_SIZE * this.tileSize),
      this.chunkY * (CHUNK_HEIGHT_SIZE * this.tileSize),
      TILE_SIZE * CHUNK_WIDTH_SIZE,
      TILE_SIZE * CHUNK_HEIGHT_SIZE,
    )
    this.graphics.setDepth(101)
  }

  killAll() {
    this.tiles.getChildren().forEach((t) => {
      this.tiles.killAndHide(t)
    })
  }

  forceUpdateCb() {
    this.tiles.getChildren().forEach((t) => {
      this.updateCb(t as Tile)
    })
  }

  update(x: number, y: number) {
    this.chunkX = x
    this.chunkY = y
    this.killAll()
    for (let row = 0; row < CHUNK_WIDTH_SIZE; row++) {
      for (let col = 0; col < CHUNK_HEIGHT_SIZE; col++) {
        const tileX = this.chunkX * (CHUNK_WIDTH_SIZE * this.tileSize) + row * this.tileSize
        const tileY = this.chunkY * (CHUNK_HEIGHT_SIZE * this.tileSize) + col * this.tileSize
        const t = this.tiles.getFirstDead()
        if (t) {
          t.setActive(true)
          t.setVisible(true)
          t.setPosition(tileX, tileY)
          this.updateCb(t)
        }
      }
    }
    this.drawBounceRect()
  }
}
