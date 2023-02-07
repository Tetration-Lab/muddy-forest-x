import { Box, keyframes, Stack, Typography, useTheme } from '@mui/material'
import { Container } from '@mui/system'
import { useState } from 'react'
import { FaChevronRight } from 'react-icons/fa'
import { MainButton } from '../component/common/MainButton'
import { NavBar } from '../component/common/NavBar'
import { texts } from '../const/texts'

const TOTAL_STEP = 3

const loadingDots = keyframes`
  0%{ 
    content: ".";
  }
  33.33%{ 
    content: "..";
  }
  66.67%{
    content: "...";
  }
`

export const Intro = () => {
  const theme = useTheme()
  const [currentStep, setCurrentStep] = useState(0)
  const goToNextStep = () => {
    setCurrentStep((step) => (step + 1) % TOTAL_STEP)
  }

  console.log(theme)

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        position: 'relative',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/assets/intro-bg.png)',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          filter: 'brightness(70%)',
        },
      }}
      onClick={() => goToNextStep()}
    >
      <Stack height="100%" sx={{ userSelect: 'none' }} position="relative">
        {currentStep === 0 ? (
          <Stack height="100%" justifyContent="center" alignItems="center">
            <Box component="img" src="/assets/svg/logo.svg" sx={{ width: '100%' }} />
          </Stack>
        ) : (
          <Container sx={{ height: '100%' }}>
            <Stack height="100%">
              <NavBar />
              <Stack flex="1" justifyContent="center">
                {currentStep === 1 && (
                  <>
                    <Typography variant="body1" color="textPrimary" sx={{ whiteSpace: 'pre-wrap' }}>
                      {texts.intro1}
                    </Typography>
                    <Typography variant="body1" color="textPrimary" sx={{ whiteSpace: 'pre-wrap' }} mt={8}>
                      {texts.intro2}
                    </Typography>
                    <MainButton fullWidth sx={{ alignSelf: 'center', mt: 20, height: 48 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography>Next</Typography> <FaChevronRight />
                      </Stack>
                    </MainButton>
                  </>
                )}
                {currentStep === 2 && (
                  <Stack height="100%" justifyContent="flex-end" alignItems="center">
                    <Stack
                      mb="30vh"
                      direction="row"
                      sx={{
                        borderRadius: 1,
                        height: 48,
                        width: 400,
                        bgcolor: theme.palette.secondary.main,
                        position: 'relative',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {/* spacer */}
                      <Box width="16px" />
                      <Typography color="textPrimary">Initializing</Typography>
                      <Typography
                        color="textPrimary"
                        sx={{
                          width: '32px',
                          '&:after': {
                            width: '100px',
                            content: '"..."',
                            animation: `${loadingDots} 2s linear infinite`,
                          },
                        }}
                      />
                    </Stack>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Container>
        )}
      </Stack>
    </Box>
  )
}
