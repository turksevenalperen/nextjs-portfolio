// /app/page.tsx (Server Component)
import { redirect } from "next/navigation"
import { auth } from "@/auth" // auth.ts dosyanızdaki auth() fonksiyonunu import edin
import LoginForm from "@/components/LoginForm" // Giriş formunuzun client componenti

export default async function Page() {
  // Sunucu tarafında oturumu kontrol et
  const session = await auth()

  if (session) {
    // Eğer oturum varsa, direkt dashboard'a yönlendir
    redirect("/dashboard")
  }

  // Oturum yoksa, giriş formunu render et
  return <LoginForm />
}
