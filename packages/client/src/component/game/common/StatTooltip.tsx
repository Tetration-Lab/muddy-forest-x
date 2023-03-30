import { Icon, Tooltip, useTheme } from '@mui/material'
import { ReactNode } from 'react'
import { FaInfoCircle } from 'react-icons/fa'

export const DefenseStatTooltip = () => {
  const theme = useTheme()

  return (
    <StatTooltip
      description={
        <>
          Defense can reduce attacker damage. The greater the defense, the{' '}
          <span
            style={{
              color: theme.palette.success.main,
            }}
          >
            lesser the energy
          </span>{' '}
          will be received from attack!
        </>
      }
    />
  )
}

export const AttackStatTooltip = () => {
  const theme = useTheme()

  return (
    <StatTooltip
      description={
        <>
          Attack refers to how powerful a planet/spaceship is. The greater the attack, the{' '}
          <span
            style={{
              color: theme.palette.error.main,
            }}
          >
            greater the energy
          </span>{' '}
          will be sent from attack!
        </>
      }
    />
  )
}

export const StatTooltip = ({ description }: { description: ReactNode }) => {
  const theme = useTheme()

  return (
    <Tooltip title={description} placement="bottom">
      <span>
        <FaInfoCircle size={12} color={theme.palette.grayScale.almostDarkGray} />
      </span>
    </Tooltip>
  )
}
