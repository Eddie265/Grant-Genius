"use client"

import { useState } from "react"
import { User, Key, Save } from "lucide-react"

export default function SettingsPage() {
  // Authentication removed - using default values
  const [name, setName] = useState("User")
  const [email, setEmail] = useState("user@example.com")
  const [apiKeyName, setApiKeyName] = useState("")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")

    try {
      // In a real app, you'd have an API endpoint to update the profile
      // For now, we'll just show a message
      setMessage("Profile updated successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!apiKeyName) {
      setMessage("Please enter a name for the API key")
      return
    }

    setSaving(true)
    setMessage("")

    try {
      // In a real app, you'd have an API endpoint to create API keys
      setMessage("API key creation feature coming soon!")
      setApiKeyName("")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Failed to create API key")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-md ${
            message.includes("success") || message.includes("soon")
              ? "bg-green-100 text-green-700 border border-green-400"
              : "bg-red-100 text-red-700 border border-red-400"
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* API Key Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <Key className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">API Key Management</h2>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Create API keys to access GrantGenius programmatically. This feature will be available in future versions.
          </p>

          <form onSubmit={handleCreateApiKey} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key Name
              </label>
              <input
                type="text"
                value={apiKeyName}
                onChange={(e) => setApiKeyName(e.target.value)}
                placeholder="e.g., Production API Key"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving || !apiKeyName}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create API Key"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

