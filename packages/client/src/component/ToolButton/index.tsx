export interface ToolButtonProps {
  onClick?: () => void
  title?: string
  iconSrc: string
}
export const ToolButton: React.FC<ToolButtonProps> = ({ title, iconSrc }) => {
  return (
    <>
      <div className="flex justify-center flex-col items-center">
        <div
          tabIndex={-1}
          className="select-none w-12 h-12 bg-[#343A40] rounded-lg flex items-center justify-center border-2 border-[#212529] transform transition-all linear duration-75 active:scale-95"
        >
          <img tabIndex={-1} draggable="false" src={iconSrc} alt="" />
        </div>
        {title && <span className="text-sm text-white">{title}</span>}
      </div>
    </>
  )
}
