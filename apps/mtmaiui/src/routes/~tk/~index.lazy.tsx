import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { tkGetUserProfileMutation } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import { useTenantId } from "../../hooks/useAuth";

export const Route = createLazyFileRoute("/tk/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <TestOpenBrowser />
    </div>
  );
}

const TestOpenBrowser = () => {
  const browserOpenMu = useMutation({
    // ...browserOpenMutation({}),
    ...tkGetUserProfileMutation({}),
  });

  const tid = useTenantId();

  return (
    <>
      <Button
        onClick={() => {
          browserOpenMu.mutate({
            path: {
              tenant: tid,
            },
            body: {
              user: "123",
            },
          });
        }}
      >
        get user profile
      </Button>

      <Button
        onClick={() => {
          browserOpenMu.mutate({
            path: {
              tenant: tid,
            },
            body: {
              user: "123",
            },
          });
        }}
      >
        Tk account login
      </Button>
    </>
  );
};
