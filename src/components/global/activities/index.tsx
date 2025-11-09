import CommentForm from '@/components/forms/comment-form'
import { VideoCommentProps } from '@/types/index.type'
import { useQueryData } from '@/hooks/use-query-data'
import { TabsContent } from '@/components/ui/tabs'
import { getVideoComments } from '@/actions/user'
import CommentCard from '../comment-card'

type Props = {
  author: string
  videoId: string
}

const Activities = ({ author, videoId }: Props) => {
  const { data } = useQueryData(['video-comments'], () =>
    getVideoComments(videoId)
  )

  const { data: comments } = data as VideoCommentProps

  return (
    <TabsContent value="Activity" className="rounded-xl flex flex-col gap-y-5">
      <CommentForm author={author} videoId={videoId} />
      {comments?.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment.comment}
          author={{
            image: comment.User?.image!,
            firstname: comment.User?.firstname!,
            lastname: comment.User?.lastname!,
          }}
          videoId={videoId}
          commentId={comment.id}
          reply={comment.reply}
          createdAt={comment.createdAt}
        />
      ))}
    </TabsContent>
  )
}

export default Activities
