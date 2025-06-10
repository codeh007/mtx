import { AppLoader } from "@mtmaiui/AppLoader";
import { getAppConfig } from "@mtmaiui/lib/config";
import { cookies } from "next/headers";

export default async function DashPage() {
  const config = getAppConfig();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  return (
    <>
      <div id="gomtm-runtime-container" />
      <AppLoader serverUrl={config.mtmServerUrl} config={config} accessToken={accessToken} />
    </>
  );
}
