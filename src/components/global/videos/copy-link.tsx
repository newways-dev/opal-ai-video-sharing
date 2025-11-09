import { Button } from '@/components/ui/button'
import { Links } from '@/components/icons'
import { toast } from 'sonner'

type Props = {
  videoId: string
  className?: string
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | null
}

const CopyLink = ({ videoId, className, variant }: Props) => {
  const onCopyClipboard = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_HOST_URL}/preview/${videoId}`
    )

    return toast('Copied', { description: 'Link copied to clipboard' })
  }

  return (
    <Button variant={variant} className={className} onClick={onCopyClipboard}>
      <Links />
    </Button>
  )
}

export default CopyLink
