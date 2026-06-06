"use client"

import { useState, useEffect } from "react"
import { User, UserCheck, Save, CheckCircle2, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface PayForScreenProps {
  savedSenderName: string
  savedReceiverName: string
  onSaveNames: (sender: string, receiver: string) => void
  onBack: () => void
}

export default function PayForScreen({
  savedSenderName,
  savedReceiverName,
  onSaveNames,
  onBack,
}: PayForScreenProps) {
  const [formSender, setFormSender] = useState(savedSenderName)
  const [formReceiver, setFormReceiver] = useState(savedReceiverName)
  const [saved, setSaved] = useState(false)

  useEffect(() => { setFormSender(savedSenderName) }, [savedSenderName])
  useEffect(() => { setFormReceiver(savedReceiverName) }, [savedReceiverName])

  const handleSaveNames = () => {
    onSaveNames(formSender.trim(), formReceiver.trim())
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onBack()
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F3] flex flex-col font-sans max-w-md mx-auto shadow-md">
      {/* Header */}
      <div className="bg-[#7B287A] text-white px-5 py-4 flex items-center gap-4 shadow-sm relative z-10">
        <button onClick={onBack} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold tracking-wide">Pay for</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
          <h3 className="text-[#7B287A] font-extrabold text-base">Contact Details</h3>
          <p className="text-gray-400 text-xs -mt-2">
            Save sender &amp; receiver names for use in future payments.
          </p>

          {/* Sender */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-600 text-xs font-semibold tracking-wide uppercase">
              Sender Name
            </label>
            <div className="flex items-center bg-[#F5F3FF] rounded-xl px-4 py-1 gap-3 border border-[#7B287A]/15 focus-within:border-[#7B287A] transition-colors">
              <User className="w-4 h-4 text-[#7B287A] flex-shrink-0" />
              <Input
                type="text"
                placeholder="e.g. Rahel Seifu Bekele"
                value={formSender}
                onChange={e => setFormSender(e.target.value)}
                className="flex-1 border-0 bg-transparent text-gray-800 placeholder-gray-400 text-sm focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-3 px-0"
              />
            </div>
          </div>

          {/* Receiver */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-600 text-xs font-semibold tracking-wide uppercase">
              Receiver Name
            </label>
            <div className="flex items-center bg-[#F5F3FF] rounded-xl px-4 py-1 gap-3 border border-[#7B287A]/15 focus-within:border-[#7B287A] transition-colors">
              <UserCheck className="w-4 h-4 text-[#7B287A] flex-shrink-0" />
              <Input
                type="text"
                placeholder="e.g. Zeyneba Meki Yasin"
                value={formReceiver}
                onChange={e => setFormReceiver(e.target.value)}
                className="flex-1 border-0 bg-transparent text-gray-800 placeholder-gray-400 text-sm focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-3 px-0"
              />
            </div>
          </div>

          {/* Saved indicator */}
          {saved && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 text-sm font-semibold animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4" />
              Names saved successfully!
            </div>
          )}

          {/* Save Button */}
          <Button
            onClick={handleSaveNames}
            disabled={!formSender.trim() || !formReceiver.trim()}
            className="w-full bg-[#7B287A] hover:bg-[#682067] disabled:opacity-50 text-white font-bold py-5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 mt-2"
          >
            <Save className="w-4 h-4" />
            Save Names
          </Button>
        </div>
      </div>
    </div>
  )
}
