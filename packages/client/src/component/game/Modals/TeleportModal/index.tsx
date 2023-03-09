import { FaQuestion } from 'react-icons/fa'
import { Box, ButtonBase, useTheme } from '@mui/material'
import { HiXMark } from 'react-icons/hi2'
import Draggable from 'react-draggable'
export interface Props {
  open?: boolean
  onClose: () => void
  energy: number
  maxMaxEnergy: number
  distance: number
  position?: { x: number; y: number }
}

export const TeleportModal = ({ open = false, position = { x: 0, y: 0 } }) => {
  const theme = useTheme()
  if (!open) return null
  return (
    <>
      <Draggable
        bounds="body"
        defaultPosition={{
          x: position.x,
          y: position.y,
        }}
      >
        <div className="absolute bg-[#1E1E1E] w-[300px] px-2 pb-4 pt-1 text-white">
          <div className="flex justify-between p-1">
            <div className="flex space-x-2 items-center">
              <div className="w-8 h-8  p-2 bg-[#4A5056] rounded-md">
                <img src="./assets/svg/teleport-icon.svg" alt="" />
              </div>
              <div>Teleport</div>
            </div>
            <div className="flex">
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-[#353A3F] p-1">
                  <FaQuestion />
                </div>
                <ButtonBase
                  sx={{
                    width: 28,
                    height: 28,
                    backgroundColor: theme.palette.grayScale.almostBlack,
                    border: `2px solid ${theme.palette.grayScale.black}`,
                    borderRadius: '4px',
                  }}
                >
                  <Box component={HiXMark} />
                </ButtonBase>
              </div>
            </div>
          </div>
          <section className="bg-[#222529] p-2 space-y-2">
            <div>Saved coordinate</div>
            <div className="p-2 border-2 border-dashed rounded-md border-[#787C80] bg-[#363A3F] text-center text-gray-500">
              Empty
            </div>
          </section>

          <section>
            <div className="flex justify-between p-2 bg-[#222529]">
              <div>Enter teleport position</div>
              <div className="w-8 h-8 bg-[#4A5056] rounded-md flex items-center justify-center">
                <img src="./assets/svg/save-icon.svg" alt="" />
              </div>
            </div>
            <div className="flex p-2 space-x-2">
              <div className="w-full p-2 bg-[#4A5056] rounded-md text-center">
                <input className="w-full bg-transparent outline-none" placeholder="X coordinate" />
              </div>
              <input className="w-full bg-transparent outline-none" placeholder="Y coordinate" />
            </div>
          </section>
          <section>
            <div>Resource estimation</div>
            <div className="flex p-2 space-x-2">
              <div className="flex items-center w-full p-2 bg-[#222529] rounded-md text-center">
                <span>
                  <img src="./assets/svg/item-energy-icon.svg" alt="item-energy-icon" />
                </span>
                <span>
                  <span className="text-green-500">100</span> / 200
                </span>
              </div>
              <div className="flex items-center w-full p-2 bg-[#222529] rounded-md text-center">
                <span>
                  <img src="./assets/svg/item-distance-icon.svg" alt="item-energy-icon" />
                </span>
                <span>xxx m</span>
              </div>
            </div>
          </section>
          <section className="flex justify-center">
            <button className="text-white p-2 bg-[#4A5056] rounded-md">Teleport</button>
          </section>
        </div>
      </Draggable>
    </>
  )
}
