import { useEffect, useRef, useState } from 'react'
import useChatMessage, { ChatMessage } from '../hook/useChatMessage'

export const ChatBox = () => {
  const chatEndpoint = 'https://chat.tetrationlab.com/'
  const chatRoomID = 'lobby'

  const scrollRef = useRef<HTMLDivElement>()
  const inputChat = useRef<HTMLInputElement>()
  const { connected, on, emit, off, disconnect } = useChatMessage(chatEndpoint, 'test', chatRoomID)
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

  useEffect(() => {
    scrollChatDown()
  }, [messageList])

  useEffect(() => {
    emit('join:room', {
      roomID: chatRoomID,
    })
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
      <div className="h-[10rem] w-[20rem] bg-black bg-opacity-50 rounded-md p-2 overflow-y-auto" ref={scrollRef}>
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
            <input ref={inputChat} className=" appearance-none bg-black opacity-50 w-full rounded-sm text-white" />
            <button
              className="bg-[#ADB5BD] text-black p-1 rounded-sm"
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
