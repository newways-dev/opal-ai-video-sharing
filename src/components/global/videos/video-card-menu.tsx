import ChangeVideoLocation from '@/components/forms/change-video-location'
import { MoveIcon } from 'lucide-react'
import Modal from '../modal'

type Props = {
  videoId: string
  currentWorkspace?: string
  currentFolder?: string
  currentFolderName?: string
}

const CardMenu = ({
  videoId,
  currentFolder,
  currentFolderName,
  currentWorkspace,
}: Props) => {
  return (
    <Modal
      className="flex items-center cursor-pointer gap-x-2"
      title="Move to new Workspace/Folder"
      description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
      trigger={<MoveIcon size={20} fill="#4f4f4f" className="text-[#4f4f4f]" />}
    >
      <ChangeVideoLocation
        currentFolder={currentFolder}
        currentFolderName={currentFolderName}
        currentWorkspace={currentWorkspace}
        videoId={videoId}
      />
    </Modal>
  )
}

export default CardMenu
