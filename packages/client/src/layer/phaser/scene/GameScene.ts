import localForage from 'localforage'
import { formatEntityID } from '@latticexyz/network'
import { Perlin } from '@latticexyz/noise'
import { getComponentValue } from '@latticexyz/recs'
import { Hasher } from 'circuits'
import Phaser from 'phaser'
import { Pane } from 'tweakpane'
import { FACTION } from '../../../const/faction'
import { planetLevel, PLANET_RARITY } from '../../../const/planet'
import { HashTwoRespItem } from '../../../miner/hasher.worker'
import { appStore } from '../../../store/app'
import { dataStore, initPlanetPosition } from '../../../store/data'
import {
  addPlanet,
  addSpaceship,
  closeTeleport,
  gameStore,
  openAttackModal,
  openPlanetModal,
  openSendModal,
  openTeleport,
} from '../../../store/game'
import { createAttackSystem } from '../../../system/createAttackSystem'
import { createOwnerChangeSystem } from '../../../system/createOwnerChangeSystem'
import { createSpawnCapitalSystem } from '../../../system/createSpawnCapitalSystem'
import { createSpawnHQShipSystem } from '../../../system/createSpawnHQShipSystem'
import { createTeleportSystem } from '../../../system/createTeleportSystem'
import { snapPosToGrid, snapToGrid, snapValToGrid } from '../../../utils/snapToGrid'
import { NetworkLayer } from '../../network/types'
import { initConfigAnim } from '../anim'
import { CHUNK_HEIGHT_SIZE, CHUNK_WIDTH_SIZE, TILE_SIZE } from '../config/chunk'
import { GAME_HEIGHT, GAME_WIDTH } from '../config/game'
import { COLOR_RED, COLOR_YELLOW } from '../constant'
import { IMAGE, SPRITE, SPRITE_PLANET } from '../constant/resource'
import { GAME_SCENE } from '../constant/scene'
import { CursorExplorer } from '../gameobject/CursorExplorer'
import { HQShip } from '../gameobject/HQShip'
import { Planet } from '../gameobject/Planet'
import { Chunk } from '../utils/Chunk'
import { ChunkLoader } from '../utils/ChunkLoader'
import { Tile } from '../utils/Tile'
import { AudioManager } from '../AudioManager'

const ZOOM_OUT_LIMIT = 0.01
const ZOOM_IN_LIMIT = 2

const debug = import.meta.env.DEV && false

export enum GAME_UI_STATE {
  NONE = 'NONE',
  SELECTED_HQ_SHIP = 'SELECTED_HQ_SHIP',
  SELECTED_ATTACK_BY_SHIP = 'SELECTED_ATTACK_BY_SHIP',
  SELECTED_ATTACK_BY_PLANET = 'SELECTED_ATTACK_BY_PLANET',
  SELECTED_PLANET = 'SELECTED_PLANET',
  SELECTED_PLANET_SEND = 'SELECTED_PLANET_SEND',
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
  targetHQMoverShip: HQShip | null = null
  targetAttack: HQShip | Planet | null = null
  targetPlanet: Planet | null = null
  drawPlanetSends: Set<string> = new Set()
  audioManager: AudioManager
  constructor() {
    super(GAME_SCENE)
    appStore.setState({ gameScene: this })
  }

  handleWorker = async (res: HashTwoRespItem[]) => {
    const {
      networkLayer: { playerIndex },
    } = appStore.getState()
    for (let i = 0; i < res.length; i++) {
      const hVal = res[i].val
      const tileX = res[i].x
      const tileY = res[i].y
      const check = BigInt(hVal) < PLANET_RARITY
      if (check) {
        type PlanetHashValItemType = {
          id: string
          hVal: string
          tileX: number
          tileY: number
        }
        const id = formatEntityID(hVal)
        const planetHashValStr: string = (await localForage.getItem(`planetHash:${playerIndex}`)) || 'null'
        let planetHashVal = {} as Record<string, PlanetHashValItemType>
        if (planetHashValStr === 'null') {
          const planetHashVal = {} as Record<string, PlanetHashValItemType>
          planetHashVal[`${id}`] = {
            id: `${id}`,
            hVal,
            tileX,
            tileY,
          }
        } else {
          planetHashVal = JSON.parse(planetHashValStr) as Record<string, PlanetHashValItemType>
          // update
          planetHashVal[`${id}`] = {
            id: `${id}`,
            hVal,
            tileX,
            tileY,
          }
        }

        const newPlanetHashValStr = JSON.stringify(planetHashVal)
        await localForage.setItem(`planetHash:${playerIndex}`, newPlanetHashValStr)
        localStorage.setItem(`lastPlanetID:${playerIndex}`, `${id}`)
        this.createPlanet(hVal, tileX, tileY)
      }
    }
  }

  createPlanet = (hVal: string, tileX: number, tileY: number) => {
    const {
      networkLayer: { components, world },
    } = appStore.getState()
    const id = formatEntityID(hVal)
    const spriteKey = SPRITE_PLANET[Number(BigInt(hVal) % BigInt(SPRITE_PLANET.length))]
    const owner = getComponentValue(components.Owner, world.registerEntity({ id }))?.value
    const faction = owner
      ? getComponentValue(components.Faction, world.registerEntity({ id: formatEntityID(owner) }))?.value
      : undefined

    const pos = snapPosToGrid(
      {
        x: tileX * TILE_SIZE,
        y: tileY * TILE_SIZE,
      },
      TILE_SIZE,
    )
    const sprite = new Planet(this, pos.x, pos.y, spriteKey, planetLevel(id) / 2 + 1, id, faction)
    sprite.setAudioMananger(this.audioManager)
    initPlanetPosition(id, [tileX, tileY])
    sprite.play(spriteKey)
    sprite.registerOnClick((p: Phaser.Input.Pointer) => {
      if (!p.leftButtonReleased()) {
        return
      }
      if (this.gameUIState === GAME_UI_STATE.SELECTED_PLANET_SEND) {
        openSendModal(this.targetPlanet.entityID, id, new Phaser.Math.Vector2(p.x, p.y))
        this.drawPlanetSends.delete(this.targetPlanet.entityID)
        this.gameUIState = GAME_UI_STATE.NONE
        return
      }
      if (this.gameUIState === GAME_UI_STATE.SELECTED_PLANET) {
        // change to attack
        this.gameUIState = GAME_UI_STATE.SELECTED_ATTACK_BY_PLANET
        this.targetAttack = sprite
        return
      }
      if (this.gameUIState === GAME_UI_STATE.SELECTED_HQ_SHIP) {
        // change to attack
        this.gameUIState = GAME_UI_STATE.SELECTED_ATTACK_BY_SHIP
        this.targetAttack = sprite
        return
      }
      openPlanetModal(id, new Phaser.Math.Vector2(p.x, p.y))
    })

    addPlanet(id, sprite)
  }

  handleUIEventPosition = (e: any) => {
    const { x, y } = e.detail
    this.followPoint.x = +x
    this.followPoint.y = +y
  }

  onSetUpSystem(networkLayer: NetworkLayer) {
    createAttackSystem(networkLayer, this)
    createOwnerChangeSystem(networkLayer, this)
    createSpawnCapitalSystem(networkLayer, (x: number, y: number, entityID: number, factionId: number) => {
      const spriteKey = FACTION[factionId].capital
      const p = new Planet(this, x, y, spriteKey, 1, formatEntityID(`0x${entityID.toString(16)}`), factionId)
      p.setDisplaySize(4 * TILE_SIZE ** 2, 4 * TILE_SIZE ** 2)
      p.play(spriteKey)
    })
    createSpawnHQShipSystem(
      networkLayer,
      (
        x: number,
        y: number,
        entityIndex: number,
        entityID: string,
        owner: string,
        name: string,
        fractionID: number,
      ) => {
        const id = formatEntityID(entityID)
        if (gameStore.getState().spaceships.has(id)) {
          return
        }
        const pos = snapToGrid(x, y, 16)
        const ship = new HQShip(this, pos.x, pos.y, FACTION[fractionID].shipSpriteKey, entityID, owner, fractionID)
        ship.setAudioMananger(this.audioManager)
        ship.setDepth(100)
        addSpaceship(id, ship)
        ship.setPlayerName(name)
        if (owner === networkLayer.connectedAddress) {
          this.followPoint.x = +pos.x
          this.followPoint.y = +pos.y
          this.navigation.setPosition(this.followPoint.x, this.followPoint.y)
          ship.predictCursor.setVisible(true)
          ship.setPlayerIndicatorVisible(true)
          ship.registerOnClick((p: Phaser.Input.Pointer) => {
            if (!p.leftButtonReleased()) {
              return
            }
            if (this.gameUIState === GAME_UI_STATE.NONE) {
              setTimeout(() => {
                this.gameUIState = GAME_UI_STATE.SELECTED_HQ_SHIP
                this.targetHQMoverShip = ship
              }, 100)
            }
            if (this.gameUIState === GAME_UI_STATE.SELECTED_ATTACK_BY_PLANET) {
              openAttackModal(this.targetPlanet.entityID, this.targetAttack.entityID, new Phaser.Math.Vector2(p.x, p.y))
              if (this.targetPlanet) {
                this.targetPlanet.clearPredictCursor()
                this.targetPlanet.drawLine(COLOR_RED, this.targetAttack.x, this.targetAttack.y)
              }
              this.clearGameUIState()
              return
            }
            if (this.gameUIState === GAME_UI_STATE.SELECTED_PLANET_SEND) {
              openSendModal(this.targetPlanet.entityID, id, new Phaser.Math.Vector2(p.x, p.y))
              this.drawPlanetSends.delete(this.targetPlanet.entityID)
              this.gameUIState = GAME_UI_STATE.NONE
              return
            }
          })
          ship.setDepth(1000)
          dataStore.setState((state) => {
            state.ownedSpaceships.push(id)
            return state
          })
        } else {
          ship.registerOnClick((p: Phaser.Input.Pointer) => {
            if (!p.leftButtonReleased()) {
              return
            }
            if (this.gameUIState === GAME_UI_STATE.SELECTED_HQ_SHIP) {
              // change to attack
              this.gameUIState = GAME_UI_STATE.SELECTED_ATTACK_BY_SHIP
              this.targetAttack = ship
              return
            }
            if (this.gameUIState === GAME_UI_STATE.SELECTED_PLANET) {
              // change to attack
              this.gameUIState = GAME_UI_STATE.SELECTED_ATTACK_BY_PLANET
              this.targetAttack = ship
              return
            }
            if (this.gameUIState === GAME_UI_STATE.SELECTED_PLANET_SEND) {
              openSendModal(this.targetPlanet.entityID, id, new Phaser.Math.Vector2(p.x, p.y))
              this.drawPlanetSends.delete(this.targetPlanet.entityID)
              this.gameUIState = GAME_UI_STATE.NONE
              return
            }
            if (this.gameUIState === GAME_UI_STATE.SELECTED_ATTACK_BY_PLANET) {
              openAttackModal(this.targetPlanet.entityID, this.targetAttack.entityID, new Phaser.Math.Vector2(p.x, p.y))
              if (this.targetPlanet) {
                this.targetPlanet.clearPredictCursor()
                this.targetPlanet.drawLine(COLOR_RED, this.targetAttack.x, this.targetAttack.y)
              }
              this.clearGameUIState()
              return
            }
            if (this.gameUIState === GAME_UI_STATE.SELECTED_ATTACK_BY_SHIP) {
              openAttackModal(
                this.targetHQMoverShip.entityID,
                this.targetAttack.entityID,
                new Phaser.Math.Vector2(p.x, p.y),
              )
              if (this.targetHQMoverShip) {
                this.targetHQMoverShip.clearPredictCursor()
                this.targetHQMoverShip.drawLine(COLOR_RED, this.targetAttack.x, this.targetAttack.y)
              }
              this.clearGameUIState()
              return
            }
          })
        }
        createTeleportSystem(networkLayer, (entityID: string, x: number, y: number) => {
          const id = formatEntityID(entityID)
          const ship = gameStore.getState().spaceships.get(id.toString())
          if (!ship) return
          const dist = Phaser.Math.Distance.Between(x, y, ship.x, ship.y)
          if (ship && dist > 0) {
            ship.teleport(x, y)
          }
        })
      },
    )
  }

  clearGameUIState() {
    setTimeout(() => {
      this.gameUIState = GAME_UI_STATE.NONE
    }, 100)
  }

  clearAllDrawLine() {
    this.drawPlanetSends.forEach((planetID) => {
      const planet = gameStore.getState().planets.get(planetID)
      if (planet) planet.clearLine()
    })
    this.drawPlanetSends.clear()
    if (this.targetHQMoverShip) {
      this.targetHQMoverShip.resetPredictMovePosition()
      this.targetHQMoverShip.clearPredictCursor()
      this.targetHQMoverShip.clearLine()
    }
    if (this.targetPlanet) {
      this.targetPlanet.clearLine()
    }
    this.clearGameUIState()
  }

  clearAllUI() {
    this.clearAllDrawLine()
    closeTeleport()
  }

  async onCreate() {
    initConfigAnim(this)
    this.input.setPollAlways()
    this.cursorMove = this.add.image(0, 0, IMAGE.SELECTED_CURSOR)
    this.cursorMove.setDisplaySize(16, 16)
    this.cursorMove.setDepth(1000)
    this.cursorMove.setOrigin(0)

    const { networkLayer } = appStore.getState()
    const playerIndex = networkLayer.playerIndex
    this.onSetUpSystem(networkLayer)

    this.events.on('sendWorker', this.handleWorker)
    this.events.on(Phaser.GameObjects.Events.DESTROY, this.onDestroy)

    this.rt = this.add.renderTexture(0, 0, GAME_WIDTH, GAME_HEIGHT)
    this.cursorExplorer = new CursorExplorer(this, this.followPoint, SPRITE.EXPLORER, this.handleWorker)
    const lastPlanetID = localStorage.getItem(`lastPlanetID:${playerIndex}`)
    if (lastPlanetID) {
      const planetHashStr = (await localForage.getItem(`planetHash:${playerIndex}`)) as string
      const planetHash = planetHashStr ? JSON.parse(planetHashStr) : {}
      if (planetHash[lastPlanetID]) {
        this.cursorExplorer.setCurrentChunkFromPos({
          x: planetHash[lastPlanetID].tileX * TILE_SIZE,
          y: planetHash[lastPlanetID].tileY * TILE_SIZE,
        })
      }

      if (planetHash) {
        Object.keys(planetHash).forEach((key) => {
          const planet = planetHash[key]
          if (planet) {
            this.createPlanet(planet.hVal, planet.tileX, planet.tileY)
          }
        })
      }
    }
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
    this.input.on('pointermove', (p) => {
      if (!p.isDown) return
      this.followPoint.x -= (p.x - p.prevPosition.x) / cam.zoom
      this.followPoint.y -= (p.y - p.prevPosition.y) / cam.zoom
    })

    gameStore.setState(() => ({
      focusLocation: (v) => {
        this.followPoint = new Phaser.Math.Vector2(v)
      },
    }))

    appStore.setState({ isLoading: false })

    this.input.on('pointerup', async (p) => {
      if (this.input.activePointer.rightButtonReleased()) {
        this.clearAllUI()
        this.gameUIState = GAME_UI_STATE.NONE
      }
      if (this.gameUIState === GAME_UI_STATE.SELECTED_ATTACK_BY_PLANET) {
        openAttackModal(this.targetPlanet.entityID, this.targetAttack.entityID, new Phaser.Math.Vector2(p.x, p.y))
        if (this.targetPlanet) {
          this.targetPlanet.clearPredictCursor()
          this.targetPlanet.drawLine(COLOR_RED, this.targetAttack.x, this.targetAttack.y)
        }
        this.clearGameUIState()
        return
      }
      if (this.gameUIState === GAME_UI_STATE.SELECTED_ATTACK_BY_SHIP) {
        openAttackModal(this.targetHQMoverShip.entityID, this.targetAttack.entityID, new Phaser.Math.Vector2(p.x, p.y))
        if (this.targetHQMoverShip) {
          this.targetHQMoverShip.clearPredictCursor()
          this.targetHQMoverShip.drawLine(COLOR_RED, this.targetAttack.x, this.targetAttack.y)
        }
        this.clearGameUIState()
        return
      }
      if (this.gameUIState === GAME_UI_STATE.SELECTED_HQ_SHIP) {
        if (this.input.activePointer.rightButtonReleased()) {
          if (this.targetHQMoverShip) {
            this.targetHQMoverShip.resetPredictMovePosition()
          }
          this.gameUIState = GAME_UI_STATE.NONE
        }
        if (!this.input.activePointer.leftButtonReleased()) {
          return
        }
        const position = snapToGrid(p.worldX, p.worldY, 16)
        const entityID = dataStore.getState().ownedSpaceships[0]
        const networkLayer = appStore.getState().networkLayer
        if (networkLayer) {
          const tileX = Math.floor(position.x / TILE_SIZE)
          const tileY = Math.floor(position.y / TILE_SIZE)
          const id = formatEntityID(entityID)
          const ship = gameStore.getState().spaceships.get(id)
          const dist = Phaser.Math.Distance.Between(position.x, position.y, ship.x, ship.y)
          if (dist === 0) {
            this.gameUIState = GAME_UI_STATE.NONE
            return
          }
          openTeleport(id)
          this.clearGameUIState()
        }
      }
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
    this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC, false)
    const keyG = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G, false)
    keyG.on('down', () => {
      this.cursorExplorer.run()
    })

    this.navigation.setDepth(10)
    this.cameras.main.startFollow(this.navigation, false, 0.3, 0.3)
    this.ready = true
  }
  create() {
    this.audioManager = new AudioManager(this)
    this.followPoint = new Phaser.Math.Vector2(0, 0)
    this.navigation = this.add.rectangle(this.followPoint.y, this.followPoint.x, 1, 1, 0x00ff00)
    this.onCreate()
  }

  updateCursor() {
    const camera = this.cameras.main
    const pointer = this.input.activePointer
    const gridX = snapValToGrid(pointer.worldX, TILE_SIZE)
    const gridY = snapValToGrid(pointer.worldY, TILE_SIZE)
    // gridPos  with zoom scale

    this.cursorMove.setPosition(gridX, gridY)
    if (this.gameUIState === GAME_UI_STATE.SELECTED_PLANET) {
      if (this.targetPlanet) {
        this.targetPlanet.predictMove(
          Math.floor(this.cursorMove.x / TILE_SIZE),
          Math.floor(this.cursorMove.y / TILE_SIZE),
        )
        this.targetPlanet.drawPredictLine()
      }
    }
    if (this.gameUIState === GAME_UI_STATE.SELECTED_HQ_SHIP) {
      if (this.targetHQMoverShip) {
        this.targetHQMoverShip.predictMove(
          Math.floor(this.cursorMove.x / TILE_SIZE),
          Math.floor(this.cursorMove.y / TILE_SIZE),
        )
        this.targetHQMoverShip.drawPredictLine()
      }
    }

    this.drawPlanetSends.forEach((s) => {
      const planet = gameStore.getState().planets.get(s)
      planet.predictMove(Math.floor(this.cursorMove.x / TILE_SIZE), Math.floor(this.cursorMove.y / TILE_SIZE))
      planet.drawPredictLine(COLOR_YELLOW)
    })
  }

  update(time: number, delta: number): void {
    if (!this.ready) {
      return
    }
    const pointer = this.input.activePointer
    this.updateCursor()

    if (this.gameUIState === GAME_UI_STATE.SELECTED_HQ_SHIP) {
      this.cursorMove.setVisible(true)
    } else {
      this.cursorMove.setVisible(false)
    }
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
    if (this.keyESC.isDown) {
      this.clearAllDrawLine()
      if (this.targetHQMoverShip) {
        this.targetHQMoverShip.resetPredictMovePosition()
        this.targetHQMoverShip.clearLine()
        const entityID = this.targetHQMoverShip.entityID
        const id = formatEntityID(entityID)
        closeTeleport()
      }
      this.gameUIState = GAME_UI_STATE.NONE
    }
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
      this.cameras.main.startFollow(this.navigation, false, 0.3, 0.3)
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
