import { Box, Popper } from '@mui/material'
import { useRef, useState } from 'react'
import { useStore } from 'zustand'
import { ChatBoxWrapper } from '../../component/ChatBox'
import { GameActionBox, GameActionBoxMode } from '../../component/game/ActionBox/GameActionBox'
import { LeaderboardActionBox } from '../../component/game/ActionBox/LeaderboardActionBox'
import { SettingActionBox } from '../../component/game/ActionBox/SettingActionBox'
import { TeleportActionBox } from '../../component/game/ActionBox/TeleportActionBox'
import { AttackModal } from '../../component/game/Modals/AttackModal'
import { HelpModal } from '../../component/game/Modals/HelpModal'
import { PlanetModal } from '../../component/game/Modals/PlanetModal'
import { SendModal } from '../../component/game/Modals/SendModal'
import { Profile } from '../../component/game/Profile'
import { ToolButton } from '../../component/ToolButton'
import { dataStore } from '../../store/data'
import { Loading } from '../../component/Loading'
import {
  closeBuildModal,
  closeTeleport,
  gameStore,
  openBuildModal,
  openHelpModal,
  openTeleport,
} from '../../store/game'
import { appStore } from '../../store/app'
import { BuildActionBox } from '../../component/game/ActionBox/BuildActionBox'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FaDiscord, FaTwitter } from 'react-icons/fa'
import { faComment } from '@fortawesome/free-solid-svg-icons'

export const UILayer = () => {
  const toolsContainerRef = useRef()
  const settingContainerRef = useRef()
  const leaderboardContainerRef = useRef()
  const teleportContainerRef = useRef()
  const buildContainerRef = useRef()

  const openTeleportBox = useStore(gameStore, (state) => state.teleportAction)
  const openBuildBox = useStore(gameStore, (state) => state.buildAction)
  const { isLoading } = useStore(appStore, (state) => state)

  const [openSettingBox, setOpenSettingBox] = useState(false)
  const [openLeaderboardBox, setOpenLeaderboardBox] = useState(false)
  const [openGameActionBox, setOpenGameActionBox] = useState(false)
  const [currentMode, setCurrentMode] = useState<GameActionBoxMode | undefined>()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleOnClickBuild = () => {
    if (openBuildBox !== undefined) {
      closeBuildModal()
    } else {
      openBuildModal('')
    }
  }

  const handleOnClickTeleport = () => {
    if (openTeleportBox) {
      closeTeleport()
    } else {
      if (dataStore.getState().ownedSpaceships.length > 0) {
        const id = dataStore.getState().ownedSpaceships[0]
        openTeleport(id)
      }
    }
  }

  const handleToolsClick = (mode: GameActionBoxMode) => () => {
    setCurrentMode(mode)
    setAnchorEl(toolsContainerRef.current)
    if (mode === currentMode) {
      handleToolsClose()
    } else {
      setOpenGameActionBox(true)
    }
  }

  const handleToolsClose = () => {
    setAnchorEl(null)
    setOpenGameActionBox(false)
    setCurrentMode(undefined)
  }

  const toolOpen = Boolean(anchorEl)
  const toolId = toolOpen ? 'simple-popper' : undefined

  return (
    <div
      onMouseDown={(e) => {
        e.stopPropagation()
      }}
      onMouseUp={(e) => {
        e.stopPropagation()
      }}
    >
      <div className="absolute bottom-0 z-10">
        <div className="p-4">
          <ChatBoxWrapper />
        </div>
      </div>
      {/*<ClickAwayListener onClickAway={handleSettingClose}>*/}
      <div className="absolute top-50 right-0">
        <div className="p-4">
          <div className="flex space-x-2">
            <div ref={settingContainerRef}>
              <ToolButton iconSrc="./assets/svg/setting-icon.svg" onClick={() => setOpenSettingBox((e) => !e)} />
            </div>
            <div ref={leaderboardContainerRef}>
              <ToolButton iconSrc="./assets/svg/trophy-icon.svg" onClick={() => setOpenLeaderboardBox((e) => !e)} />
            </div>
            <ToolButton iconSrc="./assets/svg/lightbulb-icon.svg" onClick={() => openHelpModal(0)} />
            <Popper open={openSettingBox} anchorEl={settingContainerRef.current} placement="bottom-end">
              <Box sx={{ mt: 2 }}>
                <SettingActionBox onClose={() => setOpenSettingBox(false)} />
              </Box>
            </Popper>
            <Popper
              open={openLeaderboardBox}
              anchorEl={leaderboardContainerRef.current}
              placement="bottom-end"
              keepMounted={true}
            >
              <Box sx={{ mt: 2 }}>
                <LeaderboardActionBox
                  onClose={() => {
                    setOpenLeaderboardBox(false)
                  }}
                />
              </Box>
            </Popper>
          </div>
        </div>
      </div>
      <div className="absolute top-1/2 right-0 -translate-y-1/2">
        <div className="p-4">
          <div className="flex flex-col space-y-2">
            <div ref={buildContainerRef}>
              <ToolButton iconSrc="./assets/svg/build-icon-2.svg" onClick={handleOnClickBuild} />
            </div>
            <div ref={teleportContainerRef}>
              <ToolButton iconSrc="./assets/svg/teleport-icon.svg" onClick={handleOnClickTeleport} />
            </div>
            <Popper open={openBuildBox !== undefined} anchorEl={buildContainerRef.current} placement="left">
              <Box sx={{ mr: 2 }}>
                <BuildActionBox id={openBuildBox} />
              </Box>
            </Popper>
            <Popper open={!!openTeleportBox} anchorEl={teleportContainerRef.current} placement="left-end">
              <Box sx={{ mr: 2 }}>
                <TeleportActionBox id={openTeleportBox} />
              </Box>
            </Popper>
          </div>
        </div>
      </div>
      <div className="absolute top-50 left-0">
        <div className="p-4">
          <Profile />
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex space-x-2">
          <a href="https://discord.gg/9MJ4Y6qCtf" target="_blank" rel="noopener noreferrer">
            <button className="bg-[#353A40] p-1 w-8 h-8 flex items-center justify-center border rounded-md border-[#222428]">
              <FaDiscord />
            </button>
          </a>
          <a href="https://twitter.com/muddyforest_eth" target="_blank" rel="noopener noreferrer">
            <button className="bg-[#353A40] p-1 w-8 h-8 flex items-center justify-center border rounded-md border-[#222428]">
              <FaTwitter />
            </button>
          </a>
          <a href="https://discord.gg/9MJ4Y6qCtf" target="_blank" rel="noopener noreferrer">
            <button className="bg-[#353A40] p-1 w-8 h-8 flex items-center justify-center border rounded-md border-[#222428]">
              <FontAwesomeIcon icon={faComment} />
            </button>
          </a>
        </div>
      </div>
      {/*</ClickAwayListener>*/}
      {/* debug */}
      <div className="absolute top-1/2 left-0">
        <div id="debug-pane"></div>
      </div>
      {/* tool button */}
      {/*<ClickAwayListener onClickAway={handleToolsClose}>*/}
      <div className="absolute bottom-0 right-0" ref={toolsContainerRef}>
        <div className="p-4">
          <div className="flex space-x-2">
            <ToolButton
              title={'Discovery'}
              iconSrc="./assets/svg/discovery-icon.svg"
              onClick={handleToolsClick(GameActionBoxMode.Discovery)}
            />
            <ToolButton
              title={'Research'}
              iconSrc="./assets/svg/research-icon-2.svg"
              onClick={handleToolsClick(GameActionBoxMode.Research)}
            />
            <ToolButton
              title={'Inventory'}
              iconSrc="./assets/svg/inventory-icon-2.svg"
              onClick={handleToolsClick(GameActionBoxMode.Inventory)}
            />
            <Popper id={toolId} open={openGameActionBox} anchorEl={anchorEl}>
              <Box sx={{ mr: 2 }}>
                <GameActionBox
                  mode={currentMode}
                  onClose={handleToolsClose}
                  onChangeMode={(mode) => setCurrentMode(mode)}
                />
              </Box>
            </Popper>
          </div>
        </div>
      </div>
      {/*</ClickAwayListener>*/}
      {/* Modals */}
      <AttackModals />
      <PlanetModals />
      <SendModals />
      <HelpModal />
      {isLoading && (
        <div className="absolute w-full h-full bg-black z-50">
          <Loading msg={'Preparing Resouce...'} />
        </div>
      )}
    </div>
  )
}

const PlanetModals = () => {
  const modals = useStore(gameStore, (state) => [...state.planetModals.entries()])
  return (
    <>
      {modals.map((k) => (
        <PlanetModal id={k[0]} position={k[1]} key={k[0]} />
      ))}
    </>
  )
}

const AttackModals = () => {
  const modals = useStore(gameStore, (state) => [...state.attackModals.entries()])
  return (
    <>
      {modals.map((k) => (
        <AttackModal id={k[0]} targetId={k[1][0]} position={k[1][1]} key={k[0]} />
      ))}
    </>
  )
}

const SendModals = () => {
  const modals = useStore(gameStore, (state) => [...state.sendModals.entries()])
  return (
    <>
      {modals.map((k) => (
        <SendModal id={k[0]} targetId={k[1][0]} position={k[1][1]} key={k[0]} />
      ))}
    </>
  )
}
