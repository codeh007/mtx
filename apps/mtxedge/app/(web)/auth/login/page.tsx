"use client";
import dynamic from "next/dynamic";
export const runtime = "nodejs";

const LoginPage = dynamic(
  () => import("mtmaiui/components/auth/LoginPage").then((x) => x.LoginPage),
  {
    ssr: false,
    loading: () => {
      return <div>Loading...</div>;
    },
  },
);
export default function Page() {
  return <LoginPage />;
}
