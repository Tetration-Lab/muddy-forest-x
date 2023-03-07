import { Typography, useTheme } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { closeSendResourceModal } from '../../../store/game'
import { CloseModalButton } from '../common/CloseModalButton'
import { GameItem } from '../common/GameItem'
import { SaveButton } from '../common/SaveButton'
import { TypeTag } from '../GameActionBox/TypeTag'
import Draggable from 'react-draggable'
import { generatePlanetName } from '../../../utils/random'
import { useMemo } from 'react'

export const SendResourceModal = ({ id, position }: { id: string; position: Phaser.Math.Vector2 }) => {
  const theme = useTheme()
  const name = useMemo(() => generatePlanetName(BigInt(id)), [id])

  return (
    <Draggable
      bounds="body"
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
          p: 1,
          borderRadius: 2,
          px: 0,
          py: 0,
        }}
      >
        <Stack
          spacing={1}
          sx={{
            px: 1,
            py: 0.5,
          }}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              alignItems: 'center',
            }}
          >
            <GameItem imageUrl={''} />
            <Stack mt="12px" px={2} alignItems="flex-start" flex={1}>
              <Typography sx={{ fontSize: 16, fontWeight: 700, wordBreak: 'break-all' }}>{name}</Typography>
              <TypeTag type="RESOURCE" />
            </Stack>
            <CloseModalButton onClick={() => closeSendResourceModal(id)} />
          </Stack>
          <Stack>
            <Stack direction="row" gap={1}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ height: 36, backgroundColor: theme.palette.grayScale.black, borderRadius: '4px' }}
                alignItems="center"
                flex={1}
              >
                <Box component="img" src="/assets/svg/planet-prop-energy.svg" />
                <Typography>{`100 / 200`}</Typography>
              </Stack>
              <Stack
                direction="row"
                spacing={1}
                sx={{ height: 36, backgroundColor: theme.palette.grayScale.black, borderRadius: '4px' }}
                alignItems="center"
                flex={1}
              >
                <Box component="img" src="/assets/svg/planet-prop-location.svg" />
                <Typography>{`15,255`}</Typography>
                <SaveButton onClick={() => console.log('save!')} />
              </Stack>
            </Stack>
          </Stack>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              px: 1,
              py: 0.5,
              border: `1px solid ${theme.palette.grayScale.white}`,
              borderRadius: '4px',
              heigh: '32px',
            }}
          >
            <Box component="img" src="/assets/svg/fraction-unknown.svg" />
            <Typography>-</Typography>
          </Box>
          <Stack sx={{ p: 1, backgroundColor: theme.palette.grayScale.black }} spacing={0.5}>
            <Typography sx={{ fontSize: 12, fontWeight: 400 }}>Stats</Typography>
            <Box sx={{ p: 1, backgroundColor: theme.palette.grayScale.almostBlack, borderRadius: '4px' }}>
              <Typography sx={{ fontWeight: 400, fontSize: 12, lineHeight: '14px' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
                Pellentesque sit amet sapien fringilla, mattis l
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Draggable>
  )
}
