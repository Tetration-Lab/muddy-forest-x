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
import { snapPosToGrid, snapToGrid } from '../../../utils/snapToGrid'
import { Hasher } from 'circuits'
import { initConfigAnim } from '../anim'
import { CursorExplorer } from '../gameobject/CursorExplorer'
import { Planet } from '../gameobject/Planet'
import { addPlanet, addSpaceship, gameStore, openPlanetModal, openTeleportModal } from '../../../store/game'
import { createSpawnCapitalSystem } from '../../../system/createSpawnCapitalSystem'
import { NetworkLayer } from '../../network/types'
import { IMAGE, SPRITE, SPRITE_PLANET } from '../constant/resource'
import { HashTwoRespItem } from '../../../miner/hasher.worker'
import { createSpawnHQShipSystem } from '../../../system/createSpawnHQShipSystem'
import { createTeleportSystem } from '../../../system/createTeleportSystem'
import { planetLevel, PLANET_RARITY } from '../../../const/planet'
import { HQShip } from '../gameobject/HQShip'
import { formatEntityID } from '@latticexyz/network'
import { dataStore, initPlanetPosition } from '../../../store/data'
import { FACTION } from '../../../const/faction'
import { openStdin } from 'process'
import { getAddress } from 'ethers/lib/utils'

const ZOOM_OUT_LIMIT = 0.01
const ZOOM_IN_LIMIT = 2

const debug = import.meta.env.DEV && false

export enum GAME_UI_STATE {
  NONE = 'NONE',
  SELECTED_HQ_SHIP = 'SELECTED_HQ_SHIP',
}
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
  chunkLoader!: ChunkLoader
  pane: Pane
  paramsDebug: { position: string; chunkCoordinate: string; tileCoordinate: string; cameraSize: string } | null
  keyZ!: Phaser.Input.Keyboard.Key
  keyX!: Phaser.Input.Keyboard.Key
  keyF!: Phaser.Input.Keyboard.Key
  keyG!: Phaser.Input.Keyboard.Key
  keyESC!: Phaser.Input.Keyboard.Key
  redRect!: Phaser.GameObjects.Rectangle
  rt!: Phaser.GameObjects.RenderTexture
  ready = false
  perlin: Perlin | null = null
  hasher: Hasher
  cursorExplorer!: CursorExplorer
  cursorMove!: Phaser.GameObjects.Image
  gameUIState: GAME_UI_STATE = GAME_UI_STATE.NONE

  constructor() {
    super(GAME_SCENE)
  }

  handleWorker = async (res: HashTwoRespItem[]) => {
    for (let i = 0; i < res.length; i++) {
      const hVal = res[i].val
      const tileX = res[i].x
      const tileY = res[i].y
      const check = BigInt(hVal) < PLANET_RARITY
      if (check) {
        const spriteKey = SPRITE_PLANET[Number(BigInt(hVal) % BigInt(SPRITE_PLANET.length))]
        const sprite = new Planet(this, 0, 0, spriteKey)
        const id = formatEntityID(hVal)
        initPlanetPosition(id, [tileX, tileY])

        const pos = snapPosToGrid(
          {
            x: tileX * TILE_SIZE,
            y: tileY * TILE_SIZE,
          },
          TILE_SIZE,
          sprite.displayWidth,
        )
        if (debug) {
          sprite.setPositionWithDebug(pos.x, pos.y, 0x00ff00)
        } else {
          sprite.setPosition(pos.x, pos.y)
        }

        sprite.setDepth(100)
        sprite.setScale(planetLevel(id) / 2 + 1)
        sprite.play(spriteKey)
        sprite.registerOnClick((pointer: Phaser.Input.Pointer) => {
          openPlanetModal(id, pointer.position.clone())
        })

        addPlanet(id, sprite)
      }
    }
  }

  handleUIEventPosition = (e: any) => {
    const { x, y } = e.detail
    this.followPoint.x = +x
    this.followPoint.y = +y
  }

  onSetUpSystem(networkLayer: NetworkLayer) {
    createSpawnCapitalSystem(networkLayer, (x: number, y: number, entityID: number, factionId: number) => {
      const spriteKey = FACTION[factionId].capital
      const p = new Planet(this, x, y, spriteKey)
      p.setDisplaySize(4 * TILE_SIZE ** 2, 4 * TILE_SIZE ** 2)
      p.play(spriteKey)
    })
    createSpawnHQShipSystem(
      networkLayer,
      (x: number, y: number, entityIndex: number, entityID: string, owner: string) => {
        const id = formatEntityID(entityID)
        if (gameStore.getState().spaceships.has(id)) {
          return
        }
        const pos = snapToGrid(x, y, 16)
        const ship = new HQShip(this, pos.x, pos.y, IMAGE.AI_SHIP, entityID, owner)
        ship.setDepth(100)
        addSpaceship(id, ship)
        if (owner === networkLayer.connectedAddress) {
          this.followPoint.x = +pos.x
          this.followPoint.y = +pos.y
          this.navigation.setPosition(this.followPoint.x, this.followPoint.y)
          ship.predictCursor.setVisible(true)
          ship.registerOnClick((pointer: Phaser.Input.Pointer) => {
            const position = this.input.activePointer.position
            const pos = new Phaser.Math.Vector2(position.x, position.y)
            openTeleportModal(id, pos)
          })
          ship.setDepth(1000)
          dataStore.setState((state) => {
            state.ownedSpaceships.push(id)
            return state
          })
        }
      },
    )
    createTeleportSystem(networkLayer, (entityID: string, x: number, y: number) => {
      const id = formatEntityID(entityID)
      const ship = gameStore.getState().spaceships.get(id.toString())
      const dist = Phaser.Math.Distance.Between(x, y, ship.x, ship.y)
      if (ship && dist > 0) {
        ship.teleport(x, y)
      }
    })
  }

  async onCreate() {
    initConfigAnim(this)
    this.input.setPollAlways()
    this.cursorMove = this.add.image(0, 0, IMAGE.SELECTED_CURSOR)
    this.cursorMove.setDisplaySize(16, 16)
    this.cursorMove.setDepth(1000)
    this.cursorMove.setOrigin(0)

    const { networkLayer } = appStore.getState()
    if (networkLayer) {
      this.onSetUpSystem(networkLayer)
    }

    this.events.on('sendWorker', this.handleWorker)
    this.events.on(Phaser.GameObjects.Events.DESTROY, this.onDestroy)

    this.rt = this.add.renderTexture(0, 0, GAME_WIDTH, GAME_HEIGHT)
    this.cursorExplorer = new CursorExplorer(this, this.followPoint, SPRITE.EXPLORER, this.handleWorker)
    this.cursorExplorer.run()
    this.cursorExplorer.play(SPRITE.EXPLORER)

    this.chunkLoader = new ChunkLoader(this, { tileSize: TILE_SIZE }, this.rt)
    this.chunkLoader.setUpdateCbToChunks((t: Tile) => {
      t.alpha = 0
      t.registerOnClick((pointer: Phaser.Input.Pointer) => {
        switch (this.gameUIState) {
          case GAME_UI_STATE.NONE:
            return
        }
      })
    })
    this.chunkLoader.initChunks(this.followPoint.x, this.followPoint.y)

    const cam = this.cameras.main
    cam.zoom = 0.5
    this.input.on('pointermove', (p) => {
      if (!p.isDown) return
      this.followPoint.x -= (p.x - p.prevPosition.x) / cam.zoom
      this.followPoint.y -= (p.y - p.prevPosition.y) / cam.zoom
    })

    gameStore.setState(() => ({
      focusLocation: (v) => {
        this.followPoint = v
      },
    }))

    // this.input.on('pointerup', async (p) => {
    //   if (this.gameUIState === GAME_UI_STATE.SELECTED_HQ_SHIP) {
    //     const position = snapToGrid(p.worldX, p.worldY, 16)
    //     const entityID = dataStore.getState().ownedSpaceships[0]
    //     const networkLayer = appStore.getState().networkLayer
    //     if (networkLayer) {
    //       const tileX = Math.floor(position.x / TILE_SIZE)
    //       const tileY = Math.floor(position.y / TILE_SIZE)
    //       console.log(entityID, tileX, tileY)
    //       const id = formatEntityID(entityID)
    //       const ship = gameStore.getState().spaceships.get(id)
    //       // const dist = Phaser.Math.Distance.Between(position.x, position.y, ship.x, ship.y)
    //       // if (dist === 0) {
    //       //   this.gameUIState = GAME_UI_STATE.NONE
    //       //   return
    //       // }
    //       try {
    //         // ship.playTeleport()
    //         // await networkLayer.api.move(entityID, tileX, tileY)
    //         const position = this.input.activePointer.position
    //         const pos = new Phaser.Math.Vector2(position.x, position.y)
    //         openTeleportModal(id, pos)
    //       } catch (err) {
    //         ship.stopPlayTeleport()
    //       } finally {
    //         this.gameUIState = GAME_UI_STATE.NONE
    //       }
    //     }
    //     this.gameUIState = GAME_UI_STATE.NONE
    //   }
    // })

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
    this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC, false)
    const keyG = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G, false)
    keyG.on('down', () => {
      this.cursorExplorer.run()
    })

    this.navigation.setDepth(10)
    this.cameras.main.startFollow(this.navigation)
    this.ready = true
  }
  create() {
    this.followPoint = new Phaser.Math.Vector2(0, 0)
    this.navigation = this.add.rectangle(this.followPoint.y, this.followPoint.x, 1, 1, 0x00ff00)
    this.onCreate()
  }

  updateCursor() {
    const pointer = this.input.activePointer
    const gridPos = snapToGrid(pointer.worldX, pointer.worldY, 16)
    this.cursorMove.setPosition(gridPos.x, gridPos.y)
  }

  update(time: number, delta: number): void {
    if (!this.ready) {
      return
    }

    if (this.gameUIState === GAME_UI_STATE.SELECTED_HQ_SHIP) {
      this.cursorMove.setVisible(true)
    } else {
      this.cursorMove.setVisible(false)
    }

    this.updateCursor()
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
    if (this.keyESC.isDown) {
      this.gameUIState = GAME_UI_STATE.NONE
    }
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
