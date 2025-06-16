"use client";

import { Separator } from "mtxuilib/ui/separator";
import { ProxyForm } from "../components/proxy-form";

export default function NewProxyPage() {
  return (
    <div className="flex-col">
      <div className="flex items-center justify-between">
        {/* <Heading title="创建代理服务器" description="添加新的代理服务器" /> */}
        <h1>添加新的代理服务器</h1>
      </div>
      <Separator className="my-4" />
      <ProxyForm />
    </div>
  );
}
