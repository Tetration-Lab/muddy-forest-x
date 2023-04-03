import { useComponentValueStream } from '@latticexyz/std-client'
import { Box, Button, CircularProgress, Fade, keyframes, Stack, TextField, Typography, useTheme } from '@mui/material'
import { Container } from '@mui/system'
import { useFormik } from 'formik'
import _, { isEmpty } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { useStore } from 'zustand'
import { CommonTextField } from '../../component/common/CommonTextField'
import { MainButton } from '../../component/common/MainButton'
import { NavBar } from '../../component/common/NavBar'
import { FACTION } from '../../const/faction'
import { OBJECTIVE, TEXTS } from '../../const/intro'
import { appStore } from '../../store/app'
import { NextButton } from './NextButton'
import { OnboardingHelp } from './OnboardingHelp'
import { TribeButton } from './TribeButton'

const TOTAL_STEPS = 7
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

interface SumitPayload {
  displayName: string
}

export const Intro = () => {
  const theme = useTheme()
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedTribe, setSelectedTribe] = useState<number | undefined>()
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)

  const address = localStorage.getItem('burnerWallet')

  const { components, playerIndex, api } = useStore(appStore, (state) => state.networkLayer)

  const faction = useComponentValueStream(components.Faction, playerIndex)
  useEffect(() => {
    if (faction?.value) {
      setLoading(false)
      navigate(`/${window.location.search}`)
    }
  }, [faction])

  const formik = useFormik({
    initialValues: { displayName: '' },
    validationSchema: yup
      .object({
        displayName: yup.string().required('Please enter your display name'),
      })
      .required(),
    onSubmit: (values: SumitPayload) => {
      setDisplayName(values.displayName)
      goToNextStep()
    },
  })

  const goToNextStep = () => {
    setCurrentStep((step) => (step + 1) % TOTAL_STEPS)
  }

  const spawn = useCallback(async () => {
    try {
      setLoading(true)
      await api.spawn(selectedTribe, displayName)
    } finally {
      setLoading(false)
    }
  }, [selectedTribe, displayName])

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
          filter: 'brightness(40%)',
        },
      }}
    >
      <Stack height="100%" position="relative">
        {currentStep === 0 ? (
          <Fade in={currentStep === 0}>
            <Stack height="100%" justifyContent="center" alignItems="center" spacing={1}>
              <Box component="img" src="/assets/svg/logo.svg" sx={{ width: '100%' }} />
              <MainButton onClick={() => goToNextStep()} sx={{ height: 48 }}>
                Start Your Journey
              </MainButton>
            </Stack>
          </Fade>
        ) : (
          <Container sx={{ height: '100%' }}>
            <Stack height="100%" alignItems="center">
              <NavBar />
              <Stack flex={1} justifyContent="center">
                {currentStep === 1 && (
                  <Fade in={currentStep === 1}>
                    <Stack justifyContent="center" spacing={3} width={900}>
                      {TEXTS.intros.map((e, i) => (
                        <Typography key={i} variant="body1" sx={{ whiteSpace: 'pre-wrap', textAlign: 'justify' }}>
                          {e}
                        </Typography>
                      ))}
                      <NextButton sx={{ mt: 30 }} onClick={() => goToNextStep()} />
                    </Stack>
                  </Fade>
                )}
                {currentStep === 2 && (
                  <Fade in={currentStep === 2}>
                    <Stack spacing={12}>
                      <Typography color="textPrimary">Choose one of your supported faction:</Typography>
                      <Stack direction="row" spacing={12}>
                        {Object.entries(FACTION).map((e) => {
                          return (
                            <TribeButton
                              key={e[0]}
                              color={e[1].color}
                              name={e[1].name}
                              imgUrl={e[1].signSrc}
                              isSelected={selectedTribe === +e[0]}
                              onClick={() => setSelectedTribe(+e[0])}
                            />
                          )
                        })}
                      </Stack>
                      <NextButton disabled={!selectedTribe} onClick={() => goToNextStep()} />
                    </Stack>
                  </Fade>
                )}
                {currentStep === 3 && (
                  <Fade in={currentStep === 3}>
                    <Stack flex="1" alignItems="center" justifyContent="center">
                      <Box
                        sx={{
                          width: '100%',
                          maxWidth: 420,
                          bgcolor: 'background.paper',
                          color: 'primary.main',
                          py: 3,
                          px: 4,
                        }}
                      >
                        <Stack>
                          <Typography
                            fontSize="28px"
                            fontWeight={700}
                            sx={{
                              textDecoration: 'underline',
                            }}
                          >
                            Display Name
                          </Typography>
                          <Typography variant="body2" pt={3}>
                            {TEXTS.displayNameDescription}
                          </Typography>
                          <Typography fontWeight={700} mt={3}>
                            Address
                          </Typography>
                          <Stack direction="row" alignItems="center" mt={1}>
                            <Box
                              height={40}
                              width={40}
                              sx={{
                                borderRadius: '4px 0 0 4px',
                                backgroundColor: theme.palette.gray.light,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: theme.palette.common.green,
                              }}
                            >
                              <FaCheckCircle />
                            </Box>
                            <TextField
                              sx={{
                                flex: 1,
                                '& fieldset': { borderLeft: 'none', borderRadius: '0 4px 4px 0' },
                              }}
                              variant="outlined"
                              focused={false}
                              value={`${address} (Player address)`}
                              inputProps={{
                                sx: {
                                  height: 40,
                                  fontSize: 14,
                                  padding: '0px 8px',
                                  color: theme.palette.secondary.main,
                                  backgroundColor: theme.palette.common.white,
                                  borderRadius: 1,
                                },
                              }}
                            />
                          </Stack>
                          <Typography fontWeight={700} mt={3}>
                            Display Name
                          </Typography>
                          <CommonTextField
                            formik={formik}
                            path={'displayName'}
                            placeholder="Enter your preferred name"
                            sx={{
                              mt: 1,
                            }}
                          />
                          <Button
                            onClick={formik.submitForm}
                            disabled={loading || !isEmpty(formik.errors) || !formik?.values?.displayName}
                            sx={{
                              height: 48,
                              mt: 3,
                              borderRadius: 0,
                              textTransform: 'none',
                            }}
                            color="primary"
                            variant="contained"
                          >
                            Done
                          </Button>
                        </Stack>
                      </Box>
                    </Stack>
                  </Fade>
                )}
                {currentStep === 4 && (
                  <Fade in={currentStep === 4}>
                    <Stack flex="1" justifyContent="center" spacing={2}>
                      <OnboardingHelp goToNextStep={goToNextStep} />
                    </Stack>
                  </Fade>
                )}
                {currentStep === 5 && (
                  <Fade in={currentStep === 5}>
                    <Stack flex="1" alignItems="center" justifyContent="center" spacing={6}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box component="img" src="/assets/images/intro/ob1.png" width={600} />
                        <Stack spacing={2} width="min-content">
                          <Typography variant="h4">Objective</Typography>
                          <Typography variant="body2">{OBJECTIVE.objective}</Typography>
                          <Stack direction="row" spacing={2}>
                            {OBJECTIVE.goals.map((goal, i) => (
                              <Stack
                                key={i}
                                p={1}
                                spacing={1}
                                sx={{
                                  backgroundColor: theme.palette.grayScale.white,
                                  borderRadius: '8px',
                                  width: 100,
                                }}
                              >
                                <Box component="img" src={goal.imageSrc} />
                                <Typography
                                  sx={{
                                    color: theme.palette.grayScale.soBlack,
                                    textAlign: 'center',
                                    fontSize: 14,
                                    fontFamily: 'VT323',
                                    lineHeight: 1,
                                  }}
                                >
                                  {goal.description}
                                </Typography>
                              </Stack>
                            ))}
                          </Stack>
                        </Stack>
                      </Stack>
                      <MainButton
                        disabled={loading}
                        onClick={spawn}
                        sx={{
                          height: 48,
                        }}
                      >
                        {loading ? <CircularProgress color="inherit" size={20} /> : 'Start!'}
                      </MainButton>
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
