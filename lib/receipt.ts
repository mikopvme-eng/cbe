import { BANK_INFO, SERVICE_CHARGE } from "./constants"

export function numberToWords(num: number): string {
  if (num === 0) return "Zero"

  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"]
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ]
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]
  const thousands = ["", "Thousand", "Million", "Billion"]

  const convertHundreds = (n: number): string => {
    let result = ""

    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + " Hundred "
      n %= 100
    }

    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + " "
      n %= 10
    } else if (n >= 10) {
      result += teens[n - 10] + " "
      return result.trim()
    }

    if (n > 0) {
      result += ones[n] + " "
    }

    return result.trim()
  }

  let result = ""
  let thousandIndex = 0
  let tempNum = num

  while (tempNum > 0) {
    const chunk = tempNum % 1000
    if (chunk !== 0) {
      const chunkWords = convertHundreds(chunk)
      result =
        chunkWords + (thousands[thousandIndex] ? " " + thousands[thousandIndex] : "") + (result ? " " + result : "")
    }
    tempNum = Math.floor(tempNum / 1000)
    thousandIndex++
  }

  return result.trim()
}

export function amountInWords(amt: string): string {
  const numAmount = Number.parseFloat(amt || "65")
  if (isNaN(numAmount)) return "Zero & Zero cents"

  const wholePart = Math.floor(numAmount)
  const decimalPart = Math.round((numAmount - wholePart) * 100)

  const wholeWords = numberToWords(wholePart)
  const decimalWords = decimalPart > 0 ? numberToWords(decimalPart) : "Zero"

  return `${wholeWords} & ${decimalWords} cents`
}

export function formatAccountNumber(accountNum: string): string {
  if (!accountNum || accountNum.length < 5) return accountNum
  const first = accountNum.charAt(0)
  const last4 = accountNum.slice(-4)
  return `${first}****${last4}`
}

export interface ReceiptData {
  senderName: string
  receiverName: string
  accountNumber: string
  amount: string
  reason: string
  dateTime: {
    date: string
    time: string
  }
}

export function generateReceiptHTML(data: ReceiptData): string {
  const displaySenderName = data.senderName.toUpperCase()
  const displayReceiverName = data.receiverName.toUpperCase()
  const displayAmount = data.amount || "1500.00"
  const displayReason = data.reason || "Topup 0911223212"
  const formattedAccount = data.accountNumber ? formatAccountNumber(data.accountNumber) : "1****0050"
  const wordsAmount = amountInWords(displayAmount)

  const amountNumber = Number.parseFloat(displayAmount) || 0
  const vatAmount = 0.15 * SERVICE_CHARGE
  const totalAmount = amountNumber + SERVICE_CHARGE + vatAmount

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CBE Receipt</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { 
      width: 794px;
      height: 1123px; 
      margin: 0; 
      padding: 0;
      background-color: black;
      display: flex;
      align-items: flex-start;
      padding-top: 5%;
      justify-content: center;
      box-sizing: border-box;
    }

    .receipt-container {
      width: 1080px;  
      background-color: white;
      overflow: hidden;
      margin: 0px auto;
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
    }
  </style>
</head>
<body>
  <div class="receipt-container bg-white px-8 py-3">
    <!-- Header -->
    <div class="bg-[rgba(129,0,127,255)] px-6 py-1 flex items-center justify-center"> 
      <div class="flex items-center gap-2"> 
        <img src="/images/design-mode/1000070952-removebg-preview.png" alt="CBE Logo" class="w-16 h-18 rounded-full" /> 
        <div class="text-center"> 
          <h1 class="text-white/90 text-3xl font-bold">Commercial Bank of Ethiopia</h1> 
          <p class="text-white/70 text-l">VAT Invoice / Customer Receipt</p> 
        </div> 
      </div> 
    </div>

    <!-- Receipt Content -->
    <div class="p-4">
      <!-- Company & Customer Info -->
      <div class="grid grid-cols-2 gap-4 mb-4 text-xs">
        <!-- Left Column -->
        <div>
          <h3 class="font-bold mb-1 text-base">Company Address & Other Information</h3>
          <div class="space-y-0 text-xs">
            <div class="grid grid-cols-[140px_auto]">
              <span class="font-medium">Country:</span>
              <span>${BANK_INFO.country}</span>
            </div>
            <div class="grid grid-cols-[140px_auto]">
              <span class="font-medium">City:</span>
              <span>${BANK_INFO.city}</span>
            </div>
            <div class="grid grid-cols-[140px_auto]">
              <span class="font-medium">Address:</span>
              <span>${BANK_INFO.address}</span>
            </div>
            <div class="grid grid-cols-[140px_auto]">
              <span class="font-medium">Postal code:</span>
              <span>${BANK_INFO.postalCode}</span>
            </div>
            <div class="grid grid-cols-[140px_auto]">
              <span class="font-medium">SWIFT Code:</span>
              <span>${BANK_INFO.swiftCode}</span>
            </div>
            <div class="grid grid-cols-[140px_auto]">
              <span class="font-medium">Email:</span>
              <span>${BANK_INFO.email}</span>
            </div>
            <div class="grid grid-cols-[140px_auto]">
              <span class="font-medium">Tel:</span>
              <span>${BANK_INFO.tel}</span>
            </div>
            <div class="grid grid-cols-[140px_auto]">
              <span class="font-medium">Fax:</span>
              <span>${BANK_INFO.fax}</span>
            </div>
            <div class="grid grid-cols-[140px_auto]">
              <span class="font-medium">Tin:</span>
              <span>${BANK_INFO.tin}</span>
            </div>
            <div class="grid grid-cols-[140px_auto]">
              <span class="font-medium">VAT Receipt No:</span>
              <span>${BANK_INFO.vatReceiptNo}</span>
            </div>
            <div class="grid grid-cols-[140px_auto]">
              <span class="font-medium">VAT Registration No:</span>
              <span>${BANK_INFO.vatRegistrationNo}</span>
            </div>
            <div class="grid grid-cols-[140px_auto]">
              <span class="font-medium">VAT Registration Date:</span>
              <span>${BANK_INFO.vatRegistrationDate}</span>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div>
          <h3 class="font-bold mb-2 text-base">Customer Information</h3>
          <div class="space-y-0 text-xs">
            <div class="grid grid-cols-[140px_auto]">
              <span class="font-medium">Customer Name:</span>
              <span>${displaySenderName}</span>
            </div>
            <div class="grid grid-cols-[140px_auto]">
              <span class="font-medium">Region:</span>
              <span>—</span>
            </div>
            <div class="grid grid-cols-[140px_auto]">
              <span class="font-medium">City:</span>
              <span>YEKAWORKEDA-1</span>
            </div>
            <div class="grid grid-cols-[140px_auto]">
              <span class="font-medium">Sub City:</span>
              <span>—</span>
            </div>
            <div class="grid grid-cols-[140px_auto]">
              <span class="font-medium">Wereda/Kebele:</span>
              <span>—</span>
            </div>
            <div class="grid grid-cols-[140px_auto]">
              <span class="font-medium">VAT Registration No:</span>
              <span>—</span>
            </div>
            <div class="grid grid-cols-[140px_auto]">
              <span class="font-medium">VAT Registration Date:</span>
              <span>20210618</span>
            </div>
            <div class="grid grid-cols-[140px_auto]">
              <span class="font-medium">TIN (TAX ID):</span>
              <span>—</span>
            </div>
            <div class="grid grid-cols-[140px_auto]">
              <span class="font-medium">Branch:</span>
              <span>DAMA SQUARE</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Information Table -->
      <div class="border-2 border-[rgba(129,0,127,255)] rounded-lg overflow-hidden mb-6">
        <div class="text-[rgba(129,0,127,255)] border-b-2 border-black text-center py-3">
          <h3 class="font-bold text-xl">Payment / Transaction Information</h3>
        </div>

        <div class="relative">
          <!-- Official Stamp overlay -->
          <div class="absolute left-1/3 top-1/3 z-10">
            <img src="/images/design-mode/Picsart_25-09-06_11-19-14-133.png" alt="CBE Official Stamp" class="w-40 h-40" />
          </div>

          <div class="divide-y divide-black py-4">
            <div class="grid grid-cols-2 py-0 px-4 text-sm">
              <span class="font-medium">Payer</span>
              <span class="text-right">${displaySenderName}</span>
            </div>
            <div class="grid grid-cols-2 py-2 px-4 text-sm">
              <span class="font-medium">Account</span>
              <span class="text-right">1****8532</span>
            </div>
            <div class="grid grid-cols-2 py-2 px-4 text-sm">
              <span class="font-medium">Receiver</span>
              <span class="text-right">${displayReceiverName}</span>
            </div>
            <div class="grid grid-cols-2 py-2 px-4 text-sm">
              <span class="font-medium">Account</span>
              <span class="text-right">${formattedAccount}</span>
            </div>
            <div class="grid grid-cols-2 py-2 px-4 text-sm">
              <span class="font-medium">Payment Date & Time</span>
              <span class="text-right">${data.dateTime.date}, ${data.dateTime.time}</span>
            </div>
            <div class="grid grid-cols-2 py-2 px-4 text-sm">
              <span class="font-medium">Reference No. (VAT Invoice No)</span>
              <span class="text-right">FT25204HHGP</span>
            </div>
            <div class="grid grid-cols-2 py-2 px-4 text-sm">
              <span class="font-medium">Reason / Type of service</span>
              <span class="text-right">${displayReason}</span>
            </div>
            <div class="grid grid-cols-2 py-2 px-4 text-sm">
              <span class="font-medium">Transferred Amount</span>
              <span class="text-right">ETB ${amountNumber.toFixed(2)}</span>
            </div>
            <div class="grid grid-cols-2 py-2 px-4 text-sm">
              <span class="font-medium">Commission or Service Charge</span>
              <span class="text-right">ETB ${SERVICE_CHARGE.toFixed(2)}</span>
            </div>
            <div class="grid grid-cols-2 py-2 px-4 text-sm">
              <span class="font-medium">15% VAT on Commission</span>
              <span class="text-right">ETB 0.00</span>
            </div>
            <div class="grid grid-cols-2 py-2 px-4 text-sm">
              <span class="font-medium">15% VAT (15% of ${SERVICE_CHARGE})</span>
              <span class="text-right">ETB ${vatAmount.toFixed(2)}</span>
            </div>
            <div class="grid grid-cols-2 py-2 px-4 bg-gray-50 text-sm font-medium">
              <span>Total amount debited from customers account</span>
              <span class="text-right">ETB ${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Amount in Words -->
      <div class="flex items-center mb-2">
        <div class="mr-3 font-medium text-sm text-gray-800 ml-6">Amount in Word</div>
        <div class="border-2 border-black pb-6 rounded text-center text-sm font-medium w-[400px]">
          ETB ${wordsAmount}
        </div>
        <div class="ml-9">
          <img src="/images/design-mode/Picsart_25-09-05_09-57-57-937.jpg.jpeg" alt="QR Code" class="w-24 h-24" />
        </div>
      </div>

      <!-- Footer -->
      <div class="border-2 border-[rgba(129,0,127,255)] rounded mb-12 w-[500px] text-center mx-auto">
        <div class="text-[rgba(129,0,127,255)]/90 font-extrabold text-sm underline">The Bank you can always rely on.</div>
        <div class="text-xs font-extrabold text-gray-600">© 2025 Commercial Bank of Ethiopia. All rights reserved.</div>
      </div>
    </div>
  </div>
</body>
</html>
  `
}
