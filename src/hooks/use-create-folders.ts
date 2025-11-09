import { useMutationData } from './use-mutation-data'
import { createFolder } from '@/actions/workspace'

export const useCreateFolders = (workspaceId: string) => {
  const { mutate } = useMutationData(
    ['create-folder'],
    () => createFolder(workspaceId),
    'workspace-folders'
  )

  const onCreateNewFolder = () =>
    mutate({ name: 'Untitled', id: 'optimistic--id' })

  return { onCreateNewFolder }
}
