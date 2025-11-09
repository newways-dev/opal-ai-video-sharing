import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CreateWorkspace from '@/components/global/create-workspace'
import CreateFolder from '@/components/global/create-folder'
import Folders from '@/components/global/folders'
import React from 'react'

type Props = {
  params: Promise<{ workspaceId: string }>
}

const Page = async ({ params }: Props) => {
  const { workspaceId } = await params
  return (
    <div>
      <Tabs defaultValue="videos" className="mt-6">
        <div className="flex w-full justify-between items-center">
          <TabsList className="bg-transparent gap-2 pl-0">
            <TabsTrigger
              value="videos"
              className="p-[13px] px-6 rounded-full data-[state=active]:bg-[#252525]"
            >
              Videos
            </TabsTrigger>
            <TabsTrigger
              value="archive"
              className="p-[13px] px-6 rounded-full data-[state=active]:bg-[#252525]"
            >
              Archive
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-x-3">
            <CreateWorkspace />
            <CreateFolder workspaceId={workspaceId} />
          </div>
        </div>
        <section className="py-9">
          <TabsContent value="videos">
            <Folders workspaceId={workspaceId} />
          </TabsContent>
          <TabsContent value="archive">Archive</TabsContent>
        </section>
      </Tabs>
    </div>
  )
}

export default Page
