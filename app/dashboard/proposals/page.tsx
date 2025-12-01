"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { FileText, Plus, Trash2, Edit } from "lucide-react"

interface Proposal {
  id: string
  title: string
  status: string
  createdAt: string
  updatedAt: string
  grant: {
    id: string
    title: string
    fundingBody: string
  } | null
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProposals()
  }, [])

  const fetchProposals = async () => {
    try {
      const response = await fetch("/api/proposals")
      const data = await response.json()
      setProposals(data.proposals || [])
    } catch (error) {
      console.error("Error fetching proposals:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this proposal?")) {
      return
    }

    try {
      const response = await fetch(`/api/proposals/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setProposals(proposals.filter((p) => p.id !== id))
      } else {
        alert("Failed to delete proposal")
      }
    } catch (error) {
      console.error("Error deleting proposal:", error)
      alert("An error occurred")
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading proposals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Proposals</h1>
          <p className="text-gray-600 mt-2">Manage your grant proposals</p>
        </div>
        <Link
          href="/dashboard/proposals/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="h-5 w-5" />
          New Proposal
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        {proposals.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No proposals yet</p>
            <Link
              href="/dashboard/proposals/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Plus className="h-5 w-5" />
              Create Your First Proposal
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {proposals.map((proposal) => (
              <div
                key={proposal.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {proposal.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          proposal.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : proposal.status === "ARCHIVED"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {proposal.status}
                      </span>
                    </div>
                    {proposal.grant && (
                      <p className="text-sm text-gray-600 mb-1">
                        Grant: {proposal.grant.title} • {proposal.grant.fundingBody}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      Created {formatDate(proposal.createdAt)} • Updated {formatDate(proposal.updatedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/proposals/${proposal.id}`}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-md"
                      title="Edit"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(proposal.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}



