import { Outlet, createLazyFileRoute } from '@tanstack/react-router'
import { cn } from 'mtxuilib/lib/utils'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from 'mtxuilib/ui/breadcrumb'
import { Button, buttonVariants } from 'mtxuilib/ui/button'
import {
  DashHeaders,
  HeaderActionConainer,
} from '../../../../../components/DashHeaders'

export const Route = createLazyFileRoute('/coms/$comId/view/$subComId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { comId } = Route.useParams()
  // const nav = useNav();
  // const { toast } = useToast();

  // const workflowRunId = useWorkbenchStore((x) => x.workflowRunId);

  return (
    <>
      <DashHeaders>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>子组件</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderActionConainer>
          <Button
            // to={`/coms/${comId}/new_session`}
            className={cn(buttonVariants({ variant: 'outline' }))}
          >
            保存
          </Button>
        </HeaderActionConainer>
      </DashHeaders>
      <Outlet />
    </>
  )
}
