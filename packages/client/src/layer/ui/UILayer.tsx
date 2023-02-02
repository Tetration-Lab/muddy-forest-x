import React from 'react'
import { useStore } from 'zustand'
import { ChatBox } from '../../component/Chatbox'
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
            <ToolButton>
              <img tabIndex={-1} draggable="false" src="./assets/svg/magnifying-glass-icon.svg" alt="" />
            </ToolButton>
            <ToolButton>
              <img tabIndex={-1} draggable="false" src="./assets/svg/setting-icon.svg" alt="" />
            </ToolButton>
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
            <ToolButton title={'Research'}>
              <img tabIndex={-1} draggable="false" src="./assets/svg/research-icon.svg" alt="" />
            </ToolButton>
            <ToolButton title={'Build'}>
              <img tabIndex={-1} draggable="false" src="./assets/svg/build-icon.svg" alt="" />
            </ToolButton>
            <ToolButton title={'Inventory'}>
              <img
                className="select-none"
                draggable="false"
                tabIndex={-1}
                src="./assets/svg/inventory-icon.svg"
                alt=""
              />
            </ToolButton>
          </div>
        </div>
      </div>
    </>
  )
}

interface ToolButtonProps {
  onClick?: () => void
  title?: string
  children?: React.ReactNode
}
const ToolButton: React.FC<ToolButtonProps> = ({ title, children }) => {
  return (
    <>
      <div className="flex justify-center flex-col items-center">
        <div
          tabIndex={-1}
          className="select-none w-12 h-12 bg-[#343A40] rounded-lg flex items-center justify-center border-2 border-[#212529] transform transition-all linear duration-75 active:scale-95"
        >
          {children}
        </div>
        {title && <span className="text-sm text-white">{title}</span>}
      </div>
    </>
  )
}
