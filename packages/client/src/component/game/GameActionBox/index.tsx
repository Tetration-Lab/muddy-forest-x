import { Box, Stack, Typography, useTheme } from '@mui/material'
import { ToolButton } from '../../ToolButton'
import { BuildBox } from './BuildBox'
import { DiscoveryBox } from './DiscoveryBox'
import { InventoryBox } from './InventoryBox'
import { ResearchBox } from './ResearchBox'

export enum GameActionBoxMode {
  Discovery = 'discovery',
  Research = 'research',
  Inventory = 'inventory',
  Build = 'build',
}

const ToolButtonWithText = ({
  iconSrc,
  onClick,
  text = '',
  showText = false,
}: {
  iconSrc: string
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
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
}: {
  mode: GameActionBoxMode
  onChangeMode: (mode: GameActionBoxMode) => void
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

        <ToolButtonWithText
          iconSrc="./assets/svg/build-icon-2.svg"
          onClick={() => onChangeMode(GameActionBoxMode.Build)}
          text="Build"
          showText={mode === GameActionBoxMode.Build}
        />
      </Stack>
      <Box mt={1} sx={{ width: '100%', flex: 1 }}>
        {mode === GameActionBoxMode.Inventory && <InventoryBox />}
        {mode === GameActionBoxMode.Research && <ResearchBox />}
        {mode === GameActionBoxMode.Discovery && <DiscoveryBox />}
        {mode === GameActionBoxMode.Build && <BuildBox />}
      </Box>
    </Stack>
  )
}
