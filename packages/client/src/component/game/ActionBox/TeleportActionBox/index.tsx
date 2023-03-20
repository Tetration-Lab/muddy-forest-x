import { Stack, Typography, useTheme } from '@mui/material'
import { useStore } from 'zustand'
import { useMemo, useState } from 'react'
import { appStore } from '../../../../store/app'
import { useSpaceship } from '../../../../hook/useSpaceship'
import { usePlayer } from '../../../../hook/usePlayer'
import { closeTeleport, gameStore } from '../../../../store/game'
import { useResourceRegen } from '../../../../hook/useResourceRegen'
import { moveEnergyCost } from '../../../../const/resources'
import { ToolButton } from '../../../ToolButton'
import { CloseModalButton } from '../../common/CloseModalButton'
import { SpriteEntry } from '../../Modals/AttackModal/SpriteEntry'
import { InfoTab } from '../../Modals/PlanetModal/InfoTab'
import { WarningBox } from '../../../common/WarningBox'
import { MainButton } from '../../../common/MainButton'

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
      <SpriteEntry
        sprite={shipSprite?.shipImg}
        name={owner?.name}
        position={shipSprite?.coordinate}
        onClick={() => focusLocation(shipSprite?.getPosition())}
        faction={owner?.faction}
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
        <InfoTab
          iconSrc="/assets/svg/item-energy-icon.svg"
          title={
            <>
              <span
                style={{
                  color: energyCost > energyValue && theme.palette.error.main,
                }}
              >
                {energyCost}
              </span>
              /{energyValue}
            </>
          }
        />
        <InfoTab iconSrc="/assets/svg/distance-icon.svg" title={`${distance} m`} />
      </Stack>
      {energyCost > energyValue && <WarningBox label="Need more energy to teleport because it’s too far." />}
      <Stack alignItems="center">
        <MainButton onClick={onTeleport} disabled={isTeleporting || energyCost > energyValue}>
          Teleport
        </MainButton>
      </Stack>
    </Stack>
  )
}
