import { Stack, Typography, useTheme } from '@mui/material'
import { PHASER_HOTKEY, PHASER_REVERSE_KEYMAP } from '../../../../const/hotkey'
import { ToolButton } from '../../../ToolButton'
import { CloseModalButton } from '../../common/CloseModalButton'
import { KeyboardKey } from './KeyboardKey'

export interface Props {
  onClose: () => void
}
export const HotkeyActionBox = ({ onClose }: Props) => {
  const theme = useTheme()

  return (
    <Stack
      p={1}
      sx={{
        background: theme.palette.grayScale.soBlack,
        color: theme.palette.common.white,
        borderRadius: '8px',
        width: 310,
      }}
      spacing={1}
    >
      <div className="flex items-center justify-between">
        <Stack direction="row" alignItems="center">
          <ToolButton iconSrc="./assets/svg/hotkey-icon.svg" />
          <Typography px={2} sx={{ fontFamily: 'VT323', fontSize: 24 }}>
            Keyboard Shortcuts
          </Typography>
        </Stack>
        <CloseModalButton onClick={onClose} />
      </div>
      {Object.values(PHASER_HOTKEY).map((e, i) => (
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} key={i}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            {e.keys.map((e, i) => (
              <KeyboardKey key={i} label={PHASER_REVERSE_KEYMAP[e]} />
            ))}
          </Stack>
          <Typography sx={{ fontFamily: 'VT323', fontSize: 18 }}>{e.label}</Typography>
        </Stack>
      ))}
    </Stack>
  )
}
