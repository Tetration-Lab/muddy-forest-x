import { getComponentValue } from '@latticexyz/recs'
import { Box, Stack, Typography, useTheme } from '@mui/material'
import _ from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import Draggable from 'react-draggable'
import { useStore } from 'zustand'
import { MATERIALS } from '../../../../const/materials'
import { ENERGY_ID, sendEnergyCost } from '../../../../const/resources'
import { EntityType } from '../../../../const/types'
import { useBaseEntity } from '../../../../hook/useBaseEntity'
import { usePlayer } from '../../../../hook/usePlayer'
import { useResourceRegen, useResourcesRegen } from '../../../../hook/useResourceRegen'
import { TILE_SIZE } from '../../../../layer/phaser/config/chunk'
import { appStore } from '../../../../store/app'
import { closeSendModal, gameStore } from '../../../../store/game'
import { generatePlanetName } from '../../../../utils/random'
import { MainButton } from '../../../common/MainButton'
import { WarningBox } from '../../../common/WarningBox'
import { CloseModalButton } from '../../common/CloseModalButton'
import { GameItem } from '../../common/GameItem'
import { GameItemSlider } from '../AttackModal/GameItemSlider'
import { SpriteEntry } from '../AttackModal/SpriteEntry'
import { InfoTab } from '../PlanetModal/InfoTab'

export const SendModal = ({
  id,
  targetId,
  position,
}: {
  id: string
  targetId: string
  position: Phaser.Math.Vector2
}) => {
  const theme = useTheme()
  const { components, api } = useStore(appStore, (state) => state.networkLayer)
  const focusLocation = useStore(gameStore, (state) => state.focusLocation)

  const sender = useBaseEntity(id)
  const senderResources = useResourcesRegen(sender?.entity?.resources)
  const senderEnergy = useResourceRegen(sender?.entity?.energy)
  const senderOwner = usePlayer(sender?.entity?.owner ?? '0x0')

  const target = useBaseEntity(targetId)
  const targetEnergy = useResourceRegen(target?.entity?.energy)
  const targetOwner = usePlayer(target?.entity?.owner ?? '0x0')

  const [sentEnergy, setSentEnergy] = useState(0)
  const [sentResources, setSentResources] = useState<{ [k in string]: number }>({})

  const { senderName, senderSprite, targetName, targetSprite, senderPosition, targetPosition } = useMemo(() => {
    let senderName: string
    let senderSprite: any
    let senderPosition: Phaser.Math.Vector2
    let targetName: string
    let targetSprite: any
    let targetPosition: Phaser.Math.Vector2

    if (getComponentValue(components.Type, sender?.entity?.index)?.value === EntityType.HQSHIP) {
      senderName = senderOwner?.name
      senderSprite = gameStore.getState().spaceships.get(id)?.shipImg
      senderPosition = gameStore.getState().spaceships.get(id)?.getPosition()
    } else {
      senderName = generatePlanetName(BigInt(id))
      senderSprite = gameStore.getState().planets.get(id)
      senderPosition = senderSprite?.getCenter()
    }

    if (getComponentValue(components.Type, target?.entity?.index)?.value === EntityType.HQSHIP) {
      targetName = targetOwner?.name
      targetSprite = gameStore.getState().spaceships.get(targetId)?.shipImg
      targetPosition = gameStore.getState().spaceships.get(targetId)?.getPosition()
    } else {
      targetName = generatePlanetName(BigInt(targetId))
      targetSprite = gameStore.getState().planets.get(targetId)
      targetPosition = targetSprite?.getCenter()
    }

    return {
      senderName,
      senderSprite,
      senderPosition,
      targetName,
      targetSprite,
      targetPosition,
    }
  }, [id, sender?.entity?.index, targetId, target?.entity?.index, senderOwner?.name, targetOwner?.name])

  const distance = useMemo(
    () =>
      Math.floor(
        Phaser.Math.Distance.BetweenPoints(
          senderPosition ?? Phaser.Math.Vector2.ZERO,
          targetPosition ?? Phaser.Math.Vector2.ZERO,
        ) / 16,
      ),
    [senderPosition, targetPosition],
  )

  const isInitiliazed = useMemo(() => target?.entity?.owner !== undefined, [target?.entity?.owner])

  const energyCost = useMemo(() => {
    return (
      sendEnergyCost(
        distance,
        _.sum([...Object.entries(sentResources)].map((e) => Math.floor((senderResources[e[0]] * e[1]) / 100))),
      ) + Math.floor((sentEnergy * senderEnergy) / 100)
    )
  }, [distance, sentResources, senderResources, sentEnergy, senderEnergy])

  const [isSending, setSending] = useState(false)
  const send = useCallback(async () => {
    try {
      setSending(true)
      await api.send(id, targetId, distance, [
        ...(sentEnergy > 0
          ? [
              {
                id: ENERGY_ID,
                amount: Math.floor((sentEnergy * senderEnergy) / 100),
              },
            ]
          : []),
        ...[...Object.entries(sentResources)].map((e) => ({
          id: e[0],
          amount: Math.floor((senderResources[e[0]] * e[1]) / 100),
        })),
      ])
    } finally {
      setSending(false)
    }
  }, [id, targetId, distance, sentEnergy, senderEnergy, sentResources, senderResources])

  if (!sender?.entity || !target?.entity) return <></>

  return (
    <Draggable
      cancel=".inner-send-modal"
      defaultPosition={{
        x: position.x,
        y: position.y,
      }}
    >
      <Box
        position="absolute"
        sx={{
          color: theme.palette.grayScale.white,
          backgroundImage: 'none',
          backgroundColor: theme.palette.grayScale.soBlack,
          width: 300,
          borderRadius: 2,
          px: 0,
          py: 1,
        }}
      >
        <Stack
          sx={{
            px: 1,
            py: 0.5,
          }}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation()
            e.preventDefault()
          }}
          spacing={1}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: 'center',
            }}
          >
            <GameItem imageUrl="/assets/svg/transfer-icon.svg" />
            <Typography sx={{ fontSize: 24, fontWeight: 700, fontFamily: 'VT323', flex: 1 }}>
              Interstellar Transport
            </Typography>
            <CloseModalButton onClick={() => closeSendModal(id)} />
          </Stack>
          <Stack spacing={1} className="inner-send-modal">
            <Stack
              spacing={1}
              direction="row"
              p={1}
              sx={{
                backgroundColor: theme.palette.grayScale.black,
                borderRadius: '8px',
              }}
            >
              <Stack alignItems="center" justifyContent="center">
                <img src="/assets/svg/sending.svg" width={12} draggable={false} />
              </Stack>
              <Stack spacing={1} flex={1}>
                <SpriteEntry
                  sprite={senderSprite}
                  name={senderName}
                  position={{
                    x: Math.floor(senderPosition?.x / TILE_SIZE),
                    y: Math.floor(senderPosition?.y / TILE_SIZE),
                  }}
                  faction={senderOwner?.faction}
                  onClick={() => focusLocation(senderPosition)}
                />
                <SpriteEntry
                  sprite={targetSprite}
                  name={targetName}
                  position={{
                    x: Math.floor(targetPosition?.x / TILE_SIZE),
                    y: Math.floor(targetPosition?.y / TILE_SIZE),
                  }}
                  faction={targetOwner?.faction}
                  onClick={() => focusLocation(targetPosition)}
                />
              </Stack>
            </Stack>
            {!isInitiliazed ? (
              <WarningBox label={'This planet is still vacant'} />
            ) : (
              <>
                <Typography sx={{ fontSize: 14 }}>Sending Materials</Typography>
                <GameItemSlider
                  imageUrl="/assets/svg/item-energy-icon.svg"
                  name="Energy"
                  value={Math.floor((senderEnergy * sentEnergy) / 100)}
                  percent={sentEnergy}
                  badgeValue={senderEnergy}
                  onChangePercent={setSentEnergy}
                />
                {[...sender?.entity?.resources?.keys()]
                  .filter((e) => senderResources[e] > 0 && !target.uninitilizedResources.includes(e))
                  .map((e) => {
                    return (
                      <GameItemSlider
                        key={e}
                        imageUrl={MATERIALS[e].imageUrl}
                        name={MATERIALS[e].name}
                        value={Math.floor(((sentResources[e] ?? 0) * senderResources[e]) / 100)}
                        percent={sentResources[e] ?? 0}
                        badgeValue={senderResources[e]}
                        onChangePercent={(v) => setSentResources((rs) => ({ ...rs, [e]: v }))}
                      />
                    )
                  })}
                <Typography sx={{ fontSize: 14 }}>Resource Estimation</Typography>
                <Stack direction="row" gap={1}>
                  <InfoTab
                    iconSrc="/assets/svg/item-energy-icon.svg"
                    title={
                      <>
                        <span
                          style={{
                            color: energyCost > senderEnergy && theme.palette.error.main,
                          }}
                        >
                          {energyCost}
                        </span>
                        /{senderEnergy}
                      </>
                    }
                  />
                  <InfoTab iconSrc="/assets/svg/distance-icon.svg" title={`${distance} m`} />
                </Stack>
                {energyCost > senderEnergy && <WarningBox label="Insufficient energy to transport." />}
                <Stack alignItems="center">
                  <MainButton onClick={send} disabled={isSending || energyCost > senderEnergy}>
                    Send
                  </MainButton>
                </Stack>
              </>
            )}
          </Stack>
        </Stack>
      </Box>
    </Draggable>
  )
}
