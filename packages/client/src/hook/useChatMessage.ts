import pubsub from 'pubsub-js'
import { useEffect, useRef, useState } from 'react'
import socketio, { Socket } from 'socket.io-client'

export interface ChatMessage {
  message: string
  username: string
  timestamp: number
  playerColor: string
}

type SocketEventCallbackFunction = (...args: unknown[]) => void
export default function useSocketIO(url: string, username: string, roomID = '') {
  const socket = useRef<Socket | null>()
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    socket.current = socketio(url, {
      auth: {
        username: `${username}`,
      },
    })
    socket.current.connect()
    socket.current.on('connect', () => {
      emit('join:room', {
        roomID: roomID,
      })
      setConnected(true)
    })

    socket.current.onAny((event, args) => {
      pubsub.publish(event + roomID, args)
    })

    socket.current.on('disconnect', () => {
      setConnected(false)
    })
    return () => {
      if (socket.current) socket.current.disconnect()
    }
  }, [roomID])

  const emit = (event: string, ...args: unknown[]) => {
    if (socket.current) socket.current.emit(event, ...args)
  }

  const on = (event: string, cbFunction: SocketEventCallbackFunction) => {
    pubsub.subscribe(event + roomID, cbFunction)
  }

  const off = (event: string, cbFunction: SocketEventCallbackFunction) => {
    if (socket.current) {
      socket.current.off(event, cbFunction)
    }
    pubsub.unsubscribe(event)
  }

  const disconnect = () => {
    if (socket.current) {
      socket.current.disconnect()
    }
  }

  const connect = () => {
    if (connected) {
      return
    }
    if (socket.current) {
      socket.current.connect()
    }
  }

  return {
    socket: socket.current,
    emit,
    on,
    off,
    connected,
    disconnect,
    connect,
  }
}
