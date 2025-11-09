'use client'

import FolderPlusDuotine from '@/components/icons/folder-plus-duotone'
import WorkspaceForm from '@/components/forms/workspace-form'
import { useQueryData } from '@/hooks/use-query-data'
import { getWorkSpaces } from '@/actions/workspace'
import { Button } from '@/components/ui/button'
import Modal from '../modal'

const CreateWorkspace = () => {
  const { data } = useQueryData(['user-workspaces'], getWorkSpaces)

  const { data: plan } = data as {
    status: number
    data: {
      subscription: {
        plan: 'PRO' | 'FREE'
      } | null
    }
  }

  if (plan.subscription?.plan === 'FREE') return <></>
  if (plan.subscription?.plan === 'PRO')
    return (
      <Modal
        title="Create a Workspace"
        description="This action cannot be undone. This will permanently delete your account and remove your data from our servers"
        trigger={
          <Button className="bg-[#1D1D1D] text-[#707070] flex items-center gap-2 py-6 px-4">
            <FolderPlusDuotine />
            Create a Workspace
          </Button>
        }
      >
        <WorkspaceForm />
      </Modal>
    )
}

export default CreateWorkspace
