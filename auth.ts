// /auth.ts
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
        // Örnek doğrulama: Test için sabit bir kullanıcı
        if (
          credentials?.email === "turksevenalperen0@gmail.com" &&
          credentials?.password === "1234"
        ) {
          return {
            id: "1", // id string tipinde
            name: "Test User",
            email: "test@example.com",
          }
        }
        throw new Error("Geçersiz kimlik bilgileri.")
      },
    }),
  ],
  // Diğer NextAuth seçeneklerinizi ekleyebilirsiniz
})
