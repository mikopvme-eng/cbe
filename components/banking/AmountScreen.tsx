"use client"

import { useState } from "react"
import { ArrowLeft, Banknote, Plus, EyeOff, Lock, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SERVICE_CHARGE, DEFAULT_PIN } from "@/lib/constants"

const MAX_TX_PIN = 5

interface AmountScreenProps {
  receiverName: string
  accountNumber: string
  amount: string
  setAmount: (val: string) => void
  reason: string
  setReason: (val: string) => void
  onBack: () => void
  onTransfer: () => void
}

export default function AmountScreen({
  receiverName,
  accountNumber,
  amount,
  setAmount,
  reason,
  setReason,
  onBack,
  onTransfer,
}: AmountScreenProps) {
  const [showRemark, setShowRemark] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showPinEntry, setShowPinEntry] = useState(false)
  const [pinInput, setPinInput] = useState("")
  const [pinError, setPinError] = useState("")
  const [shake, setShake] = useState(false)

  const amountNumber = Number.parseFloat(amount) || 0

  const displayReceiver = receiverName || "Zeyneba Meki Yasin"
  const displayAccount = accountNumber || "1000403184717"

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 550)
  }

  const handleCloseSheet = () => {
    setShowConfirm(false)
    setShowPinEntry(false)
    setPinInput("")
    setPinError("")
  }

  const handleAuthSubmit = () => {
    if (pinInput === DEFAULT_PIN) {
      handleCloseSheet()
      onTransfer()
    } else {
      setPinError("Incorrect PIN. Please try again.")
      setPinInput("")
      triggerShake()
    }
  }

  const handleNumKey = (key: string) => {
    setPinError("")
    if (key === "backspace") {
      setPinInput(prev => prev.slice(0, -1))
    } else if (key === "submit") {
      if (pinInput.length < MAX_TX_PIN) {
        setPinError(`Enter your ${MAX_TX_PIN}-digit PIN.`)
        triggerShake()
        return
      }
      handleAuthSubmit()
    } else {
      if (pinInput.length < MAX_TX_PIN) setPinInput(prev => prev + key)
    }
  }

  const numRows = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["backspace", "0", "submit"],
  ]

  return (
    <div className="h-screen bg-[#F0EBF2] flex flex-col font-sans max-w-md mx-auto shadow-md relative overflow-hidden">
      <style>{`
        @keyframes shake {
          0%,100% { transform:translateX(0); }
          20%      { transform:translateX(-8px); }
          40%      { transform:translateX(8px); }
          60%      { transform:translateX(-5px); }
          80%      { transform:translateX(5px); }
        }
        .tx-shake { animation: shake 0.55s ease-in-out; }
      `}</style>

      {/* Header */}
      <div className="bg-[#7b1fa2] px-5 py-4 flex items-center gap-4 shadow-md">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-white text-xl font-bold tracking-wide">Transfer</h1>
      </div>

      {/* Body */}
      <div className="flex-1 px-5 py-5 flex flex-col gap-4">

        {/* Transfer To */}
        <div className="bg-[#7b1fa2] rounded-2xl px-5 py-4 flex flex-col gap-1 shadow-md">
          <p className="text-[#AC7537] text-sm font-bold">Transfer to</p>
          <div className="flex justify-between items-center text-white text-sm mt-1">
            <span className="text-gray-300">Account holder</span>
            <span className="font-semibold text-right">{displayReceiver}</span>
          </div>
          <div className="flex justify-between items-center text-white text-sm">
            <span className="text-gray-300">Account Number</span>
            <span className="font-semibold text-right tracking-wider">{displayAccount}</span>
          </div>
        </div>

        {/* From Account */}
        <div className="bg-[#1E1E2E] rounded-2xl px-5 py-4 flex flex-col gap-2 shadow-lg">
          <p className="text-[#AC7537] text-xs font-semibold tracking-wider uppercase">From Account</p>
          <p className="text-[#AC7537] text-base font-bold">Saving Account - 1********2766</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex gap-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-gray-500" />
              ))}
            </div>
            <EyeOff className="w-4 h-4 text-gray-500" />
          </div>
        </div>

        {/* Amount Field */}
        <div className="bg-white rounded-2xl flex items-center px-4 py-1 gap-3 border border-gray-100 shadow-sm focus-within:border-[#7b1fa2] transition-colors">
          <Banknote className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <Input
            type="number"
            placeholder="Enter amount*"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 border-0 bg-transparent text-gray-800 placeholder-gray-400 text-sm focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-4 px-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        {/* Remark Toggle */}
        {showRemark ? (
          <div className="bg-white rounded-2xl flex items-center px-4 py-1 gap-3 border border-gray-100 shadow-sm focus-within:border-[#7b1fa2] transition-colors">
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
            className="flex items-center gap-2 text-[#7b1fa2] text-sm font-semibold hover:opacity-80 px-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add remark</span>
            <span className="text-gray-400 font-normal">*Default: MB transfer</span>
          </button>
        )}

        {/* Transfer Button */}
        <Button
          onClick={() => setShowConfirm(true)}
          disabled={!amount || amountNumber <= 0}
          className="w-full bg-[#7b1fa2] hover:bg-[#682067] disabled:opacity-50 text-white text-base font-bold py-6 rounded-2xl shadow-md transition-colors mt-2"
        >
          Transfer
        </Button>

      </div>

      {/* ── Confirm Bottom Sheet Overlay ── */}
      {showConfirm && (
        <div className="absolute inset-0 z-50 flex flex-col">
          {/* Dimmed backdrop */}
          <div className="flex-1 bg-black/40" onClick={handleCloseSheet} />

          {/* Sheet */}
          <div className="bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col">

            {!showPinEntry ? (
              /* ── Step 1: Confirmation Details ── */
              <div className="px-6 pt-4 pb-8">
                <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-5" />
                <h2 className="text-gray-900 text-xl font-extrabold text-center mb-6">Please Confirm</h2>

                <div className="flex justify-between items-start py-4 border-b border-gray-100">
                  <span className="text-gray-400 text-sm font-medium">From</span>
                  <div className="text-right">
                    <p className="text-gray-900 text-sm font-bold">Girma Sisay Bekele</p>
                    <p className="text-gray-500 text-xs mt-0.5">1********2766</p>
                  </div>
                </div>

                <div className="flex justify-between items-start py-4 border-b border-gray-100">
                  <span className="text-gray-400 text-sm font-medium">To</span>
                  <div className="text-right">
                    <p className="text-gray-900 text-sm font-bold">{displayReceiver}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{displayAccount}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center py-4 border-b border-gray-100">
                  <span className="text-gray-400 text-sm font-medium">Total Amount</span>
                  <span className="text-[#7b1fa2] text-xl font-extrabold">
                    {amountNumber.toFixed(2)} <span className="text-sm font-bold">ETB</span>
                  </span>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleCloseSheet}
                    className="flex-1 py-4 rounded-2xl bg-red-50 text-red-500 font-bold text-base hover:bg-red-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowPinEntry(true)}
                    className="flex-1 py-4 rounded-2xl bg-[#7b1fa2] text-white font-bold text-base hover:bg-[#682067] transition-colors shadow-md"
                  >
                    Continue
                  </button>
                </div>
              </div>
            ) : (
              /* ── Step 2: PIN Numpad ── */
              <div className="flex flex-col">
                {/* Sheet header */}
                <div className="px-6 pt-4 pb-3">
                  {/* Drag handle + X */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto absolute left-1/2 -translate-x-1/2" />
                    <div className="flex-1" />
                    <button
                      onClick={handleCloseSheet}
                      className="w-8 h-8 flex items-center justify-center text-[#7b1fa2] hover:opacity-70 transition-opacity"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <h2 className="text-[#7b1fa2] text-lg font-bold text-center mb-4">
                    Enter your PIN to confirm
                  </h2>

                  {/* PIN Display Field */}
                  <div
                    className={`flex items-center bg-white rounded-2xl border-2 px-4 py-3 gap-3 ${pinError ? "border-red-400" : "border-[#7b1fa2]"
                      } ${shake ? "tx-shake" : ""}`}
                  >
                    <Lock className="w-3 h-3 text-[#7b1fa2] flex-shrink-0" />
                    <div className="flex items-center flex-1 h-6 gap-1 px-2">
                      {pinInput.length === 0 ? (
                        <span className="text-gray-400 text-sm font-medium">Enter your PIN</span>
                      ) : (
                        <span className="text-gray-800 text-2xl leading-none mt-1 tracking-widest">
                          {"•".repeat(pinInput.length)}
                        </span>
                      )}
                      <span className="w-[1.5px] h-5 bg-[#7b1fa2] animate-pulse opacity-70" />
                    </div>
                  </div>

                  {/* Error */}
                  {pinError && (
                    <p className="text-red-500 text-xs font-semibold text-center mt-2">{pinError}</p>
                  )}
                </div>

                {/* Numpad */}
                <div className="px-4 pb-2 flex flex-col gap-2">
                  {numRows.map((row, ri) => (
                    <div key={ri} className="grid grid-cols-3 gap-3">
                      {row.map((key) => (
                        <button
                          key={key}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleNumKey(key)}
                          className="flex items-center justify-center rounded-2xl py-5 text-2xl font-semibold bg-[#F0F0EE] hover:bg-[#E4E4E2] active:scale-95 active:bg-[#DADADB] transition-all select-none shadow-sm"
                        >
                          {key === "backspace" ? (
                            <svg width="28" height="24" viewBox="0 0 28 24" fill="none">
                              <path
                                d="M11 1H25C26.1 1 27 1.9 27 3V21C27 22.1 26.1 23 25 23H11L1 12L11 1Z"
                                stroke="#7b1fa2" strokeWidth="1.8" fill="none"
                              />
                              <line x1="14" y1="8" x2="21" y2="16" stroke="#7b1fa2" strokeWidth="1.8" strokeLinecap="round" />
                              <line x1="21" y1="8" x2="14" y2="16" stroke="#7b1fa2" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                          ) : key === "submit" ? (
                            <Check className="w-7 h-7 text-[#7b1fa2]" strokeWidth={2.5} />
                          ) : (
                            <span className="text-gray-800">{key}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Transfer button */}
                <div className="px-4 pt-2 pb-8">
                  <button
                    onClick={() => handleNumKey("submit")}
                    className="w-full bg-[#7b1fa2] hover:bg-[#682067] active:scale-[0.98] text-white text-base font-bold py-4 rounded-full shadow-md transition-all"
                  >
                    Transfer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}


