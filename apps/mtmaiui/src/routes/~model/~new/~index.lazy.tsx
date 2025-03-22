import { createLazyFileRoute } from "@tanstack/react-router";
import { ModelClientForm } from "../../../components/model/ModelForm";

export const Route = createLazyFileRoute("/model/new/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <ModelClientForm />
    </>
  );
}
