"use client"

import { useEffect, useRef } from "react"
import { TrendingUp, Shield, CheckCircle, Headphones, Building2, Briefcase } from "lucide-react"

export default function DashboardPage() {
  const lineChartRef = useRef<HTMLCanvasElement>(null)
  const barChartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Ensure we're on the client side
    if (typeof window === 'undefined') return

    // Line Chart - Proposal Generation
    if (lineChartRef.current) {
      const ctx = lineChartRef.current.getContext("2d")
      if (ctx) {
        const canvas = lineChartRef.current
        // Set canvas size based on container
        const rect = canvas.getBoundingClientRect()
        const dpr = window.devicePixelRatio || 1
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        ctx.scale(dpr, dpr)
        
        const width = rect.width
        const height = rect.height

        // Clear canvas
        ctx.clearRect(0, 0, width, height)

        // Draw grid
        ctx.strokeStyle = "#e5e7eb"
        ctx.lineWidth = 1
        for (let i = 0; i <= 5; i++) {
          const y = (height / 5) * i
          ctx.beginPath()
          ctx.moveTo(40, y)
          ctx.lineTo(width - 20, y)
          ctx.stroke()
        }

        // Draw Y-axis labels
        ctx.fillStyle = "#6b7280"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "right"
        for (let i = 0; i <= 5; i++) {
          const value = 500 - (i * 100)
          const y = (height / 5) * i + 4
          ctx.fillText(value.toString(), 35, y)
        }

        // Draw X-axis labels
        ctx.textAlign = "center"
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
        const monthWidth = (width - 60) / 6
        months.forEach((month, i) => {
          const x = 40 + (i * monthWidth) + (monthWidth / 2)
          ctx.fillText(month, x, height - 5)
        })

        // Draw line
        const data = [50, 120, 180, 250, 320, 400]
        ctx.strokeStyle = "#f97316"
        ctx.lineWidth = 3
        ctx.beginPath()
        data.forEach((value, i) => {
          const x = 40 + (i * monthWidth) + (monthWidth / 2)
          const y = height - 20 - ((value / 500) * (height - 40))
          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        })
        ctx.stroke()

        // Draw points
        ctx.fillStyle = "#f97316"
        data.forEach((value, i) => {
          const x = 40 + (i * monthWidth) + (monthWidth / 2)
          const y = height - 20 - ((value / 500) * (height - 40))
          ctx.beginPath()
          ctx.arc(x, y, 4, 0, 2 * Math.PI)
          ctx.fill()
        })
      }
    }

    // Bar Chart
    if (barChartRef.current) {
      const ctx = barChartRef.current.getContext("2d")
      if (ctx) {
        const canvas = barChartRef.current
        // Set canvas size based on container
        const rect = canvas.getBoundingClientRect()
        const dpr = window.devicePixelRatio || 1
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        ctx.scale(dpr, dpr)
        
        const width = rect.width
        const height = rect.height

        // Clear canvas
        ctx.clearRect(0, 0, width, height)

        // Draw grid
        ctx.strokeStyle = "#e5e7eb"
        ctx.lineWidth = 1
        for (let i = 0; i <= 4; i++) {
          const y = (height / 4) * i
          ctx.beginPath()
          ctx.moveTo(40, y)
          ctx.lineTo(width - 20, y)
          ctx.stroke()
        }

        // Draw Y-axis labels
        ctx.fillStyle = "#6b7280"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "right"
        for (let i = 0; i <= 4; i++) {
          const value = 100 - (i * 25)
          const y = (height / 4) * i + 4
          ctx.fillText(value.toString(), 35, y)
        }

        // Draw bars
        const data = [45, 70, 30, 85, 60, 50, 75, 40, 90, 65]
        const barWidth = (width - 60) / 10
        const maxValue = 100

        data.forEach((value, i) => {
          const x = 40 + (i * barWidth) + 2
          const barHeight = (value / maxValue) * (height - 40)
          const y = height - 20 - barHeight

          ctx.fillStyle = "#f97316"
          ctx.fillRect(x, y, barWidth - 4, barHeight)
        })

        // Draw X-axis labels
        ctx.fillStyle = "#6b7280"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        for (let i = 0; i < 10; i++) {
          const x = 40 + (i * barWidth) + (barWidth / 2)
          ctx.fillText(i.toString(), x, height - 5)
        }
      }
    }
  }, [])
  
  // Handle window resize
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleResize = () => {
      // Trigger re-render on resize
      if (lineChartRef.current || barChartRef.current) {
        // Charts will be redrawn on next render
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Proposal Generation</h3>
          <div className="w-full" style={{ height: "300px" }}>
            <canvas
              ref={lineChartRef}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Grant Applications</h3>
          <div className="w-full" style={{ height: "300px" }}>
            <canvas
              ref={barChartRef}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-100 rounded-lg p-6 flex items-start gap-4">
          <div className="p-3 bg-orange-500 rounded-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Powered by AI</h4>
            <p className="text-sm text-gray-600">
              Powered by AI for precision, both ChatGPT & Claude
            </p>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-6 flex items-start gap-4">
          <div className="p-3 bg-orange-500 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Secure & Protected</h4>
            <p className="text-sm text-gray-600">
              Secure and well protected with highly skilled cyber security
            </p>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-6 flex items-start gap-4">
          <div className="p-3 bg-orange-500 rounded-lg">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Trusted Platform</h4>
            <p className="text-sm text-gray-600">
              Trusted by many NGOs individuals and gvt agencies
            </p>
          </div>
        </div>
      </div>

      {/* Image Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative rounded-lg overflow-hidden shadow-sm h-64 group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 z-10" />
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800')"
            }}
          />
          <div className="relative z-20 h-full flex flex-col justify-between p-6 text-white">
            <div className="flex-1 flex items-center">
              <p className="text-sm leading-relaxed">
                24/7 Supporting service that keeps you up and running providing high quality support
              </p>
            </div>
            <div className="flex items-center justify-between">
              <Headphones className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="relative rounded-lg overflow-hidden shadow-sm h-64 group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 z-10" />
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800')"
            }}
          />
          <div className="relative z-20 h-full flex flex-col justify-between p-6 text-white">
            <div className="flex-1 flex items-center">
              <p className="text-sm leading-relaxed">
                Choose us today and watch you organization grow and glow with us.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <Building2 className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="relative rounded-lg overflow-hidden shadow-sm h-64 group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 z-10" />
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800')"
            }}
          />
          <div className="relative z-20 h-full flex flex-col justify-between p-6 text-white">
            <div className="flex-1 flex items-center">
              <p className="text-sm leading-relaxed">
                What are you waiting for? contact us now.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <Briefcase className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
