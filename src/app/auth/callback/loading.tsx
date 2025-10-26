import { Spinner } from '@/components/global/loader/spinner'

const AuthLoading = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <Spinner />
    </div>
  )
}

export default AuthLoading
