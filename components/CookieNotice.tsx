"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Cookie } from "lucide-react"

const STORAGE_KEY = "gg-cookie-notice"

// We only set strictly necessary cookies (sign-in session and CSRF protection),
// so this is an informational notice rather than a consent prompt.
export function CookieNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reads browser-only storage after mount
      setVisible(localStorage.getItem(STORAGE_KEY) !== "dismissed")
    } catch {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "dismissed")
    } catch {}
    setVisible(false)
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl animate-fade-up sm:inset-x-auto sm:left-1/2 sm:w-full sm:-translate-x-1/2">
      <div className="flex flex-col gap-3 rounded-2xl bg-brand-950 p-4 text-sm text-brand-100/80 shadow-2xl sm:flex-row sm:items-center">
        <Cookie className="hidden h-5 w-5 shrink-0 text-white sm:block" />
        <p className="flex-1 leading-relaxed">
          We use only essential cookies to keep you signed in and protect your account. No advertising or tracking
          cookies.{" "}
          <Link href="/legal/cookies" className="font-medium text-white underline underline-offset-2">
            Cookie Policy
          </Link>
        </p>
        <button
          onClick={dismiss}
          className="h-9 shrink-0 rounded-full bg-white px-4 text-[13px] font-medium text-zinc-950 hover:bg-zinc-200"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
