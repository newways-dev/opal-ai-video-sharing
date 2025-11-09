import EditVideoForm from '@/components/forms/edit-video'
import { Button } from '@/components/ui/button'
import { EditIcon } from 'lucide-react'
import Modal from '../modal'

type Props = {
  title: string
  description: string
  videoId: string
}

const EditVideo = ({ title, description, videoId }: Props) => {
  return (
    <Modal
      title="Edit video details"
      description="You can update your video details here!"
      trigger={
        <Button variant="ghost">
          <EditIcon className="text-[#6c6c6c]" />
        </Button>
      }
    >
      <EditVideoForm
        videoId={videoId}
        title={title}
        description={description}
      />
    </Modal>
  )
}

export default EditVideo
