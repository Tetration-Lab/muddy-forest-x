import { FaMinus, FaPlus, FaQuestion } from 'react-icons/fa'
import { Box, ButtonBase, useTheme } from '@mui/material'
import { HiXMark } from 'react-icons/hi2'
import Draggable from 'react-draggable'
import { closeTeleportModal, gameStore } from '../../../../store/game'
import { useStore } from 'zustand'
import { useEffect, useMemo, useState } from 'react'
import { appStore } from '../../../../store/app'
import { dataStore } from '../../../../store/data'
import { moveEnergyCost } from '../../../../const/resources'
import { useSpaceship } from '../../../../hook/useSpaceship'

export interface Props {
  id: string
  open?: boolean
  onClose: () => void
  energy: number
  maxMaxEnergy: number
  distance: number
  position?: { x: number; y: number }
}

export const TeleportModal = ({ id, open = false, position = { x: 0, y: 0 } }) => {
  const theme = useTheme()
  const ship = useSpaceship(id ?? '0x0')
  const shipSprite = useStore(gameStore, (state) => state.spaceships.get(id))
  const networkLayer = useStore(appStore, (state) => state.networkLayer)
  const [predictMove, setPredictMove] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })

  const calculatemoveEnergyCost = useMemo(() => {
    if (!shipSprite) {
      return 0
    }
    const distance = Phaser.Math.Distance.Between(
      shipSprite.coordinate.x,
      shipSprite.coordinate.y,
      shipSprite.predictMoveCoordinate.x,
      shipSprite.predictMoveCoordinate.y,
    )
    return moveEnergyCost(distance)
  }, [predictMove])

  const onPredictMove = (x: number, y: number) => {
    shipSprite.predictMove(x, y)
    shipSprite.drawPredictLine()
  }

  useEffect(() => {
    if (!shipSprite) {
      return
    }
    setPredictMove({ x: shipSprite.predictMoveCoordinate.x, y: shipSprite.predictMoveCoordinate.y })
  }, [])

  const onTeleport = async () => {
    if (!networkLayer) {
      return
    }
    const entityID = dataStore.getState().ownedSpaceships[0]
    try {
      shipSprite.playTeleport()
      await networkLayer.api.move(entityID, predictMove.x, predictMove.y)
    } catch (err) {
      console.log(err)
      shipSprite.stopPlayTeleport()
    } finally {
      closeTeleportModal(id)
    }
  }

  const onClose = () => {
    closeTeleportModal(id)
    if (shipSprite) {
      shipSprite.resetPredictMovePosition()
    }
  }

  if (!open) return null
  return (
    <>
      <Draggable
        bounds="body"
        defaultPosition={{
          x: position.x,
          y: position.y,
        }}
      >
        <div id="teleport-modal" className="absolute bg-[#1E1E1E] w-[300px] px-2 pb-4 pt-1 text-white">
          <div className="flex justify-between p-1">
            <div className="flex space-x-2 items-center">
              <div className="w-8 h-8  p-2 bg-[#4A5056] rounded-md">
                <img src="./assets/svg/teleport-icon.svg" alt="" />
              </div>
              <div>Teleport</div>
            </div>
            <div className="flex">
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-[#353A3F] p-1">
                  <FaQuestion />
                </div>
                <ButtonBase
                  onClick={() => onClose()}
                  sx={{
                    width: 28,
                    height: 28,
                    backgroundColor: theme.palette.grayScale.almostBlack,
                    border: `2px solid ${theme.palette.grayScale.black}`,
                    borderRadius: '4px',
                  }}
                >
                  <Box component={HiXMark} />
                </ButtonBase>
              </div>
            </div>
          </div>
          {/* TODO: save position */}
          {/* <section className="bg-[#222529] p-2 space-y-2">
            <div>Saved coordinate</div>
            <div className="p-2 border-2 border-dashed rounded-md border-[#787C80] bg-[#363A3F] text-center text-gray-500">
              Empty
            </div>
          </section> */}

          <section>
            <div className="flex justify-between p-2 bg-[#222529]">
              <div>Enter teleport position</div>
              <div className="w-8 h-8 bg-[#4A5056] rounded-md flex items-center justify-center">
                <img src="./assets/svg/save-icon.svg" alt="" />
              </div>
            </div>
            <div className="flex p-2 space-x-2">
              <div className="w-full flex items-center space-x-2 p-2 bg-[#4A5056] rounded-md text-center">
                <FaMinus
                  onClick={() =>
                    onPredictMove(shipSprite.predictMoveCoordinate.x - 1, shipSprite.predictMoveCoordinate.y)
                  }
                />
                <input
                  onChange={(e) => onPredictMove(Number(e.target.value), shipSprite.predictMoveCoordinate.y)}
                  className="w-full bg-transparent outline-none"
                  placeholder="X coordinate"
                  value={predictMove.x}
                />
                <FaPlus
                  onClick={() =>
                    onPredictMove(shipSprite.predictMoveCoordinate.x + 1, shipSprite.predictMoveCoordinate.y)
                  }
                />
              </div>
              <div className="w-full flex items-center space-x-2 p-2 bg-[#4A5056] rounded-md text-center">
                <FaMinus
                  onClick={() =>
                    onPredictMove(shipSprite.predictMoveCoordinate.x, shipSprite.predictMoveCoordinate.y - 1)
                  }
                />
                <input
                  onChange={(e) => onPredictMove(shipSprite.predictMoveCoordinate.x, Number(e.target.value))}
                  className="w-full bg-transparent outline-none"
                  placeholder="Y coordinate"
                  value={predictMove.y}
                />
                <FaPlus
                  onClick={() =>
                    onPredictMove(shipSprite.predictMoveCoordinate.x, shipSprite.predictMoveCoordinate.y + 1)
                  }
                />
              </div>
            </div>
          </section>
          <section>
            <div>Resource estimation</div>
            <div className="flex p-2 space-x-2">
              <div className="flex items-center w-full p-2 bg-[#222529] rounded-md text-center">
                <span>
                  <img src="./assets/svg/item-energy-icon.svg" alt="item-energy-icon" />
                </span>
                <span>
                  <span className="text-green-500">{Math.floor(calculatemoveEnergyCost || 0)}</span> /{' '}
                  {ship?.energy?.cap || ''}
                </span>
              </div>
              <div className="flex items-center w-full p-2 bg-[#222529] rounded-md text-center">
                <span>
                  <img src="./assets/svg/item-distance-icon.svg" alt="item-energy-icon" />
                </span>
                <span>xxx m</span>
              </div>
            </div>
          </section>
          <section className="flex justify-center">
            <button className="text-white p-2 bg-[#4A5056] rounded-md" onClick={() => onTeleport()}>
              Teleport
            </button>
          </section>
        </div>
      </Draggable>
    </>
  )
}
