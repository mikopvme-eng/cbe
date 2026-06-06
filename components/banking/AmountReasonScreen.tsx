"use client"

import { ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AmountReasonScreenProps {
  amount: string
  setAmount: (val: string) => void
  reason: string
  setReason: (val: string) => void
  onBack: () => void
  onSubmit: () => void
}

export default function AmountReasonScreen({
  amount,
  setAmount,
  reason,
  setReason,
  onBack,
  onSubmit,
}: AmountReasonScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm">
        <ArrowLeft className="w-6 h-6 text-[rgba(142,36,170,1)] cursor-pointer" onClick={onBack} />
        <span className="text-[rgba(142,36,170,1)] font-medium">አማ</span>
        <RefreshCw className="w-6 h-6 text-[rgba(142,36,170,1)]" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-8">
        <h1 className="text-2xl font-bold text-center text-black mb-16">Enter</h1>

        <div className="space-y-6 mb-16">
          <Input
            type="text"
            placeholder="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full py-6 px-4 text-lg border-2 border-[rgba(142,36,170,1)] rounded-lg bg-white focus:ring-0 focus:border-[rgba(142,36,170,1)]"
          />

          <Input
            type="text"
            placeholder="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full py-6 px-4 text-lg border-2 border-[rgba(142,36,170,1)] rounded-lg bg-white focus:ring-0 focus:border-[rgba(142,36,170,1)]"
          />
        </div>

        <Button
          onClick={onSubmit}
          className="w-full bg-[rgba(142,36,170,1)] hover:bg-[rgba(142,36,170,1)] text-white py-6 rounded-lg text-lg font-medium"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
