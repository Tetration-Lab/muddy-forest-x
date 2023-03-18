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
import { SnackbarProvider } from 'notistack'
import { Loading } from './component/Loading'

function App() {
  const store = useStore(appStore, (state) => state)
  const [loaded, setLoaded] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState<{ msg: string; percentage: number }>({
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
    appStore.setState({ networkLayer })
    createLoadingStateSystem(networkLayer, (stage, msg, percentage) => {
      setLoaded(stage === SyncState.LIVE)
      setLoadingMsg({
        msg,
        percentage,
      })
    })
  }, [])

  useEffect(() => {
    onInitialSync()
    document.addEventListener('contextmenu', (event) => {
      event.preventDefault()
    })
  }, [])

  return (
    <>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          maxSnack={2}
          dense={true}
          anchorOrigin={{
            horizontal: 'center',
            vertical: 'top',
          }}
          autoHideDuration={2000}
          style={{ fontFamily: 'Fira Mono', borderRadius: '100px', justifyContent: 'center' }}
        >
          {!loaded ? (
            <Loading msg={loadingMsg.msg} percentage={loadingMsg.percentage} />
          ) : (
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          )}
        </SnackbarProvider>
      </ThemeProvider>
    </>
  )
}

export default App
