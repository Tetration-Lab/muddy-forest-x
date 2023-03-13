import { SyncState } from '@latticexyz/network'
import { ThemeProvider } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useStore } from 'zustand'
import { createNetworkLayer } from './layer/network/createNetworkLayer'
import { createLoadingStateSystem } from './system/createLoadingStateSystem'
import { AppRoutes } from './router'
import { appStore } from './store/app'
import { workerStore } from './store/worker'
import { theme } from './themes/theme'
import { config } from './config'

interface LoadingGameProps {
  msg?: string
  percentage?: number
}
const LoadingGame: React.FC<LoadingGameProps> = ({ msg, percentage }) => {
  return (
    <>
      <div className="h-full w-full flex text-white justify-center items-center">
        <div>
          <div className="flex justify-center">Loading...</div>
          <div className="flex justify-center">{percentage !== -1 && <div>{percentage.toFixed(2)}</div>}</div>
          <div className="flex justify-center">{msg && <div>{msg}</div>}</div>
        </div>
      </div>
    </>
  )
}

interface GameLoadingState {
  msg: string
  percentage: number
}

function App() {
  const store = useStore(appStore, (state) => state)
  const [loaded, setLoaded] = useState(false)

  const [loadingMsg, setLoadingMsg] = useState<GameLoadingState>({
    msg: '',
    percentage: -1,
  })
  const onInitialSync = useCallback(async () => {
    workerStore.setState({
      createWorker: () =>
        new ComlinkWorker<typeof import('./miner/hasher.worker')>(new URL('./miner/hasher.worker.ts', import.meta.url)),
    })
    const networkLayer = await createNetworkLayer(config)
    networkLayer.startSync()
    store.setNetworkLayer(networkLayer)
    createLoadingStateSystem(networkLayer, (stage, msg, percentage) => {
      if (stage === SyncState.LIVE) {
        console.log('SYNC DONE')
        setLoaded(true)
        return
      }
      setLoadingMsg({
        msg,
        percentage,
      })
      console.log('loading state', stage, msg, percentage)
    })
  }, [])

  useEffect(() => {
    onInitialSync()
    // disable right click
    document.addEventListener('contextmenu', (event) => {
      event.preventDefault()
    })
  }, [onInitialSync])

  if (!loaded) return <LoadingGame msg={loadingMsg.msg} percentage={loadingMsg.percentage} />

  return (
    <>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App
