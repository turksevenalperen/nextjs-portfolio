// /app/login/page.tsx
import { redirect } from "next/navigation"
import { auth } from "@/auth" // auth.ts dosyanızdan auth() fonksiyonu
import LoginForm from "@/components/LoginForm" // Bu dosya "use client" içermeli

export default async function LoginPageServer() {
  // auth() çağrısıyla oturum sunucu tarafında alınır
  const session = await auth()

  if (session) {
    // Eğer oturum varsa, kullanıcıyı direkt dashboard'a yönlendirir
    redirect("/dashboard")
  }

  // Oturum yoksa login formunu gösterir
  return <LoginForm />
}
