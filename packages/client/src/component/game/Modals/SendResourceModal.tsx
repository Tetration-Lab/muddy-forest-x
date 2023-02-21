import { Dialog, Typography, useTheme } from '@mui/material'
import { Stack } from '@mui/system'
import { CloseModalButton } from '../common/CloseModalButton'
import { GameItem } from '../common/GameItem'
import { TypeTag } from '../GameActionBox/TypeTag'

export const SendResourceModal = ({ open }: { open: boolean }) => {
  const theme = useTheme()

  return (
    <Dialog
      open={open}
      PaperProps={{
        sx: {
          backgroundImage: 'none',
          backgroundColor: theme.palette.grayScale.soBlack,
          minWidth: 282,
          p: 1,
          borderRadius: 2,
        },
      }}
    >
      <Stack>
        <Stack
          sx={{
            borderRadius: '4px',
            px: 1,
            py: 0.5,
            alignItems: 'center',
          }}
          direction="row"
          spacing={1}
        >
          <GameItem imageUrl="/assets/empty-build.png" />
          <Stack mt="12px" px={2} alignItems="flex-start" spacing="4px" flex={1}>
            <Typography sx={{ fontSize: 16, fontWeight: 700 }}>Lorem ipsum.</Typography>
            <TypeTag type="RESOURCE" />
            <CloseModalButton />
          </Stack>
        </Stack>
      </Stack>
    </Dialog>
  )
}
