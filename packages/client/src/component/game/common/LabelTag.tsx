import { Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Box, SxProps } from '@mui/system'

export const GenericTag = ({
  color,
  value,
  textColor,
  sx,
}: {
  color: string
  value: string
  textColor?: string
  sx?: SxProps
}) => {
  return (
    <Box sx={{ borderRadius: '4px', backgroundColor: color, ...sx }}>
      <Typography sx={{ fontSize: '12px', fontWeight: 500, px: '3px', py: '1px', color: textColor }}>
        {value}
      </Typography>
    </Box>
  )
}

export const TypeTag = ({ type }: { type: string }) => {
  const theme = useTheme()
  return (
    <Box sx={{ borderRadius: '4px', backgroundColor: theme.palette.common.green, width: 'fit-content' }}>
      <Typography sx={{ fontSize: '12px', fontWeight: 500, px: '3px', py: '1px' }}>{type.toUpperCase()}</Typography>
    </Box>
  )
}

export const LevelTag = ({ level }: { level: number }) => {
  const theme = useTheme()
  return (
    <Box sx={{ borderRadius: '4px', backgroundColor: theme.palette.common.gold }}>
      <Typography
        sx={{ fontSize: '12px', fontWeight: 500, px: '3px', py: '1px', color: theme.palette.grayScale.black }}
      >{`Lv.${level}`}</Typography>
    </Box>
  )
}
