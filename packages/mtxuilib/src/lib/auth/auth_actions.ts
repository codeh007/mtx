"use server";
import { signIn } from "mtxuilib/lib/auth/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
const SIGNIN_ERROR_URL = "/auth/login";

export const signin = async (
  providerId: string,
  callbackUrl?: string,
  successUrl?: string,
  errorUrl?: string,
  formData?: FormData,
) => {
  try {
    if (providerId === "credentials" && formData) {
      const result = await signIn("credentials", formData);
    } else {
      const result = await signIn(providerId, {
        // redirectTo: callbackUrl ?? "",
        redirectTo: callbackUrl || "/",
      });
      // console.log(result);
    }
  } catch (error) {
    console.error("捕获到错误", error);
    // Signin can fail for a number of reasons, such as the user
    // not existing, or the user not having the correct role.
    // In some cases, you may want to redirect to a custom error
    if (error instanceof AuthError) {
      return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
    }

    // Otherwise if a redirects happens Next.js can handle it
    // so you can just re-thrown the error and let Next.js handle it.
    // Docs:
    // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
    throw error;
  }
};
