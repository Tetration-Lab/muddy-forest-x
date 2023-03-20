import { IconButton, NativeSelect, Stack, Typography, useTheme } from '@mui/material'
import { useState } from 'react'
import { FaMinus, FaPause, FaPlay, FaPlus } from 'react-icons/fa'
import { useStore } from 'zustand'
import { MAX_MINER_INSTANCE } from '../../../../const/miner'
import { MiningPatternType } from '../../../../miner/MiningPatterns'
import { minerStore } from '../../../../store/miner'
import { MainButton } from '../../../common/MainButton'
import { WarningBox } from '../../../common/WarningBox'
import { ToolButton } from '../../../ToolButton'

export const SettingActionBox = () => {
  const theme = useTheme()
  const miner = useStore(minerStore, (state) => state.miner)

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
      <Stack direction="row" alignItems="center">
        <ToolButton iconSrc="./assets/svg/setting-icon.svg" />
        <Typography px={2} sx={{ fontFamily: 'VT323', fontSize: 24 }}>
          Setting
        </Typography>
      </Stack>
      <Stack
        sx={{
          backgroundColor: theme.palette.grayScale.black,
          borderRadius: '4px',
        }}
        p={1}
        spacing={1}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography>Hashing</Typography>
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
        <MainButton disableElevation sx={{ gap: 1 }} onClick={() => miner.toggle()}>
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
        <Typography>Hashing Speed</Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography>Miner: </Typography>
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
        <Typography>Patterns</Typography>
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
    </Stack>
  )
}