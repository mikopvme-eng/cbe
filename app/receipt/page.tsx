"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Image from "next/image"
import { BANK_INFO, SERVICE_CHARGE } from "@/lib/constants"
import { amountInWords, formatAccountNumber } from "@/lib/receipt"

interface TxData {
  txId: string
  date: string
  from: string
  to: string
  fromAccount: string
  toAccount: string
  amount: string
  reason: string
  senderName: string
  receiverName: string
}

function ReceiptContent() {
  const searchParams = useSearchParams()
  const raw = searchParams.get("d")

  let tx: TxData | null = null
  let parseError = false

  if (raw) {
    try {
      tx = JSON.parse(atob(decodeURIComponent(raw))) as TxData
    } catch {
      parseError = true
    }
  }

  if (!raw || parseError || !tx) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-2xl p-10 shadow text-center max-w-sm">
          <p className="text-2xl font-bold text-[#7B287A] mb-2">Invalid Receipt</p>
          <p className="text-gray-500 text-sm">
            This QR code does not contain valid transaction data.
          </p>
        </div>
      </div>
    )
  }

  const amountNumber  = Number.parseFloat(tx.amount) || 0
  const vatAmount     = 0.15 * SERVICE_CHARGE
  const disasterRecovery = 0.05 * SERVICE_CHARGE
  const totalAmount   = amountNumber + SERVICE_CHARGE + vatAmount + disasterRecovery
  const wordsAmount   = amountInWords(tx.amount)
  const formattedAcc  = formatAccountNumber(tx.toAccount)
  const senderUpper   = tx.senderName.toUpperCase()
  const receiverUpper = tx.receiverName.toUpperCase()
  const displayReason = tx.reason || "MB Transfer"

  return (
    <div className="min-h-screen bg-black flex items-start justify-center py-8">
      <div className="bg-white w-full max-w-3xl shadow-2xl px-8 py-3">

        {/* ── Header ── */}
        <div className="bg-[#81007F] px-6 py-3 flex items-center justify-center gap-4 mb-0">
          <Image src="/CLOGO.png" alt="CBE Logo" width={56} height={56} className="rounded-full" />
          <div className="text-center">
            <h1 className="text-white/90 text-2xl font-bold">Commercial Bank of Ethiopia</h1>
            <p className="text-white/70 text-sm">VAT Invoice / Customer Receipt</p>
          </div>
        </div>

        {/* ── Company & Customer Info ── */}
        <div className="grid grid-cols-2 gap-6 mt-4 text-xs">
          {/* Left */}
          <div>
            <h3 className="font-bold mb-1 text-sm">Company Address &amp; Other Information</h3>
            <div className="space-y-0.5">
              {[
                ["Country",               BANK_INFO.country],
                ["City",                  BANK_INFO.city],
                ["Address",               BANK_INFO.address],
                ["Postal code",           BANK_INFO.postalCode],
                ["SWIFT Code",            BANK_INFO.swiftCode],
                ["Email",                 BANK_INFO.email],
                ["Tel",                   BANK_INFO.tel],
                ["Fax",                   BANK_INFO.fax],
                ["Tin",                   BANK_INFO.tin],
                ["VAT Receipt No",        BANK_INFO.vatReceiptNo],
                ["VAT Registration No",   BANK_INFO.vatRegistrationNo],
                ["VAT Registration Date", BANK_INFO.vatRegistrationDate],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[160px_auto]">
                  <span className="font-medium">{label}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div>
            <h3 className="font-bold mb-1 text-sm">Customer Information</h3>
            <div className="space-y-0.5">
              {[
                ["Customer Name",       senderUpper],
                ["Region",             "—"],
                ["City",               "YEKAWORKEDA-1"],
                ["Sub City",           "—"],
                ["Wereda/Kebele",      "—"],
                ["VAT Registration No","—"],
                ["VAT Registration Date","20210618"],
                ["TIN (TAX ID)",       "—"],
                ["Branch",             "DAMA SQUARE"],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[160px_auto]">
                  <span className="font-medium">{label}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Payment Information Table ── */}
        <div className="border-2 border-[#81007F] rounded-lg overflow-hidden mt-4 mb-4">
          <div className="text-[#81007F] border-b-2 border-black text-center py-2">
            <h3 className="font-bold text-lg">Payment / Transaction Information</h3>
          </div>

          <div className="relative divide-y divide-gray-200 text-sm">
            {/* Official Stamp overlay */}
            <div className="absolute left-1/3 top-1/3 z-10 pointer-events-none opacity-60">
              <Image
                src="/images/design-mode/Picsart_25-09-06_11-19-14-133.png"
                alt="CBE Official Stamp"
                width={140}
                height={140}
              />
            </div>

            {[
              ["Payer",                        senderUpper],
              ["Account",                      "1****8532"],
              ["Receiver",                     receiverUpper],
              ["Account",                      formattedAcc],
              ["Payment Date & Time",          tx.date],
              ["Reference No. (VAT Invoice No)", tx.txId],
              ["Reason / Type of service",     displayReason],
              ["Transferred Amount",           `ETB ${amountNumber.toFixed(2)}`],
              ["Commission or Service Charge", `ETB ${SERVICE_CHARGE.toFixed(2)}`],
              ["15% VAT on Commission",        "ETB 0.00"],
              [`15% VAT (15% of ${SERVICE_CHARGE})`, `ETB ${vatAmount.toFixed(2)}`],
              ["Disaster Recovery (5%)",       `ETB ${disasterRecovery.toFixed(2)}`],
            ].map(([label, value], i) => (
              <div key={i} className="grid grid-cols-2 py-1.5 px-4">
                <span className="font-medium">{label}</span>
                <span className="text-right">{value}</span>
              </div>
            ))}

            <div className="grid grid-cols-2 py-2 px-4 bg-gray-50 font-semibold text-sm">
              <span>Total amount debited from customer&apos;s account</span>
              <span className="text-right">ETB {totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* ── Amount in Words ── */}
        <div className="flex items-center gap-6 mb-4">
          <span className="font-medium text-sm text-gray-800 whitespace-nowrap">Amount in Words</span>
          <div className="border-2 border-black rounded text-center text-sm font-medium flex-1 py-1 px-2">
            ETB {wordsAmount}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="border-2 border-[#81007F] rounded mb-8 w-full max-w-md text-center mx-auto py-2">
          <p className="text-[#81007F] font-extrabold text-sm underline">
            The Bank you can always rely on.
          </p>
          <p className="text-xs font-extrabold text-gray-600">
            © 2025 Commercial Bank of Ethiopia. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-white text-lg">Loading receipt…</p>
      </div>
    }>
      <ReceiptContent />
    </Suspense>
  )
}
