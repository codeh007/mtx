import { createFileRoute } from "@tanstack/react-router";
import GalleryManager from "../../components/views/gallery/manager";

export const Route = createFileRoute("/ag/gallery/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <main style={{ height: "100%" }} className=" h-full ">
        <GalleryManager />
      </main>
    </>
  );
}
