import { Box, Button, CircularProgress, Fade, keyframes, Stack, TextField, Typography, useTheme } from '@mui/material'
import { Container, SxProps } from '@mui/system'
import { ethers } from 'ethers'
import { useFormik } from 'formik'
import { isEmpty } from 'lodash'
import { useEffect, useState } from 'react'
import { FaCheckCircle, FaChevronRight } from 'react-icons/fa'
import * as yup from 'yup'
import { useStore } from 'zustand'
import { CommonTextField } from '../component/common/CommonTextField'
import { MainButton } from '../component/common/MainButton'
import { NavBar } from '../component/common/NavBar'
import { texts } from '../const/texts'
import { appStore } from '../store/app'
import { wait } from '../utils/utils'

enum Tribe {
  APE_APE = 'APE_APE',
  ALIEN_APE = 'ALIEN_APE',
  AI_APE = 'AI_APE',
}

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

interface SumitPayload {
  displayName: string
}

export const TripeMapperID = {
  [Tribe.APE_APE]: 10,
  [Tribe.ALIEN_APE]: 11,
  [Tribe.AI_APE]: 12,
}

export const Intro = () => {
  const theme = useTheme()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedTribe, setSelectedTribe] = useState<Tribe | undefined>()
  const [loading, setLoading] = useState(false)
  const address = localStorage.getItem('burnerWallet')
  const store = useStore(appStore, (state) => state)

  const formik = useFormik({
    initialValues: { displayName: '' },
    validationSchema: yup
      .object({
        displayName: yup.string().required('Please enter your display name'),
      })
      .required(),
    onSubmit: async (values: SumitPayload) => {
      const fractionID = TripeMapperID[selectedTribe!]
      console.log('values', values, fractionID)
      // NOTE: mock loading
      setLoading(true)
      await wait(150)
      const hqID = ethers.BigNumber.from(ethers.utils.randomBytes(32))
      console.log(hqID.toBigInt(), fractionID)
      if (store.networkLayer) store.networkLayer.api.spawn(fractionID, hqID)
      setLoading(false)
      alert('done')
    },
  })

  const goToNextStep = () => {
    setCurrentStep((step) => (step + 1) % TOTAL_STEPS)
  }

  useEffect(() => {
    if (currentStep === 2) {
      // mock for intializing
      setTimeout(goToNextStep, 100)
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
                    <Stack spacing={12}>
                      <Typography color="textPrimary">Choose one of your supported fraction:</Typography>
                      <div className="grid grid-cols-1 sm:grid-cols-3">
                        <TribeButton
                          name="The APE APE"
                          imgUrl="/assets/images/ape_ape_icon.png"
                          isSelected={selectedTribe === Tribe.APE_APE}
                          onClick={() => setSelectedTribe(Tribe.APE_APE)}
                        />
                        <TribeButton
                          name="The ALIEN APE"
                          imgUrl="/assets/images/alien_ape_icon.png"
                          isSelected={selectedTribe === Tribe.ALIEN_APE}
                          onClick={() => setSelectedTribe(Tribe.ALIEN_APE)}
                        />
                        <TribeButton
                          name="The AI APE"
                          imgUrl="/assets/images/ai_ape_icon.png"
                          isSelected={selectedTribe === Tribe.AI_APE}
                          onClick={() => setSelectedTribe(Tribe.AI_APE)}
                        />
                      </div>
                      <NextButton disabled={!selectedTribe} onClick={() => goToNextStep()} />
                    </Stack>
                  </Fade>
                )}
                {currentStep === 4 && (
                  <Fade in={currentStep === 4}>
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
                            {texts.displayNameDescription}
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
                            }}
                            color="primary"
                            variant="contained"
                          >
                            {loading ? <CircularProgress color="inherit" /> : 'Done'}
                          </Button>
                        </Stack>
                      </Box>
                    </Stack>
                  </Fade>
                )}
                {currentStep === 5 && (
                  <Fade in={currentStep === 5}>
                    <Stack flex="1" alignItems="center" justifyContent="center">
                      <Box
                        sx={{
                          width: '100%',
                          maxWidth: 420,
                          bgcolor: 'background.paper',
                          color: 'primary.main',
                          py: 3,
                          px: 3,
                        }}
                      >
                        <Stack alignItems="center">
                          <Box component={FaCheckCircle} color={theme.palette.common.green} fontSize={60} />
                          <Typography fontSize="20px" fontWeight={700} mt={3}>
                            Binding display name completed!
                          </Typography>
                          <Typography mt={1} sx={{ textAlign: 'center' }}>
                            From now on, your account will display and other people will see you as “
                            <Typography component="span" sx={{ color: theme.palette.gray.main }}>
                              Display Name
                            </Typography>
                            ”
                          </Typography>
                          <Button
                            fullWidth
                            onClick={() => {
                              goToNextStep()
                            }}
                            sx={{
                              height: 48,
                              mt: 3,
                              borderRadius: 0,
                            }}
                            color="primary"
                            variant="contained"
                          >
                            CONTINUE
                          </Button>
                        </Stack>
                      </Box>
                    </Stack>
                  </Fade>
                )}
                {currentStep === 6 && (
                  <Fade in={currentStep === 6}>
                    <Stack flex="1" justifyContent="center">
                      <Typography variant="body1" color="textPrimary" sx={{ whiteSpace: 'pre-wrap' }}>
                        {texts.infoBeforeStart}
                      </Typography>
                      <NextButton sx={{ mt: 20 }} onClick={() => goToNextStep()} />
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
