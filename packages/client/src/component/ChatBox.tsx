import { useEffect, useRef, useState } from 'react'
import { useStore } from 'zustand'
import { FACTION } from '../const/faction'
import useChatMessage, { ChatMessage } from '../hook/useChatMessage'
import { appStore } from '../store/app'
import { useNumber } from 'react-hanger'
import { getComponentValue } from '@latticexyz/recs'
import { CHAT_ENDPOINT, MAX_SHOWN_CHAT } from '../const/chat'
import { Badge, Input, Stack, Typography, useTheme } from '@mui/material'
import { MainButton } from './common/MainButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'

export const ChatBoxWrapper = () => {
  const {
    networkLayer: { playerIndex, components },
  } = useStore(appStore, (state) => state)
  const name = getComponentValue(components.Name, playerIndex)?.value
  const faction = getComponentValue(components.Faction, playerIndex)?.value
  return <>{name && faction && <ChatBox faction={faction} name={name} />}</>
}

enum ChatBoxTab {
  Global,
  Faction,
}

export interface ChatBoxProps {
  name?: string
  faction?: number
}

export const ChatBox: React.FC<ChatBoxProps> = ({ name, faction }) => {
  const theme = useTheme()

  const globalRoomID = 'muddy-lobby'
  const factionRoomID = `muddy-${faction}`

  const scrollRef = useRef<HTMLDivElement>()
  const inputChat = useRef<HTMLInputElement>()

  const [currentTab, setCurrentTab] = useState(ChatBoxTab.Global)

  const globalChat = useChatMessage(CHAT_ENDPOINT, name, globalRoomID)
  const globalChatNotification = useNumber(0)
  const [globalMsgList, setGlobalMsgList] = useState<ChatMessage[]>([])

  const factionChat = useChatMessage(CHAT_ENDPOINT, name, factionRoomID)
  const factionChatNotification = useNumber(0)
  const [factionMsgList, setFactionMsgList] = useState<ChatMessage[]>([])

  const [isMinimize, setIsMinimize] = useState(false)

  const changeTabToGlobal = () => {
    setCurrentTab(ChatBoxTab.Global)
    globalChatNotification.setValue(0)
  }

  const changeTabToFaction = () => {
    setCurrentTab(ChatBoxTab.Faction)
    factionChatNotification.setValue(0)
  }

  const onMessageGlobal = (_msg: string, data: any) => {
    setCurrentTab((e) => {
      if (e !== ChatBoxTab.Global) globalChatNotification.increase(1)
      return e
    })
    setGlobalMsgList((e) => {
      if (e.length > MAX_SHOWN_CHAT) e.shift()
      return [
        ...e,
        {
          message: data.text,
          username: data.username,
          timestamp: Date.now(),
          playerColor: data.playerColor || 'white',
        },
      ]
    })
    scrollChatDown()
  }

  const toggleMinimize = () => {
    setIsMinimize(!isMinimize)
  }

  const onMessageFaction = (_msg: string, data: any) => {
    setCurrentTab((e) => {
      if (e !== ChatBoxTab.Faction) factionChatNotification.increase(1)
      return e
    })
    setFactionMsgList((e) => {
      if (e.length > MAX_SHOWN_CHAT) e.shift()
      return [
        ...e,
        {
          message: data.text,
          username: data.username,
          timestamp: Date.now(),
          playerColor: data.playerColor || 'white',
        },
      ]
    })
    scrollChatDown()
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
    if (!isMinimize) {
      switch (currentTab) {
        case ChatBoxTab.Global:
          globalChatNotification.setValue(0)
          break
        case ChatBoxTab.Faction:
          factionChatNotification.setValue(0)
          break
      }
    }
  }, [isMinimize, currentTab])

  const onFocusInput = () => {
    appStore.setState({ isFocusUI: true })
  }
  const onFocusOutInput = () => {
    appStore.setState({ isFocusUI: false })
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
      <div className="flex space-x-2 justify-between">
        <div className="flex space-x-2">
          <Badge badgeContent={globalChatNotification.value} color="secondary" max={99}>
            <MainButton
              size="small"
              sx={{
                color: currentTab === ChatBoxTab.Global ? theme.palette.grayScale.white : theme.palette.grayScale.black,
                backgroundColor:
                  currentTab === ChatBoxTab.Global ? theme.palette.grayScale.black : theme.palette.grayScale.almostGray,
              }}
              onClick={() => changeTabToGlobal()}
              type="button"
            >
              All
            </MainButton>
          </Badge>
          <Badge badgeContent={factionChatNotification.value} color="secondary" max={99}>
            <MainButton
              size="small"
              onClick={() => changeTabToFaction()}
              sx={{
                backgroundColor:
                  currentTab === ChatBoxTab.Faction
                    ? theme.palette.grayScale.black
                    : theme.palette.grayScale.almostGray,
              }}
              type="button"
            >
              Faction
            </MainButton>
          </Badge>
        </div>
        <div className="flex">
          <MainButton size="small" onClick={() => toggleMinimize()}>
            {isMinimize ? <FontAwesomeIcon icon={faCaretUp} /> : <FontAwesomeIcon icon={faCaretDown} />}
          </MainButton>
        </div>
      </div>
      <Stack
        ref={scrollRef}
        p={1}
        sx={{
          transition: 'all 0.3s ease',
          height: isMinimize ? 0 : 130,
          padding: isMinimize ? 0 : 1,
          overflowY: 'auto',
          backgroundColor: `${theme.palette.grayScale.black}B3`,
          borderRadius: '4px',
        }}
      >
        {currentTab === ChatBoxTab.Global &&
          globalMsgList.map((msg) => (
            <Stack key={msg.timestamp} spacing={1} direction="row">
              <Typography variant="body2" sx={{ color: msg.playerColor }}>
                {msg.username}
              </Typography>
              <Typography variant="body2">{msg.message}</Typography>
            </Stack>
          ))}
        {currentTab === ChatBoxTab.Faction &&
          factionMsgList.map((msg) => (
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
          <MainButton size="small" type="submit">
            Send
          </MainButton>
        </Stack>
      </form>
    </Stack>
  )
}
