import { Box, ButtonBase, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { FaCheck } from 'react-icons/fa'

export const FilterButton = ({
  text,
  active = false,
  onClick,
}: {
  text: string
  active?: boolean
  onClick: () => void
}) => {
  const theme = useTheme()

  return (
    <ButtonBase
      sx={{
        border: `1px solid ${active ? 'transparent' : theme.palette.grayScale.white}`,
        borderRadius: '4px',
        height: 24,
        px: 1,
        backgroundColor: active ? theme.palette.grayScale.almostDarkGray : 'transparent',
        transition: 'background-color .2s',
      }}
      onClick={onClick}
    >
      <Stack direction="row" alignItems="center">
        {active && <Box component={FaCheck} sx={{ fontSize: 12, mr: 1 }} />}
        <Typography variant="caption">{text}</Typography>
      </Stack>
    </ButtonBase>
  )
}
