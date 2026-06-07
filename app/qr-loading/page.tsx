"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function QRLoadingPage() {
  const searchParams = useSearchParams()
  const [loadingTime, setLoadingTime] = useState(120) // 2 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingTime(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#F0EBF2] flex flex-col items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-6">
        {/* Golden spinning loader */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-8 border-[#AC7537] border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-4 border-[#AC7537] border-b-transparent animate-spin" style={{ animationDirection: 'reverse' }} />
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <p className="text-gray-700 text-lg font-semibold mb-2">Processing Transaction</p>
          <p className="text-[#AC7537] text-2xl font-bold">
            {Math.floor(loadingTime / 60)}:{(loadingTime % 60).toString().padStart(2, '0')}
          </p>
          <p className="text-gray-500 text-sm mt-1">Please wait...</p>
        </div>
      </div>
    </div>
  )
}
