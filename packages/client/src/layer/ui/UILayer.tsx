import React from 'react'
import { useStore } from 'zustand'
import { ChatBox } from '../../component/Chatbox'
import { ToolButton } from '../../component/ToolButton'
import { appStore } from '../../store/app'

export const UILayer = () => {
  const store = useStore(appStore, (state) => state)
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
      <div className="absolute bottom-0 right-0">
        <div className="p-4">
          <div className="flex space-x-2">
            <ToolButton title={'Research'} iconSrc="./assets/svg/research-icon.svg"></ToolButton>
            <ToolButton title={'Build'} iconSrc="./assets/svg/build-icon.svg"></ToolButton>
            <ToolButton title={'Inventory'} iconSrc="./assets/svg/inventory-icon.svg"></ToolButton>
          </div>
        </div>
      </div>
    </>
  )
}
