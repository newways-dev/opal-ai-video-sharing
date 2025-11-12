import parse from 'html-react-parser'

type Props = {
  title: string
  html: string
}

const HowToPost = ({ title, html }: Props) => {
  return (
    <div className="flex flex-col gap-y-10 lg:col-span-2 mt-10">
      <div className="text-5xl font-bold">{title}</div>
      <div className="[&>h2]:text-3xl [&>h2]:mt-5 [&>h2]:mb-3 [&>p]:text-base [&>p]my-2 post--container">
        {parse(html || '')}
      </div>
    </div>
  )
}

export default HowToPost
