import { Box, Popper } from '@mui/material'
import React, { useRef, useState } from 'react'
import { useStore } from 'zustand'
import { ChatBox } from '../../component/Chatbox'
import { GameActionBox, GameActionBoxMode } from '../../component/game/GameActionBox'
import { SendResourceModal } from '../../component/game/Modals/SendResourceModal'
import { SettingActionBox } from '../../component/game/SettingActionBox'
import { ToolButton } from '../../component/ToolButton'
import { appStore } from '../../store/app'
import { gameStore as GameStore } from '../../store/game'

export const UILayer = () => {
  const store = useStore(appStore, (state) => state)
  const gameStore = useStore(GameStore, (state) => state)
  const toolsContainerRef = useRef()
  const settingContainerRef = useRef()

  const [openSettingBox, setOpenSettingBox] = React.useState(false)
  const [settingAnchorEl, setSettingAnchorEl] = React.useState<null | HTMLElement>()

  const [openGameActionBox, setOpenGameActionBox] = React.useState(false)
  const [currentMode, setCurrentMode] = useState<GameActionBoxMode | undefined>()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleSettingClick = () => {
    setSettingAnchorEl(settingContainerRef.current)
    if (openSettingBox) {
      handleSettingClose()
    } else {
      setOpenSettingBox(true)
    }
  }

  const handleSettingClose = () => {
    setSettingAnchorEl(null)
    setOpenSettingBox(false)
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

  const settingOpen = Boolean(anchorEl)
  const settingId = settingOpen ? 'setting-popper' : undefined

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
          <ChatBox focusInputCallback={onInputFocus} focusOutInputCallback={onInputFocusOut} />
        </div>
      </div>
      {/*<ClickAwayListener onClickAway={handleSettingClose}>*/}
      <div className="absolute top-50 right-0" ref={settingContainerRef}>
        <div className="p-4">
          <div className="flex space-x-2">
            <ToolButton iconSrc="./assets/svg/magnifying-glass-icon.svg"></ToolButton>
            <ToolButton iconSrc="./assets/svg/setting-icon.svg" onClick={handleSettingClick}></ToolButton>
            <Popper id={settingId} open={openSettingBox} anchorEl={settingAnchorEl} placement="bottom-end">
              <Box sx={{ mr: 2 }}>
                <SettingActionBox />
              </Box>
            </Popper>
          </div>
        </div>
      </div>
      <div className="absolute top-1/2 right-0">
        <ToolButton
          title={'Teleport'}
          iconSrc="./assets/svg/build-icon-2.svg"
          onClick={handleToolsClick(GameActionBoxMode.Build)}
        />
      </div>
      {/*</ClickAwayListener>*/}
      {/* debug */}
      <div className="absolute top-50 left-0">
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
      <SendResourceModal
        open={gameStore.sendResourceModal.open}
        onClose={() => gameStore.setSendResource({ open: false })}
      />
    </div>
  )
}
