"use client"

import { forwardRef, useState, type ComponentProps } from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui"

// Password field with a show/hide toggle so people can check what they typed
export const PasswordInput = forwardRef<HTMLInputElement, Omit<ComponentProps<"input">, "type">>(
  function PasswordInput({ className, ...props }, ref) {
    const [visible, setVisible] = useState(false)

    return (
      <div className="relative">
        <Input ref={ref} type={visible ? "text" : "password"} className={cn("pr-20", className)} {...props} />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          title={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-1 right-1 flex items-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium text-brand-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    )
  }
)
