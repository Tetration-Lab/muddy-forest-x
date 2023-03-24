import { Icon, Stack, Typography, useTheme } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect } from 'react'
import { useNumber } from 'react-hanger'
import { FaCheckCircle } from 'react-icons/fa'
import { MainButton } from '../../component/common/MainButton'
import { GameItem } from '../../component/game/common/GameItem'
import { BASIC_HELP } from '../../const/help'

export const OnboardingHelp = ({ goToNextStep }: { goToNextStep: () => void }) => {
  const theme = useTheme()
  const currentStep = useNumber(0)

  const next = () => {
    if (currentStep.value + 1 === BASIC_HELP.length) {
      goToNextStep()
    } else {
      currentStep.increase(1)
    }
  }

  return (
    <>
      <Typography variant="body2">
        Before start, if you never play Muddy Forest before. This is some basic tips for you.
      </Typography>
      <Stack
        p={2}
        spacing={1}
        sx={{
          width: 750,
          backgroundColor: theme.palette.grayScale.soBlack,
          borderRadius: '8px',
        }}
      >
        <Typography variant="body2">Basic Systems</Typography>
        <Stack direction="row" spacing={1}>
          {BASIC_HELP.map((help, index) => (
            <Stack
              key={index}
              direction="row"
              spacing={1}
              sx={{
                flex: 1,
                alignItems: 'center',
                borderRadius: '8px',
                border: currentStep.value === index && `1px solid ${theme.palette.grayScale.white}`,
                backgroundColor: theme.palette.grayScale.black,
              }}
            >
              <GameItem imageUrl={help.logo} />
              <Typography
                noWrap
                variant="body2"
                sx={{
                  width: 75,
                  maxLines: 1,
                  textOverflow: 'ellipsis',
                  wordBreak: 'break-all',
                  fontFamily: 'VT323',
                  fontSize: 20,
                }}
              >
                {help.title}
              </Typography>
              <Icon
                component={FaCheckCircle}
                sx={{
                  height: 16,
                  color: currentStep.value > index ? theme.palette.success.main : 'transparent',
                }}
              />
            </Stack>
          ))}
        </Stack>
        <Stack alignItems="center">
          <Box
            component="img"
            src={BASIC_HELP[currentStep.value].description.src}
            width={500}
            sx={{
              width: 500,
              borderRadius: '8px',
            }}
          />
        </Stack>
        <Stack
          spacing={2}
          sx={{
            p: 2,
            borderRadius: '4px',
            backgroundColor: theme.palette.grayScale.black,
          }}
        >
          <Typography
            sx={{
              fontFamily: 'VT323',
              fontSize: 24,
              lineHeight: 1,
            }}
          >
            {BASIC_HELP[currentStep.value].title}
          </Typography>
          <Typography
            sx={{
              textAlign: 'justify',
              fontSize: 12,
            }}
          >
            {BASIC_HELP[currentStep.value].description.text[0]}
          </Typography>
        </Stack>
      </Stack>
      <Stack direction="row" spacing={1} justifyContent="center">
        <MainButton variant="outlined" onClick={goToNextStep}>
          Skip
        </MainButton>
        <MainButton onClick={next}>Next</MainButton>
      </Stack>
    </>
  )
}
