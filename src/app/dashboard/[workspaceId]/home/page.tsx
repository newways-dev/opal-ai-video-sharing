import { getWixContent, howToPost } from '@/actions/workspace'
import VideoCard from '@/components/global/videos/video-card'
import HowToPost from '@/components/global/how-to-post'

const Home = async () => {
  const videos = await getWixContent()
  const post = await howToPost()

  return (
    <div className="flex items-center justify-center flex-col gap-2">
      <div className="text-2xl font-bold">A Message From The Opal Team</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:w-1/2">
        {videos.status === 200 &&
          videos.data?.map((video) => (
            <VideoCard
              key={video.id}
              {...video}
              workspaceId={video.workSpaceId!}
            />
          ))}
        <HowToPost title={post.title} html={post.content} />
      </div>
    </div>
  )
}

export default Home
