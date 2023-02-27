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
import { Position, snapPosToGrid, snapToGrid, snapValToGrid } from '../../../utils/snapToGrid'
import { Hasher } from 'circuits'
import { workerStore } from '../../../store/worker'
import { initConfigAnim } from '../anim'
import { CursorExplorer } from '../gameobject/CursorExplorer'
import { Planet } from '../gameobject/Planet'
import { gameStore, SendResourceData } from '../../../store/game'
import { createSpawnCapitalSystem } from '../../../system/createSpawnCapitalSystem'
import { NetworkLayer } from '../../network/types'
import { IDLE_ANIM, SPRITE } from '../constant/resouce'

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
  cursorExplorer!: CursorExplorer
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

  handleWorker = async (data: Position[]) => {
    data = data.filter((d) => {
      const key = `${d.x}-${d.y}`
      return !this.spawnPlanetMap.has(key)
    })
    const checkVal = BigInt('0x2d2f32534e97d979c3f2b616170489791c3f6706d539c62f89fd52bdb46c1c')
    const worker = workerStore.getState().worker
    if (worker) {
      const res = await worker.HashTwo(data)
      for (let i = 0; i < res.length; i++) {
        const hVal = res[i].val
        const tileX = res[i].x
        const tileY = res[i].y
        //console.log(tileX, tileY, hVal)
        const check = BigInt(hVal) < checkVal
        const spawnKey = `${tileX}-${tileY}`
        const notSpawn = !this.spawnPlanetMap.has(spawnKey)
        if (check && notSpawn) {
          //console.log('spawn!', tileX, tileY)
          this.spawnPlanetMap.set(spawnKey, true)
          const sprite = new Planet(this, 0, 0, 'dogeSheet')
          const pos = snapPosToGrid(
            {
              x: tileX * TILE_SIZE,
              y: tileY * TILE_SIZE,
            },
            TILE_SIZE,
            sprite.displayWidth,
          )
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
            gameStore.setState({
              sendResourceModal: {
                open: true,
                data: payload,
              },
            })
          })
        }
      }
      //this.cursorExplorer.run()
    }
  }

  handleUIEventPosition = (e: any) => {
    const { x, y } = e.detail
    this.followPoint.x = +x
    this.followPoint.y = +y
  }

  onSetUpSystem(networkLayer: NetworkLayer) {
    createSpawnCapitalSystem(networkLayer, (x: number, y: number, entityID: number, fractionID: number) => {
      //
      console.log(entityID, fractionID, 'fractionID')
      let spriteKey = SPRITE.Capital_1
      let idleKey = IDLE_ANIM.Capital_1
      switch (fractionID) {
        case 10:
          spriteKey = SPRITE.Capital_1
          idleKey = IDLE_ANIM.Capital_1
          break
        case 11:
          spriteKey = SPRITE.Capital_2
          idleKey = IDLE_ANIM.Capital_2
          break
        case 12:
          spriteKey = SPRITE.Capital_3
          idleKey = IDLE_ANIM.Capital_3
          break
      }
      const p = new Planet(this, x, y, spriteKey)
      p.play(idleKey)
    })
  }

  async onCreate() {
    initConfigAnim(this)

    const { networkLayer } = appStore.getState()
    if (networkLayer) {
      this.onSetUpSystem(networkLayer)
    }
    this.redRect = this.add.rectangle(1016, 0, 16, 16, 0xff0000)
    this.redRect.setDepth(100)
    this.redRect.setVisible(false)

    const mockHQ = new Planet(this, 0, 0, SPRITE.Capital_1)
    mockHQ.setPositionWithDebug(
      snapValToGrid(800, TILE_SIZE, mockHQ.displayWidth),
      snapValToGrid(600, TILE_SIZE, mockHQ.displayWidth),
    )
    mockHQ.setDepth(100)
    mockHQ.play(IDLE_ANIM.Capital_1)
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

    //let startAt = 0
    //for (let i = -1; i <= LOAD_RADIUS; i++) {
    //for (let j = -1; j <= LOAD_RADIUS; j++) {
    //this.time.addEvent({
    //startAt,
    //delay: 50,
    //callback: () => {
    //const targetChunk = this.chunkLoader.updateChunksRePositionWithOffset(
    //this.followPoint.x,
    //this.followPoint.y,
    //i,
    //j,
    //)
    //if (!targetChunk) return
    //// const sendPos = []
    //// const tList = []
    //// targetChunk.tiles.getChildren().forEach((_t) => {
    ////   const t = _t as Tile
    ////   const tileX = t.x
    ////   const tileY = t.y
    ////   sendPos.push({ x: tileX, y: tileY })
    ////   tList.push(t)
    ////   t.alpha = 0.1
    //// })
    //// this.events.emit('sendWorker', sendPos)
    //},
    //loop: true,
    //})
    //startAt += 50
    //}
    //}
    this.events.on('sendWorker', this.handleWorker)

    this.events.on(Phaser.GameObjects.Events.DESTROY, this.onDestroy)

    this.rt = this.add.renderTexture(0, 0, GAME_WIDTH, GAME_HEIGHT)
    this.followPoint = new Phaser.Math.Vector2(mockHQ.x, mockHQ.y)
    const cursorPos = snapToGrid(this.followPoint.x, this.followPoint.y)
    this.cursorExplorer = new CursorExplorer(this, 0, 0, 'explorerSheet', 3, this.handleWorker)
    this.cursorExplorer.run()
    this.cursorExplorer.setDebug(false)
    this.cursorExplorer.play(IDLE_ANIM.Explorer_Idle)

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
    const keyG = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G, false)
    keyG.on('down', () => {
      this.cursorExplorer.move()
    })
    const keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H, false)
    keyH.on('down', () => {
      this.cursorExplorer.updateExplorerSize()
    })

    const keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J, false)
    keyJ.on('down', () => {
      this.cursorExplorer.toggleisStop()
    })

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
    //this.cursorExplorer.move()
    //const cursorPos = snapToGrid(
    //this.cursorExplorer.currentTilePosition.x,
    //this.cursorExplorer.currentTilePosition.y,
    //16,
    //)
    //this.events.emit('sendWorker', [cursorPos])
    //this.cursorExplorer.wait()
    //const cursor = this.input.activePointer
    //const gridPos = snapToGrid(cursor.x, cursor.y, 16)
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
