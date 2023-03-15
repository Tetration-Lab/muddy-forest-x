import { useComponentValueStream } from '@latticexyz/std-client'
import { Box, Popper } from '@mui/material'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from 'zustand'
import { ChatBox } from '../../component/Chatbox'
import { GameActionBox, GameActionBoxMode } from '../../component/game/GameActionBox'
import { AttackModal } from '../../component/game/Modals/AttackModal'
import { PlanetModal } from '../../component/game/Modals/PlanetModal'
import { Profile } from '../../component/game/Profile'
import { SettingActionBox } from '../../component/game/SettingActionBox'
import { TeleportActionBox } from '../../component/game/TeleportActionBox'
import { ToolButton } from '../../component/ToolButton'
import { FACTION } from '../../const/faction'
import { appStore } from '../../store/app'
import { dataStore } from '../../store/data'
import { closeTeleport, gameStore, openTeleport } from '../../store/game'

export const UILayer = () => {
  const store = useStore(appStore, (state) => state)

  const toolsContainerRef = useRef()
  const settingContainerRef = useRef()
  const teleportContainerRef = useRef()

  const openTeleportBox = useStore(gameStore, (state) => state.teleportAction)

  const [openSettingBox, setOpenSettingBox] = React.useState(false)

  const [openGameActionBox, setOpenGameActionBox] = React.useState(false)
  const [currentMode, setCurrentMode] = useState<GameActionBoxMode | undefined>()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const networkLayer = store.networkLayer
  const playerNameComponent = useComponentValueStream(networkLayer.components.Name, networkLayer.playerIndex)
  const factionID = useComponentValueStream(networkLayer.components.Faction, networkLayer.playerIndex)
  const [playerColor, setPlayerColor] = useState('white')
  const [playerName, setPlayerName] = useState<null | string>(null)

  useEffect(() => {
    if (playerNameComponent) {
      setPlayerName(playerNameComponent?.value)
      setPlayerColor(FACTION[factionID?.value].color)
    }
  }, [playerNameComponent, factionID])

  const handleSettingClick = () => {
    if (openSettingBox) {
      handleSettingClose()
    } else {
      setOpenSettingBox(true)
    }
  }

  const handleSettingClose = () => {
    setOpenSettingBox(false)
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

  const onInputFocus = () => {
    store.setFocusUI(true)
  }
  const onInputFocusOut = () => {
    store.setFocusUI(false)
  }

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
          {playerName && (
            <ChatBox
              playerColor={playerColor}
              playerName={playerName}
              focusInputCallback={onInputFocus}
              focusOutInputCallback={onInputFocusOut}
            />
          )}
        </div>
      </div>
      {/*<ClickAwayListener onClickAway={handleSettingClose}>*/}
      <div className="absolute top-50 right-0" ref={settingContainerRef}>
        <div className="p-4">
          <div className="flex space-x-2">
            <ToolButton iconSrc="./assets/svg/magnifying-glass-icon.svg"></ToolButton>
            <ToolButton iconSrc="./assets/svg/setting-icon.svg" onClick={handleSettingClick}></ToolButton>
            <Popper open={openSettingBox} anchorEl={settingContainerRef.current} placement="bottom-end">
              <Box sx={{ mr: 2 }}>
                <SettingActionBox />
              </Box>
            </Popper>
          </div>
        </div>
      </div>
      <div className="absolute top-1/2 right-0" ref={teleportContainerRef}>
        <div className="p-4">
          <ToolButton title="Teleport" iconSrc="./assets/svg/teleport-icon.svg" onClick={handleOnClickTeleport} />
          <Popper open={!!openTeleportBox} anchorEl={teleportContainerRef.current} placement="left">
            <TeleportActionBox id={openTeleportBox} />
          </Popper>
        </div>
      </div>
      <div className="absolute top-50 left-0">
        <div className="p-4">
          <Profile />
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
            <ToolButton
              title={'Build'}
              iconSrc="./assets/svg/build-icon-2.svg"
              onClick={handleToolsClick(GameActionBoxMode.Build)}
            />
            <Popper id={toolId} open={openGameActionBox} anchorEl={anchorEl}>
              <Box sx={{ mr: 2 }}>
                <GameActionBox mode={currentMode} onChangeMode={(mode) => setCurrentMode(mode)} />
              </Box>
            </Popper>
          </div>
        </div>
      </div>
      {/*</ClickAwayListener>*/}
      {/* Modals */}
      <AttackModals />
      <PlanetModals />
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
