import { SyncState } from '@latticexyz/network'
import { useCallback, useEffect, useState } from 'react'
import { useStore } from 'zustand'
import { config } from '../config'
import { createNetworkLayer } from '../layer/network/createNetworkLayer'
import { PhaserLayer } from '../layer/phaser/phaserLayer'
import { UILayer } from '../layer/ui/UILayer'
import { appStore } from '../store/app'
import { createLoadingStateSystem } from '../system/createLoadingStateSystem'
import { createCheckFractionSystem } from '../system/createCheckFractionSystem'
import { useNavigate } from 'react-router-dom'

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
export const Game = () => {
  const navigate = useNavigate()
  const store = useStore(appStore, (state) => state)
  const [loaded, setLoaded] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState<GameLoadingState>({
    msg: '',
    percentage: -1,
  })
  const onInitialSync = useCallback(async () => {
    const networkLayer = await createNetworkLayer(config)
    networkLayer.startSync()
    store.setNetworkLayer(networkLayer)
    createLoadingStateSystem(networkLayer, (stage, msg, percentage) => {
      if (stage === SyncState.LIVE) {
        console.log('SYNC DONE')
        setLoaded(true)
        createCheckFractionSystem({
          network: networkLayer,
          gotoGame: () => {
            // do nothing ?
            console.log('continue game')
          },
          gotoIntroPage: () => {
            console.log('createCheckFractionSystem done')
            // navigate(`/intro${window.location.search}`)
          },
        })
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
  }, [onInitialSync])

  if (!loaded) return <LoadingGame msg={loadingMsg.msg} percentage={loadingMsg.percentage} />
  return (
    <>
      <UILayer />
      <PhaserLayer />
    </>
  )
}
