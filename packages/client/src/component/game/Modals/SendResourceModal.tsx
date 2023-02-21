import { Popover, Typography, useTheme } from '@mui/material'
import { Stack } from '@mui/system'
import { useStore } from 'zustand'
import { gameStore as GameStore } from '../../../store/game'
import { CloseModalButton } from '../common/CloseModalButton'
import { GameItem } from '../common/GameItem'
import { TypeTag } from '../GameActionBox/TypeTag'

export const SendResourceModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const theme = useTheme()
  const gameStore = useStore(GameStore, (state) => state)

  return (
    <Popover
      transitionDuration={0}
      anchorReference="anchorPosition"
      anchorPosition={{ top: 200, left: 400 }}
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
          minWidth: 282,
          p: 1,
          borderRadius: 2,
          px: 0,
          py: 0,
        },
      }}
    >
      <Stack>
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            borderRadius: '4px',
            px: 1,
            py: 0.5,
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
      </Stack>
    </Popover>
  )
}
