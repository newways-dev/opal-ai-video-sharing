type Props = {
  children: React.ReactNode
}

const WorkspacePlaceholder = ({ children }: Props) => {
  return (
    <span className="bg-[#545454] flex items-center font-bold justify-center w-8 h-7 px-2 rounded-sm text-[#1d1d1d]">
      {children}
    </span>
  )
}

export default WorkspacePlaceholder
