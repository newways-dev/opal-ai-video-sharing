import { moveVideoSchema } from '@/components/forms/change-video-location/schema'
import { getWorkspaceFolders, moveVideoLocation } from '@/actions/workspace'
import { useMutationData } from './use-mutation-data'
import { useAppSelector } from '@/redux/store'
import { useEffect, useState } from 'react'
import useZodForm from './use-zod-form'

export const useMoveVideos = (videoId: string, currentWorkspace: string) => {
  const { workspaces } = useAppSelector((state) => state.WorkSpaceReducer)
  const { folders } = useAppSelector((state) => state.FolderReducer)

  const [isFetching, setIsFetching] = useState(false)
  const [isFolders, setIsFolders] = useState<
    | ({
        _count: {
          videos: number
        }
      } & {
        id: string
        name: string
        createdAt: Date
        workSpaceId: string | null
      })[]
    | undefined
  >(undefined)

  // optimistic mutation data
  const { mutate, isPending } = useMutationData(
    ['change-video-location'],
    (data: { folder_id: string; workspace_id: string }) =>
      moveVideoLocation(videoId, data.workspace_id, data.folder_id)
  )
  const { errors, onFormSubmit, watch, register } = useZodForm(
    moveVideoSchema,
    mutate,
    { folder_id: null, workspace_id: currentWorkspace }
  )

  //fetch folders
  const fetchFolders = async (workspace: string) => {
    setIsFetching(true)
    const folders = await getWorkspaceFolders(workspace)
    setIsFetching(false)
    setIsFolders(folders.data)
  }
  useEffect(() => {
    fetchFolders(currentWorkspace)
  }, [])

  useEffect(() => {
    const workspace = watch(async (value) => {
      if (value.workspace_id) fetchFolders(value.workspace_id)
    })

    return () => workspace.unsubscribe()
  }, [watch])

  return {
    onFormSubmit,
    errors,
    register,
    isPending,
    folders,
    workspaces,
    isFetching,
    isFolders,
  }
}
