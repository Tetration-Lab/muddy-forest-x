import { useTheme } from '@mui/material/styles'
import { Box, SxProps } from '@mui/system'
import { ItemVisibility } from '../ActionBox/GameActionBox/types'

export const GameItem = ({
  imageUrl,
  active = false,
  onClick,
  visibility = ItemVisibility.Visible,
  withBadge = false,
  withBlueprintBg = false,
  small = false,
  sx,
}: {
  imageUrl: string
  active?: boolean
  onClick?: () => void
  visibility?: ItemVisibility
  withBadge?: boolean
  withBlueprintBg?: boolean
  small?: boolean
  sx?: SxProps
}) => {
  const theme = useTheme()

  const smallBlueprintBg = `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='4' ry='4' stroke='%23C9E4FF' stroke-width='2.5' stroke-dasharray='12%2c6' stroke-dashoffset='8.5' stroke-linecap='butt'/%3e%3c/svg%3e");`
  const normalBlueprintBg = `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='10' ry='10' stroke='%23C9E4FF' stroke-width='5' stroke-dasharray='28%2c12' stroke-dashoffset='22.5' stroke-linecap='butt'/%3e%3c/svg%3e");`
  return (
    <Box
      onClick={onClick}
      sx={{
        flexShrink: 0,
        width: small ? 24 : 48,
        height: small ? 24 : 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: active ? theme.palette.grayScale.black : theme.palette.grayScale.almostBlack,
        border: `2px solid ${active ? theme.palette.grayScale.white : theme.palette.grayScale.black}`,
        borderRadius: small ? '8px' : '12px',
        cursor: onClick ? 'pointer' : 'default',
        opacity: visibility === ItemVisibility.Visible ? 1 : 0.5,
        position: 'relative',
        // boxSizing: 'border-box',
        ...(withBlueprintBg && {
          backgroundImage: 'url(/assets/svg/blueprint-item-bg.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          '&::after': {
            content: '""',
            backgroundImage: small ? smallBlueprintBg : normalBlueprintBg,
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            borderRadius: small ? '4px' : '10px',
          },
        }),
        ...sx,
      }}
    >
      <Box component="img" src={imageUrl} alt={imageUrl} sx={{ width: 32, height: 32 }} />
      {withBadge && (
        <Box
          sx={{
            backgroundColor: theme.palette.error.main,
            width: '4px',
            height: '4px',
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        />
      )}
    </Box>
  )
}
