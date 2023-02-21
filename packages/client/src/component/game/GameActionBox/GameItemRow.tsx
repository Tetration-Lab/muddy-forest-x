import { Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { GameItem } from './GameItem'
import { useTheme } from '@mui/material/styles'

export const GameItemRow = ({
  imageUrl,
  name,
  num1,
  num2,
  withBlueprintBg = false,
}: {
  imageUrl: string
  name: string
  num1: number
  num2: number
  withBlueprintBg?: boolean
}) => {
  const theme = useTheme()

  return (
    <Stack
      sx={{
        px: 2,
        py: 0.5,
        backgroundColor: theme.palette.grayScale.almostBlack,
        borderRadius: 2,
      }}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Stack direction="row">
        <GameItem small imageUrl={imageUrl} withBlueprintBg={withBlueprintBg} />
        <Typography
          sx={{
            fontFamily: 'VT323',
            fontWeight: 400,
            fontSize: 16,
          }}
        >
          {name}
        </Typography>
      </Stack>
      <Typography
        sx={{
          fontFamily: 'VT323',
          fontWeight: 400,
          fontSize: 16,
        }}
      >
        {`${num1} / ${num2}`}
      </Typography>
    </Stack>
  )
}
