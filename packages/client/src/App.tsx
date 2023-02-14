import { SyncState } from '@latticexyz/network'
import { ThemeProvider } from '@mui/material'
import { useCallback, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useStore } from 'zustand'
import { config } from './config'
import { createNetworkLayer } from './layer/network/createNetworkLayer'

import { AppRoutes } from './router'
import { appStore } from './store/app'
import { workerStore } from './store/worker'
import { createLoadingStateSystem } from './system/createLoadingStateSystem'
import { theme } from './themes/theme'

function App() {
  const store = useStore(appStore, (state) => state)
  const wStore = useStore(workerStore, (state) => state)
  const onInitialSync = useCallback(async () => {
    const networkLayer = await createNetworkLayer(config)
    networkLayer.startSync()
    store.setNetworkLayer(networkLayer)
    createLoadingStateSystem(networkLayer, (stage, msg, percentage) => {
      if (stage === SyncState.LIVE) {
        console.log('SYNC DONE')
      }
      console.log('loading state', stage, msg, percentage)
    })
    const worker = new ComlinkWorker<typeof import('./miner/hasher.worker')>(
      new URL('./miner/hasher.worker.ts', import.meta.url),
    )
    wStore.setWorker(worker)
    // const result = await worker.HashTwo([
    //   {
    //     x: '0x1',
    //     y: '0x2',
    //   },
    // ])
    // const val = hash.hash_two('0x1', '0x2')
    // console.log('hash', result)
  }, [])

  useEffect(() => {
    onInitialSync()
  }, [onInitialSync])

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
