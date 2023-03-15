import { Stack, Typography } from '@mui/material'
import { FaExclamationCircle } from 'react-icons/fa'

export const WarningBox = ({ label }: { label: string }) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{ backgroundColor: 'rgba(214, 67, 47, 0.2)', borderRadius: '4px' }}
      spacing={1}
      p={1}
    >
      <FaExclamationCircle size={28} color="#D6432F" />
      <Typography fontSize={12}>{label}</Typography>
    </Stack>
  )
}
