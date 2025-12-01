"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Search, Filter, Plus } from "lucide-react"

interface Grant {
  id: string
  title: string
  description: string
  category: string
  region: string
  fundingBody: string
  amount: string | null
  deadline: Date | null
  link: string | null
}

export default function GrantsPage() {
  const [grants, setGrants] = useState<Grant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [regionFilter, setRegionFilter] = useState("")

  useEffect(() => {
    fetchGrants()
  }, [search, categoryFilter, regionFilter])

  const fetchGrants = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      if (categoryFilter) params.append("category", categoryFilter)
      if (regionFilter) params.append("region", regionFilter)

      const response = await fetch(`/api/grants?${params.toString()}`)
      const data = await response.json()
      setGrants(data.grants || [])
    } catch (error) {
      console.error("Error fetching grants:", error)
    } finally {
      setLoading(false)
    }
  }

  const categories = Array.from(new Set(grants.map((g) => g.category)))
  const regions = Array.from(new Set(grants.map((g) => g.region)))

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading grants...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grants</h1>
          <p className="text-gray-600 mt-2">Browse available grant opportunities</p>
        </div>
        <Link
          href="/dashboard/proposals/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="h-5 w-5" />
          New Proposal
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search grants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Regions</option>
            {regions.map((reg) => (
              <option key={reg} value={reg}>
                {reg}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grants.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No grants found. Try adjusting your filters.</p>
          </div>
        ) : (
          grants.map((grant) => (
            <div
              key={grant.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {grant.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {grant.description}
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded">
                    {grant.category}
                  </span>
                  <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {grant.region}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  <strong>Funding Body:</strong> {grant.fundingBody}
                </p>
                {grant.amount && (
                  <p className="text-sm text-gray-500">
                    <strong>Amount:</strong> {grant.amount}
                  </p>
                )}
                {grant.deadline && (
                  <p className="text-sm text-gray-500">
                    <strong>Deadline:</strong> {formatDate(grant.deadline)}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/proposals/new?grantId=${grant.id}`}
                  className="flex-1 text-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm"
                >
                  Apply
                </Link>
                {grant.link && (
                  <a
                    href={grant.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
                  >
                    Details
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}



