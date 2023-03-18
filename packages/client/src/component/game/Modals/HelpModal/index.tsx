import { Box, Modal, Typography, useTheme } from '@mui/material'
import { Stack } from '@mui/system'
import { useStore } from 'zustand'
import { BASIC_HELP } from '../../../../const/help'
import { closeHelpModal, gameStore, openHelpModal } from '../../../../store/game'
import { CloseModalButton } from '../../common/CloseModalButton'
import { GameItem } from '../../common/GameItem'

export const HelpModal = () => {
  const h = useStore(gameStore, (state) => state.helpModal)
  const theme = useTheme()

  return (
    <Modal
      open={h !== undefined}
      onClose={closeHelpModal}
      disableAutoFocus
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Stack
        p={2}
        sx={{
          backgroundColor: theme.palette.grayScale.soBlack,
          borderRadius: '8px',
          width: 800,
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
          <GameItem imageUrl="/assets/svg/lightbulb-icon.svg" />
          <Typography sx={{ fontSize: 24, fontWeight: 700, fontFamily: 'VT323', flex: 1 }}>Help</Typography>
          <CloseModalButton onClick={closeHelpModal} />
        </Stack>
        <Stack direction="row" spacing={2}>
          <Stack flex={1} spacing={1}>
            <Typography variant="body2">Basic Systems</Typography>
            {BASIC_HELP.map((e, i) => (
              <Stack
                key={e.title}
                direction="row"
                spacing={1}
                p={0.5}
                onClick={() => openHelpModal(i)}
                sx={{
                  alignItems: 'center',
                  borderRadius: '8px',
                  backgroundColor: theme.palette.grayScale.black,
                  outline: h === i ? `1px solid ${theme.palette.grayScale.white}` : 'none',
                  cursor: 'pointer',
                }}
              >
                <GameItem imageUrl={e.logo} />
                <Typography sx={{ fontFamily: 'VT323', fontSize: 22 }}>{e.title}</Typography>
              </Stack>
            ))}
          </Stack>
          <Stack flex={2.5} spacing={1}>
            {BASIC_HELP[h] && (
              <>
                <Box component="img" src={BASIC_HELP[h].description.image} />
                <Stack spacing={1} p={2} sx={{ backgroundColor: theme.palette.grayScale.black, borderRadius: '8px' }}>
                  <Typography sx={{ fontFamily: 'VT323', fontSize: 22, lineHeight: 1 }}>
                    {BASIC_HELP[h].title}
                  </Typography>
                  <Typography variant="body2" textAlign="justify">
                    {BASIC_HELP[h].description.text[0]}
                  </Typography>
                </Stack>
              </>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Modal>
  )
}
