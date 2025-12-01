"use client"

import { Building2, Users, Shield, Zap, Headphones, Check, ArrowRight } from "lucide-react"
import { useState } from "react"

const features = [
  {
    icon: <Users className="h-6 w-6" />,
    title: "Team Collaboration",
    description: "Unlimited team members with role-based access control",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Enterprise Security",
    description: "Advanced security features, SSO, and compliance certifications",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Custom Integrations",
    description: "Integrate with your existing tools and workflows",
  },
  {
    icon: <Headphones className="h-6 w-6" />,
    title: "Dedicated Support",
    description: "24/7 priority support with dedicated account manager",
  },
]

const benefits = [
  "Unlimited proposals and grants",
  "Advanced AI customization",
  "Custom branding and white-labeling",
  "API access and webhooks",
  "Advanced analytics and reporting",
  "SLA guarantee (99.9% uptime)",
  "Training and onboarding",
  "Custom contract terms",
]

export default function EnterprisePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    alert("Thank you! Our sales team will contact you soon.")
    setFormData({ name: "", email: "", company: "", message: "" })
  }

  return (
    <div className="p-6">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Building2 className="h-10 w-10 text-orange-500" />
          <h1 className="text-4xl font-bold text-gray-900">Enterprise Plan</h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Tailored solutions for large organizations. Get custom pricing and dedicated support.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="p-3 bg-orange-100 rounded-lg w-fit mb-4 text-orange-500">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Benefits */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="h-6 w-6 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 p-6 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold text-gray-900">Enterprise-Grade Security</h3>
            </div>
            <p className="text-sm text-gray-600">
              Your data is protected with enterprise-level security measures, regular audits, and compliance with industry standards.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Request a Quote</h2>
          <p className="text-gray-600 mb-6">
            Fill out the form below and our sales team will contact you within 24 hours to discuss your enterprise needs.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tell us about your needs
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Number of users, specific requirements, etc."
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Request Quote
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}



