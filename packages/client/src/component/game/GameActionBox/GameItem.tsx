import { useTheme } from '@mui/material/styles'
import { Box } from '@mui/system'
import { ItemVisibility } from './types'

export const GameItem = ({
  imageUrl,
  active = false,
  onClick,
  visibility = ItemVisibility.Visible,
}: {
  imageUrl: string
  active?: boolean
  onClick?: () => void
  visibility?: ItemVisibility
}) => {
  const theme = useTheme()
  return (
    <Box
      onClick={onClick}
      sx={{
        width: 48,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: active ? theme.palette.grayScale.black : theme.palette.grayScale.almostBlack,
        border: `2px solid ${active ? theme.palette.grayScale.white : theme.palette.grayScale.black}`,
        borderRadius: '12px',
        cursor: 'pointer',
        opacity: visibility === ItemVisibility.Visible ? 1 : 0.5,
      }}
    >
      <Box component="img" src={imageUrl} alt={imageUrl} sx={{ width: 32, height: 32 }} />
    </Box>
  )
}
