import NextAuth, {
  CredentialsSignin,
  type Session,
  type User,
} from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
const superUser = {
  id: "admin",
  username: "admin",
  password: "admin123!!",
  email: "admin@example.com",
};
interface ExtendedSession extends Session {
  user: User;
}
class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password";
}

const providers: Provider[] = [
  GitHub({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  }),
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

const basePath = `${process.env.MTM_BASE_URL}/api/auth`;
// console.log("basePath", basePath);
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: "/auth/login",
  },
  basePath: basePath,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token;
    }) {
      console.log("auth session callback", token);
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
});
