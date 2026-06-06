"use client"

import { useState, useEffect } from "react"
import {
  LayoutGrid, Globe, RefreshCw, Search, Eye, EyeOff, Copy,
  MessageSquareMore, GitFork, Clock, FileCheck,
  ArrowUpRight, ArrowDownLeft, Smartphone, ArrowLeftRight,
  Wallet, Receipt, Landmark, Building2, QrCode,
  Home, Settings, Check, Store, Plane, ShoppingBag, Film, CreditCard
} from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

/* ─── Types ─────────────────────────────────────────────────────────── */
type TabId = "merchant" | "travel" | "shopping" | "entertainment" | "payfor"

interface Tab {
  id: TabId
  label: string
  icon: React.ReactNode
}

const TABS: Tab[] = [
  { id: "merchant", label: "Payment for Merchant", icon: <Store className="w-4 h-4" /> },
  { id: "travel", label: "Travel", icon: <Plane className="w-4 h-4" /> },
  { id: "shopping", label: "Shopping", icon: <ShoppingBag className="w-4 h-4" /> },
  { id: "entertainment", label: "Entertainment", icon: <Film className="w-4 h-4" /> },
  { id: "payfor", label: "Pay for", icon: <CreditCard className="w-4 h-4" /> },
]

/* ─── Props ──────────────────────────────────────────────────────────── */
interface DashboardScreenProps {
  formattedDate: string
  onTransferClick: () => void
  onReceiptClick: () => void
  savedSenderName: string
  savedReceiverName: string
  onSaveNames: (sender: string, receiver: string) => void
  onPayForClick: () => void
}

/* ─── Component ──────────────────────────────────────────────────────── */
export default function DashboardScreen({
  formattedDate,
  onTransferClick,
  onReceiptClick,
  savedSenderName,
  savedReceiverName,
  onSaveNames,
  onPayForClick,
}: DashboardScreenProps) {
  const [showBalance, setShowBalance] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId | null>(null)
  const [loadingTab, setLoadingTab] = useState(false)

  const firstNameRaw = savedSenderName ? savedSenderName.split(" ")[0] : "Rahel"
  const firstName = firstNameRaw.charAt(0).toUpperCase() + firstNameRaw.slice(1).toLowerCase()

  const handleCopyAccount = () => {
    navigator.clipboard.writeText("100027663828")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const triggerLoader = () => {
    setLoadingTab(true)
    setTimeout(() => {
      setLoadingTab(false)
    }, 120000) // 2 minutes
  }

  const handleTabClick = (id: TabId) => {
    if (id === "payfor") {
      onPayForClick()
      return
    }
    triggerLoader()
  }

  // Expanded tab dropdowns removed per user instructions

  /* ─── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#F5F5F3] flex flex-col font-sans pb-32 max-w-md mx-auto shadow-md relative overflow-x-hidden">

      {/* ── Golden arc loading overlay ── */}
      {loadingTab && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
          {/* Spinning golden dots identical to reference site */}
          <svg
            className="w-16 h-16 animate-spin"
            viewBox="0 0 100 100"
            style={{
              animationDuration: "1.2s",
              animationTimingFunction: "linear",
            }}
          >
            {/* Top */}
            <circle cx="50" cy="18" r="4" fill="#F4ECDB" />
            {/* Top-Right */}
            <circle cx="72.6" cy="27.4" r="5.2" fill="#F2DCAB" />
            {/* Right */}
            <circle cx="82" cy="50" r="6.5" fill="#E9CA7C" />
            {/* Bottom-Right */}
            <circle cx="72.6" cy="72.6" r="7.5" fill="#DCBE74" />
            {/* Bottom */}
            <circle cx="50" cy="82" r="8.5" fill="#D0B16B" />
            {/* Bottom-Left */}
            <circle cx="27.4" cy="72.6" r="9" fill="#C5A660" />
            {/* Left */}
            <circle cx="18" cy="50" r="9.5" fill="#BA9C56" />
            {/* Top-Left */}
            <circle cx="27.4" cy="27.4" r="10.5" fill="#B2944E" />
          </svg>
          {/* Label */}
          <p className="mt-5 text-[#D0B16B] font-semibold text-xs tracking-[0.25em] uppercase">
            loading
          </p>
        </div>
      )}

      {/* 1. Header */}
      <div className="bg-[#7B287A] text-white rounded-b-[2.5rem] pb-24 pt-4 px-6 relative shadow-md">
        <div className="flex items-center justify-between mb-6">
          <button className="p-1 hover:opacity-80">
            <LayoutGrid className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 bg-white/20 border border-white/30 rounded-full px-3 py-1 text-xs font-semibold hover:bg-white/35 transition-colors">
              <Globe className="w-3.5 h-3.5" /><span>EN</span>
            </button>
            <button className="p-1 hover:opacity-80"><Search className="w-5 h-5 text-white" /></button>
            <button className="p-1 hover:opacity-80"><RefreshCw className="w-5 h-5 text-white" /></button>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-white/80 text-sm font-light leading-tight">Hello,</p>
          <h2 className="text-white text-2xl font-bold tracking-wide mt-1">{firstName}</h2>
        </div>
      </div>

      {/* 2. Overlapping Content */}
      <div className="px-5 -mt-20 flex flex-col gap-5 z-10">

        {/* Balance Card */}
        <div className="bg-[#121212] rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden flex flex-col gap-4 border border-zinc-800/80">
          {/* Map of the world background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-screen"
            style={{ backgroundImage: "url(/worldcbe.jpg)", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />

          {/* Header Row (Left Aligned) */}
          <div className="flex items-start gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <Image src="/CLOGO.png" alt="CBE Logo" width={32} height={32} className="object-contain" />
            </div>
            <div>
              <h3 className="text-[#AC7537] text-sm font-bold">Commercial Bank of Ethiopia</h3>
              <p className="text-yellow-500/80 text-[10px] tracking-wide">The bank you can always rely on!</p>
            </div>
          </div>

          {/* Centered Balance & Eye Row */}
          <div className="flex items-center justify-center gap-3 my-1 relative z-10">
            <span className="text-2xl font-extrabold tracking-wide">
              {showBalance ? "48,250.60" : "*** ***"} <span className="text-sm font-medium">ETB</span>
            </span>
            <button onClick={() => setShowBalance(!showBalance)} className="text-gray-400 hover:text-white transition-colors">
              {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Centered Saving Account & Copy Row */}
          <div className="flex items-center justify-center gap-2 relative z-10 text-xs border-t border-zinc-800/50 pt-3">
            <span className="text-[#AC7537] font-semibold text-sm">Saving Account 1********2766</span>
            <button onClick={handleCopyAccount} className="text-[#AC7537] hover:opacity-85 flex items-center">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Centered Date & Time */}
          <div className="text-gray-500 text-[10px] text-center relative z-10">
            {formattedDate} • 10:54 PM
          </div>
        </div>

        {/* 3. Quick Actions */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-1.5 bg-[#AC7537] rounded-full mb-3 shadow-sm" />
          <div className="grid grid-cols-4 gap-4 w-full px-2">
            {[
              { icon: <MessageSquareMore className="w-6 h-6" />, label: "Feedback" },
              { icon: <GitFork className="w-6 h-6 rotate-180" />, label: "Bill-Share" },
              { icon: <Clock className="w-6 h-6" />, label: "Schedules" },
              { icon: <FileCheck className="w-6 h-6" />, label: "Receipt" },
            ].map(({ icon, label }) => (
              <div key={label} onClick={triggerLoader} className="flex flex-col items-center gap-1.5 group cursor-pointer">
                <div className="w-14 h-14 bg-[#F3EBF4] border border-[#7B287A]/20 rounded-2xl flex items-center justify-center text-[#7B287A] shadow-sm group-hover:bg-[#ebdeed] transition-colors">
                  {icon}
                </div>
                <span className="text-gray-500 text-xs font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Transfer & Receive Bar */}
        <div className="bg-white rounded-3xl shadow-[0_4px_15px_rgba(0,0,0,0.04)] py-4 px-2 flex items-center justify-around border border-gray-100">
          <button onClick={onTransferClick} className="flex-1 flex items-center justify-center gap-2.5 py-1 text-[#7B287A] font-bold text-sm hover:opacity-85">
            <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <span>CBE Transfer</span>
          </button>
          <div className="w-[1px] h-6 bg-gray-200" />
          <button onClick={triggerLoader} className="flex-1 flex items-center justify-center gap-2.5 py-1 text-[#7B287A] font-bold text-sm hover:opacity-85">
            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <span>Receive</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: <Smartphone className="w-6 h-6" />, label: "Airtime" },
            { icon: <ArrowLeftRight className="w-6 h-6" />, label: "Other Transfers" },
            { icon: <Wallet className="w-6 h-6" />, label: "CBEBirr" },
            { icon: <Receipt className="w-6 h-6" />, label: "Bills & Utilities" },
            { icon: <Landmark className="w-6 h-6" />, label: "ATM/Branch" },
            { icon: <Building2 className="w-6 h-6" />, label: "Government" },
          ].map(({ icon, label }) => (
            <div key={label} onClick={triggerLoader} className="bg-white rounded-2xl p-4 flex flex-col gap-3 shadow-sm border border-gray-50 hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-[#7B287A]">{icon}</div>
              <span className="text-gray-800 text-sm font-bold">{label}</span>
            </div>
          ))}
        </div>

        {/* ── 6. Category Tabs ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            {TABS.map((tab, idx) => {
              const isActive = activeTab === tab.id
              return (
                <div
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`bg-white rounded-2xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all cursor-pointer border ${isActive
                      ? "border-[#7B287A] ring-2 ring-[#7B287A]/10 bg-[#FBF8FC]"
                      : "border-gray-50"
                    }`}
                >
                  <div className={isActive ? "text-[#AC7537]" : "text-[#7B287A]"}>
                    {tab.icon}
                  </div>
                  <span className="text-gray-800 text-sm font-bold">{tab.label}</span>
                </div>
              )
            })}
          </div>
        </div>

      </div>

      {/* Scan QR */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30">
        <button className="flex items-center gap-2 bg-[#7B287A] hover:bg-[#682067] text-white px-6 py-3 rounded-full font-bold shadow-lg transition-all text-sm uppercase tracking-wider">
          <QrCode className="w-4 h-4" /><span>Scan QR</span>
        </button>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-6 py-2.5 z-20 shadow-lg flex items-center justify-between">
        <button className="flex items-center gap-2 bg-[#EADAB9] text-[#7B287A] py-2 px-4 rounded-full font-bold text-xs shadow-sm">
          <Home className="w-4 h-4" /><span>Home</span>
        </button>
        <button onClick={triggerLoader} className="p-2 text-[#7B287A] hover:opacity-80"><Landmark className="w-5 h-5" /></button>
        <button onClick={triggerLoader} className="p-2 text-[#7B287A] hover:opacity-80"><Settings className="w-5 h-5" /></button>
      </div>

    </div>
  )
}
