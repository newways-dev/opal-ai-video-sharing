'use client'

import { useMutationDataState } from '@/hooks/use-mutation-data'
import FolderDuotone from '@/components/icons/folder-duotone'
import { getWorkspaceFolders } from '@/actions/workspace'
import { useQueryData } from '@/hooks/use-query-data'
import { FOLDERS } from '@/redux/slices/folders'
import { ArrowRightIcon } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { cn } from '@/lib/utils'
import Folder from './folder'

type Props = { workspaceId: string }

export type FoldersProps = {
  status: number
  data: ({
    _count: {
      videos: number
    }
  } & {
    id: string
    name: string
    createdAt: Date
    workSpaceId: string | null
  })[]
}

const Folders = ({ workspaceId }: Props) => {
  const dispatch = useDispatch()
  const { data, isFetched } = useQueryData(['workspace-folders'], () =>
    getWorkspaceFolders(workspaceId)
  )

  const { latestVariables } = useMutationDataState(['create-folder'])
  const { status, data: folders } = data as FoldersProps

  if (isFetched && folders) {
    dispatch(FOLDERS({ folders: folders }))
  }

  // Optimistic variable
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <FolderDuotone />
          <h2 className="text-[#bdbdbd] text-xl">Folders</h2>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-[#bdbdbd]">See all</p>
          <ArrowRightIcon color="#707070" />
        </div>
      </div>
      <section
        className={cn(
          status !== 200 && 'justify-center',
          'flex items-center gap-4 overflow-x-auto w-full'
        )}
      >
        {status !== 200 ? (
          <p className="text-neutral-300">No folders in workspace</p>
        ) : (
          <>
            {latestVariables && latestVariables.status === 'pending' && (
              <Folder
                name={latestVariables.variables.name}
                id={latestVariables.variables.id}
                optimistic
              />
            )}
            {folders.map((folder) => (
              <Folder
                key={folder.id}
                id={folder.id}
                name={folder.name}
                count={folder._count.videos}
              />
            ))}
          </>
        )}
      </section>
    </div>
  )
}

export default Folders
