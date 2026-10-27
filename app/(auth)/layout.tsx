import { Logo } from "@/components/site/Logo"
import { LegalFooter } from "@/components/site/LegalFooter"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10">
        <Logo height={88} href={null} className="mb-10" />
        {children}
      </main>
      <LegalFooter className="mx-auto w-full max-w-5xl px-6 pb-6 sm:px-10" />
    </div>
  )
}
