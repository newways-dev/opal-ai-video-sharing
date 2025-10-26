import { Spinner } from './spinner'
import { cn } from '@/lib/utils'

type Props = {
  state: boolean
  className?: string
  color?: string
  children?: React.ReactNode
}

const Loader = ({ state, className, color, children }: Props) => {
  return state ? (
    <Spinner color={color} />
  ) : (
    <div className={cn(className)}>{children}</div>
  )
}

export default Loader
