import FormGenerator from '@/components/global/form-generator'
import { useVideoComment } from '@/hooks/use-video'
import Loader from '@/components/global/loader'
import { Button } from '@/components/ui/button'
import { SendIcon } from 'lucide-react'

type Props = {
  author: string
  videoId: string
  commentId?: string
  close?: () => void
}

const CommentForm = ({ author, videoId, commentId, close }: Props) => {
  const { errors, isPending, onFormSubmit, register } = useVideoComment(
    videoId,
    commentId
  )

  return (
    <form className="relative w-full" onSubmit={onFormSubmit}>
      <FormGenerator
        register={register}
        errors={errors}
        placeholder={`Respond to ${author}...`}
        name="comment"
        inputType="input"
        type="text"
      />
      <Button
        className="p-0 bg-transparent absolute top-[1px] right-3 hover:bg-transparent"
        type="submit"
      >
        <Loader state={isPending}>
          <SendIcon
            className="text-white/50 cursor-pointer hover:text-white/80"
            size={18}
          />
        </Loader>
      </Button>
    </form>
  )
}

export default CommentForm
