import VideoRecorderIcon from '@/components/icons/video-recorder'
import { SearchIcon, UploadIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserButton } from '@clerk/nextjs'

const InfoBar = () => {
  return (
    <header className="pl-20 md:pl-[265px] fixed p-4 w-full flex items-center justify-between gap-4">
      <div className="flex items-center justify-center gap-4 border-2 rounded-full px-4 w-full max-w-lg">
        <SearchIcon size={25} className="text-[#707070]" />
        <Input
          className="bg-transparent border-none !placeholder-neutral-500"
          placeholder="Search for people, projects, tags & folders"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button className="bg-[#9D9D9D] flex items-center gap-2">
          <UploadIcon size={20} />{' '}
          <span className="flex items-center gap-2">Upload</span>
        </Button>
        <Button className="bg-[#9D9D9D] flex items-center gap-2">
          <VideoRecorderIcon />
          <span className="flex items-center gap-2">Record</span>
        </Button>
        <UserButton />
      </div>
    </header>
  )
}

export default InfoBar
