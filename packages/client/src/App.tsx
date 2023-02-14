import { SyncState } from '@latticexyz/network'
import { ThemeProvider } from '@mui/material'
import { useCallback, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useStore } from 'zustand'
import { config } from './config'
import { createNetworkLayer } from './layer/network/createNetworkLayer'

import { AppRoutes } from './router'
import { appStore } from './store/app'
import { createLoadingStateSystem } from './system/createLoadingStateSystem'
import { theme } from './themes/theme'

function App() {
  const store = useStore(appStore, (state) => state)

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
    const worker = new ComlinkWorker<typeof import('./miner/hasher')>(new URL('./miner/hasher.ts', import.meta.url))
    const hashInstance = await new worker.HasherInstance()
    await hashInstance.init()
    // const hash = await worker.HashTwo('0x1', '0x2')
    // const val = hash.hash_two('0x1', '0x2')
    console.log('hash', hashInstance.instance.hash_two('0x1', '0x2'))
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
