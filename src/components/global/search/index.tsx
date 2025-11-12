import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useMutationData } from '@/hooks/use-mutation-data'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { inviteMembers } from '@/actions/user'
import { useSearch } from '@/hooks/use-search'
import { Input } from '@/components/ui/input'
import { User } from 'lucide-react'
import Loader from '../loader'

type Props = {
  workspaceId: string
}

const Search = ({ workspaceId }: Props) => {
  const { query, onSearchQuery, isFetching, onUsers } = useSearch(
    'get-users',
    'USERS'
  )

  const { mutate, isPending } = useMutationData(
    ['invite-member'],
    (data: { recieverId: string; email: string }) =>
      inviteMembers(workspaceId, data.recieverId, data.email)
  )

  return (
    <div className="flex flex-col gap-5">
      <Input
        onChange={onSearchQuery}
        value={query}
        className="bg-transparent border-2 outline-none"
        placeholder="Search for user..."
        type="text"
      />

      {isFetching ? (
        <div className="flex flex-col gap-y-2">
          <Skeleton className="w-full h-8 rounded-xl" />
        </div>
      ) : !onUsers ? (
        <p className="text-center text-sm text-[#a4a4a4]">No Users Found</p>
      ) : (
        <div>
          {onUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-x-3 border-2 w-full p-3 rounded-xl"
            >
              <Avatar>
                <AvatarImage src={user.image as string} />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <h3 className="text-bold text-lg capitalize">
                  {user.firstname} {user.lastname}
                </h3>
                <p className="lowercase text-xs bg-white px-2 rounded-lg text-[#1e1e1e]">
                  {user.subscription?.plan}
                </p>
              </div>
              <div className="flex flex-1 justify-end items-center">
                <Button
                  onClick={() =>
                    mutate({ recieverId: user.id, email: user.email })
                  }
                  variant="default"
                  className="w-5/12 font-bold"
                >
                  <Loader state={isPending} color="#000">
                    Invite
                  </Loader>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Search
