import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Redirect based on role
  if (session.user?.role === "ADMIN") {
    redirect("/admin/dashboard")
  }

  if (session.user?.role === "EMPLOYEE") {
    redirect("/employee/pos")
  }

  if (session.user?.role === "STUDENT") {
    redirect("/student/dashboard")
  }

  redirect("/login")
}
