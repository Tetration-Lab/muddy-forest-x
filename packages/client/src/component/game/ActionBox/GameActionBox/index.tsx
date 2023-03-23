import { Box, Stack, Typography, useTheme } from '@mui/material'
import { ToolButton } from '../../../ToolButton'
import { BuildBox } from './BuildBox'
import { DiscoveryBox } from './DiscoveryBox'
import { InventoryBox } from './InventoryBox'
import { ResearchBox } from './ResearchBox'
import { CloseModalButton } from '../../common/CloseModalButton'

export enum GameActionBoxMode {
  Discovery = 'discovery',
  Research = 'research',
  Inventory = 'inventory',
}

const ToolButtonWithText = ({
  iconSrc,
  onClick,
  text = '',
  showText = false,
}: {
  iconSrc: string
  onClick?: () => void
  text?: string
  showText?: boolean
}) => {
  const theme = useTheme()

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        backgroundColor: theme.palette.grayScale.black,
        borderRadius: 2,
      }}
    >
      <ToolButton iconSrc={iconSrc} onClick={onClick} />
      {showText && text && (
        <Typography px={2} sx={{ fontFamily: 'VT323', fontSize: 28 }}>
          {text}
        </Typography>
      )}
    </Stack>
  )
}

export const GameActionBox = ({
  mode,
  onChangeMode,
  onClose,
}: {
  mode: GameActionBoxMode
  onChangeMode: (mode: GameActionBoxMode) => void
  onClose: () => void
}) => {
  const theme = useTheme()

  return (
    <Stack
      p={2}
      sx={{
        background: theme.palette.grayScale.soBlack,
        color: theme.palette.common.white,
        borderRadius: '12px',
        width: 704,
        height: 464,
      }}
    >
      <div className="flex justify-between items-center">
        <Stack direction="row" spacing="10px">
          <ToolButtonWithText
            iconSrc="./assets/svg/inventory-icon-2.svg"
            onClick={() => onChangeMode(GameActionBoxMode.Inventory)}
            text="Inventory"
            showText={mode === GameActionBoxMode.Inventory}
          />
          <ToolButtonWithText
            iconSrc="./assets/svg/research-icon-2.svg"
            onClick={() => onChangeMode(GameActionBoxMode.Research)}
            text="Research"
            showText={mode === GameActionBoxMode.Research}
          />
          <ToolButtonWithText
            iconSrc="./assets/svg/discovery-icon.svg"
            onClick={() => onChangeMode(GameActionBoxMode.Discovery)}
            text="Discovery"
            showText={mode === GameActionBoxMode.Discovery}
          />
        </Stack>
        <div>
          <CloseModalButton onClick={() => onClose()} />
        </div>
      </div>
      <Box mt={1} sx={{ width: '100%', flex: 1, position: 'relative' }}>
        {mode === GameActionBoxMode.Inventory && <InventoryBox />}
        {mode === GameActionBoxMode.Research && <ResearchBox />}
        {mode === GameActionBoxMode.Discovery && <DiscoveryBox />}
        <Stack
          sx={{
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backgroundColor: theme.palette.grayScale.black,
              opacity: 0.7,
            }}
          />
          <Typography sx={{ position: 'absolute', fontSize: 22 }}>Coming Soon...</Typography>
        </Stack>
      </Box>
    </Stack>
  )
}
