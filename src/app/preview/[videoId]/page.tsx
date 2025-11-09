import { getUserProfile, getVideoComments } from '@/actions/user'
import VideoPreview from '@/components/global/videos/preview'
import { getPreviewVideo } from '@/actions/workspace'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'

type Props = {
  params: {
    videoId: string
  }
}

const Page = async ({ params: { videoId } }: Props) => {
  const query = new QueryClient()

  await query.prefetchQuery({
    queryKey: ['preview-video'],
    queryFn: () => getPreviewVideo(videoId),
  })

  await query.prefetchQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
  })

  await query.prefetchQuery({
    queryKey: ['video-comments'],
    queryFn: () => getVideoComments(videoId),
  })

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <VideoPreview videoId={videoId} />
    </HydrationBoundary>
  )
}

export default Page
