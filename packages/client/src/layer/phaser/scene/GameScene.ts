import { Perlin } from '@latticexyz/noise'
import Phaser, { GameObjects } from 'phaser'
import { Pane } from 'tweakpane'
import { Chunk } from '../utils/Chunk'
import { ChunkLoader } from '../utils/ChunkLoader'
import { CHUNK_HEIGHT_SIZE, CHUNK_WIDTH_SIZE, LOAD_RADIUS, TILE_SIZE } from '../config/chunk'
import { GAME_HEIGHT, GAME_WIDTH } from '../config/game'
import { GAME_SCENE } from '../constant/scene'
import { Tile } from '../utils/Tile'
import { appStore } from '../../../store/app'
import { snapPosToGrid, snapToGrid, snapValToGrid } from '../../../utils/snapToGrid'
import { buildPoseidon } from 'circomlibjs'
import { Hasher } from 'circuits'
import { workerStore } from '../../../store/worker'
import { initConfigAnim } from '../anim'
import { CursorExplorer } from '../gameobject/CursorExplorer'
import { Planet } from '../gameobject/Planet'
import { gameStore, SendResourceData } from '../../../store/game'

type Poseidon = ReturnType<typeof buildPoseidon>

const ZOOM_OUT_LIMIT = 0.5
const ZOOM_IN_LIMIT = 4
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
  paramsDebug: { position: string; chunkCoordinate: string; tileCoordinate: string; cameraSize: string } | null
  keyZ!: Phaser.Input.Keyboard.Key
  keyX!: Phaser.Input.Keyboard.Key
  redRect!: Phaser.GameObjects.Rectangle
  rt!: Phaser.GameObjects.RenderTexture
  ready = false
  spawnPlanetMap = new Map<string, boolean>()
  perlin: Perlin | null = null
  hasher: Hasher
  constructor() {
    super(GAME_SCENE)
    if (import.meta.env.DEV) {
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
  }

  handleWorker = async (data, tList: Tile[]) => {
    const checkVal = BigInt('0x2d2f32534e97d979c3f2b616170489791c3f6706d539c62f89fd52bdb46c1c')
    const worker = workerStore.getState().worker
    if (worker) {
      const res = await worker.HashTwo(data)
      for (let i = 0; i < res.length; i++) {
        const hVal = res[i]
        const tile = tList[i] as Tile
        const check = BigInt(hVal) < checkVal
        const spawnKey = `${tile.x}-${tile.y}`
        const notSpawn = !this.spawnPlanetMap.has(spawnKey)
        if (check && notSpawn) {
          this.spawnPlanetMap.set(spawnKey, true)
          const sprite = new Planet(this, 0, 0, 'dogeSheet')
          console.log('sprite', sprite.displayWidth)
          const pos = snapPosToGrid(tile.tilePosition(), TILE_SIZE, sprite.displayWidth)
          sprite.setPositionWithDebug(pos.x, pos.y, 0x00ff00)
          sprite.setDepth(100)
          sprite.play('doge')
          const imageUri = this.textures.getBase64('dogeSheet', 0)
          sprite.registerOnClick((pointer: Phaser.Input.Pointer) => {
            const payload: SendResourceData = {
              name: 'doge',
              imageSrc: imageUri,
              mouseScreenX: pointer.position.x,
              mouseScreenY: pointer.position.y,
            }
            console.log(payload)
            gameStore.setState({
              sendResourceModal: {
                open: true,
                data: payload,
              },
            })
          })
        }
      }
    }
  }

  handleUIEventPosition = (e: any) => {
    const { x, y } = e.detail
    this.followPoint.x = +x
    this.followPoint.y = +y
  }
  async onCreate() {
    initConfigAnim(this)
    this.redRect = this.add.rectangle(1016, 0, 16, 16, 0xff0000)
    this.redRect.setDepth(100)
    this.redRect.setVisible(false)

    const mockHQ = new Planet(this, 0, 0, 'H1Sheet')
    mockHQ.setPositionWithDebug(
      snapValToGrid(800, TILE_SIZE, mockHQ.displayWidth),
      snapValToGrid(600, TILE_SIZE, mockHQ.displayWidth),
    )
    mockHQ.setDepth(100)
    mockHQ.play('H1Idle')
    mockHQ.registerOnClick((pointer: Phaser.Input.Pointer) => {
      console.log('mockHQ click', pointer.position)
    })

    // document.addEventListener('mousedown', (event: MouseEvent) => {
    //   console.log('native click', event.clientX, event.clientY)
    // })
    const p8 = new Planet(this, 0, 0, 'p8Sheet')
    p8.setPositionWithDebug(
      snapValToGrid(800, TILE_SIZE, p8.displayWidth),
      snapValToGrid(600, TILE_SIZE, p8.displayWidth),
    )
    p8.setDepth(100)
    p8.play('p8Idle')

    const sprite = new Planet(this, 0, 0, 'dogeSheet')
    sprite.setPositionWithDebug(
      snapValToGrid(800, TILE_SIZE, sprite.displayWidth),
      snapValToGrid(451, TILE_SIZE, sprite.displayWidth),
    )
    sprite.setDepth(100)
    sprite.play('doge')

    const sprite2 = new Planet(this, 0, 0, 'p1Sheet')
    sprite2.setPositionWithDebug(
      snapValToGrid(800, TILE_SIZE, sprite2.displayWidth),
      snapValToGrid(500, TILE_SIZE, sprite2.displayWidth),
    )
    sprite2.setDepth(100)
    sprite2.play('p1Idle')

    let startAt = 0
    for (let i = -1; i <= LOAD_RADIUS; i++) {
      for (let j = -1; j <= LOAD_RADIUS; j++) {
        console.log('updateChunksEvent', i, j)
        this.time.addEvent({
          startAt,
          delay: 50,
          callback: () => {
            const targetChunk = this.chunkLoader.updateChunksRePositionWithOffset(
              this.followPoint.x,
              this.followPoint.y,
              i,
              j,
            )
            if (!targetChunk) return
            const sendPos = []
            const tList = []
            targetChunk.tiles.getChildren().forEach((_t) => {
              const t = _t as Tile
              const tileX = t.x
              const tileY = t.y
              sendPos.push({ x: tileX, y: tileY })
              tList.push(t)
              t.alpha = 0.1
            })
            this.events.emit('sendWorker', sendPos, tList)
          },
          loop: true,
        })
        startAt += 50
      }
    }
    this.events.on('sendWorker', this.handleWorker)

    this.events.on(Phaser.GameObjects.Events.DESTROY, this.onDestroy)

    this.rt = this.add.renderTexture(0, 0, GAME_WIDTH, GAME_HEIGHT)
    this.followPoint = new Phaser.Math.Vector2(800, 800)
    const cursorPos = snapToGrid(1000, 590)
    console.log('cursorPos', cursorPos)
    new CursorExplorer(this, cursorPos.x, cursorPos.y, 'explorerSheet')

    this.chunkLoader = new ChunkLoader(this, { tileSize: TILE_SIZE }, this.rt)

    this.chunkLoader.setUpdateCbToChunks((t: Tile) => {
      t.alpha = 0.1
    })
    this.chunkLoader.initChunks(this.followPoint.x, this.followPoint.y)
    this.chunkLoader.addObject(this.redRect)

    const cam = this.cameras.main
    this.input.on('pointermove', (p) => {
      if (!p.isDown) return
      this.followPoint.x -= (p.x - p.prevPosition.x) / cam.zoom
      this.followPoint.y -= (p.y - p.prevPosition.y) / cam.zoom
    })

    this.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {
      // handle zoom in range MAX and MIN zoom value
      const cam = this.cameras.main
      if (deltaY > 0 && cam.zoom < ZOOM_IN_LIMIT) {
        cam.zoom += 0.1
      }
      if (deltaY < 0 && cam.zoom > ZOOM_OUT_LIMIT) {
        cam.zoom -= 0.1
      }
    })

    window.addEventListener('position', this.handleUIEventPosition)
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W, false)
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S, false)
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A, false)
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D, false)
    this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z, false)
    this.keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X, false)
    this.navigation = this.add.rectangle(this.followPoint.y, this.followPoint.x, 1, 1, 0x00ff00)

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
    this.updateDebug()

    this.handleKeyboardUpdate()
    this.navigation.setPosition(this.followPoint.x, this.followPoint.y)
  }

  updateDebug() {
    if (this.pane) {
      this.paramsDebug.position = `${this.navigation.x}, ${this.navigation.y}`
      const chunkX = Math.floor(this.navigation.x / (TILE_SIZE * CHUNK_WIDTH_SIZE))
      const chunkY = Math.floor(this.navigation.y / (TILE_SIZE * CHUNK_HEIGHT_SIZE))
      this.paramsDebug.chunkCoordinate = `${chunkX}, ${chunkY}`
      const tileX = Math.floor(this.navigation.x / TILE_SIZE)
      const tileY = Math.floor(this.navigation.y / TILE_SIZE)

      this.paramsDebug.tileCoordinate = `${tileX}, ${tileY}`
      this.paramsDebug.cameraSize = `${this.cameras.main.worldView.width} ${this.cameras.main.worldView.height}`
    }
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
      if (this.cameras.main.zoom <= ZOOM_OUT_LIMIT) return
      camera.setZoom(this.cameras.main.zoom - 0.1)
    }
    if (this.keyX.isDown) {
      const camera = this.cameras.main
      if (this.cameras.main.zoom >= ZOOM_IN_LIMIT) return
      camera.setZoom(this.cameras.main.zoom + 0.1)
    }
  }

  getCenter() {
    return new Phaser.Math.Vector2(GAME_WIDTH / 2, GAME_HEIGHT / 2)
  }

  onDestroy = () => {
    this.time.removeAllEvents()
    window.removeEventListener('position', this.handleUIEventPosition)
    /**
     * TODO: clean up for event listeners in this scene
     */
  }
}
export default GameScene
