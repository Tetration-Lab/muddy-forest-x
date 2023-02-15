import { Box, ClickAwayListener, Fade, Popper } from '@mui/material'
import React, { useRef, useState } from 'react'
import { useStore } from 'zustand'
import { ChatBox } from '../../component/Chatbox'
import { GameActionBox, GameActionBoxMode } from '../../component/game/GameActionBox'
import { ToolButton } from '../../component/ToolButton'
import { appStore } from '../../store/app'
export const UILayer = () => {
  const store = useStore(appStore, (state) => state)
  const toolsContainerRef = useRef()

  const [openGameActionBox, setOpenGameActionBox] = React.useState(false)
  const [currentMode, setCurrentMode] = useState<GameActionBoxMode | undefined>()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (mode: GameActionBoxMode) => () => {
    console.log('handleClick!!', mode)
    setCurrentMode(mode)
    setAnchorEl(toolsContainerRef.current)
    if (mode === currentMode) {
      handleClose()
    } else {
      setOpenGameActionBox(true)
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
    setOpenGameActionBox(false)
    setCurrentMode(undefined)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popper' : undefined

  const onInputFocus = () => {
    store.setFocusUI(true)
  }
  const onInputFocusOut = () => {
    store.setFocusUI(false)
  }
  return (
    <>
      <div className="absolute bottom-0">
        <div className="p-4">
          <ChatBox focusInputCallback={onInputFocus} focusOutInputCallback={onInputFocusOut} />
        </div>
      </div>
      <div className="absolute top-0 right-0">
        <div className="p-4">
          <div className="flex space-x-2">
            <ToolButton iconSrc="./assets/svg/magnifying-glass-icon.svg"></ToolButton>
            <ToolButton iconSrc="./assets/svg/setting-icon.svg"></ToolButton>
          </div>
        </div>
      </div>
      {/* debug */}
      <div className="absolute top-50 right-0">
        <div id="debug-pane"></div>
      </div>
      {/* tool button */}
      <ClickAwayListener onClickAway={handleClose}>
        <div className="absolute bottom-0 right-0" ref={toolsContainerRef}>
          <div className="p-4">
            <div className="flex space-x-2">
              <ToolButton
                title={'Discovery'}
                iconSrc="./assets/svg/discovery-icon.svg"
                onClick={handleClick(GameActionBoxMode.Discovery)}
              />
              <ToolButton
                title={'Research'}
                iconSrc="./assets/svg/research-icon-2.svg"
                onClick={handleClick(GameActionBoxMode.Research)}
              />
              <ToolButton
                title={'Inventory'}
                iconSrc="./assets/svg/inventory-icon-2.svg"
                onClick={handleClick(GameActionBoxMode.Inventory)}
              />
              <ToolButton
                title={'Build'}
                iconSrc="./assets/svg/build-icon-2.svg"
                onClick={handleClick(GameActionBoxMode.Build)}
              />
              <Popper id={id} open={openGameActionBox} anchorEl={anchorEl}>
                <Box sx={{ mr: 2 }}>
                  <GameActionBox mode={currentMode} onChangeMode={(mode) => setCurrentMode(mode)} />
                </Box>
              </Popper>
            </div>
          </div>
        </div>
      </ClickAwayListener>
    </>
  )
}
