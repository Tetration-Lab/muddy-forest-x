/* eslint-disable @typescript-eslint/no-empty-function */
import { Box, ButtonBase, useTheme } from '@mui/material'
import { HiXMark } from 'react-icons/hi2'

export interface Props {
  isOpen?: boolean
  onClose?: () => void
  onConfirm?: () => void
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ConfirmMoveModal = ({ isOpen = false, onClose = () => {}, onConfirm = () => {} }) => {
  const theme = useTheme()
  return (
    <>
      <div id="confirm-move-modal" className="absolute bg-[#1E1E1E] w-[300px] px-2 pb-4 pt-1 text-white">
        <div className="flex justify-between p-1">
          <div className="flex space-x-2 items-center">
            <div className="w-8 h-8  p-2 bg-[#4A5056] rounded-md">
              <img src="./assets/svg/teleport-icon.svg" alt="" />
            </div>
            <div>Confirm Teleport</div>
          </div>
          <div className="flex">
            <div className="flex items-center space-x-2">
              <ButtonBase
                onClick={() => onClose()}
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
        <div className="p-1">
          <section>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <div>From</div>
                <div>(200, 300)</div>
              </div>
              <div className="flex justify-between">
                <div>To</div>
                <div>(400 ,500)</div>
              </div>
            </div>
          </section>
          <section className="flex justify-between mt-4">
            <button className="px-2 bg-[#4A5056] rounded-sm">Confirm</button>
            <button className="px-2 bg-[#4A5056] rounded-sm">Cancel</button>
          </section>
        </div>
      </div>
    </>
  )
}
