import { Stack } from '@mui/system'
import { useTheme } from '@mui/material/styles'

export const BuildBox = () => {
  const theme = useTheme()

  return (
    <Stack direction="row" spacing={2} width="100%" height="100%">
      <Stack
        sx={{
          borderRadius: '4px',
          border: `2px solid ${theme.palette.common.black}`,
          flex: 6,
          flexGrow: 'none',
          backgroundColor: theme.palette.grayScale.black,
        }}
      ></Stack>
      <Stack
        sx={{
          borderRadius: '4px',
          border: `2px solid ${theme.palette.common.black}`,
          flex: 4,
          backgroundColor: theme.palette.grayScale.black,
        }}
      ></Stack>
    </Stack>
  )
}
