import { Box, Stack, Typography, useTheme } from '@mui/material'

export const TribeButton = ({
  name,
  imgUrl,
  color,
  isSelected = false,
  onClick,
}: {
  name: string
  imgUrl: string
  color: string
  isSelected?: boolean
  onClick: () => void
}) => {
  const theme = useTheme()

  return (
    <Stack spacing={10} alignItems="center" onClick={onClick} sx={{ cursor: 'pointer' }}>
      <Box
        sx={{
          width: 150,
          height: 150,
          borderRadius: 1,
          border: '4px solid #CED4DA',
          background: theme.palette.secondary.main,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          filter: isSelected ? 'none' : 'grayscale(100%)',
          boxShadow: isSelected ? `0px 0px 15px 10px ${color}` : 'none',
          transition: 'box-shadow .2s, filter .2s',
          '&:hover': {
            boxShadow: isSelected ? `0px 0px 15px 10px ${color}` : '0px 0px 15px 4px rgba(255,255,255,0.75)',
            filter: 'none',
          },
        }}
      >
        <Box component="img" src={imgUrl} />
      </Box>
      <Typography
        variant="h3"
        color="textPrimary"
        sx={{
          fontSize: 24,
          fontWeight: 700,
          opacity: isSelected ? 1 : 0.6,
        }}
      >
        {name}
      </Typography>
    </Stack>
  )
}
