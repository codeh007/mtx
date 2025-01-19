import NextAuth, { CredentialsSignin } from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
const superUser = {
  id: "admin",
  username: "admin",
  password: "admin123!!",
  email: "admin@example.com",
};
class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password";
}

const providers: Provider[] = [
  GitHub,
  Credentials({
    credentials: { password: { label: "Password", type: "password" } },
    authorize(c) {
      if (c.password !== superUser.password) {
        throw new InvalidLoginError();
      }
      return {
        id: superUser.id,
        name: superUser.username,
        email: superUser.email,
      };
    },
  }),
];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    }
    return { id: provider.id, name: provider.name };
  })
  .filter((provider) => provider.id !== "credentials");

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: "/auth/login",
  },
});
