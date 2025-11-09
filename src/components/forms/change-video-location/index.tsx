import { Separator } from '@/components/ui/separator'
import { useMoveVideos } from '@/hooks/use-folders'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Loader from '@/components/global/loader'
import { Label } from '@/components/ui/label'

type Props = {
  currentFolder?: string
  currentFolderName?: string
  currentWorkspace?: string
  videoId: string
}

const ChangeVideoLocation = ({
  currentFolder,
  currentFolderName,
  currentWorkspace,
  videoId,
}: Props) => {
  const {
    register,
    isPending,
    onFormSubmit,
    folders,
    workspaces,
    isFetching,
    isFolders,
  } = useMoveVideos(videoId, currentWorkspace!)

  const folder = folders.find((folder) => folder.id === currentFolder)
  const workspace = workspaces.find(
    (workspace) => workspace.id === currentWorkspace
  )

  return (
    <form className="flex flex-col gap-y-5" onSubmit={onFormSubmit}>
      <div className="border rounded-xl p-5">
        <h2 className="text-xs text-[#a4a4a4]">Current Workspace</h2>
        {workspace && <p>{workspace.name}</p>}
        <h2 className="text-xs text-[#a4a4a4] mt-4">Current Folder</h2>
        {folder ? <p>{folder.name}</p> : 'This video has no folder'}
      </div>
      <Separator orientation="horizontal" />
      <div className="flex flex-col gap-y-5 p-5 border rounded-xl">
        <h2 className="text-xs text-[#a4a4a4]">To</h2>
        <Label className="flex flex-col gap-y-2">
          <p className="text-xs">Workspace</p>
          <select
            className="rounded-xl text-base bg-transparent"
            {...register('workspace_id')}
          >
            {workspaces.map((space) => (
              <option
                key={space.id}
                value={space.id}
                className="text-[#a4a4a4]"
              >
                {space.name}
              </option>
            ))}
          </select>
        </Label>
        {isFetching ? (
          <Skeleton className="w-full h-[40px] rounded-xl" />
        ) : (
          <Label className="flex flex-col gap-y-2">
            <p className="text-xs">Folders in this workspace</p>
            {isFolders && isFolders.length > 0 ? (
              <select
                {...register('folder_id')}
                className="rounded-xl bg-transparent text-base"
              >
                {isFolders.map((folder, key) =>
                  key === 0 ? (
                    <option
                      key={folder.id}
                      className="text-[#a4a4a4]"
                      value={folder.id}
                    >
                      {folder.name}
                    </option>
                  ) : (
                    <option
                      key={folder.id}
                      className="text-[#a4a4a4]"
                      value={folder.id}
                    >
                      {folder.name}
                    </option>
                  )
                )}
              </select>
            ) : (
              <p className="text-[#a4a4a4] text-sm">
                This workspace has no folders
              </p>
            )}
          </Label>
        )}
      </div>
      <Button>
        <Loader state={isPending} color="#000">
          Transfer
        </Loader>
      </Button>
    </form>
  )
}

export default ChangeVideoLocation
