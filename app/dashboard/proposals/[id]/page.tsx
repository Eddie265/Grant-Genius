"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEditor, EditorContent, type JSONContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { Check, Download, Loader2, AlertTriangle, ArrowLeft } from "lucide-react"
import { saveAs } from "file-saver"
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx"
import jsPDF from "jspdf"
import { Button, Card, Notice, Select } from "@/components/ui"

interface Proposal {
  id: string
  title: string
  content: string
  status: "DRAFT" | "COMPLETED" | "ARCHIVED"
  grant: { id: string; title: string; fundingBody: string; link: string | null; deadline: string | null } | null
}

type SaveState = "idle" | "saving" | "saved" | "error"
type Block = { kind: "h1" | "h2" | "h3" | "p" | "li"; text: string; ordinal?: number }

// Flatten the editor document into simple blocks for Word/PDF export
function toBlocks(doc: JSONContent): Block[] {
  const text = (node: JSONContent): string =>
    node.text ?? (node.content ?? []).map(text).join(node.type === "listItem" ? " " : "")
  const blocks: Block[] = []
  const walk = (node: JSONContent) => {
    switch (node.type) {
      case "heading": {
        const level = node.attrs?.level ?? 2
        blocks.push({ kind: level <= 1 ? "h1" : level === 2 ? "h2" : "h3", text: text(node) })
        return
      }
      case "paragraph":
        blocks.push({ kind: "p", text: text(node) })
        return
      case "bulletList":
      case "orderedList":
        node.content?.forEach((item, i) =>
          blocks.push({ kind: "li", text: text(item), ordinal: node.type === "orderedList" ? i + 1 : undefined })
        )
        return
      default:
        node.content?.forEach(walk)
    }
  }
  walk(doc)
  return blocks.filter((b) => b.text.trim() !== "")
}

function safeFilename(title: string) {
  return title.replace(/[\\/:*?"<>|]+/g, "").slice(0, 80) || "proposal"
}

export default function ProposalEditorPage() {
  const params = useParams<{ id: string }>()
  const proposalId = params.id
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [title, setTitle] = useState("")
  const [saveState, setSaveState] = useState<SaveState>("idle")
  const [placeholders, setPlaceholders] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const loaded = useRef(false)

  const countPlaceholders = (text: string) => (text.match(/\[(insert|add|include)[^\]]*\]/gi) ?? []).length

  const autosave = useCallback(
    async (content: string) => {
      setSaveState("saving")
      try {
        const res = await fetch(`/api/proposals/${proposalId}/autosave`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        })
        setSaveState(res.ok ? "saved" : "error")
      } catch {
        setSaveState("error")
      }
    },
    [proposalId]
  )

  const editor = useEditor({
    // Tiptap 3: avoid SSR hydration mismatches in Next.js
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing your proposal…",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      if (!loaded.current) return
      setPlaceholders(countPlaceholders(editor.getText()))
      setSaveState("saving")
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => autosave(editor.getHTML()), 1200)
    },
  })

  useEffect(() => {
    fetch(`/api/proposals/${proposalId}`)
      .then(async (res) => {
        if (res.status === 404) return setNotFound(true)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setProposal(data.proposal)
        setTitle(data.proposal.title)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [proposalId])

  // Load content once both the editor and the proposal are ready
  useEffect(() => {
    if (!editor || !proposal || loaded.current) return
    editor.commands.setContent(proposal.content || "")
    // eslint-disable-next-line react-hooks/set-state-in-effect -- derived from editor content after load
    setPlaceholders(countPlaceholders(editor.getText()))
    loaded.current = true
  }, [editor, proposal])

  const patch = async (data: Partial<Pick<Proposal, "title" | "status">>) => {
    setSaveState("saving")
    const res = await fetch(`/api/proposals/${proposalId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    setSaveState(res.ok ? "saved" : "error")
    if (res.ok) setProposal((p) => (p ? { ...p, ...data } : p))
  }

  const exportPDF = () => {
    if (!editor) return
    const pdf = new jsPDF({ unit: "pt", format: "a4" })
    const margin = 56
    const width = pdf.internal.pageSize.getWidth() - margin * 2
    const bottom = pdf.internal.pageSize.getHeight() - margin
    let y = margin

    const write = (text: string, size: number, style: "normal" | "bold", gapBefore: number, indent = 0) => {
      pdf.setFont("helvetica", style)
      pdf.setFontSize(size)
      const lines: string[] = pdf.splitTextToSize(text, width - indent)
      const lineHeight = size * 1.45
      y += gapBefore
      for (const line of lines) {
        if (y + lineHeight > bottom) {
          pdf.addPage()
          y = margin
        }
        pdf.text(line, margin + indent, y + size)
        y += lineHeight
      }
    }

    write(title, 18, "bold", 0)
    for (const b of toBlocks(editor.getJSON())) {
      if (b.kind === "h1") write(b.text, 15, "bold", 14)
      else if (b.kind === "h2") write(b.text, 13, "bold", 12)
      else if (b.kind === "h3") write(b.text, 11.5, "bold", 8)
      else if (b.kind === "li") write(`${b.ordinal ? `${b.ordinal}.` : "•"} ${b.text}`, 10.5, "normal", 2, 12)
      else write(b.text, 10.5, "normal", 6)
    }
    pdf.save(`${safeFilename(title)}.pdf`)
  }

  const exportWord = async () => {
    if (!editor) return
    const heading = { h1: HeadingLevel.HEADING_1, h2: HeadingLevel.HEADING_2, h3: HeadingLevel.HEADING_3 }
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun(title)] }),
            ...toBlocks(editor.getJSON()).map((b) =>
              b.kind === "p"
                ? new Paragraph({ children: [new TextRun(b.text)], spacing: { after: 120 } })
                : b.kind === "li"
                  ? new Paragraph({ children: [new TextRun(`${b.ordinal ? `${b.ordinal}. ` : "• "}${b.text}`)], indent: { left: 360 } })
                  : new Paragraph({ heading: heading[b.kind], children: [new TextRun(b.text)] })
            ),
          ],
        },
      ],
    })
    saveAs(await Packer.toBlob(doc), `${safeFilename(title)}.docx`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 p-16 text-sm text-zinc-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading proposal…
      </div>
    )
  }

  if (notFound || !proposal) {
    return (
      <div className="mx-auto max-w-md p-16 text-center">
        <p className="text-sm text-zinc-500">This proposal doesn’t exist or you don’t have access to it.</p>
        <Link href="/dashboard/proposals" className="mt-4 inline-block text-sm font-medium underline underline-offset-2">
          Back to proposals
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-8">
      <Link href="/dashboard/proposals" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-950">
        <ArrowLeft className="h-3.5 w-3.5" /> Proposals
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0 space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => title.trim() && title !== proposal.title && patch({ title: title.trim() })}
            maxLength={200}
            aria-label="Proposal title"
            className="w-full rounded-lg bg-transparent text-2xl font-bold tracking-tight text-zinc-950 outline-none focus:bg-white focus:ring-4 focus:ring-brand-500/15"
          />
          <Card className="px-6 py-4 sm:px-10 sm:py-8">
            <EditorContent editor={editor} />
          </Card>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <Card className="space-y-4 p-4">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-zinc-500">Autosave</span>
              <span className="flex items-center gap-1.5 font-medium text-zinc-900">
                {saveState === "saving" && <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</>}
                {saveState === "saved" && <><Check className="h-3.5 w-3.5" /> Saved</>}
                {saveState === "idle" && "Up to date"}
                {saveState === "error" && "Not saved — retrying on next edit"}
              </span>
            </div>
            <div>
              <label htmlFor="status" className="mb-1.5 block text-[13px] text-zinc-500">
                Status
              </label>
              <Select
                id="status"
                value={proposal.status}
                onChange={(e) => patch({ status: e.target.value as Proposal["status"] })}
              >
                <option value="DRAFT">Draft</option>
                <option value="COMPLETED">Completed</option>
                <option value="ARCHIVED">Archived</option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" size="sm" onClick={exportWord}>
                <Download className="h-3.5 w-3.5" /> Word
              </Button>
              <Button variant="secondary" size="sm" onClick={exportPDF}>
                <Download className="h-3.5 w-3.5" /> PDF
              </Button>
            </div>
          </Card>

          {placeholders > 0 ? (
            <Notice>
              <span className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  <strong className="text-zinc-950">{placeholders} placeholder{placeholders === 1 ? "" : "s"}</strong> to
                  replace with your real information before submitting.
                </span>
              </span>
            </Notice>
          ) : null}

          {proposal.grant && (
            <Card className="p-4 text-[13px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">Linked grant</p>
              <p className="mt-2 font-medium text-zinc-950">{proposal.grant.title}</p>
              <p className="text-zinc-500">{proposal.grant.fundingBody}</p>
              {proposal.grant.deadline && (
                <p className="mt-2 text-zinc-600">
                  Deadline: {new Date(proposal.grant.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              )}
              {proposal.grant.link && (
                <a href={proposal.grant.link} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block font-medium underline underline-offset-2">
                  Funder’s page ↗
                </a>
              )}
            </Card>
          )}

          <p className="px-1 text-xs leading-relaxed text-zinc-500">
            AI drafts can contain errors. Verify all facts and follow the funder’s guidelines.{" "}
            <Link href="/legal/ai-disclaimer" className="underline underline-offset-2">Learn more</Link>
          </p>
        </aside>
      </div>
    </div>
  )
}
