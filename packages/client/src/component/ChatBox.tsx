import { useCallback, useEffect, useRef, useState } from 'react'
import { useStore } from 'zustand'
import { FACTION } from '../const/faction'
import useChatMessage, { ChatMessage } from '../hook/useChatMessage'
import { appStore } from '../store/app'
import { useArray, useNumber } from 'react-hanger'
import { getComponentValue } from '@latticexyz/recs'
import { CHAT_ENDPOINT, MAX_SHOWN_CHAT } from '../const/chat'
import { FormControl, Input, Stack, Typography, useTheme } from '@mui/material'
import { MainButton } from './common/MainButton'

export const ChatBoxWrapper = () => {
  const {
    networkLayer: { playerIndex, components },
    setFocusUI,
  } = useStore(appStore, (state) => state)
  const name = getComponentValue(components.Name, playerIndex)?.value
  const faction = getComponentValue(components.Faction, playerIndex)?.value
  return (
    <>
      {name && faction && (
        <ChatBox
          faction={faction}
          name={name}
          focusInputCallback={() => setFocusUI(true)}
          focusOutInputCallback={() => setFocusUI(false)}
        />
      )}
    </>
  )
}

enum ChatBoxTab {
  Global,
  Faction,
}

export interface ChatBoxProps {
  focusInputCallback?: () => void
  focusOutInputCallback?: () => void
  name?: string
  faction?: number
}

export const ChatBox: React.FC<ChatBoxProps> = ({ focusInputCallback, focusOutInputCallback, name, faction }) => {
  const theme = useTheme()

  const globalRoomID = 'muddy-lobby'
  const factionRoomID = `muddy-${faction}`

  const scrollRef = useRef<HTMLDivElement>()
  const inputChat = useRef<HTMLInputElement>()

  const [currentTab, setCurrentTab] = useState(ChatBoxTab.Global)

  const globalChat = useChatMessage(CHAT_ENDPOINT, name, globalRoomID)
  const globalChatNotification = useNumber(0)
  const globalMsgList = useArray<ChatMessage>([])

  const factionChat = useChatMessage(CHAT_ENDPOINT, name, factionRoomID)
  const factionChatNotification = useNumber(0)
  const factionMsgList = useArray<ChatMessage>([])

  const toggleTab = () => {
    if (currentTab === ChatBoxTab.Global) {
      setCurrentTab(ChatBoxTab.Faction)
      factionChatNotification.setValue(0)
    } else {
      setCurrentTab(ChatBoxTab.Global)
      globalChatNotification.setValue(0)
    }
  }

  const onMessageGlobal = (_msg: string, data: any) => {
    if (globalMsgList.value.length > MAX_SHOWN_CHAT) globalMsgList.removeIndex(0)
    if (currentTab !== ChatBoxTab.Global) globalChatNotification.increase(1)
    globalMsgList.push({
      message: data.text,
      username: data.username,
      timestamp: Date.now(),
      playerColor: data.playerColor || 'white',
    })
  }

  const onMessageFaction = (_msg: string, data: any) => {
    if (factionMsgList.value.length > MAX_SHOWN_CHAT) factionMsgList.removeIndex(0)
    if (currentTab !== ChatBoxTab.Faction) factionChatNotification.increase(1)
    factionMsgList.push({
      message: data.text,
      username: data.username,
      timestamp: Date.now(),
      playerColor: data.playerColor || 'white',
    })
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
    if (currentTab === ChatBoxTab.Global) {
      scrollChatDown()
    }
  }, [globalMsgList])

  useEffect(() => {
    if (currentTab === ChatBoxTab.Faction) {
      scrollChatDown()
    }
  }, [factionMsgList])

  useEffect(() => {
    globalChat.on(`message`, onMessageGlobal)
    factionChat.on(`message`, onMessageFaction)
    return () => {
      globalChat.off(`message`, onMessageGlobal)
      factionChat.off(`message`, onMessageFaction)
    }
  }, [globalChat.connected, factionChat.connected])

  const onSubmit = () => {
    if (!inputChat.current || !inputChat.current.value) return
    if (currentTab === ChatBoxTab.Global) {
      globalChat.emit('message:room', {
        message: inputChat.current.value,
        playerColor: FACTION[faction]?.color ?? 'white',
        roomID: globalRoomID,
      })
    } else {
      factionChat.emit('message:room', {
        message: inputChat.current.value,
        playerColor: FACTION[faction]?.color ?? 'white',
        roomID: factionRoomID,
      })
    }
    inputChat.current.value = ''
  }

  return (
    <Stack spacing={0.5} sx={{ width: 350 }}>
      <Stack
        ref={scrollRef}
        p={1}
        sx={{
          height: 130,
          overflowY: 'auto',
          backgroundColor: `${theme.palette.grayScale.black}B3`,
          borderRadius: '4px',
        }}
      >
        {globalMsgList.value.map((msg) => (
          <Stack key={msg.timestamp} spacing={1} direction="row">
            <Typography variant="body2" sx={{ color: msg.playerColor }}>
              {msg.username}
            </Typography>
            <Typography variant="body2">{msg.message}</Typography>
          </Stack>
        ))}
      </Stack>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <Stack direction="row" spacing={0.5}>
          <Input
            id="chat-input"
            sx={{
              backgroundColor: theme.palette.grayScale.black,
              height: '3em',
              px: 2,
              fontSize: 12,
              borderRadius: '4px',
              appearance: 'none',
              focus: { outline: 'none' },
            }}
            fullWidth
            inputRef={inputChat}
            onFocus={onFocusInput}
            onBlur={onFocusOutInput}
            autoComplete="off"
            autoCorrect="off"
            placeholder="Enter text here..."
          />
          <MainButton type="submit">Send</MainButton>
        </Stack>
      </form>
    </Stack>
  )

  return (
    <>
      <div
        className="h-[10rem] w-[15rem] sm:w-[20rem] md:w-[30rem] bg-black bg-opacity-50 rounded-md p-2 overflow-y-auto
        chatbox-scroll"
        ref={scrollRef}
      >
        <div className="space-y-1 text-white">
          {globalMsgList.value.map((e) => (
            <div key={e.timestamp}>
              <span
                className="mr-2"
                style={{
                  color: e.playerColor,
                }}
              >
                {e.username}:
              </span>
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
              id="chat-input"
              tabIndex={-1}
              ref={inputChat}
              placeholder="Enter text here..."
              className="appearance-none bg-black  bg-opacity-50 w-full rounded-md text-white p-2 focus:outline-none"
              onFocus={onFocusInput}
              onBlur={onFocusOutInput}
              autoComplete="off"
              autoCorrect="off"
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
