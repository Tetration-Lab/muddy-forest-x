import { Stack, SxProps, Typography } from '@mui/material'
import { FaChevronRight } from 'react-icons/fa'
import { MainButton } from '../../component/common/MainButton'

export const NextButton = ({
  sx,
  onClick,
  disabled = false,
}: {
  sx?: SxProps
  onClick?: () => void
  disabled?: boolean
}) => {
  return (
    <MainButton sx={{ alignSelf: 'center', height: 48, ...sx }} onClick={onClick} disabled={disabled}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>Next</Typography> <FaChevronRight />
      </Stack>
    </MainButton>
  )
}
