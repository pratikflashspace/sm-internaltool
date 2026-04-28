import type { AgreementFormData } from '@/types'

// ── DATE HELPERS ──────────────────────────────────────────────

export function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

export function numberToWords(n: number): string {
  const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine',
    'Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen']
  const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety']
  if (n === 0) return 'Zero'
  if (n < 20) return ones[n]
  if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? ' ' + ones[n%10] : '')
  if (n < 1000) return ones[Math.floor(n/100)] + ' Hundred' + (n%100 ? ' ' + numberToWords(n%100) : '')
  if (n < 10000) return ones[Math.floor(n/1000)] + ' Thousand' + (n%1000 ? ' ' + numberToWords(n%1000) : '')
  return n.toString()
}

export interface ParsedDate {
  day: number
  ordDay: string
  month: string
  year: number
  yearWords: string
  short: string // e.g. "28/4/2026"
}

export function parseDate(dateStr: string): ParsedDate | null {
  if (!dateStr) return null
  const d = new Date(dateStr + 'T00:00:00')
  if (isNaN(d.getTime())) return null
  const day = d.getDate()
  const month = MONTHS[d.getMonth()]
  const year = d.getFullYear()
  return {
    day,
    ordDay: ordinal(day),
    month,
    year,
    yearWords: numberToWords(year),
    short: `${day}/${d.getMonth() + 1}/${year}`,
  }
}

// ── FIELD HELPERS ─────────────────────────────────────────────

export function feeString(data: AgreementFormData): string {
  if (data.hideAmount || !data.fee) return ''
  return `INR ${data.fee}`
}

export function floorLabel(room: string): string {
  return '2nd Floor'
}

export function floorWord(_room: string): string {
  return 'SECOND'
}

// ── PLAIN TEXT BUILDER (for Google Docs / download) ───────────

export function buildAgreementText(data: AgreementFormData): string {
  const agrDate = parseDate(data.agrDate)
  const nocDate = parseDate(data.nocDate)
  const room    = data.room || '[Room No]'
  const company = (data.company || '[COMPANY NAME]').toUpperCase()
  const director = (data.director || '[DIRECTOR NAME]').toUpperCase()
  const position = data.position || '[Position]'
  const relation = data.relation || '[S/O|D/O|W/O]'
  const father   = data.fatherName || '[Father/Husband Name]'
  const address  = data.address || '[Residential Address]'
  const pan      = data.pan || '[PAN]'
  const mobile   = data.mobile || '[Mobile]'
  const fee      = feeString(data)
  const plan     = data.planType || ''

  const agrDateStr = agrDate
    ? `the ${agrDate.ordDay} day of ${agrDate.month}, year ${agrDate.year} ${agrDate.yearWords}`
    : '[Date]'
  const nocDateStr = nocDate ? nocDate.short : '[Date]'
  const floor = floorLabel(room)

  const feeLine = data.hideAmount || !data.fee
    ? 'The user shall pay a membership fee plus additional taxes. After 11 months, the payment will be made again. The agreement is recurring in nature and gets renewed automatically.'
    : `The user shall pay a membership fee of "${fee}" plus additional taxes. After 11 months, the payment will be made again. The agreement is recurring in nature and gets renewed automatically.`

  return `LEAVE & LICENSE AGREEMENT
${'='.repeat(60)}

This agreement is made at DELHI on ${agrDateStr} by and between Stirring Minds Services Pvt Ltd, a company registered under the Companies Act, 2013, having its registered office Room "${room}", 2-A/3, S/F Front side, Kundan Mansion, Asaf Ali Road, Turkman Gate, Delhi New Delhi-110002 India (hereinafter referred to as the "Company" or "Us" or "Stirring Minds" or "Hub").

AND

"${company}" through its "${position}", "${director}", "${relation}" "${father}", R/O "${address}", with PAN Number "${pan}", with mobile number "${mobile}", hereinafter referred to as "You" or "User".

DEFINITIONS
-----------
• 'Leave and License Agreement' means this document, which lays out the mutual expectations of the Member and Stirring Minds.
• 'Mutual Expectations' or 'Expectations' are what you and us both say we will do.
• 'Stirring Minds office space' means the building and facilities of Stirring Minds, Room ${room}, 2-A/3, S/F Front side, Kundan Mansion, Asaf Ali Road, Turkman Gate, Delhi New Delhi-110002

WHEREAS THE Company is carrying on business at Room ${room}, 2-A/3, S/F Front side, Kundan Mansion, Asaf Ali Road, Turkman Gate, Delhi New Delhi-110002.

AND WHEREAS the Company has permitted the User to avail the facilities of Stirring Minds, AND WHEREAS the Company has consented to the said proposal of the User and the parties hereto are desirous of recording the terms and conditions of the said agreement as per below.

• ${feeLine}

ADDITIONAL BENEFITS
The members might use this address for the following:
${plan !== 'Mailing Address' ? '• Use of office address for govt. registrations\n' : ''}• Use of office mail services

LIMITED RIGHTS TO USE OF SPACE
• You understand that your membership does not constitute a lease or sublease but is only a license to use the suite allotted to the user within Room ${room}, the allocated Office Space.
• You understand that membership is a privilege that may be revoked at Stirring Minds's discretion.
• Stirring Minds hereby agrees to let the member/members run their business/businesses only out of the ${floor} Room ${room} in the Stirring Minds office space.
• Storage cupboards will be charged Rs 300/cupboard/month.

TERMS OF PAYMENT
• Membership Plan Prices are exclusive of all taxes.
• Memberships must be paid on annually basis.
• Access cards will be issued at the time of joining. In-case of loss, re-issued at INR 100.
• Grace period of 20 days on renewal delay; per day penalty of Rs 100 thereafter.
• Upon renewal, membership fee shall automatically increase by 10% over the previous year's price.
• Renewals would be automatic in case of Mailing Box Plans.
• Guest policy: guests permitted for no more than 1/2 hour (30 minutes). Extended stay: INR 500 + GST per day.
• Meeting rooms are chargeable as per applicable tariff.

INDEMNIFICATION AND LIMITED LIABILITY
• You are responsible for injuries or damages caused by your negligence.
• Under no event shall Stirring Minds be liable for any direct or indirect damages.
• AGREE NOT TO HOLD Stirring Minds OR ITS EMPLOYEES RESPONSIBLE for loss/damage of personal belongings.

FINAL PROVISIONS
• Stirring Minds reserves the right to update Terms and Conditions at any time.
• Your membership is non-transferrable.
• Arbitration: disputes settled as per Indian Arbitration and Conciliation Act, 1996 at Delhi, India.
• The rights and obligations not specified herein will be as provided under Indian Law.

NO ILLEGAL OR OTHERWISE OBJECTIONABLE ACTIVITY
• You agree not to engage in any illegal activity in the Stirring Minds office space.
• You agree not to engage in activities that may damage the functioning of Stirring Minds.

Both parties have signed this deed of Leave & License Agreement on the day, month and year first mentioned above.

• PRANAV BHATIA
  (Director, STIRRING MINDS SERVICES PVT LTD)

• ${director}
  (${position}, ${company})

WITNESSES

Witness 1:
_____________________________
PRATIK DEY
Aadhar No: 5309 7600 8589

Witness 2:
_____________________________
SURABHI DEWRA

${'='.repeat(60)}
NOC LETTER
${'='.repeat(60)}

                                          Kanchan Bhatia
                                          94 Gagan Vihar (Main)
                                          Vikas Marg, Delhi - 110051

TO WHOMSOEVER IT MAY CONCERN

Dear Sir/Ma'am,

Sub: NOC Letter

I am the owner and landlady of the property c/o Stirring Minds, Room ${room}, 2-A/3, S/F Front side, Kundan Mansion, Asaf Ali Road, Turkman Gate, Delhi New Delhi-110002. I have no objection if ${company}, through its ${position}, ${director}, uses this address for government registrations and as a registered office address.

Thanking you,

_____________________________
Kanchan Bhatia

_____________________________
Pranav Bhatia

Date : ${nocDateStr}
Place : New Delhi
`
}

// ── GOOGLE DOCS PAYLOAD ───────────────────────────────────────

export function buildGDocsPayload(data: AgreementFormData) {
  const agrDate = parseDate(data.agrDate)
  const nocDate = parseDate(data.nocDate)
  return {
    company    : (data.company || '').toUpperCase(),
    director   : (data.director || '').toUpperCase(),
    position   : data.position,
    relation   : data.relation,
    fatherName : data.fatherName,
    address    : data.address,
    pan        : data.pan,
    mobile     : data.mobile,
    room       : data.room,
    fee        : feeString(data),
    hideAmount : data.hideAmount,
    plan       : data.planType,
    agrDate    : agrDate ? `${agrDate.ordDay} day of ${agrDate.month}, year ${agrDate.year}` : '[Date]',
    nocDate    : nocDate ? nocDate.short : '[Date]',
    date       : data.agrDate || new Date().toISOString().slice(0,10),
    clientEmail: data.clientEmail,
    clientPhone: data.clientPhone,
  }
}
