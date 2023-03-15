import { FaMinus, FaPlus, FaQuestion } from 'react-icons/fa'
import { Box, ButtonBase, Stack, Typography, useTheme } from '@mui/material'
import { HiXMark } from 'react-icons/hi2'
import { useStore } from 'zustand'
import { useMemo, useState } from 'react'
import { appStore } from '../../../store/app'
import { useSpaceship } from '../../../hook/useSpaceship'
import { closeTeleport, gameStore } from '../../../store/game'
import { moveEnergyCost } from '../../../const/resources'
import { ToolButton } from '../../ToolButton'
import { CloseModalButton } from '../common/CloseModalButton'
import { GameItemEntry } from '../Modals/PlanetModal/GameItemEntry'
import { usePlayer } from '../../../hook/usePlayer'
import { FACTION } from '../../../const/faction'
import { useResourceRegen } from '../../../hook/useResourceRegen'
import { InfoTab } from '../Modals/PlanetModal/InfoTab'
import { MainButton } from '../../common/MainButton'

export const TeleportActionBox = ({ id }: { id: string }) => {
  const theme = useTheme()
  const networkLayer = useStore(appStore, (state) => state.networkLayer)
  const { ship } = useSpaceship(id)
  const owner = usePlayer(ship?.owner ?? '0x0')
  const { shipSprite, focusLocation } = useStore(gameStore, (state) => ({
    shipSprite: state.spaceships.get(id),
    focusLocation: state.focusLocation,
  }))

  const energyValue = useResourceRegen(ship?.energy)

  const distance = useMemo(() => {
    if (!shipSprite) return 0
    else return Math.floor(Phaser.Math.Distance.BetweenPoints(shipSprite.coordinate, shipSprite.predictMoveCoordinate))
  }, [shipSprite?.coordinate, shipSprite?.predictMoveCoordinate])

  const energyCost = useMemo(() => {
    return moveEnergyCost(distance)
  }, [distance])

  const onPredictMove = (x: number, y: number) => {
    shipSprite.predictMove(x, y)
    shipSprite.drawPredictLine()
  }

  const [isTeleporting, setTeleporting] = useState(false)
  const onTeleport = async () => {
    const entityID = id
    setTeleporting(true)
    try {
      shipSprite.playTeleport()
      await networkLayer.api.move(entityID, shipSprite.predictMoveCoordinate.x, shipSprite.predictMoveCoordinate.y)
    } catch (err) {
      shipSprite.stopPlayTeleport()
    } finally {
      setTeleporting(false)
      closeTeleport()
    }
  }

  return (
    <Stack
      p={1}
      sx={{
        background: theme.palette.grayScale.soBlack,
        color: theme.palette.common.white,
        borderRadius: '8px',
        width: 250,
      }}
      spacing={1}
    >
      <Stack direction="row" alignItems="center">
        <ToolButton iconSrc="./assets/svg/jump-icon.svg" />
        <Typography px={2} sx={{ fontFamily: 'VT323', fontSize: 24, flex: 1 }}>
          Teleport
        </Typography>
        <CloseModalButton onClick={closeTeleport} />
      </Stack>
      <GameItemEntry
        iconUrl={shipSprite?.shipImg?.texture?.manager?.getBase64(shipSprite?.shipImg?.texture?.key)}
        title={owner?.name}
        description={`${shipSprite?.coordinate?.x}, ${shipSprite?.coordinate?.y}`}
        onClick={() => focusLocation(shipSprite?.getPosition())}
        sx={{
          border: `2px solid ${FACTION[owner?.faction]?.color}`,
          borderStyle: 'outset',
        }}
      />
      <Stack spacing={1} p={1} sx={{ backgroundColor: theme.palette.grayScale.black, borderRadius: '8px' }}>
        <Typography sx={{ fontSize: 14 }}>Teleport Position</Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-evenly" spacing={1}>
          <Stack
            py={1}
            sx={{
              backgroundColor: theme.palette.grayScale.darkGray,
              flex: 1,
              alignItems: 'center',
              borderRadius: '4px',
            }}
          >
            <Typography sx={{ fontSize: 14 }}>X: {shipSprite?.predictMoveCoordinate.x}</Typography>
          </Stack>
          <Stack
            py={1}
            sx={{
              backgroundColor: theme.palette.grayScale.darkGray,
              flex: 1,
              alignItems: 'center',
              borderRadius: '4px',
            }}
          >
            <Typography sx={{ fontSize: 14 }}>Y: {shipSprite?.predictMoveCoordinate.y}</Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="row" spacing={1}>
        <InfoTab iconSrc="/assets/svg/distance-icon.svg" title={`${distance} m`} />
        <InfoTab iconSrc="/assets/svg/item-energy-icon.svg" title={`${energyCost}/${energyValue}`} />
      </Stack>
      <Stack alignItems="center">
        <MainButton onClick={onTeleport} disabled={isTeleporting}>
          Teleport
        </MainButton>
      </Stack>
    </Stack>
  )

  return (
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
              onClick={closeTeleport}
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
          {/* TODO: save position */}
          {/* <div className="w-8 h-8 bg-[#4A5056] rounded-md flex items-center justify-center">
                <img src="./assets/svg/save-icon.svg" alt="" />
              </div> */}
        </div>
        <div className="flex p-2 space-x-2">
          <div className="w-full flex items-center space-x-2 p-2 bg-[#4A5056] rounded-md text-center">
            <FaMinus
              onClick={() => onPredictMove(shipSprite.predictMoveCoordinate.x - 1, shipSprite.predictMoveCoordinate.y)}
            />
            <input
              onChange={(e) => onPredictMove(Number(e.target.value), shipSprite.predictMoveCoordinate.y)}
              className="w-full bg-transparent outline-none"
              placeholder="X coordinate"
              value={shipSprite.predictMoveCoordinate.x}
            />
            <FaPlus
              onClick={() => onPredictMove(shipSprite.predictMoveCoordinate.x + 1, shipSprite.predictMoveCoordinate.y)}
            />
          </div>
          <div className="w-full flex items-center space-x-2 p-2 bg-[#4A5056] rounded-md text-center">
            <FaMinus
              onClick={() => onPredictMove(shipSprite.predictMoveCoordinate.x, shipSprite.predictMoveCoordinate.y - 1)}
            />
            <input
              onChange={(e) => onPredictMove(shipSprite.predictMoveCoordinate.x, Number(e.target.value))}
              className="w-full bg-transparent outline-none"
              placeholder="Y coordinate"
              value={shipSprite.predictMoveCoordinate.y}
            />
            <FaPlus
              onClick={() => onPredictMove(shipSprite.predictMoveCoordinate.x, shipSprite.predictMoveCoordinate.y + 1)}
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
              <span className="text-green-500">{energyCost}</span> / {ship?.energy?.cap}
            </span>
          </div>
          <div className="flex items-center w-full p-2 bg-[#222529] rounded-md text-center">
            <span>
              <img src="./assets/svg/item-distance-icon.svg" alt="item-energy-icon" />
            </span>
            <span>{distance} m</span>
          </div>
        </div>
      </section>
      <section className="flex justify-center">
        <button className="text-white p-2 bg-[#4A5056] rounded-md" onClick={() => onTeleport()}>
          Teleport
        </button>
      </section>
    </div>
  )
}
