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
    <div className="absolute bottom-0">
      <div className="p-4">
        <ChatBox focusInputCallback={onInputFocus} focusOutInputCallback={onInputFocusOut} />
      </div>
    </div>
  )
}
