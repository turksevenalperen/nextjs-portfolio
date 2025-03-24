import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { saltAndHashPassword } from "./components/ui/password";
import { getUserFromDb } from "./components/ui/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, _request) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email ve şifre zorunludur.");
        }
      
        // Değerleri string olarak cast ediyoruz.
        const email = credentials.email as string;
        const password = credentials.password as string;
      
        const pwHash = saltAndHashPassword(password);
        const user = await getUserFromDb(email, pwHash);
      
        if (!user) {
          throw new Error("Geçersiz kimlik bilgileri.");
        }
      
        return user;
      },
      
    }),
  ],
});
