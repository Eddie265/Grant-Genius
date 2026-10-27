import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session"

// No marketing site: send people straight into the product
export default async function Home() {
  const user = await getCurrentUser()
  redirect(user ? "/dashboard" : "/login")
}
