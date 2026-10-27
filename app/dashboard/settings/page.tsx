"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { Download, Loader2 } from "lucide-react"
import { PasswordInput } from "@/components/PasswordInput"
import { Button, Card, CardHeader, Field, Input, Notice, PageHeader } from "@/components/ui"

type Account = {
  name: string | null
  email: string
  createdAt: string
  acceptedTermsAt: string | null
  termsVersion: string | null
}

type Status = { tone: "success" | "error"; text: string } | null

function formatLongDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

export default function SettingsPage() {
  const { update } = useSession()
  const [account, setAccount] = useState<Account | null>(null)
  const [name, setName] = useState("")
  const [profileStatus, setProfileStatus] = useState<Status>(null)
  const [savingProfile, setSavingProfile] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [passwordStatus, setPasswordStatus] = useState<Status>(null)
  const [savingPassword, setSavingPassword] = useState(false)

  const [deletePassword, setDeletePassword] = useState("")
  const [confirmText, setConfirmText] = useState("")
  const [deleteError, setDeleteError] = useState("")
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch("/api/account")
      .then((r) => r.json())
      .then((d) => {
        setAccount(d.account)
        setName(d.account.name ?? "")
      })
      .catch(() => {})
  }, [])

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    setProfileStatus(null)
    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
    const data = await res.json()
    if (res.ok) {
      await update({ name: data.name })
      setProfileStatus({ tone: "success", text: "Profile updated." })
    } else {
      setProfileStatus({ tone: "error", text: data.error || "Couldn't update profile." })
    }
    setSavingProfile(false)
  }

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingPassword(true)
    setPasswordStatus(null)
    const res = await fetch("/api/account/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    const data = await res.json()
    if (res.ok) {
      setCurrentPassword("")
      setNewPassword("")
      setPasswordStatus({ tone: "success", text: "Password changed." })
    } else {
      setPasswordStatus({ tone: "error", text: data.error || "Couldn't change password." })
    }
    setSavingPassword(false)
  }

  const deleteAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setDeleting(true)
    setDeleteError("")
    const res = await fetch("/api/account", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: deletePassword }),
    })
    if (res.ok) {
      await signOut({ callbackUrl: "/login?deleted=true" })
      return
    }
    const data = await res.json()
    setDeleteError(data.error || "Couldn't delete account.")
    setDeleting(false)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-8">
      <PageHeader title="Settings" description="Manage your profile, security and personal data." />

      <Card>
        <CardHeader title="Profile" description="Your name appears on your dashboard and in messages to us." />
        <form onSubmit={saveProfile} className="space-y-4 p-5">
          {profileStatus && <Notice tone={profileStatus.tone}>{profileStatus.text}</Notice>}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" htmlFor="name">
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} minLength={2} maxLength={100} required />
            </Field>
            <Field label="Email" htmlFor="email" hint="Contact support to change your email.">
              <Input id="email" value={account?.email ?? ""} disabled />
            </Field>
          </div>
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={savingProfile || !account}>
              {savingProfile && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Save changes
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <CardHeader title="Password" description="Use at least 8 characters. Avoid reusing passwords from other sites." />
        <form onSubmit={changePassword} className="space-y-4 p-5">
          {passwordStatus && <Notice tone={passwordStatus.tone}>{passwordStatus.text}</Notice>}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Current password" htmlFor="currentPassword">
              <PasswordInput
                id="currentPassword"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </Field>
            <Field label="New password" htmlFor="newPassword">
              <PasswordInput
                id="newPassword"
                autoComplete="new-password"
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Field>
          </div>
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={savingPassword}>
              {savingPassword && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Update password
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <CardHeader
          title="Your data"
          description={
            <>
              Download a copy of everything we hold about you. See our{" "}
              <Link href="/legal/privacy" className="underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </>
          }
        />
        <div className="flex flex-wrap items-center justify-between gap-4 p-5">
          <dl className="space-y-1 text-[13px]">
            {account && (
              <>
                <div className="flex gap-2">
                  <dt className="text-zinc-500">Member since</dt>
                  <dd className="text-zinc-900">{formatLongDate(account.createdAt)}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-zinc-500">Terms accepted</dt>
                  <dd className="text-zinc-900">
                    {account.acceptedTermsAt
                      ? `${formatLongDate(account.acceptedTermsAt)} (version ${account.termsVersion})`
                      : "Before versioned terms were recorded"}
                  </dd>
                </div>
              </>
            )}
          </dl>
          <a
            href="/api/account/export"
            className="inline-flex h-8 items-center gap-2 rounded-full px-3.5 text-[13px] font-medium text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-50"
          >
            <Download className="h-3.5 w-3.5" /> Export my data (JSON)
          </a>
        </div>
      </Card>

      <Card className="border-zinc-950">
        <CardHeader
          title="Delete account"
          description="Permanently deletes your account and all your proposals. This cannot be undone."
        />
        <form onSubmit={deleteAccount} className="space-y-4 p-5">
          {deleteError && <Notice tone="error">{deleteError}</Notice>}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your password" htmlFor="deletePassword">
              <PasswordInput
                id="deletePassword"
                autoComplete="current-password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                required
              />
            </Field>
            <Field label='Type "DELETE" to confirm' htmlFor="confirmDelete">
              <Input id="confirmDelete" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} required />
            </Field>
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="danger" size="sm" disabled={deleting || confirmText !== "DELETE" || !deletePassword}>
              {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Delete my account
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
