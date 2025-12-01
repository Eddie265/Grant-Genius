"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { Loader2 } from "lucide-react"

interface Grant {
  id: string
  title: string
  description: string
}

function ProposalFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const grantId = searchParams.get("grantId")

  const [grantTitle, setGrantTitle] = useState("")
  const [goal, setGoal] = useState("")
  const [orgType, setOrgType] = useState("")
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Your proposal will appear here after generation...",
      }),
    ],
    content: "",
  })

  useEffect(() => {
    if (grantId) {
      fetchGrant(grantId)
    }
  }, [grantId])

  const fetchGrant = async (id: string) => {
    try {
      const response = await fetch(`/api/grants/${id}`)
      const data = await response.json()
      if (data.grant) {
        setSelectedGrant(data.grant)
        setGrantTitle(data.grant.title)
      }
    } catch (error) {
      console.error("Error fetching grant:", error)
    }
  }

  const handleGenerate = async () => {
    if (!grantTitle || !goal || !orgType) {
      alert("Please fill in all required fields")
      return
    }

    setGenerating(true)
    try {
      const response = await fetch("/api/proposals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grantTitle,
          goal,
          orgType,
          grantId: selectedGrant?.id,
          grantDescription: selectedGrant?.description,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate proposal")
      }

      if (editor && data.proposal.content) {
        editor.commands.setContent(data.proposal.content)
      }

      // Redirect to edit page
      router.push(`/dashboard/proposals/${data.proposal.id}`)
    } catch (error) {
      console.error("Error generating proposal:", error)
      alert(error instanceof Error ? error.message : "Failed to generate proposal")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Generate New Proposal</h1>
        <p className="text-gray-600 mt-2">Fill in the details below to generate an AI-powered proposal</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grant Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={grantTitle}
            onChange={(e) => setGrantTitle(e.target.value)}
            placeholder="Enter the grant opportunity title"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={!!selectedGrant}
          />
          {selectedGrant && (
            <p className="mt-1 text-sm text-gray-500">
              Linked to grant: {selectedGrant.title}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organization Type <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={orgType}
            onChange={(e) => setOrgType(e.target.value)}
            placeholder="e.g., Non-profit, NGO, Social Enterprise, Community Organization"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Goal/Idea <span className="text-red-500">*</span>
          </label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Describe your project idea, goals, and what you hope to achieve..."
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Generated Proposal Preview
          </label>
          <div className="border border-gray-300 rounded-md min-h-[400px] p-4">
            <EditorContent editor={editor} />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleGenerate}
            disabled={generating || !grantTitle || !goal || !orgType}
            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Proposal"
            )}
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default function NewProposalPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-500">Loading proposal form...</div>}>
      <ProposalFormContent />
    </Suspense>
  )
}
