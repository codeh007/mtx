"use client";
import dynamic from "next/dynamic";

const LoginPage = dynamic(
  () =>
    import("../../../../components/auth/LoginPage").then((x) => x.LoginPage),
  {
    ssr: false,
    loading: () => {
      return <div>Loading...</div>;
    },
  },
);
export default function Page(props: {
  searchParams: { callbackUrl: string | undefined };
}) {
  return <LoginPage {...props} />;
}
