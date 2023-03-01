import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from 'zustand'
import { PhaserLayer } from '../layer/phaser/phaserLayer'
import { UILayer } from '../layer/ui/UILayer'
import { appStore } from '../store/app'
import { createCheckFractionSystem } from '../system/createCheckFractionSystem'

export const Game = () => {
  const store = useStore(appStore, (state) => state)
  const navigate = useNavigate()
  useEffect(() => {
    const networkLayer = store.networkLayer
    createCheckFractionSystem({
      network: networkLayer,
      gotoGame: () => {
        // do nothing ?
        console.log('ontinue gamec')
      },
      gotoIntroPage: () => {
        console.log('createCheckFractionSystem done')
        navigate(`intro/${window.location.search}`)
      },
    })
  }, [])
  return (
    <>
      <UILayer />
      <PhaserLayer />
    </>
  )
}
