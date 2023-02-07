import { Box, Fade, keyframes, Stack, Typography, useTheme } from '@mui/material'
import { Container, SxProps } from '@mui/system'
import { useEffect, useState } from 'react'
import { FaChevronRight } from 'react-icons/fa'
import { MainButton } from '../component/common/MainButton'
import { NavBar } from '../component/common/NavBar'
import { texts } from '../const/texts'

enum Tribe {
  PROTOSS = 'protoss',
  TERRANS = 'terrans',
  ZERG = 'zerg',
}

const TOTAL_STEPS = 4
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

const TribeButton = ({
  name,
  imgUrl,
  isSelected = false,
  onClick,
}: {
  name: string
  imgUrl: string
  isSelected?: boolean
  onClick: () => void
}) => {
  const theme = useTheme()
  return (
    <Stack spacing={6} alignItems="center" onClick={onClick} sx={{ cursor: 'pointer' }}>
      <Box
        sx={{
          width: 180,
          height: 180,
          borderRadius: 1,
          border: '4px solid #CED4DA',
          background: theme.palette.secondary.main,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          filter: isSelected ? 'none' : 'grayscale(100%)',
          boxShadow: isSelected ? '0px 0px 15px 4px rgba(255,255,255,0.75)' : 'none',
          transition: 'box-shadow .2s, filter .2s',
        }}
      >
        <img src={imgUrl} width={144} />
      </Box>
      <Typography
        variant="h3"
        color="textPrimary"
        sx={{
          fontSize: 24,
          fontWeight: 700,
          opacity: isSelected ? 1 : 0.6,
        }}
      >
        {name}
      </Typography>
    </Stack>
  )
}

const NextButton = ({ sx, onClick, disabled = false }: { sx?: SxProps; onClick?: () => void; disabled?: boolean }) => {
  return (
    <MainButton fullWidth sx={{ alignSelf: 'center', height: 48, ...sx }} onClick={onClick} disabled={disabled}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>Next</Typography> <FaChevronRight />
      </Stack>
    </MainButton>
  )
}

export const Intro = () => {
  const theme = useTheme()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedTribe, setSelectedTribe] = useState<Tribe | undefined>()
  const goToNextStep = () => {
    setCurrentStep((step) => (step + 1) % TOTAL_STEPS)
  }

  useEffect(() => {
    if (currentStep === 2) {
      setTimeout(goToNextStep, 3000)
    }
  }, [currentStep])

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
    >
      <Stack height="100%" position="relative">
        {currentStep === 0 ? (
          <Fade in={currentStep === 0}>
            <Stack
              height="100%"
              justifyContent="center"
              alignItems="center"
              sx={{ cursor: 'pointer', userSelect: 'none' }}
              onClick={() => goToNextStep()}
            >
              <Box component="img" src="/assets/svg/logo.svg" sx={{ width: '100%' }} />
            </Stack>
          </Fade>
        ) : (
          <Container sx={{ height: '100%' }}>
            <Stack height="100%">
              <NavBar />
              <Stack flex="1" justifyContent="center">
                {currentStep === 1 && (
                  <Fade in={currentStep === 1}>
                    <Stack flex="1" justifyContent="center">
                      <Typography variant="body1" color="textPrimary" sx={{ whiteSpace: 'pre-wrap' }}>
                        {texts.intro1}
                      </Typography>
                      <Typography variant="body1" color="textPrimary" sx={{ whiteSpace: 'pre-wrap' }} mt={8}>
                        {texts.intro2}
                      </Typography>
                      <NextButton sx={{ mt: 20 }} onClick={() => goToNextStep()} />
                    </Stack>
                  </Fade>
                )}
                {currentStep === 2 && (
                  <Fade in={currentStep === 2}>
                    <Stack
                      height="100%"
                      justifyContent="flex-end"
                      alignItems="center"
                      onClick={() => goToNextStep()}
                      sx={{ cursor: 'pointer' }}
                    >
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
                              content: '""',
                              animation: `${loadingDots} 2s linear infinite`,
                            },
                          }}
                        />
                      </Stack>
                    </Stack>
                  </Fade>
                )}
                {currentStep === 3 && (
                  <Fade in={currentStep === 3}>
                    <Stack spacing={20}>
                      <Typography color="textPrimary">Choose one of your supported fraction:</Typography>
                      <Stack direction="row" spacing={24} width="100%" justifyContent="center">
                        <TribeButton
                          name="The Protoss"
                          imgUrl="/assets/tribes/protoss.png"
                          isSelected={selectedTribe === Tribe.PROTOSS}
                          onClick={() => setSelectedTribe(Tribe.PROTOSS)}
                        />
                        <TribeButton
                          name="The Terrans"
                          imgUrl="/assets/tribes/terrans.png"
                          isSelected={selectedTribe === Tribe.TERRANS}
                          onClick={() => setSelectedTribe(Tribe.TERRANS)}
                        />
                        <TribeButton
                          name="The Zerg"
                          imgUrl="/assets/tribes/zerg.png"
                          isSelected={selectedTribe === Tribe.ZERG}
                          onClick={() => setSelectedTribe(Tribe.ZERG)}
                        />
                      </Stack>
                      <NextButton disabled={!selectedTribe} onClick={() => goToNextStep()} />
                    </Stack>
                  </Fade>
                )}
              </Stack>
            </Stack>
          </Container>
        )}
      </Stack>
    </Box>
  )
}
