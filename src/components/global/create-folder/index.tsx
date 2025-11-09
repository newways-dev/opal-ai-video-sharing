'use client'

import FolderPlusDuotine from '@/components/icons/folder-plus-duotone'
import { useCreateFolders } from '@/hooks/use-create-folders'
import { Button } from '@/components/ui/button'

type Props = { workspaceId: string }

const CreateFolder = ({ workspaceId }: Props) => {
  const { onCreateNewFolder } = useCreateFolders(workspaceId)

  return (
    <Button
      onClick={onCreateNewFolder}
      className="bg-[#1D1D1D] text-[#707070] flex items-center gap-2 py-6 px-4 rounded-2xl"
    >
      <FolderPlusDuotine />
      Create a Folder
    </Button>
  )
}

export default CreateFolder
