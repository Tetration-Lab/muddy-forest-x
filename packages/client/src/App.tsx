import { getComponentValue, getComponentValueStrict } from '@latticexyz/recs'
import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useStore } from 'zustand'
import { config } from './config'
import { createNetworkLayer } from './layer/network/createNetworkLayer'
import { AppRoutes } from './router'
import { appStore } from './store/app'
import { createLoadingStateSystem } from './system/createLoadingStateSystem'

function App() {
  const store = useStore(appStore,(state)=>state)
  useEffect(() => {
    (async()=>{
      const networkLayer = await createNetworkLayer(config)
      networkLayer.startSync()
      store.setNetworkLayer(networkLayer)
      createLoadingStateSystem(networkLayer,()=>{
        console.log('ok')
      })
    })()
  },[])
  
  return (
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  )
}

export default App
