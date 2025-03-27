
import { redirect } from "next/navigation"
import { auth } from "@/auth" 
import LoginForm from "@/components/LoginForm" 

export default async function LoginPageServer() {
  
  const session = await auth()

  if (session) {
  
    redirect("/dashboard")
  }

  
  return <LoginForm />
}
