import { ButtonLink } from "@/components/ui"
import { Logo } from "@/components/site/Logo"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Logo height={72} />
      <p className="mt-10 font-mono text-sm text-zinc-400">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950">Page not found</h1>
      <p className="mt-2 max-w-sm text-zinc-500">The page you’re looking for doesn’t exist or has moved.</p>
      <div className="mt-8 flex gap-2">
        <ButtonLink href="/">Go home</ButtonLink>
        <ButtonLink href="/dashboard" variant="secondary">Dashboard</ButtonLink>
      </div>
    </div>
  )
}
