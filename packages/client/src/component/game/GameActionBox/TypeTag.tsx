import { Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Box } from '@mui/system'

export const TypeTag = ({ type }: { type: string }) => {
  const theme = useTheme()
  return (
    <Box sx={{ borderRadius: '4px', backgroundColor: theme.palette.common.green }}>
      <Typography sx={{ fontSize: '12px', fontWeight: 500, px: '4px', py: '2px' }}>{type.toUpperCase()}</Typography>
    </Box>
  )
}
