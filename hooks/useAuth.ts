import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useAuth(requiredRole?: string) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }

    if (requiredRole && session?.user?.role !== requiredRole) {
      router.push("/")
    }
  }, [status, session, requiredRole, router])

  return {
    session,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    user: session?.user,
  }
}
