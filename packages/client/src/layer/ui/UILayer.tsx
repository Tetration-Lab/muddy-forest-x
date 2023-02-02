import { ChatBox } from '../../component/Chatbox'

export const UILayer = () => {
  return (
    <div className="absolute bottom-0">
      <div className="p-4">
        <ChatBox />
      </div>
    </div>
  )
}
