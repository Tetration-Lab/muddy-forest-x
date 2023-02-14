import { Perlin } from '@latticexyz/noise'
import Phaser from 'phaser'
import { Pane } from 'tweakpane'
import { Chunk } from '../utils/Chunk'
import { ChunkLoader } from '../utils/ChunkLoader'
import { CHUNK_HEIGHT_SIZE, CHUNK_WIDTH_SIZE, LOAD_RADIUS, TILE_SIZE } from '../config/chunk'
import { GAME_HEIGHT, GAME_WIDTH } from '../config/game'
import { GAME_SCENE } from '../constant/scene'
import { Tile } from '../utils/Tile'
import GameUIScene from './GameUIScene'
import { appStore } from '../../../store/app'
import { Container } from 'windicss/types/utils/style'
import { snapToGrid } from '../../../util/snapToGrid'
import { buildPoseidon } from 'circomlibjs'
import { Hasher } from 'circuits'
import { Remote } from 'comlink'
import { workerStore } from '../../../store/worker'

type Worker = Remote<typeof import('../../../miner/hasher')>
type Poseidon = ReturnType<typeof buildPoseidon>
class GameScene extends Phaser.Scene {
  bg!: Phaser.GameObjects.TileSprite
  logo!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
  chunkSize!: number
  tileSize!: number
  chunks!: Chunk[]
  followPoint!: Phaser.Math.Vector2
  keyS!: Phaser.Input.Keyboard.Key
  keyA!: Phaser.Input.Keyboard.Key
  keyD!: Phaser.Input.Keyboard.Key
  keyW!: Phaser.Input.Keyboard.Key
  cameraSpeed = 10
  navigation!: Phaser.GameObjects.Rectangle
  rectBound!: Phaser.GameObjects.Rectangle
  graphicsGp!: Phaser.GameObjects.Graphics
  chunkLoader!: ChunkLoader
  pane: Pane
  paramsDebug: { position: string; chunkCoordinate: string; tileCoordinate: string; cameraSize: string }
  keyZ!: Phaser.Input.Keyboard.Key
  keyX!: Phaser.Input.Keyboard.Key
  redRect!: Phaser.GameObjects.Rectangle
  rt!: Phaser.GameObjects.RenderTexture
  ready = false
  perlin: Perlin | null = null
  poseidon: Poseidon
  hasher: Hasher
  constructor() {
    super(GAME_SCENE)
    document.getElementById('debug-pane').innerHTML = ''
    this.pane = new Pane({ container: document.getElementById('debug-pane') })
    this.paramsDebug = {
      position: '0, 0',
      chunkCoordinate: '0, 0',
      tileCoordinate: '0, 0',
      cameraSize: '',
    }
    this.pane.addMonitor(this.paramsDebug, 'position')
    this.pane.addMonitor(this.paramsDebug, 'chunkCoordinate')
    this.pane.addMonitor(this.paramsDebug, 'tileCoordinate')
    this.pane.addMonitor(this.paramsDebug, 'cameraSize')
  }

  preload() {
    this.load.spritesheet('dogeSheet', 'assets/sprite/doge-hv.png', { frameWidth: 480, frameHeight: 480 })
    this.load.spritesheet('p1Sheet', 'assets/sprite/P1_24px.png', { frameWidth: 24, frameHeight: 24 })
    this.load.spritesheet('p2Sheet', 'assets/sprite/P2_48px.png', { frameWidth: 48, frameHeight: 48 })
    this.load.spritesheet('p3Sheet', 'assets/sprite/P3_48px.png', { frameWidth: 48, frameHeight: 48 })
    this.load.image('tile', 'assets/tile.png')
  }

  handleUIEventPosition = (e: any) => {
    const { x, y } = e.detail
    this.followPoint.x = +x
    this.followPoint.y = +y
  }
  async onCreate() {
    const idle = {
      key: 'doge',
      frames: this.anims.generateFrameNumbers('dogeSheet', { start: 0, end: 74 }),
      frameRate: 30,
      repeat: -1,
    }
    const p1Idle = {
      key: 'p1Idle',
      frames: this.anims.generateFrameNumbers('p1Sheet', { start: 0, end: 74 }),
      frameRate: 30,
      repeat: -1,
    }
    const p2Idle = {
      key: 'p2Idle',
      frames: this.anims.generateFrameNumbers('p2Sheet', { start: 0, end: 74 }),
      frameRate: 30,
      repeat: -1,
    }
    this.anims.create(idle)
    this.anims.create(p1Idle)
    this.anims.create(p2Idle)
    console.log('game scene create')
    this.redRect = this.add.rectangle(1016, 0, 16, 16, 0xff0000)
    this.redRect.setDepth(100)
    this.redRect.setVisible(false)
    const sprite = this.add.sprite(800, 451, 'dogeSheet')
    sprite.setDepth(100)
    sprite.play('doge')
    sprite.setScale(0.5)
    const sprite2 = this.add.sprite(800, 500, 'p1Sheet')
    sprite2.setScale(2)
    sprite2.setDepth(100)
    sprite2.play('p1Idle')
    const circle = this.add.circle(sprite2.x, sprite2.y, sprite2.width / 2 - 4, 0x00ff00, 0.8)
    circle.setDepth(99)
    const sprite3 = this.add.sprite(800, 600, 'p2Sheet')
    sprite3.setDepth(100)
    sprite3.play('p2Idle')
    window.addEventListener('position', this.handleUIEventPosition)
    let startAt = 0
    for (let i = -1; i <= LOAD_RADIUS; i++) {
      for (let j = -1; j <= LOAD_RADIUS; j++) {
        console.log('updateChunksEvent', i, j)
        this.time.addEvent({
          startAt,
          delay: 50,
          callback: () => {
            this.chunkLoader.updateChunksRePositionWithOffset(this.followPoint.x, this.followPoint.y, i, j)
          },
          loop: true,
        })
        startAt += 50
      }
    }
    this.events.on('hello', async (data) => {
      console.log('hello', data)
      const worker = workerStore.getState().worker
      if (worker) {
        const res = await worker.HashTwo(data)
        for (let i = 0; i < res.length; i++) {
          console.log('res', res[i], data[i].x, data[i].y)
          const hVal = res[i]
          const val = '0x2d2f32534e97d979c3f2b616170489791c3f6706d539c62f89fd52bdb46c1cd7'
          const check = BigInt(hVal) < BigInt(val)
          console.log(BigInt(hVal) - BigInt(val))
          if (!check) {
            const pos = {
              x: +data[i].x,
              y: +data[i].y,
            }
            this.add.circle(pos.x, pos.y, 2, 0x00ff00, 0.8)
          }
        }
      }
      // console.log('hi', worker)
      // const hash = worker.CreateHasher()
      // console.log('hash', hash)
      // .then((hasher) => hasher)
      // .then((hasher) => {
      //   console.log(hasher, 'h')
      //   const res = hasher.hash_two('0x1', '0x2')
      //   console.log('res', res)
      // })
      // .catch((e) => {
      //   console.log('error', e)
      // })
    })

    this.events.on(Phaser.GameObjects.Events.DESTROY, this.onDestroy)

    this.rt = this.add.renderTexture(0, 0, GAME_WIDTH, GAME_HEIGHT)
    this.followPoint = new Phaser.Math.Vector2(
      this.cameras.main.worldView.x + this.cameras.main.worldView.width * 0.5,
      this.cameras.main.worldView.y + this.cameras.main.worldView.height * 0.5,
    )

    this.chunkLoader = new ChunkLoader(this, { tileSize: TILE_SIZE }, this.rt)
    let sendPos = []
    const tList = []
    this.chunkLoader.setUpdateCbToChunks((t: Tile) => {
      const SCALE = 100
      const PRECISION = 10
      // if (this.hasher) {

      const pos = t.centerPosition()
      const tileX = t.x
      const tileY = t.y
      sendPos.push({ x: `${tileX}`, y: String(tileY) })
      tList.push(t)
      if (sendPos.length >= 200) {
        console.log('send')
        this.events.emit('hello', sendPos, tList)
        sendPos = []
      }

      // const h = this.hasher.hash_two(`${tileX}`, `${tileY}`)
      // console.log('h-start')

      // worker.HashTwo(`${tileX}`, `${tileY}`).
      // console.log(h, 'h')

      // const h = this.poseidon([tileX, tileY])
      // const hVal = `0x${this.poseidon.F.toString(h, 16)}`
      // const val = '0x2d2f32534e97d979c3f2b616170489791c3f6706d539c62f89fd52bdb46c1cd7'
      // const check = BigInt(hVal) < BigInt(val)
      // console.log(BigInt(hVal) - BigInt(val))
      // if (!check) {
      //   this.add.circle(pos.x, pos.y, 2, 0x00ff00, 0.8)
      // }
      // }
      if (!this.perlin) return
      t.alpha = Math.floor(this.perlin(t.x, t.y, 0, SCALE) * 2 ** PRECISION) / 2 ** PRECISION
    })

    this.poseidon = await buildPoseidon()
    this.chunkLoader.initChunks(this.followPoint.x, this.followPoint.y)
    this.chunkLoader.addObject(this.redRect)

    const cam = this.cameras.main
    this.input.on('pointermove', (p) => {
      if (!p.isDown) return
      console.log('pointermove', p.x, p.y, p.prevPosition.x, p.prevPosition.y, cam.zoom)
      this.followPoint.x -= (p.x - p.prevPosition.x) / cam.zoom
      this.followPoint.y -= (p.y - p.prevPosition.y) / cam.zoom
    })

    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W, false)
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S, false)
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A, false)
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D, false)
    this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z, false)
    this.keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X, false)
    this.navigation = this.add.rectangle(this.followPoint.y, this.followPoint.x, 16, 16, 0x00ff00)

    this.navigation.setDepth(10)
    this.cameras.main.startFollow(this.navigation)

    this.input.on('pointerdown', (pointer: any) => {
      console.log(pointer.worldX, this.cameras.main.worldView.width)
    })

    this.ready = true
  }
  create() {
    this.onCreate()
  }

  update(time: number, delta: number): void {
    if (!this.ready) {
      return
    }
    const cursor = this.input.activePointer
    const gridPos = snapToGrid(cursor.x, cursor.y, 16)
    this.chunkLoader.updateChunks(this.followPoint.x, this.followPoint.y)
    this.paramsDebug.position = `${this.navigation.x}, ${this.navigation.y}`
    const chunkX = Math.floor(this.navigation.x / (TILE_SIZE * CHUNK_WIDTH_SIZE))
    const chunkY = Math.floor(this.navigation.y / (TILE_SIZE * CHUNK_HEIGHT_SIZE))
    this.paramsDebug.chunkCoordinate = `${chunkX}, ${chunkY}`
    const tileX = Math.floor(this.navigation.x / TILE_SIZE)
    const tileY = Math.floor(this.navigation.y / TILE_SIZE)

    this.paramsDebug.tileCoordinate = `${tileX}, ${tileY}`
    this.paramsDebug.cameraSize = `${this.cameras.main.worldView.width} ${this.cameras.main.worldView.height}`

    this.handleKeyboardUpdate()
    this.navigation.setPosition(this.followPoint.x, this.followPoint.y)
  }

  handleKeyboardUpdate() {
    const focusUI = appStore.getState().isFocusUI
    if (focusUI) {
      return
    }

    if (this.keyW.isDown) {
      this.followPoint.y -= this.cameraSpeed
    }
    if (this.keyS.isDown) {
      this.followPoint.y += this.cameraSpeed
    }
    if (this.keyA.isDown) {
      this.followPoint.x -= this.cameraSpeed
    }
    if (this.keyD.isDown) {
      this.followPoint.x += this.cameraSpeed
    }
    if (this.keyZ.isDown) {
      const camera = this.cameras.main
      if (this.cameras.main.zoom <= 0.1) return
      camera.setZoom(this.cameras.main.zoom - 0.1)
    }
    if (this.keyX.isDown) {
      const camera = this.cameras.main
      camera.setZoom(this.cameras.main.zoom + 0.1)
    }
  }

  getCenter() {
    return new Phaser.Math.Vector2(GAME_WIDTH / 2, GAME_HEIGHT / 2)
  }

  onDestroy = () => {
    this.time.removeAllEvents()
    /**
     * TODO: clean up for event listeners in this scene
     */
  }
}
export default GameScene
