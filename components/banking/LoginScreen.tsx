"use client"

import { useState, useEffect, useRef } from "react"
import { Globe, Lock, LayoutGrid, MessageSquare, ChevronDown, Check } from "lucide-react"
import Image from "next/image"

interface LoginScreenProps {
  pin: string
  setPin: (val: string) => void
  onSubmit: () => void
}

const MAX_PIN = 5

export default function LoginScreen({ pin, setPin, onSubmit }: LoginScreenProps) {
  const [showKeyboard, setShowKeyboard] = useState(true)
  const [error, setError]               = useState("")
  const [shake, setShake]               = useState(false)
  const prevPinRef                       = useRef(pin)

  /* Detect wrong PIN: parent resets pin to "" after a full-length attempt */
  useEffect(() => {
    if (prevPinRef.current.length === MAX_PIN && pin === "") {
      setError("Incorrect PIN. Please try again.")
      triggerShake()
    }
    prevPinRef.current = pin
  }, [pin])

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 550)
  }

  const handleKey = (key: string) => {
    setError("")
    if (key === "backspace") {
      setPin(pin.slice(0, -1))
    } else if (key === "submit") {
      if (pin.length < MAX_PIN) {
        setError(`Enter your ${MAX_PIN}-digit PIN.`)
        triggerShake()
        return
      }
      onSubmit()
    } else {
      if (pin.length < MAX_PIN) setPin(pin + key)
    }
  }

  const rows = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["backspace", "0", "submit"],
  ]

  return (
    <div className="h-screen bg-gradient-to-tr from-[#F2F2EF] via-[#F6F6F4] to-[#FAF5FC] flex flex-col font-sans max-w-md mx-auto shadow-md relative overflow-hidden">
      
      {/* Premium Background Orbs for Mesh Gradient Effect */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full bg-[#7b1fa2]/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[200px] right-[-100px] w-[300px] h-[300px] rounded-full bg-[#AC7537]/5 blur-[80px] pointer-events-none" />

      <style>{`
        @keyframes shake {
          0%,100% { transform:translateX(0); }
          20%      { transform:translateX(-8px); }
          40%      { transform:translateX(8px); }
          60%      { transform:translateX(-5px); }
          80%      { transform:translateX(5px); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0.9; }
          to { transform: translateY(0); opacity: 1; }
        }
        .shake-anim { animation: shake 0.55s ease-in-out; }
        .keyboard-slide-anim {
          animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Language toggle */}
      <div className="flex justify-end px-6 pt-4 relative z-10">
        <button className="flex items-center gap-1.5 text-[#7b1fa2] bg-white/60 hover:bg-white backdrop-blur-sm border border-gray-200/50 py-1.5 px-3 rounded-full font-semibold text-xs transition-all hover:scale-105 active:scale-95 shadow-sm">
          <Globe className="w-3.5 h-3.5" /><span>EN</span>
        </button>
      </div>

      {/* Brand */}
      <div className="flex flex-col items-center mt-3 mb-5 px-6 relative z-10">
        <div className="relative w-28 h-28 mb-3 rounded-full bg-white flex items-center justify-center">
          <Image src="/playstore-icon.png" alt="CBE" width={80} height={80} className="object-contain" priority />
        </div>
        <h1 className="text-gray-800 text-lg font-bold tracking-wide text-center">Commercial Bank of Ethiopia</h1>
        <div className="w-10 h-0.5 bg-[#7b1fa2] my-2 rounded-full opacity-60" />
        <h2 className="text-[#7b1fa2] text-lg font-extrabold tracking-wide">Welcome</h2>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col px-6 gap-4 relative z-10">
        {/* PIN display */}
        <div
          onClick={() => setShowKeyboard(true)}
          className={`flex items-center bg-white/80 backdrop-blur-md rounded-2xl border-2 px-4 py-1 cursor-pointer transition-all duration-300 ${
            error ? "border-red-400 shadow-[0_0_12px_rgba(239,68,68,0.15)]" : "border-[#7b1fa2]/40 hover:border-[#7b1fa2] focus-within:border-[#7b1fa2] focus-within:shadow-[0_0_12px_rgba(123,40,122,0.1)]"
          } ${shake ? "shake-anim" : ""}`}
        >
          <Lock className="w-3 h-3 text-[#7b1fa2]/60 mr-4 flex-shrink-0" />
          <div className="flex items-center flex-1 h-10 gap-1 px-2">
            {pin.length === 0 ? (
              <span className="text-gray-400 text-sm font-medium">PIN</span>
            ) : (
              <span className="text-gray-800 text-2xl leading-none mt-1 tracking-widest">
                {"•".repeat(pin.length)}
              </span>
            )}
            <span className="w-[1.5px] h-5 bg-[#7b1fa2] animate-pulse opacity-70" />
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-xs font-semibold text-center -mt-1 animate-pulse">{error}</p>
        )}

        {/* Login button */}
        <button
          onClick={() => handleKey("submit")}
          className="w-full bg-[#C29B57] hover:bg-[#B38D4E] active:scale-98 text-white text-base font-medium tracking-wide py-3.5 rounded-full shadow-sm transition-all flex items-center justify-center"
        >
          Login
        </button>

        {/* Feedback */}
        <div className="flex items-center justify-center gap-1.5 mt-1 cursor-pointer hover:opacity-80 transition-opacity">
          <span className="text-[#7b1fa2] font-bold text-sm">Feedback</span>
          <MessageSquare className="w-4 h-4 text-[#7b1fa2] fill-current" />
        </div>
      </div>

      {/* Custom keyboard OR footer */}
      {showKeyboard ? (
        <div className="bg-[#EFEFED]/95 backdrop-blur-md border-t border-gray-200/60 px-4 pb-8 pt-1 relative z-20 keyboard-slide-anim">
          {/* Dismiss chevron */}
          <div className="flex justify-center mb-1">
            <button
              onClick={() => setShowKeyboard(false)}
              className="text-gray-400 p-1 hover:text-gray-600 "
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Keys */}
          <div className="flex flex-col gap-2">
            {rows.map((row, ri) => (
              <div key={ri} className="grid grid-cols-3 gap-2">
                {row.map((key) => (
                  <button
                    key={key}
                    onMouseDown={(e) => e.preventDefault()} // prevent input blur
                    onClick={() => handleKey(key)}
                    className="flex items-center justify-center rounded-2xl py-3 text-xl font-bold shadow-[0_1px_3px_rgba(0,0,0,0.05)] active:scale-95 active:bg-[#e1e1de] transition-all select-none bg-[#E8E8E6] text-gray-800"
                  >
                    {key === "backspace" ? (
                      <svg width="26" height="22" viewBox="0 0 26 22" fill="none" className="transition-transform active:scale-90">
                        <path
                          d="M10 1H23C24.1 1 25 1.9 25 3V19C25 20.1 24.1 21 23 21H10L1 11L10 1Z"
                          stroke="#7b1fa2" strokeWidth="1.8" fill="none"
                        />
                        <line x1="13" y1="7.5" x2="19" y2="14.5" stroke="#7b1fa2" strokeWidth="1.8" strokeLinecap="round" />
                        <line x1="19" y1="7.5" x2="13" y2="14.5" stroke="#7b1fa2" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    ) : key === "submit" ? (
                      <Check className="w-6 h-6 text-[#7b1fa2] transition-transform active:scale-90" strokeWidth={3} />
                    ) : (
                      <span className="text-gray-800">{key}</span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-6 pb-4 mt-auto relative z-20">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <button className="flex items-center justify-center gap-2 bg-[#EADCEB] hover:bg-[#e2cee3] active:scale-98 text-[#7b1fa2] py-3.5 px-4 rounded-xl font-bold text-sm transition-all shadow-sm">
              <LayoutGrid className="w-4 h-4" /><span>Other Services</span>
            </button>
            <button className="flex items-center justify-center gap-2 bg-[#EADCEB] hover:bg-[#e2cee3] active:scale-98 text-[#7b1fa2] py-3.5 px-4 rounded-xl font-bold text-sm transition-all shadow-sm">
              <MessageSquare className="w-4 h-4" /><span>Chatbot</span>
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-400 font-semibold tracking-wider">
            © Commercial Bank of Ethiopia
          </p>
        </div>
      )}
    </div>
  )
}
