import { useEffect, useRef, useState } from 'react'
import useChatMessage, { ChatMessage } from '../../hook/useChatMessage'
import './index.css'
export interface ChatBoxProps {
  focusInputCallback?: () => void
  focusOutInputCallback?: () => void
}
export const ChatBox: React.FC<ChatBoxProps> = ({ focusInputCallback, focusOutInputCallback }) => {
  const chatEndpoint = 'https://chat.tetrationlab.com/'
  const chatRoomID = 'lobby'

  const scrollRef = useRef<HTMLDivElement>()
  const inputChat = useRef<HTMLInputElement>()
  const { connected, on, emit, off } = useChatMessage(chatEndpoint, 'test', chatRoomID)
  const [messageList, setMessageList] = useState<ChatMessage[]>([])
  const onMessage = (_msg: string, data: any) => {
    console.log(data)
    const ts = new Date().getTime().toString()
    setMessageList((prev) => [
      ...prev,
      {
        message: data.text,
        username: data.username,
        id: ts,
        playerColor: data.playerColor || 'white',
      },
    ])
  }

  const scrollChatDown = () => {
    if (scrollRef.current) {
      scrollRef.current.scroll({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }

  const onFocusInput = () => {
    if (focusInputCallback) focusInputCallback()
  }
  const onFocusOutInput = () => {
    if (focusOutInputCallback) focusOutInputCallback()
  }

  useEffect(() => {
    scrollChatDown()
  }, [messageList])

  useEffect(() => {
    on(`message`, onMessage)
    return () => {
      off('message', onMessage)
    }
  }, [connected])

  const onSubmit = () => {
    if (!inputChat.current || !inputChat.current.value) return
    console.log('onSubmit', inputChat.current.value)
    emit('message:room', {
      playerColor: 'black',
      roomID: chatRoomID,
      message: inputChat.current.value,
    })
    inputChat.current.value = ''
  }

  return (
    <>
      <div
        className="h-[10rem] w-[15rem] sm:w-[20rem] md:w-[30rem] bg-black bg-opacity-50 rounded-md p-2 overflow-y-auto
        chatbox-scroll"
        ref={scrollRef}
      >
        <div className="space-y-1 text-white">
          {messageList.map((e) => (
            <div key={e.id}>
              <span className="mr-2">{e.username}:</span>
              <span className="break-words">{e.message}</span>
            </div>
          ))}
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <div className="mt-2">
          <div className="flex space-x-2">
            <input
              tabIndex={-1}
              ref={inputChat}
              placeholder="Enter text here..."
              className="appearance-none bg-black  bg-opacity-50 w-full rounded-md text-white p-2 focus:outline-none"
              onFocus={onFocusInput}
              onBlur={onFocusOutInput}
            />
            <button
              tabIndex={-1}
              className="bg-[#343A40] p-1 px-2 rounded-sm text-white"
              onClick={(e) => {
                e.preventDefault()
                onSubmit()
              }}
            >
              send
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
