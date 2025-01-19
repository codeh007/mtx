import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const superUser = {
  username: "admin",
  password: "admin",
};
class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password";
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("auth credentials", credentials);
        if (
          credentials.username !== superUser.username ||
          credentials.password !== superUser.password
        ) {
          throw new InvalidLoginError();
        }
        return superUser;
      },
    }),
  ],
});
