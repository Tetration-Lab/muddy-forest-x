import { Typography, useTheme } from '@mui/material'
import { Stack } from '@mui/system'
import { GameItem } from '../game/common/GameItem'

export interface ToolButtonProps {
  onClick?: () => void
  title?: string
  iconSrc: string
}

export const ToolButton: React.FC<ToolButtonProps> = ({ title, iconSrc, onClick }) => {
  const theme = useTheme()
  return (
    <Stack alignItems="center">
      <GameItem imageUrl={iconSrc} onClick={onClick} />
      <Typography sx={{ color: theme.palette.grayScale.white, fontSize: 12 }}>{title}</Typography>
    </Stack>
  )
}
