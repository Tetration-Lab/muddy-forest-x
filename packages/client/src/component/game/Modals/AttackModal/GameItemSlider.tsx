import { Badge, Slider, Stack, Typography, useTheme } from '@mui/material'
import { GameItem } from '../../common/GameItem'

export interface GameItemSliderProps {
  imageUrl: string
  name?: string
  value: React.ReactNode
  badgeValue?: number
  percent: number
  onChangePercent: (value: number) => void
}

export const GameItemSlider = ({
  imageUrl,
  name,
  value,
  percent,
  onChangePercent,
  badgeValue,
}: GameItemSliderProps) => {
  const theme = useTheme()
  return (
    <Stack
      direction="row"
      spacing={1}
      p={0.5}
      sx={{ backgroundColor: theme.palette.grayScale.black, borderRadius: '8px' }}
    >
      <Badge
        badgeContent={badgeValue}
        max={999999999}
        color="primary"
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        sx={{
          '& .MuiBadge-badge': {
            backgroundColor: theme.palette.grayScale.black,
            bottom: 4,
            right: 4,
          },
        }}
      >
        <GameItem imageUrl={imageUrl} />
      </Badge>
      <Stack flex={1} justifyContent="center" alignItems="space-between">
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="end">
          {name && <Typography sx={{ fontSize: 14, flex: 1 }}>{name}</Typography>}
          <Typography sx={{ fontSize: 14 }}>{value}</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center" width="100%">
          <Typography sx={{ fontSize: 14, color: theme.palette.grayScale.almostGray }}>0%</Typography>
          <Slider
            aria-label="energy-used"
            value={percent}
            valueLabelDisplay="auto"
            onChange={(_, value) => onChangePercent(value as number)}
            size="small"
            sx={{ color: theme.palette.grayScale.white, p: 0 }}
          />
          <Typography sx={{ fontSize: 14, color: theme.palette.grayScale.almostGray }}>100%</Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}
