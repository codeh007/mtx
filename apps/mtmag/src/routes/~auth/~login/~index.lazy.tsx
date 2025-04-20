"use client";
import { Link, createLazyFileRoute } from "@tanstack/react-router";
import { Icons } from "mtxuilib/icons/icons";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { Button } from "mtxuilib/ui/button";
import { getCsrfToken, getProviders, signIn } from "next-auth/react";
// import { signIn } from "@/auth"
// import { signIn } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import { UserLoginForm } from "../../../components/auth/user-login-form";
import { useLoginHandler } from "../../../hooks/useAuth";
export const Route = createLazyFileRoute("/auth/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  const forms = [
    // basicEnabled && <BasicLogin />,
    <BasicLogin key="basic" />,
    // googleEnabled && <GoogleLogin key="google" />,
    // githubEnabled && <GithubLogin key="github" />,
  ].filter(Boolean);

  return (
    <div className="flex flex-1 flex-col items-center justify-center w-full h-full lg:flex-row">
      <div className="container relative flex-col items-center justify-center w-full lg:px-0">
        <div className="mx-auto flex w-full max-w-md lg:p-8">
          <div className="flex w-full flex-col justify-center space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Log in</h1>
              <p className="text-sm text-gray-700 dark:text-gray-300">{/* {prompt} */}</p>
            </div>
            {forms.map((form, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <Fragment key={index}>
                {form}
                {/* {index < schemes.length - 1 && <OrContinueWith />} */}
              </Fragment>
            ))}

            <GithubLogin />
            <TwitterLogin />
            <div className="flex flex-col space-y-2">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Don't have an account?{" "}
                <CustomLink
                  to="/auth/register"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign up
                </CustomLink>
              </p>
            </div>
            <p className="text-left text-sm text-gray-700 dark:text-gray-300 w-full">
              By clicking continue, you agree to our{" "}
              <Link
                to="https://www.iubenda.com/terms-and-conditions/76608149"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>
              ,{" "}
              <Link
                to="https://www.iubenda.com/privacy-policy/76608149/cookie-policy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Cookie Policy
              </Link>
              , and{" "}
              <Link
                to="https://www.iubenda.com/privacy-policy/76608149"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrContinueWith() {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white px-2 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          Or continue with
        </span>
      </div>
    </div>
  );
}

function BasicLogin() {
  const { loginHandler, isPending, fieldErrors } = useLoginHandler();

  return <UserLoginForm isLoading={isPending} onSubmit={loginHandler} fieldErrors={fieldErrors} />;
}

export function GoogleLogin() {
  return (
    <a href={"/api/v1/users/google/start"} className="w-full">
      <Button variant="outline" type="button" className="w-full py-2">
        <Icons.google className="mr-2 h-4 w-4" />
        Google
      </Button>
    </a>
  );
}

export function GithubLogin() {
  // const origin = window.location.origin;
  const [providers, setProviders] = useState({});
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    // Récupérer les fournisseurs d'authentification et le token CSRF
    async function loadProviders() {
      const authProviders = await getProviders();
      setProviders(authProviders || {});

      const csrf = await getCsrfToken();
      setCsrfToken(csrf);
    }
    loadProviders();
  }, []);
  return (
    <form
      className="flex flex-col bg-amber-50 p-16 rounded-lg gap-4 self-center"
      method="post"
      action="/api/auth/callback/credentials"
    >
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <Button
        variant="outline"
        type="button"
        className="w-full py-2"
        onClick={() => signIn("github")}
      >
        <Icons.gitHub className="mr-2 h-4 w-4" />
        Github
      </Button>
    </form>
  );
}

export function TwitterLogin() {
  const [providers, setProviders] = useState({});
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    // Récupérer les fournisseurs d'authentification et le token CSRF
    async function loadProviders() {
      const authProviders = await getProviders();
      setProviders(authProviders || {});

      const csrf = await getCsrfToken();
      setCsrfToken(csrf);
    }
    loadProviders();
  }, []);
  return (
    <form
      className="flex flex-col bg-amber-50 p-16 rounded-lg gap-4 self-center"
      method="post"
      action="/api/auth/callback/credentials"
    >
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <Button
        variant="outline"
        type="button"
        className="w-full py-2"
        onClick={() => signIn("twitter")}
      >
        <Icons.twitter className="mr-2 size-4" />
        Twitter
      </Button>
    </form>
  );
}
