import { SyncState } from '@latticexyz/network'
import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useStore } from 'zustand'
import { config } from './config'
import { createNetworkLayer } from './layer/network/createNetworkLayer'

import { AppRoutes } from './router'
import { appStore } from './store/app'
import { createLoadingStateSystem } from './system/createLoadingStateSystem'

function App() {
  const store = useStore(appStore, (state) => state)

  const onInitialSync = async () => {
    const networkLayer = await createNetworkLayer(config)
    networkLayer.startSync()
    store.setNetworkLayer(networkLayer)
    createLoadingStateSystem(networkLayer, (stage, msg, percentage) => {
      if (stage === SyncState.LIVE) {
        console.log('SYNC DONE')
      }
      console.log('loading state', stage, msg, percentage)
    })
  }

  useEffect(() => {
    onInitialSync()
  }, [])

  return (
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  )
}

export default App
