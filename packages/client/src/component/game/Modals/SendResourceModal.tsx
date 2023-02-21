import { Popover, Typography, useTheme } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { useStore } from 'zustand'
import { gameStore as GameStore } from '../../../store/game'
import { CloseModalButton } from '../common/CloseModalButton'
import { GameItem } from '../common/GameItem'
import { SaveButton } from '../common/SaveButton'
import { TypeTag } from '../GameActionBox/TypeTag'

export const SendResourceModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const theme = useTheme()
  const gameStore = useStore(GameStore, (state) => state)

  return (
    <Popover
      transitionDuration={0}
      anchorReference="anchorPosition"
      anchorPosition={{
        top: gameStore.sendResourceModal.data?.mouseScreenY,
        left: gameStore.sendResourceModal.data?.mouseScreenX,
      }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundImage: 'none',
          backgroundColor: theme.palette.grayScale.soBlack,
          width: 300,
          p: 1,
          borderRadius: 2,
          px: 0,
          py: 0,
        },
      }}
    >
      <Stack
        spacing={1}
        sx={{
          px: 1,
          py: 0.5,
        }}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          console.log('click!')
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
          <GameItem imageUrl={gameStore.sendResourceModal.data?.imageSrc} />
          <Stack mt="12px" px={2} alignItems="flex-start" flex={1}>
            <Typography sx={{ fontSize: 16, fontWeight: 700 }}>{gameStore.sendResourceModal.data?.name}</Typography>
            <TypeTag type="RESOURCE" />
          </Stack>
          <CloseModalButton onClick={onClose} />
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
    </Popover>
  )
}
