"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { Download, Save, Loader2 } from "lucide-react"
import { saveAs } from "file-saver"
import { Document, Packer, Paragraph, TextRun } from "docx"
import jsPDF from "jspdf"

interface Proposal {
  id: string
  title: string
  content: string
  status: string
  grant: {
    id: string
    title: string
  } | null
}

export default function ProposalEditorPage() {
  const router = useRouter()
  const params = useParams()
  const proposalId = params.id as string
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [autosaveTimer, setAutosaveTimer] = useState<NodeJS.Timeout | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start editing your proposal...",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      // Debounce autosave
      if (autosaveTimer) {
        clearTimeout(autosaveTimer)
      }

      const timer = setTimeout(() => {
        autosaveProposal(editor.getHTML())
      }, 2000)

      setAutosaveTimer(timer)
    },
  })

  useEffect(() => {
    if (proposalId) {
      fetchProposal()
    }
    return () => {
      if (autosaveTimer) {
        clearTimeout(autosaveTimer)
      }
    }
  }, [proposalId])

  const fetchProposal = async () => {
    try {
      const response = await fetch(`/api/proposals/${proposalId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch proposal")
      }

      setProposal(data.proposal)
      if (editor && data.proposal.content) {
        editor.commands.setContent(data.proposal.content)
      }
    } catch (error) {
      console.error("Error fetching proposal:", error)
      alert("Failed to load proposal")
    } finally {
      setLoading(false)
    }
  }

  const autosaveProposal = async (content: string) => {
    try {
      await fetch(`/api/proposals/${proposalId}/autosave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
    } catch (error) {
      console.error("Error autosaving:", error)
    }
  }

  const handleSave = async () => {
    if (!editor || !proposal) return

    setSaving(true)
    try {
      const response = await fetch(`/api/proposals/${proposalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: editor.getHTML(),
          status: "COMPLETED",
        }),
      })

      if (response.ok) {
        alert("Proposal saved successfully!")
        router.refresh()
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Error saving proposal:", error)
      alert("Failed to save proposal")
    } finally {
      setSaving(false)
    }
  }

  const handleExportPDF = () => {
    if (!editor || !proposal) return

    const content = editor.getText()
    const pdf = new jsPDF()
    const lines = pdf.splitTextToSize(content, 180)
    pdf.text(lines, 10, 10)
    pdf.save(`${proposal.title}.pdf`)
  }

  const handleExportWord = async () => {
    if (!editor || !proposal) return

    const content = editor.getText()
    const paragraphs = content.split("\n").map(
      (line) =>
        new Paragraph({
          children: [new TextRun(line)],
        })
    )

    const doc = new Document({
      sections: [
        {
          children: paragraphs,
        },
      ],
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, `${proposal.title}.docx`)
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-600 mb-4" />
          <p className="text-gray-500">Loading proposal...</p>
        </div>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Proposal not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{proposal.title}</h1>
          {proposal.grant && (
            <p className="text-gray-600 mt-1">Grant: {proposal.grant.title}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            PDF
          </button>
          <button
            onClick={handleExportWord}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Word
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="border border-gray-300 rounded-md min-h-[600px] p-6">
          <EditorContent editor={editor} />
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Changes are automatically saved as you type
        </p>
      </div>
    </div>
  )
}

