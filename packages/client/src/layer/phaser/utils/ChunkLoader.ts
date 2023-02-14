import { Chunk } from './Chunk'
import { CHUNK_HEIGHT_SIZE, CHUNK_WIDTH_SIZE, LOAD_RADIUS, TILE_SIZE } from '../config/chunk'
import { Tile } from './Tile'
export interface ChunkLoaderConfig {
  tileSize: number
}
export class ChunkLoader {
  trackObjects!: Phaser.GameObjects.Group
  scene: Phaser.Scene
  chunks: Chunk[]
  rt: Phaser.GameObjects.RenderTexture
  chunkGroup: Phaser.GameObjects.Group
  alivePosition: Map<string, boolean> = new Map()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateCb = (t: Tile) => {}
  constructor(scene: Phaser.Scene, config: ChunkLoaderConfig, rt: Phaser.GameObjects.RenderTexture) {
    this.scene = scene
    this.chunks = []
    this.trackObjects = this.scene.add.group()
    this.chunkGroup = this.scene.add.group()
    this.rt = rt
  }

  addObject(trackObject: Phaser.GameObjects.Rectangle) {
    this.trackObjects.add(trackObject)
  }

  setUpdateCbToChunks(cb: (t: Tile) => void | Promise<void>) {
    this.updateCb = cb
  }

  getChunk(x: number, y: number) {
    let chunk
    for (let i = 0; i < this.chunks.length; i++) {
      if (this.chunks[i].x === x && this.chunks[i].y === y) {
        chunk = this.chunks[i]
      }
    }
    return chunk
  }

  chunkCount() {
    return this.chunks.length
  }

  initChunks(x: number, y: number) {
    let id = 0
    const chunkX = Math.floor(x / (CHUNK_WIDTH_SIZE * TILE_SIZE))
    const chunkY = Math.floor(y / (CHUNK_HEIGHT_SIZE * TILE_SIZE))
    for (let i = chunkX - LOAD_RADIUS; i <= chunkX + LOAD_RADIUS; i++) {
      for (let j = chunkY - LOAD_RADIUS; j <= chunkY + LOAD_RADIUS; j++) {
        const chunk = new Chunk(this.scene, i, j, id++)
        chunk.registerUpdateCb(this.updateCb)
        chunk.load()
        chunk.update(i, j)
        this.chunks.push(chunk)
        this.chunkGroup.add(chunk)
        this.alivePosition.set(this.makeChunkPositionKey(i, j), true)
      }
    }
  }

  updateChunksRePosition(x: number, y: number) {
    const chunkX = Math.floor(x / (CHUNK_WIDTH_SIZE * TILE_SIZE))
    const chunkY = Math.floor(y / (CHUNK_HEIGHT_SIZE * TILE_SIZE))
    for (let i = chunkX - LOAD_RADIUS; i <= chunkX + LOAD_RADIUS; i++) {
      for (let j = chunkY - LOAD_RADIUS; j <= chunkY + LOAD_RADIUS; j++) {
        const c = this.chunkGroup.getFirstDead() as Chunk

        if (c && !this.alivePosition.has(`${i},${j}`)) {
          c.setActive(true)
          c.setVisible(true)
          this.alivePosition.set(`${i},${j}`, true)
          c.update(i, j)
        }
      }
    }
  }

  updateChunksRePositionWithOffset(x: number, y: number, offsetChunkX: number, offsetChunkY: number) {
    const chunkX = Math.floor(x / (CHUNK_WIDTH_SIZE * TILE_SIZE))
    const chunkY = Math.floor(y / (CHUNK_HEIGHT_SIZE * TILE_SIZE))
    const i = chunkX - offsetChunkX
    const j = chunkY - offsetChunkY
    const c = this.chunkGroup.getFirstDead() as Chunk

    if (c && !this.alivePosition.has(this.makeChunkPositionKey(i, j))) {
      c.setActive(true)
      c.setVisible(true)
      this.alivePosition.set(this.makeChunkPositionKey(i, j), true)
      c.update(i, j)
    }
  }

  makeChunkPositionKey(x: number, y: number) {
    return `${+x},${+y}`
  }

  updateChunks(x: number, y: number) {
    const chunkX = Math.floor(x / (CHUNK_WIDTH_SIZE * TILE_SIZE))
    const chunkY = Math.floor(y / (CHUNK_HEIGHT_SIZE * TILE_SIZE))

    for (let i = 0; i < this.chunks.length; i++) {
      const c = this.chunks[i]
      if (Math.abs(c.chunkX - chunkX) > LOAD_RADIUS || Math.abs(c.chunkY - chunkY) > LOAD_RADIUS) {
        if (c.isAlive()) {
          this.chunkGroup.killAndHide(c)
          this.alivePosition.delete(this.makeChunkPositionKey(c.chunkX, c.chunkY))
        }
      }
    }

    for (const _obj of this.trackObjects.getChildren()) {
      const obj = _obj as Phaser.GameObjects.Rectangle
      const chunkX = Math.floor(obj.x / (CHUNK_WIDTH_SIZE * TILE_SIZE))
      const chunkY = Math.floor(obj.y / (CHUNK_HEIGHT_SIZE * TILE_SIZE))
      if (this.getChunk(chunkX, chunkY)) {
        obj.setVisible(true)
        obj.setActive(true)
      } else {
        obj.setVisible(false)
        obj.setActive(false)
      }
    }
  }
}
