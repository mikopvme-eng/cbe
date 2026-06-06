"use client"

import { useState } from "react"
import { ArrowLeft, CreditCard, QrCode, Banknote, Plus, Trash2, ChevronRight, Landmark, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface RecentTransfer {
  name: string
  account: string
}

interface TransferNamesScreenProps {
  senderName: string
  setSenderName: (val: string) => void
  receiverName: string
  setReceiverName: (val: string) => void
  accountNumber: string
  setAccountNumber: (val: string) => void
  amount: string
  setAmount: (val: string) => void
  reason: string
  setReason: (val: string) => void
  recentTransfers: RecentTransfer[]
  onSelectRecent: (name: string, account: string) => void
  onDeleteRecent: (account: string) => void
  onClearAll: () => void
  onBack: () => void
  onSubmit: () => void
}

export default function TransferNamesScreen({
  accountNumber,
  setAccountNumber,
  amount,
  setAmount,
  reason,
  setReason,
  recentTransfers,
  onSelectRecent,
  onDeleteRecent,
  onClearAll,
  onBack,
  onSubmit,
}: TransferNamesScreenProps) {
  const [showRemark, setShowRemark] = useState(false)

  return (
    <div className="min-h-screen bg-[#F0EBF2] flex flex-col font-sans max-w-md mx-auto shadow-md">

      {/* Header — solid purple, back arrow + title */}
      <div className="bg-[#7B287A] px-5 py-4 flex items-center gap-4 shadow-md">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-white text-xl font-bold tracking-wide">CBE Transfer</h1>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4 pb-10">

        {/* From Account Card — dark */}
        <div className="bg-[#1E1E2E] rounded-2xl px-5 py-4 flex flex-col gap-2 shadow-lg">
          <p className="text-[#AC7537] text-xs font-semibold tracking-wider uppercase">From Account</p>
          <p className="text-[#AC7537] text-base font-bold">Saving Account - 1********2766</p>
          <div className="flex items-center gap-2 mt-1">
            {/* Masked PIN dots */}
            <div className="flex gap-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-gray-500" />
              ))}
            </div>
            <EyeOff className="w-4 h-4 text-gray-500" />
          </div>
        </div>

        {/* Account Number Field */}
        <div className="bg-white rounded-2xl flex items-center px-4 py-1 gap-3 border border-gray-100 shadow-sm focus-within:border-[#7B287A] transition-colors">
          <CreditCard className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <Input
            type="text"
            placeholder="Account Number*"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="flex-1 border-0 bg-transparent text-gray-800 placeholder-gray-400 text-sm focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-4 px-0"
          />
          <button className="text-gray-400 hover:text-[#7B287A] transition-colors">
            <QrCode className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Field */}
        <div className="bg-white rounded-2xl flex items-center px-4 py-1 gap-3 border border-gray-100 shadow-sm focus-within:border-[#7B287A] transition-colors">
          <Banknote className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <Input
            type="number"
            placeholder="Amount*"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 border-0 bg-transparent text-gray-800 placeholder-gray-400 text-sm focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-4 px-0"
          />
        </div>

        {/* Remark Toggle */}
        {showRemark ? (
          <div className="bg-white rounded-2xl flex items-center px-4 py-1 gap-3 border border-gray-100 shadow-sm focus-within:border-[#7B287A] transition-colors">
            <Input
              type="text"
              placeholder="Remark (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="flex-1 border-0 bg-transparent text-gray-800 placeholder-gray-400 text-sm focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-4 px-0"
            />
          </div>
        ) : (
          <button
            onClick={() => setShowRemark(true)}
            className="flex items-center gap-2 text-[#7B287A] text-sm font-semibold hover:opacity-80 px-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add remark</span>
            <span className="text-gray-400 font-normal">*Default: MB transfer</span>
          </button>
        )}

        {/* Continue Button */}
        <Button
          onClick={onSubmit}
          disabled={!accountNumber || !amount}
          className="w-full bg-[#7B287A] hover:bg-[#682067] disabled:opacity-50 text-white text-base font-bold py-6 rounded-2xl shadow-md transition-colors mt-1"
        >
          Continue
        </Button>

        {/* Recent Transfers Heading */}
        <div className="flex items-center justify-between mt-3">
          <h2 className="text-gray-900 font-extrabold text-base">Recent Transfers</h2>
          {recentTransfers.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-[#7B287A] text-xs font-semibold hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Recent Transfers List */}
        <div className="flex flex-col gap-3">
          {recentTransfers.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-sm bg-white rounded-2xl border border-dashed border-gray-200">
              No recent transfers found.
            </div>
          ) : (
            recentTransfers.map((t, idx) => (
              <div
                key={idx}
                onClick={() => onSelectRecent(t.name, t.account)}
                className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-4 shadow-sm border border-gray-50 hover:shadow-md hover:border-[#7B287A]/20 transition-all cursor-pointer group"
              >
                {/* Avatar icon */}
                <div className="w-10 h-10 rounded-full bg-[#F3EBF4] flex items-center justify-center flex-shrink-0">
                  <Landmark className="w-5 h-5 text-[#7B287A]" />
                </div>

                {/* Name + account */}
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 text-sm font-bold truncate">{t.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{t.account}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteRecent(t.account)
                    }}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#7B287A] transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
