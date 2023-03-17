import { Box, LinearProgress, Stack, Typography, useTheme } from '@mui/material'

export interface LoadingProps {
  msg?: string
  percentage?: number
}
export const Loading = ({ msg, percentage }: LoadingProps) => {
  const theme = useTheme()
  return (
    <Stack sx={{ alignItems: 'center', justifyContent: 'center', height: '100%' }} spacing={1}>
      <div className="absolute w-full h-full z-10 flex justify-center items-center flex-col">
        <Box py={1} component="img" src="/assets/loading.gif" sx={{ height: '120px' }} />
        <Typography sx={{ fontFamily: 'VT323', fontSize: 32, lineHeight: 1 }}>Loading...</Typography>
        <LinearProgress
          sx={{
            width: 220,
            height: 8,
            color: theme.palette.grayScale.white,
            borderRadius: 12,
            border: '1px solid #fff',
          }}
          color="inherit"
          variant="determinate"
          value={percentage}
        />
        <Typography sx={{ fontSize: 14, color: theme.palette.grayScale.almostGray }}>{msg}</Typography>
      </div>
      <div className="absolute w-full h-full z-0 bg-[url('/assets/bg/Star_background.png')] animate-spin-slow"></div>
    </Stack>
  )
}
