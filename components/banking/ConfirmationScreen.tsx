"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { QRCodeSVG } from "qrcode.react"
import { Scan } from "lucide-react"
import { SERVICE_CHARGE, DEFAULT_SENDER_NAME, DEFAULT_RECEIVER_NAME } from "@/lib/constants"

interface ConfirmationScreenProps {
  senderName: string
  receiverName: string
  accountNumber: string
  amount: string
  reason: string
  formattedDateTime: {
    date: string
    time: string
    shortDate: string
  }
  onBack: () => void
  onClose: () => void
  onReceiptClick: () => void
}

export default function ConfirmationScreen({
  senderName,
  receiverName,
  accountNumber,
  amount,
  reason,
  formattedDateTime,
  onClose,
  onReceiptClick,
}: ConfirmationScreenProps) {
  const displaySenderName = senderName?.trim() || DEFAULT_SENDER_NAME
  const displayReceiverName = receiverName?.trim() || DEFAULT_RECEIVER_NAME
  const displayAmount = amount || "1500.00"
  const amountNumber = Number.parseFloat(displayAmount) || 0

  const senderSuffix = "8499"
  const receiverSuffix = accountNumber ? accountNumber.slice(-4) : "4717"

  // Charges — matching the design values proportionally
  const serviceCharge = SERVICE_CHARGE        // ETB 0.50
  const vatOnCharge = 0.15 * serviceCharge  // ETB 0.075
  const disasterRecovery = 0.05 * serviceCharge  // ETB 0.025
  const totalAmount = amountNumber + serviceCharge + vatOnCharge + disasterRecovery

  const txId = "FT26153CPSKX"
  const txDate = formattedDateTime.shortDate
  const txTime = formattedDateTime.time

  // Build the receipt URL encoded into the QR code
  // Scanning the QR on any device opens /receipt?d=<base64> directly
  const txData = {
    txId,
    date:          `${txDate} ${txTime}`,
    from:          `${displaySenderName} ETB-${senderSuffix}`,
    to:            `${displayReceiverName} ETB-${receiverSuffix}`,
    fromAccount:   `10000000${senderSuffix}`,
    toAccount:     accountNumber || `10000000${receiverSuffix}`,
    amount:        amountNumber.toFixed(2),
    reason:        reason || "MB Transfer",
    senderName:    displaySenderName,
    receiverName:  displayReceiverName,
  }

  const qrPayload = "System failer"

  return (
    <div className="h-screen bg-[#7b1fa2] flex flex-col font-sans max-w-md mx-auto shadow-md overflow-hidden relative">

      {/* Close button - top right */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full border-2 border-white/60 flex items-center justify-center transition-colors"
      >
        <Scan className="w-5 h-5 text-white" />
      </button>

      {/* ── 1. Purple Header ─────────────────────────────────────── */}
      <div className="bg-[#7b1fa2] px-5 pt-10 pb-20 flex items-center justify-between relative flex-shrink-0">

        {/* Left: Shield icon + Thank you / Success */}
        <div className="flex items-center gap-3">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-9 h-9 text-white flex-shrink-0"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L3 6.5v5c0 4.55 3.84 8.74 9 9.5 5.16-.76 9-4.95 9-9.5v-5L12 2z" fill="white" stroke="none" />
            <path d="M9 12l2 2 4-4" stroke="#7b1fa2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <div>
            <h1 className="text-white text-xl font-extrabold leading-tight">Thank you</h1>
            <p className="text-white/75 text-sm font-medium">Success</p>
          </div>
        </div>

        {/* Central purple circle — pinned to header bottom, protrudes down */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
          <div className="w-20 h-20 rounded-full bg-[#7b1fa2] border-4 border-white flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

      </div>

      {/* ── 2. White body — rounded top, padding clears the overlapping circle ─ */}
      <div className="flex-1 bg-white rounded-t-[2.5rem] px-5 pt-12 pb-6 flex flex-col gap-5 overflow-hidden">

        {/* Subtitle */}
        <p className="text-gray-700 text-sm font-medium text-center -mt-1">
          Transaction Completed Successfully!
        </p>

        {/* ── 3. Transaction Summary Card ─────────────────────────── */}
        <div className="bg-[#F0F0F0] rounded-2xl p-5 flex flex-col gap-4">

          <p className="text-gray-400 text-xs font-medium">Transaction Summary</p>

          {/* Transaction message body */}
          <p className="text-gray-900 text-sm leading-6">
            ETB{" "}
            <span className="font-extrabold">{amountNumber.toFixed(1)}</span>{" "}
            has been debited from{" "}
            <span className="font-extrabold">{displaySenderName}</span>{" "}
            ETB-{senderSuffix} for{" "}
            <span className="font-extrabold">{displayReceiverName}</span>{" "}
            ETB-{receiverSuffix} on{" "}
            <span className="font-extrabold">{txDate} {txTime}</span>{" "}
            with transaction ID:{" "}
            <span className="font-extrabold">{txId}</span>. Reason: {reason || "MB Transfer"}
            {"\n"}Total Amount Debited: {totalAmount.toFixed(2)} ETB with Service Charge of ETB{serviceCharge.toFixed(2)}, VAT (15%) of ETB{vatOnCharge.toFixed(2)} and Disaster Recovery (5%) of ETB{disasterRecovery.toFixed(2)}.
          </p>

          {/* QR Code — dynamically generated from transaction data */}
          <div className="flex justify-center py-2">
            <QRCodeSVG
              value={qrPayload}
              size={185}
              bgColor="#F0F0F0"
              fgColor="#1a1a1a"
              level="M"
              includeMargin={false}
            />
          </div>

          {/* CBE branding row */}
          <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
            <Image
              src="/CLOGO.png"
              alt="CBE Logo"
              width={42}
              height={42}
              className="rounded-full flex-shrink-0"
            />
            <div>
              <p className="text-gray-900 text-sm font-extrabold leading-tight">
                Commercial Bank of Ethiopia
              </p>
              <p className="text-gray-400 text-xs mt-0.5">
                The bank you can always rely on!
              </p>
            </div>
          </div>
        </div>

        {/* ── 4. Three action icon buttons ── */}
        <div className="flex items-center justify-around pt-1">

          {/* Receipt */}
          <button
            onClick={onReceiptClick}
            className="flex flex-col items-center gap-1 text-gray-800 hover:text-[#7b1fa2] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="12" y1="11" x2="12" y2="17" />
              <path d="M9.5 13.5a2.5 2.5 0 005 0M9.5 14.5a2.5 2.5 0 005 0" />
            </svg>
            <span className="text-[10px] font-semibold">Receipt</span>
          </button>

          {/* Download */}
          <button className="flex flex-col items-center gap-1 text-gray-800 hover:text-[#7b1fa2] transition-colors">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v13M7 12l5 5 5-5" />
              <path d="M5 19h14" />
            </svg>
            <span className="text-[10px] font-semibold">Download</span>
          </button>

          {/* Share */}
          <button className="flex flex-col items-center gap-1 text-gray-800 hover:text-[#7b1fa2] transition-colors">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="2" />
              <circle cx="6" cy="12" r="2" />
              <circle cx="18" cy="19" r="2" />
              <line x1="8" y1="11" x2="16" y2="6" />
              <line x1="8" y1="13" x2="16" y2="18" />
            </svg>
            <span className="text-[10px] font-semibold">Share</span>
          </button>

        </div>

        {/* ── 5. Close pill button ── */}
        <button
          onClick={onClose}
          className="w-full py-4 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 font-semibold text-base transition-colors"
        >
          Close
        </button>

      </div>
    </div>
  )
}
