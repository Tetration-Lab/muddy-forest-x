import { Badge, Typography, useTheme } from '@mui/material'
import { Stack, SxProps } from '@mui/system'
import { ReactNode } from 'react'
import { GameItem } from '../../common/GameItem'

export interface GameItemEntryProps {
  iconUrl: string
  onClick?: () => void
  value?: string
  title: string
  description?: ReactNode
  sx?: SxProps
  suffix?: ReactNode
}

export const GameItemEntry = ({ iconUrl, onClick, value, title, description, sx, suffix }: GameItemEntryProps) => {
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
        direction="row"
        px={1}
        py={0.5}
        sx={{ backgroundColor: theme.palette.grayScale.almostBlack, flex: 1, borderRadius: '8px' }}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack flex={1}>
          <Typography fontSize={14} color={theme.palette.grayScale.almostGray}>
            {title}
          </Typography>
          {description && typeof description === 'string' ? (
            <Typography fontSize={12} color={theme.palette.grayScale.almostDarkGray}>
              {description}
            </Typography>
          ) : (
            description
          )}
        </Stack>
        {suffix}
      </Stack>
    </Stack>
  )
}
