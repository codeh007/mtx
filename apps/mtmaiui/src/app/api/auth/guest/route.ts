import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { signIn } from "../../../../../app/(auth)/auth";
import { isDevelopmentEnvironment } from "../../../../../components/aichatbot/lib/constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectUrl = searchParams.get("redirectUrl") || "/";

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: !isDevelopmentEnvironment,
  });

  if (token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return signIn("guest", { redirect: true, redirectTo: redirectUrl });
}
