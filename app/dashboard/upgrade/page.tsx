"use client"

import { ArrowUp, Check, Shield, Zap, Users, Star } from "lucide-react"
import { useState } from "react"

interface Plan {
  id: string
  name: string
  price: string
  period: string
  features: string[]
  popular?: boolean
  icon: React.ReactNode
}

const plans: Plan[] = [
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "per month",
    icon: <Zap className="h-6 w-6" />,
    features: [
      "Unlimited proposals",
      "Advanced AI features",
      "Priority support",
      "Export to PDF/Word",
      "Custom templates",
      "Analytics dashboard",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    icon: <Users className="h-6 w-6" />,
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "Training & onboarding",
    ],
  },
]

export default function UpgradePage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  return (
    <div className="p-6">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <ArrowUp className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-900">Upgrade Your Plan</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Unlock powerful features and take your grant writing to the next level
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-lg shadow-sm p-8 ${
              plan.popular ? "ring-2 ring-orange-500" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-orange-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium flex items-center gap-1">
                <Star className="h-4 w-4" />
                Popular
              </div>
            )}
            
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-orange-100 rounded-lg text-orange-500">
                  {plan.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
              </div>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600 ml-2">{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                plan.popular
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
            >
              {plan.id === "enterprise" ? "Contact Sales" : "Upgrade Now"}
            </button>
          </div>
        ))}
      </div>

      {/* Current Plan Info */}
      <div className="mt-8 max-w-5xl mx-auto">
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-6 w-6 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">Current Plan: Free</h3>
          </div>
          <p className="text-sm text-gray-600">
            You're currently on the free plan. Upgrade to unlock advanced features and unlimited access.
          </p>
        </div>
      </div>
    </div>
  )
}



