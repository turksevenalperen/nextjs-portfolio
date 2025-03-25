
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import LoginForm from "@/components/LoginForm"
import A from "@/components/A"
import B from "@/components/B"

export default async function Page() {

  const session = await auth()

  if (session) {

    redirect("/dashboard")
  }

  
  return(
<div>
    <LoginForm />

  
    </div>
  )

  
}
