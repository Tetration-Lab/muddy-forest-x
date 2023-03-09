import { FaQuestion, FaTimes } from 'react-icons/fa'

export const TeleportModal = () => {
  return (
    <>
      <div className="bg-[#1E1E1E] w-[300px] p-2 py-4 text-white">
        <div className="flex justify-between p-2">
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
              <div className="flex items-center bg-[#353A3F] p-1">
                <FaTimes />
              </div>
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
            <div className="w-full p-2 bg-[#4A5056] rounded-md text-center">X coordinate</div>
            <div className="w-full p-2 bg-[#4A5056] rounded-md text-center">Y coordinate</div>
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
    </>
  )
}
