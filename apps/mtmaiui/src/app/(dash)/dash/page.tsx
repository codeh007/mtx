import { AppLoader } from "@mtmaiui/AppLoader";
import { getAppConfig } from "@mtmaiui/lib/config";

export default function DashPage() {
  const config = getAppConfig();
  return (
    <>
      <div id="gomtm-runtime-container" />
      <AppLoader serverUrl={config.mtmServerUrl} config={config} />
    </>
  );
}
