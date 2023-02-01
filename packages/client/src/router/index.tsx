import { Route, Routes } from 'react-router-dom'
import { Game } from '../page/Game'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Game />} />
    </Routes>
  )
}
