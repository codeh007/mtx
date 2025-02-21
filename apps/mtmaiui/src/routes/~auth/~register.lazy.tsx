import { createLazyFileRoute } from "@tanstack/react-router";
import { UserRegisterScreen } from "../../components/auth/UserRegister";
import { RootAppWrapper } from "../components/RootAppWrapper";

export const Route = createLazyFileRoute("/auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RootAppWrapper className="flex w-full h-full flex-1">
      <UserRegisterScreen />
    </RootAppWrapper>
  );
}
