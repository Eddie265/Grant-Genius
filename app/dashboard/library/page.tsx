"use client"

import { useState } from "react"
import { BookOpen, Search, FileText, Download, Eye } from "lucide-react"

interface LibraryItem {
  id: string
  title: string
  category: string
  description: string
  type: "template" | "guide" | "example"
  downloads: number
}

const libraryItems: LibraryItem[] = [
  {
    id: "1",
    title: "Grant Proposal Template - Education",
    category: "Education",
    description: "Comprehensive template for education-focused grant proposals",
    type: "template",
    downloads: 245,
  },
  {
    id: "2",
    title: "Healthcare Grant Writing Guide",
    category: "Healthcare",
    description: "Step-by-step guide for writing successful healthcare grants",
    type: "guide",
    downloads: 189,
  },
  {
    id: "3",
    title: "Sample Proposal - Community Development",
    category: "Community",
    description: "Example proposal for community development projects",
    type: "example",
    downloads: 312,
  },
  {
    id: "4",
    title: "NGO Funding Proposal Template",
    category: "NGO",
    description: "Professional template for NGO funding applications",
    type: "template",
    downloads: 456,
  },
  {
    id: "5",
    title: "Budget Planning Guide",
    category: "Finance",
    description: "Complete guide to budget planning for grant proposals",
    type: "guide",
    downloads: 278,
  },
  {
    id: "6",
    title: "Sample Proposal - Environmental",
    category: "Environment",
    description: "Example environmental grant proposal",
    type: "example",
    downloads: 201,
  },
]

export default function LibraryPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<string>("all")

  const filteredItems = libraryItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === "all" || item.type === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-900">Library</h1>
        </div>
        <p className="text-gray-600">Browse templates, guides, and examples</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search library..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Types</option>
            <option value="template">Templates</option>
            <option value="guide">Guides</option>
            <option value="example">Examples</option>
          </select>
        </div>
      </div>

      {/* Library Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded">
                  {item.category}
                </span>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{item.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {item.downloads} downloads
              </span>
              <div className="flex gap-2">
                <button className="p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No items found matching your search</p>
        </div>
      )}
    </div>
  )
}



