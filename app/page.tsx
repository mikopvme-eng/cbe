"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { DEFAULT_PIN, DEFAULT_SENDER_NAME, DEFAULT_RECEIVER_NAME, SERVICE_CHARGE } from "@/lib/constants"
import { generateReceiptHTML } from "@/lib/receipt"

// Import modular screens
import LoginScreen from "@/components/banking/LoginScreen"
import DashboardScreen from "@/components/banking/DashboardScreen"
import TransferNamesScreen from "@/components/banking/TransferNamesScreen"
import AmountScreen from "@/components/banking/AmountScreen"
import ConfirmationScreen from "@/components/banking/ConfirmationScreen"
import PayForScreen from "@/components/banking/PayForScreen"

type Screen = "login" | "dashboard" | "transfer-names" | "amount" | "confirmation" | "payfor"

interface RecentTransfer {
  name: string
  account: string
}

const DEFAULT_RECENTS: RecentTransfer[] = [
  { name: "Zeyneba Meki Yasin",      account: "1000403184717" },
  { name: "Asnakech Zewudu Gemeda",  account: "1000289123828" },
  { name: "Geremew Seifu Bekele",    account: "1000192732702" },
  { name: "Mesud Miftah Shafi",      account: "1000982315623" },
  { name: "Abera Aredo Bedasa",      account: "1000382913296" },
]

export default function CBEMobileBanking() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login")
  const [pin, setPin] = useState("")
  const [senderName, setSenderName] = useState("")
  const [receiverName, setReceiverName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")

  // Dynamic Recent Transfers state
  const [recentTransfers, setRecentTransfers] = useState<RecentTransfer[]>([])

  // Load persisted names and recents from localStorage on mount
  useEffect(() => {
    const storedSender   = localStorage.getItem("cbe_sender_name")   || ""
    const storedReceiver = localStorage.getItem("cbe_receiver_name") || ""
    if (storedSender)   setSenderName(storedSender)
    if (storedReceiver) setReceiverName(storedReceiver)

    const storedRecents = localStorage.getItem("cbe_recent_transfers")
    if (storedRecents) {
      try {
        setRecentTransfers(JSON.parse(storedRecents))
      } catch (e) {
        setRecentTransfers(DEFAULT_RECENTS)
      }
    } else {
      setRecentTransfers(DEFAULT_RECENTS)
      localStorage.setItem("cbe_recent_transfers", JSON.stringify(DEFAULT_RECENTS))
    }
  }, [])

  // Save names handler — persists to localStorage and updates state
  const handleSaveNames = useCallback((sender: string, receiver: string) => {
    setSenderName(sender)
    setReceiverName(receiver)
    localStorage.setItem("cbe_sender_name",   sender)
    localStorage.setItem("cbe_receiver_name", receiver)
  }, [])

  // Memoized current date formatting
  const currentDate = useMemo(() => new Date(), [])
  const formattedDate = useMemo(
    () =>
      currentDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    [currentDate],
  )
  const formattedDateTime = useMemo(
    () => ({
      date: currentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      time: currentDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      shortDate: currentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    }),
    [currentDate],
  )

  // Handlers
  const handlePinSubmit = useCallback(() => {
    if (pin === DEFAULT_PIN) {
      setCurrentScreen("dashboard")
    } else {
      setPin("")
    }
  }, [pin])

  const handleTransferClick = useCallback(() => {
    // Reset transfer state on starting fresh
    setAccountNumber("")
    setAmount("")
    setReason("")
    setCurrentScreen("transfer-names")
  }, [])

  // Transfer screen (account number) → Amount screen
  const handleTransferContinue = useCallback(() => {
    setCurrentScreen("amount")
  }, [])

  // Amount screen (confirm sheet) → Confirmation screen
  const handleAmountTransfer = useCallback(() => {
    // Add current transfer to recent list
    const activeReceiver = receiverName.trim() || DEFAULT_RECEIVER_NAME
    const activeAccount  = accountNumber.trim()

    setRecentTransfers(prev => {
      // Avoid duplicate accounts in recents — filter existing and prepending
      const filtered = prev.filter(item => item.account !== activeAccount)
      const updated = [{ name: activeReceiver, account: activeAccount }, ...filtered]
      localStorage.setItem("cbe_recent_transfers", JSON.stringify(updated))
      return updated
    })

    setCurrentScreen("confirmation")
  }, [receiverName, accountNumber])

  const handleSelectRecent = useCallback((name: string, account: string) => {
    setReceiverName(name)
    setAccountNumber(account)
    // Instantly direct to amount screen per user instruction
    setCurrentScreen("amount")
  }, [])

  const handleDeleteRecent = useCallback((account: string) => {
    setRecentTransfers(prev => {
      const updated = prev.filter(item => item.account !== account)
      localStorage.setItem("cbe_recent_transfers", JSON.stringify(updated))
      return updated
    })
  }, [])

  const handleClearAllRecents = useCallback(() => {
    setRecentTransfers([])
    localStorage.setItem("cbe_recent_transfers", JSON.stringify([]))
  }, [])

  const handleBack = useCallback(() => {
    switch (currentScreen) {
      case "transfer-names":
        setCurrentScreen("dashboard")
        break
      case "amount":
        setCurrentScreen("transfer-names")
        break
      case "confirmation":
        setCurrentScreen("dashboard")
        break
      case "payfor":
        setCurrentScreen("dashboard")
        break
      default:
        break
    }
  }, [currentScreen])

  // Receipt window handler
  const handleReceiptClick = useCallback(() => {
    const receiptData = {
      senderName: senderName || DEFAULT_SENDER_NAME,
      receiverName: receiverName || DEFAULT_RECEIVER_NAME,
      accountNumber,
      amount,
      reason,
      dateTime: formattedDateTime,
    }

    const receiptWindow = window.open("", "_blank", "width=1080,height=1400,scrollbars=yes,resizable=yes")
    if (receiptWindow) {
      receiptWindow.document.write(generateReceiptHTML(receiptData))
      receiptWindow.document.close()
    }
  }, [senderName, receiverName, accountNumber, amount, reason, formattedDateTime])

  // Send push notification on confirmation
  const sendPaymentNotification = useCallback(
    async (displaySenderName: string, displayReceiverName: string, displayAmount: string) => {
      const amountNumber = Number.parseFloat(displayAmount) || 0
      const vatAmount = 0.15 * SERVICE_CHARGE
      const totalAmount = amountNumber + SERVICE_CHARGE + vatAmount

      const title = "Payment Debited Successfully"
      const options = {
        body: `ETB ${Number.parseFloat(displayAmount).toFixed(2)} debited from ${displaySenderName} - ETB-8422 for ${displayReceiverName} - ETB-6278 on ${formattedDateTime.date} with transaction ID: FT26298PT5MY. Total Amount Debited ETB ${totalAmount.toFixed(2)} with commission of ETB ${SERVICE_CHARGE.toFixed(2)} and 15% VAT of ETB ${vatAmount.toFixed(2)}.`,
        icon: "/cbe-logo.png",
        badge: "/cbe-logo.png",
        tag: "payment-notification",
        requireInteraction: false,
        silent: false,
      }

      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(title, options)
        } else if (Notification.permission !== "denied") {
          try {
            const permission = await Notification.requestPermission()
            if (permission === "granted") {
              new Notification(title, options)
            }
          } catch (error) {
            console.error("[CBE] Error requesting notification permission:", error)
          }
        }
      }
    },
    [formattedDateTime],
  )

  useEffect(() => {
    if (currentScreen === "confirmation") {
      const displaySenderName = senderName?.toUpperCase() || DEFAULT_SENDER_NAME
      const displayReceiverName = receiverName?.toUpperCase() || DEFAULT_RECEIVER_NAME
      const displayAmount = amount || "1500.00"

      setTimeout(() => {
        sendPaymentNotification(displaySenderName, displayReceiverName, displayAmount)
      }, 500)
    }
  }, [currentScreen, senderName, receiverName, amount, sendPaymentNotification])

  // Render screens
  switch (currentScreen) {
    case "login":
      return (
        <LoginScreen
          pin={pin}
          setPin={setPin}
          onSubmit={handlePinSubmit}
        />
      )
    case "dashboard":
      return (
        <DashboardScreen
          formattedDate={formattedDate}
          onTransferClick={handleTransferClick}
          onReceiptClick={handleReceiptClick}
          savedSenderName={senderName}
          savedReceiverName={receiverName}
          onSaveNames={handleSaveNames}
          onPayForClick={() => setCurrentScreen("payfor")}
        />
      )
    case "transfer-names":
      return (
        <TransferNamesScreen
          senderName={senderName}
          setSenderName={setSenderName}
          receiverName={receiverName}
          setReceiverName={setReceiverName}
          accountNumber={accountNumber}
          setAccountNumber={setAccountNumber}
          amount={amount}
          setAmount={setAmount}
          reason={reason}
          setReason={setReason}
          recentTransfers={recentTransfers}
          onSelectRecent={handleSelectRecent}
          onDeleteRecent={handleDeleteRecent}
          onClearAll={handleClearAllRecents}
          onBack={handleBack}
          onSubmit={handleTransferContinue}
        />
      )
    case "amount":
      return (
        <AmountScreen
          receiverName={receiverName}
          accountNumber={accountNumber}
          amount={amount}
          setAmount={setAmount}
          reason={reason}
          setReason={setReason}
          onBack={handleBack}
          onTransfer={handleAmountTransfer}
        />
      )
    case "confirmation":
      return (
        <ConfirmationScreen
          senderName={senderName}
          receiverName={receiverName}
          accountNumber={accountNumber}
          amount={amount}
          reason={reason}
          formattedDateTime={formattedDateTime}
          onBack={handleBack}
          onClose={() => setCurrentScreen("dashboard")}
          onReceiptClick={handleReceiptClick}
        />
      )
    case "payfor":
      return (
        <PayForScreen
          savedSenderName={senderName}
          savedReceiverName={receiverName}
          onSaveNames={handleSaveNames}
          onBack={handleBack}
        />
      )
    default:
      return null
  }
}
