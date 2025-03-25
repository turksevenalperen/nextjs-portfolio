
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (
          credentials?.email === "turksevenalperen0@gmail.com" &&
          credentials?.password === "1234"
        ) {
          return {
            id: "1",
            name: "Test User",
            email: "test@example.com",
            role: "user"
          }
        } else if (credentials.email === "admin@gmail.com" && credentials.password === "admin") {
          return {
            id: "1",
            name: "Test User",
            email: "iotech@gmail.com",
            role: "admin"
          }
        } else {
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string; // Ensure role is included
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Store role in JWT token
      }
      return token;
    },
  },

})
