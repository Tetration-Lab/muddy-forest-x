import { Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { MainButton } from './MainButton'

export const NavBar = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        py: 2,
      }}
    >
      <Link to="/">
        <Box
          component="img"
          src="/assets/svg/logo.svg"
          sx={{
            height: '48px',
          }}
        />
      </Link>
    </Box>
  )
}
