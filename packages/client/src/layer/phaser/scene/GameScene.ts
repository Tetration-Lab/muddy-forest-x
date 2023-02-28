import { Perlin } from '@latticexyz/noise'
import Phaser from 'phaser'
import { Pane } from 'tweakpane'
import { Chunk } from '../utils/Chunk'
import { ChunkLoader } from '../utils/ChunkLoader'
import { CHUNK_HEIGHT_SIZE, CHUNK_WIDTH_SIZE, TILE_SIZE } from '../config/chunk'
import { GAME_HEIGHT, GAME_WIDTH } from '../config/game'
import { GAME_SCENE } from '../constant/scene'
import { Tile } from '../utils/Tile'
import { appStore } from '../../../store/app'
import { Position, snapPosToGrid, snapValToGrid } from '../../../utils/snapToGrid'
import { Hasher } from 'circuits'
import { workerStore } from '../../../store/worker'
import { initConfigAnim } from '../anim'
import { CursorExplorer } from '../gameobject/CursorExplorer'
import { Planet } from '../gameobject/Planet'
import { gameStore, SendResourceData } from '../../../store/game'
import { createSpawnCapitalSystem } from '../../../system/createSpawnCapitalSystem'
import { NetworkLayer } from '../../network/types'
import { IDLE_ANIM, SPRITE } from '../constant/resouce'
import { HashTwoRespItem } from '../../../miner/hasher.worker'

const ZOOM_OUT_LIMIT = 0.01
const ZOOM_IN_LIMIT = 2
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
  keyF!: Phaser.Input.Keyboard.Key
  keyG!: Phaser.Input.Keyboard.Key
  redRect!: Phaser.GameObjects.Rectangle
  rt!: Phaser.GameObjects.RenderTexture
  ready = false
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

  handleWorker = async (res: HashTwoRespItem[]) => {
    const checkVal = BigInt('0x2d2f32534e97d979c3f2b616170489791c3f6706d539c62f89fd52bdb46c1c')
    for (let i = 0; i < res.length; i++) {
      const hVal = res[i].val
      const tileX = res[i].x
      const tileY = res[i].y
      //console.log(tileX, tileY, hVal)
      const check = BigInt(hVal) < checkVal
      if (check) {
        //console.log('spawn!', tileX, tileY)
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
      const p = new Planet(this, x * TILE_SIZE, y * TILE_SIZE, spriteKey)
      p.setDisplaySize(4 * TILE_SIZE ** 2, 4 * TILE_SIZE ** 2)
      p.play(idleKey)
    })
  }

  async onCreate() {
    initConfigAnim(this)

    const { networkLayer } = appStore.getState()
    if (networkLayer) {
      this.onSetUpSystem(networkLayer)
    }
    //this.redRect = this.add.rectangle(0, 0, TILE_SIZE / 2, TILE_SIZE / 2, 0xff0000)
    //this.redRect.setDepth(100)
    //this.redRect.setVisible(false)

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

    this.followPoint = new Phaser.Math.Vector2(0, 0)

    this.events.on('sendWorker', this.handleWorker)
    this.events.on(Phaser.GameObjects.Events.DESTROY, this.onDestroy)

    this.rt = this.add.renderTexture(0, 0, GAME_WIDTH, GAME_HEIGHT)
    this.cursorExplorer = new CursorExplorer(this, { x: 0, y: 0 }, 'explorerSheet', this.handleWorker)
    this.cursorExplorer.run()
    this.cursorExplorer.play(IDLE_ANIM.Explorer_Idle)

    this.chunkLoader = new ChunkLoader(this, { tileSize: TILE_SIZE }, this.rt)
    this.chunkLoader.setUpdateCbToChunks((t: Tile) => {
      t.alpha = 0.1
    })
    this.chunkLoader.initChunks(this.followPoint.x, this.followPoint.y)

    const cam = this.cameras.main
    cam.zoom = 0.5
    this.input.on('pointermove', (p) => {
      if (!p.isDown) return
      this.followPoint.x -= (p.x - p.prevPosition.x) / cam.zoom
      this.followPoint.y -= (p.y - p.prevPosition.y) / cam.zoom
    })

    this.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {
      // handle zoom in range MAX and MIN zoom value
      const cam = this.cameras.main
      if (deltaY > 0 && cam.zoom < ZOOM_IN_LIMIT) {
        cam.zoom *= 1.05
      }
      if (deltaY < 0 && cam.zoom > ZOOM_OUT_LIMIT) {
        cam.zoom /= 1.05
      }
    })

    window.addEventListener('position', this.handleUIEventPosition)
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W, false)
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S, false)
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A, false)
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D, false)
    this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z, false)
    this.keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X, false)
    this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F, false)
    this.keyG = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G, false)
    this.navigation = this.add.rectangle(this.followPoint.y, this.followPoint.x, 1, 1, 0x00ff00)
    const keyG = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G, false)
    keyG.on('down', () => {
      this.cursorExplorer.run()
    })

    this.navigation.setDepth(10)
    this.cameras.main.startFollow(this.navigation)

    this.input.on('pointerdown', (pointer: any) => {
      console.log(Math.floor(+pointer.worldX / 16), Math.floor(+pointer.worldY / 16))
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

    const cam = this.cameras.main
    if (this.keyW.isDown) {
      this.followPoint.y -= this.cameraSpeed / cam.zoom
    }
    if (this.keyS.isDown) {
      this.followPoint.y += this.cameraSpeed / cam.zoom
    }
    if (this.keyA.isDown) {
      this.followPoint.x -= this.cameraSpeed / cam.zoom
    }
    if (this.keyD.isDown) {
      this.followPoint.x += this.cameraSpeed / cam.zoom
    }
    if (this.keyF.isDown) {
      this.cameras.main.startFollow(this.navigation)
    }
    if (this.keyG.isDown) {
      this.cameras.main.startFollow(this.cursorExplorer)
    }
    const camera = this.cameras.main
    if (this.keyZ.isDown && camera.zoom > ZOOM_OUT_LIMIT) {
      cam.zoom /= 1.02
    }
    if (this.keyX.isDown && camera.zoom < ZOOM_IN_LIMIT) {
      cam.zoom *= 1.02
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
