"use client";
import { migratePgLiteInBrowser } from "mtxuilib/db/migrate-browser";
import { pgLiteSeed } from "mtxuilib/db/pglite";
import { createUser, getUser } from "mtxuilib/db/queries/user-query";
import { Button } from "mtxuilib/ui/button";

export default function DeployPage() {
  const handleClick = () => {
    pgLiteSeed();
  };

  const handleClick4 = async () => {
    await migratePgLiteInBrowser();
  };

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleClick}>seed</Button>
      <Button onClick={handleClick4}>migrate</Button>
      <Button
        onClick={() => {
          createUser("test@test.com", "123456");
        }}
      >
        createUser
      </Button>

      <Button
        onClick={async () => {
          const user = await getUser("test@test.com");
          console.log(user);
        }}
      >
        getUser
      </Button>
    </div>
  );
}
