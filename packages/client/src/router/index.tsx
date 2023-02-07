import { Route, Routes } from 'react-router-dom'
import { Game } from '../page/Game'
import { Intro } from '../page/Intro'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Game />} />
      <Route path="/intro" element={<Intro />} />
    </Routes>
  )
}
