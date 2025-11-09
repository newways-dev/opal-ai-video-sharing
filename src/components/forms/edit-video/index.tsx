import FormGenerator from '@/components/global/form-generator'
import { useEditVideo } from '@/hooks/use-edit-video'
import Loader from '@/components/global/loader'
import { Button } from '@/components/ui/button'

type Props = {
  videoId: string
  title: string
  description: string
}

const EditVideoForm = ({ videoId, title, description }: Props) => {
  const { onFormSubmit, register, errors, isPending } = useEditVideo(
    videoId,
    title,
    description
  )

  return (
    <form onSubmit={onFormSubmit} className="flex flex-col gap-y-5">
      <FormGenerator
        register={register}
        errors={errors}
        name="title"
        inputType="input"
        type="text"
        label="Title"
        placeholder="Video title..."
      />
      <FormGenerator
        register={register}
        errors={errors}
        name="description"
        inputType="textarea"
        type="text"
        label="Description"
        lines={5}
        placeholder="Video description..."
      />
      <Button>
        <Loader state={isPending} color="#000">
          Update
        </Loader>
      </Button>
    </form>
  )
}

export default EditVideoForm
