import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/devpools/dev/$deviceId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { deviceId } = Route.useParams();

  // const { data: device } = useQuery({
  //   queryKey: ["device", deviceId],
  //   queryFn: () => getDevice(deviceId),
  // });

  return (
    <>
      <h1>设备详情</h1>
      <p>设备ID: {deviceId}</p>
      <div>TODO: 显示操作面板</div>
    </>
  );
}
