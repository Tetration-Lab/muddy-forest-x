import { SyncState } from '@latticexyz/network'
import { useCallback, useEffect, useState } from 'react'
import { useStore } from 'zustand'
import { config } from '../config'
import { createNetworkLayer } from '../layer/network/createNetworkLayer'
import { PhaserLayer } from '../layer/phaser/phaserLayer'
import { UILayer } from '../layer/ui/UILayer'
import { appStore } from '../store/app'
import { createLoadingStateSystem } from '../system/createLoadingStateSystem'

export const Game = () => {
  const store = useStore(appStore, (state) => state)
  const [loaded, setLoaded] = useState(true)
  const onInitialSync = useCallback(async () => {
    const networkLayer = await createNetworkLayer(config)
    networkLayer.startSync()
    store.setNetworkLayer(networkLayer)
    createLoadingStateSystem(networkLayer, (stage, msg, percentage) => {
      if (stage === SyncState.LIVE) {
        console.log('SYNC DONE')
        setLoaded(true)
      }
      console.log('loading state', stage, msg, percentage)
    })
  }, [])

  useEffect(() => {
    onInitialSync()
  }, [onInitialSync])

  if (!loaded) return null
  return (
    <>
      <UILayer />
      <PhaserLayer />
    </>
  )
}
