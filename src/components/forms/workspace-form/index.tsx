import { useCreateWorkspace } from '@/hooks/use-create-workspace'
import FormGenerator from '@/components/global/form-generator'
import Loader from '@/components/global/loader'
import { Button } from '@/components/ui/button'

const WorkspaceForm = () => {
  const { register, isPending, onFormSubmit, errors } = useCreateWorkspace()

  return (
    <form onSubmit={onFormSubmit} className="flex flex-col gap-y-3">
      <FormGenerator
        name="name"
        label="Name"
        placeholder="Workspace name"
        inputType="input"
        type="text"
        register={register}
        errors={errors}
      />
      <Button
        type="submit"
        disabled={isPending}
        className="text-sm w-full mt-2"
      >
        <Loader state={isPending}>Create Workspace</Loader>
      </Button>
    </form>
  )
}

export default WorkspaceForm
