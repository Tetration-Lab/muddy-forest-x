import { ThemeProvider } from '@mui/material'
import { useCallback, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useStore } from 'zustand'

import { AppRoutes } from './router'
import { workerStore } from './store/worker'
import { theme } from './themes/theme'

function App() {
  const wStore = useStore(workerStore, (state) => state)
  const onInitialSync = useCallback(async () => {
    const worker = new ComlinkWorker<typeof import('./miner/hasher.worker')>(
      new URL('./miner/hasher.worker.ts', import.meta.url),
    )
    wStore.setWorker(worker)
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
