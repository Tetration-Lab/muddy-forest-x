import { IconButton, NativeSelect, Slider, Stack, Typography, useTheme } from '@mui/material'
import { useState } from 'react'
import { FaMinus, FaPause, FaPlay, FaPlus, FaVolumeMute, FaVolumeUp } from 'react-icons/fa'
import { useStore } from 'zustand'
import { MAX_MINER_INSTANCE } from '../../../../const/miner'
import { MiningPatternType } from '../../../../miner/MiningPatterns'
import { appStore } from '../../../../store/app'
import { minerStore } from '../../../../store/miner'
import { MainButton } from '../../../common/MainButton'
import { WarningBox } from '../../../common/WarningBox'
import { ToolButton } from '../../../ToolButton'
import { CloseModalButton } from '../../common/CloseModalButton'

export interface Props {
  onClose: () => void
}
export const SettingActionBox: React.FC<Props> = ({ onClose }) => {
  const theme = useTheme()

  const miner = useStore(minerStore, (state) => state.miner)
  const [miningTmp, setMiningTmp] = useState(0)

  const audioManager = useStore(appStore, (state) => state.gameScene.audioManager)
  const [muted, setMuted] = useState(audioManager?.scene?.sound?.mute)
  const [audio, setAudio] = useState(audioManager?.scene?.sound?.volume)

  const [isSettingMiner, setSettingMiner] = useState(false)
  const setMinerCall = async (m: number) => {
    setSettingMiner(true)
    await miner.setMiner(m)
    setSettingMiner(false)
  }

  return (
    <Stack
      p={1}
      sx={{
        background: theme.palette.grayScale.soBlack,
        color: theme.palette.common.white,
        borderRadius: '8px',
        width: 288,
      }}
      spacing={1}
    >
      <div className="flex justify-between items-center">
        <Stack direction="row" alignItems="center">
          <ToolButton iconSrc="./assets/svg/setting-icon.svg" />
          <Typography px={2} sx={{ fontFamily: 'VT323', fontSize: 24 }}>
            Setting
          </Typography>
        </Stack>
        <CloseModalButton onClick={() => onClose()} />
      </div>
      <Stack
        sx={{
          backgroundColor: theme.palette.grayScale.black,
          borderRadius: '4px',
        }}
        p={1}
        spacing={1}
        key={miningTmp}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2">Hashing</Typography>
          {miner.isExploring ? (
            <>
              <Typography
                fontSize={12}
                p="4px"
                sx={{ backgroundColor: theme.palette.success.main, borderRadius: '4px' }}
              >
                Active
              </Typography>
            </>
          ) : (
            <>
              <Typography
                fontSize={12}
                p="4px"
                sx={{
                  backgroundColor: theme.palette.grayScale.white,
                  color: theme.palette.grayScale.almostGray,
                  borderRadius: '4px',
                }}
              >
                Pause
              </Typography>
            </>
          )}
        </Stack>
        <MainButton
          disableElevation
          sx={{ gap: 1 }}
          onClick={() => {
            miner.toggle()
            setMiningTmp((e) => e + 1)
          }}
        >
          {miner.isExploring ? (
            <>
              <FaPause size={12} />
              <Typography fontSize={12}>Pause</Typography>
            </>
          ) : (
            <>
              <FaPlay size={12} />
              <Typography fontSize={12}>Resume</Typography>
            </>
          )}
        </MainButton>
      </Stack>
      <Stack
        sx={{
          backgroundColor: theme.palette.grayScale.black,
          borderRadius: '4px',
        }}
        p={1}
        spacing={1}
      >
        <Typography variant="body2">Hashing Speed</Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2">Miner: </Typography>
          <Stack direction="row" alignItems="center">
            <IconButton
              sx={{
                borderWidth: 1,
                borderColor: theme.palette.grayScale.almostDarkGray,
                borderStyle: 'solid',
                borderRadius: '6px 0px 0px 6px',
              }}
              onClick={() => {
                setMinerCall(miner.miners.length - 1)
              }}
              disabled={miner.miners.length <= 1 || isSettingMiner}
            >
              <FaMinus size={12} />
            </IconButton>
            <Typography
              sx={{ backgroundColor: theme.palette.grayScale.white, color: theme.palette.grayScale.black }}
              py="2px"
              px={1}
            >
              {miner.miners.length}
            </Typography>
            <IconButton
              sx={{
                borderWidth: 1,
                borderColor: theme.palette.grayScale.almostDarkGray,
                borderStyle: 'solid',
                borderRadius: '0px 6px 6px 0px',
              }}
              disabled={miner.miners.length >= MAX_MINER_INSTANCE || isSettingMiner}
              onClick={() => {
                setMinerCall(miner.miners.length + 1)
              }}
            >
              <FaPlus size={12} />
            </IconButton>
          </Stack>
        </Stack>
        <WarningBox label="Using more miners may effect your devices performances" />
      </Stack>
      <Stack
        sx={{
          backgroundColor: theme.palette.grayScale.black,
          borderRadius: '4px',
        }}
        p={1}
        spacing={1}
      >
        <Typography variant="body2">Patterns</Typography>
        <NativeSelect
          defaultValue={0}
          inputProps={{
            name: 'Patterns',
          }}
          sx={{
            borderRadius: '4px',
            backgroundColor: theme.palette.grayScale.almostDarkGray,
            px: 0.5,
            fontSize: 12,
          }}
          onChange={(c) => {
            miner.setMiningPattern(MiningPatternType[c.target.value])
          }}
        >
          {[...Array(2).keys()].map((i) => {
            const ty = MiningPatternType[i]
            return (
              <option value={ty} key={ty}>
                {ty}
              </option>
            )
          })}
        </NativeSelect>
      </Stack>
      <Typography variant="body2">Background & SFX</Typography>
      <Stack
        sx={{
          backgroundColor: theme.palette.grayScale.black,
          borderRadius: '4px',
        }}
        p={1}
        spacing={1}
      >
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Typography variant="body2">Master Volume</Typography>
          <MainButton
            onClick={() =>
              setMuted((e) => {
                audioManager.scene.sound.mute = !e
                return !e
              })
            }
          >
            {muted ? <FaVolumeMute /> : <FaVolumeUp />}
          </MainButton>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography sx={{ fontSize: 14, color: theme.palette.grayScale.almostGray }}>0%</Typography>
          <Slider
            min={0}
            max={2}
            step={0.01}
            aria-label="sfx"
            value={audio}
            onChange={(_, value) => {
              setAudio(+value)
              audioManager.scene.sound.volume = +value
            }}
            size="small"
            sx={{ color: theme.palette.grayScale.white, p: 0 }}
          />
          <Typography sx={{ fontSize: 14, color: theme.palette.grayScale.almostGray }}>200%</Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}
