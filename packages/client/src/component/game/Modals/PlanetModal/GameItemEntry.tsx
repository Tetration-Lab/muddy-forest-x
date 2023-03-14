import { Badge, Typography, useTheme } from '@mui/material'
import { Stack, SxProps } from '@mui/system'
import { GameItem } from '../../common/GameItem'

export interface GameItemEntryProps {
  iconUrl: string
  onClick?: () => void
  value?: string
  title: string
  description?: string
  sx?: SxProps
}

export const GameItemEntry = ({ iconUrl, onClick, value, title, description, sx }: GameItemEntryProps) => {
  const theme = useTheme()

  return (
    <Stack
      direction="row"
      spacing={1}
      p={0.5}
      sx={{
        borderRadius: '12px',
        backgroundColor: theme.palette.grayScale.darkGray,
        ...sx,
      }}
    >
      <Badge
        badgeContent={value}
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
        <GameItem imageUrl={iconUrl} sx={{ cursor: !onClick ? undefined : 'pointer' }} onClick={onClick} />
      </Badge>
      <Stack
        px={1}
        py={0.5}
        sx={{ backgroundColor: theme.palette.grayScale.almostBlack, flex: 1, borderRadius: '8px' }}
        justifyContent="center"
      >
        <Typography fontSize={14} color={theme.palette.grayScale.almostGray}>
          {title}
        </Typography>
        {description && (
          <Typography fontSize={12} color={theme.palette.grayScale.almostDarkGray}>
            {description}
          </Typography>
        )}
      </Stack>
    </Stack>
  )
}
