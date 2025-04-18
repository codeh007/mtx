"use client";
import { DashSidebar } from "mtmaiui/components/sidebar/siderbar";

// import "../../../styles/swagger-ui.css";
import { SidebarInset } from "mtxuilib/ui/sidebar";
import Script from "next/script";
import { useEffect, useState } from "react";
export default function Page() {
  const [swaggerLoaded, setWwaggerLoaded] = useState(false);
  const [swaggerPresetLoaded, setSwaggerPresetLoaded] = useState(false);

  const [openapiUrl, setOpenapiUrl] = useState(
    // "https://coleb-gomtm.yuepa8.com/api/v1/openapi.json",
    "https://colab-gomtm.yuepa8.com/openapi.yaml",
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (swaggerLoaded && swaggerPresetLoaded) {
        // 配置文档： https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/
        //@ts-ignore
        window.ui = SwaggerUIBundle({
          // url: "https://petstore3.swagger.io/api/v3/openapi.json",
          url: openapiUrl,
          dom_id: "#swagger-ui",
          //@ts-ignore
          presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
          layout: "StandaloneLayout",
          persistAuthorization: true,
        });
      }
    }
  }, [swaggerLoaded, swaggerPresetLoaded]);
  return (
    <>
      <DashSidebar />

      <Script
        // src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"
        src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" // Changed CDN
        onLoad={() => {
          setWwaggerLoaded(true);
        }}
      />
      <Script
        // src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js"
        src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js" // Changed CDN
        onLoad={() => {
          setSwaggerPresetLoaded(true);
        }}
      />
      <SidebarInset>
        <div id="swagger-ui">加载中, 请稍后 ...</div>
      </SidebarInset>
    </>
  );
}
