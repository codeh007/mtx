import { AppLoader } from "@mtmaiui/AppLoader";
import { getAppConfig } from "@mtmaiui/lib/config";

export default function DashPage() {
  return (
    <>
      <div id="gomtm-runtime-container" />
      <AppLoader serverUrl={getAppConfig().mtmServerUrl} />
    </>
  );
}
