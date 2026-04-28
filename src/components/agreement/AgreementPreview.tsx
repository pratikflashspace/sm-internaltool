'use client'
import { parseDate, feeString, floorLabel } from '@/lib/agreement/helpers'
import type { AgreementFormData } from '@/types'

interface Props { data: AgreementFormData }

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function Fill({ val, placeholder }: { val: string; placeholder: string }) {
  if (!val) return <span style={{color:'#e05252', fontStyle:'italic'}}>[{placeholder}]</span>
  return <span style={{color:'#0f9c92', fontWeight:600}}>{val}</span>
}

export function AgreementPreview({ data }: Props) {
  const agrDate = parseDate(data.agrDate)
  const nocDate = parseDate(data.nocDate)
  const company = data.company.toUpperCase() || ''
  const director = data.director.toUpperCase() || ''
  const fee = feeString(data)
  const floor = floorLabel(data.room)
  const isMailing = data.planType === 'Mailing Address'

  const agrDateStr = agrDate
    ? <><strong>{agrDate.ordDay}</strong> day of <strong>{agrDate.month}</strong>, year <strong>{agrDate.year} {agrDate.yearWords}</strong></>
    : <Fill val="" placeholder="Agreement Date" />

  const feeLine = (data.hideAmount || !data.fee)
    ? 'The user shall pay a membership fee plus additional taxes. After 11 months, the payment will be made again. The agreement is recurring in nature and gets renewed automatically.'
    : <>The user shall pay a membership fee of <Fill val={fee ? `"${fee}"` : ''} placeholder="Membership Fee" /> plus additional taxes. After 11 months, the payment will be made again. The agreement is recurring in nature and gets renewed automatically.</>

  return (
    <div className="font-[Arial,sans-serif] text-[11pt] text-[#111] leading-relaxed">

      {/* Title */}
      <p className="text-center font-bold underline text-[13pt] mb-4">LEAVE &amp; LICENSE AGREEMENT</p>

      {/* Opening */}
      <p className="text-justify mb-3">
        This agreement is made at <strong>DELHI</strong> on the {agrDateStr} by and between{' '}
        <strong>Stirring Minds Services Pvt Ltd</strong>, a company registered under the Companies Act, 2013,
        having its registered office Room{' '}
        <Fill val={data.room ? `"${data.room}"` : ''} placeholder="Room No" />,
        {' '}2-A/3, S/F Front side, Kundan Mansion, Asaf Ali Road, Turkman Gate, Delhi New Delhi-110002 India
        (hereinafter referred to as the &quot;Company&quot; or &quot;Us&quot; or &quot;Stirring Minds&quot; or &quot;Hub&quot;).
      </p>

      <p className="text-center font-bold my-2">AND</p>

      <p className="text-justify mb-3">
        <Fill val={company ? `"${company}"` : ''} placeholder="COMPANY NAME" /> through its &quot;<Fill val={data.position} placeholder="Position" />&quot;,{' '}
        &quot;<Fill val={director} placeholder="DIRECTOR NAME" />&quot;,{' '}
        &quot;<Fill val={data.relation} placeholder="S/O|D/O|W/O" />&quot;{' '}
        &quot;<Fill val={data.fatherName} placeholder="Father/Husband Name" />&quot;, R/O{' '}
        &quot;<Fill val={data.address} placeholder="Residential Address" />&quot;, with PAN Number{' '}
        &quot;<Fill val={data.pan} placeholder="PAN" />&quot;, with mobile number{' '}
        &quot;<Fill val={data.mobile} placeholder="Mobile" />&quot;, hereinafter referred to as &quot;You&quot; or &quot;User&quot;.
      </p>

      {/* Definitions */}
      <p className="font-bold underline mt-3 mb-1">DEFINITIONS</p>
      <ul className="list-disc ml-5 space-y-0.5 mb-3">
        <li><strong>&lsquo;Leave and License Agreement&rsquo;</strong> means this document, which lays out the mutual expectations of the Member and Stirring Minds.</li>
        <li><strong>&lsquo;Mutual Expectations&rsquo;</strong> or &lsquo;Expectations&rsquo; are what you and us both say we will do.</li>
        <li><strong>&lsquo;Stirring Minds office space&rsquo;</strong> means the building and facilities of Stirring Minds, Room{' '}
          <Fill val={data.room} placeholder="Room No" />, 2-A/3, S/F Front side, Kundan Mansion, Asaf Ali Road, Turkman Gate, Delhi New Delhi-110002
        </li>
      </ul>

      <p className="font-bold text-justify mb-2">
        WHEREAS THE Company is carrying on business at Room{' '}
        <Fill val={data.room} placeholder="Room No" />, 2-A/3, S/F Front side, Kundan Mansion, Asaf Ali Road,
        Turkman Gate, Delhi New Delhi-110002 and running its business service center (hereinafter referred to as
        &quot;Stirring Minds&quot; or &quot;Stirring Minds Office Space&quot; or &quot;Hub&quot;) at the said place.
      </p>

      <p className="font-bold text-justify mb-3">
        AND WHEREAS the Company has permitted the User to avail the facilities of Stirring Minds, AND WHEREAS the Company
        has consented to the said proposal of the User and the parties hereto are desirous of recording the terms and
        conditions of the said agreement as per below.
      </p>

      <ul className="list-disc ml-5 mb-3">
        <li>{feeLine}</li>
      </ul>

      {/* Additional Benefits */}
      <p className="font-bold underline mt-3 mb-1">ADDITIONAL BENEFITS</p>
      <p className="mb-1">The members might use this address for the following:</p>
      <ul className="list-disc ml-5 mb-3">
        {!isMailing && <li>Use of office address for govt. registrations</li>}
        <li>Use of office mail services</li>
      </ul>

      {/* Limited Rights */}
      <p className="font-bold underline mt-3 mb-1">LIMITED RIGHTS TO USE OF SPACE</p>
      <ul className="list-disc ml-5 space-y-0.5 mb-3">
        <li>You understand that your membership does not constitute a lease or sublease but is only a license to use the suite allotted to the user within Room <Fill val={data.room} placeholder="Room No" />, the allocated Office Space.</li>
        <li>You understand that membership is a privilege that may be revoked at Stirring Minds&apos;s discretion.</li>
        <li>Stirring Minds hereby agrees to let the member/members run their business/businesses only out of the{' '}
          <strong>{floor}</strong> Room <Fill val={data.room} placeholder="Room No" /> in the Stirring Minds office space.
        </li>
        <li>Storage cupboards will be charged Rs 300/cupboard/month.</li>
      </ul>

      {/* Terms of Payment */}
      <p className="font-bold underline mt-3 mb-1">TERMS OF PAYMENT</p>
      <ul className="list-disc ml-5 space-y-0.5 mb-3">
        <li>Membership Plan Prices are exclusive of all taxes.</li>
        <li>Memberships must be paid on annually basis.</li>
        <li>Access cards issued at joining. Loss re-issued at INR 100.</li>
        <li>Grace period of 20 days on renewal delay; per day penalty of Rs 100 thereafter.</li>
        <li>Upon renewal, membership fee shall automatically increase by 10% over the previous year&apos;s price.</li>
        <li>Guest policy: no more than ½ hour (30 minutes). Extended stay: <strong>INR 500 + GST per day.</strong></li>
        <li>The use of <strong>meeting rooms</strong> is chargeable as per applicable tariff.</li>
      </ul>

      {/* Signatures */}
      <p className="mt-4 mb-3 text-justify">
        Both parties have signed this deed of Leave &amp; License Agreement on the day, month and year first mentioned above.
      </p>
      <p className="font-bold">PRANAV BHATIA</p>
      <p className="mb-3">(Director, STIRRING MINDS SERVICES PVT LTD)</p>
      <p className="font-bold"><Fill val={director} placeholder="DIRECTOR NAME" /></p>
      <p className="mb-4">(<Fill val={data.position} placeholder="Position" />, <Fill val={company} placeholder="COMPANY NAME" />)</p>

      <p className="font-bold underline mb-2">WITNESSES</p>
      <p className="font-bold">Witness 1:</p>
      <p>_____________________________</p>
      <p className="font-bold">PRATIK DEY</p>
      <p className="mb-3">Aadhar No: 5309 7600 8589</p>
      <p className="font-bold">Witness 2:</p>
      <p>_____________________________</p>
      <p className="font-bold mb-4">SURABHI DEWRA</p>

      {/* NOC */}
      <div className="mt-6 pt-4 border-t-2 border-[#eee]">
        <div className="text-right mb-4">
          <p className="font-bold">Kanchan Bhatia</p>
          <p>94 Gagan Vihar (Main)</p>
          <p>Vikas Marg, Delhi &ndash; 110051</p>
        </div>
        <p className="text-center font-bold mb-2">TO WHOMSOEVER IT MAY CONCERN</p>
        <p className="mb-1">Dear Sir/Ma&apos;am,</p>
        <p className="font-bold mb-2">Sub: NOC Letter</p>
        <p className="text-justify mb-4">
          I am the owner and landlady of the property c/o Stirring Minds, Room <Fill val={data.room} placeholder="Room No" />,
          2-A/3, S/F Front side, Kundan Mansion, Asaf Ali Road, Turkman Gate, Delhi New Delhi-110002.
          I have no objection if <Fill val={company} placeholder="COMPANY NAME" />, through its <Fill val={data.position} placeholder="Position" />,{' '}
          <Fill val={director} placeholder="DIRECTOR NAME" />, uses this address for government registrations and as a registered office address.
        </p>
        <p className="mb-4">Thanking you,</p>
        <p>_____________________________</p>
        <p className="font-bold">Kanchan Bhatia</p>
        <p className="my-3">_____________________________</p>
        <p className="font-bold">Pranav Bhatia</p>
        <p className="mt-3">Date : <Fill val={nocDate ? nocDate.short : ''} placeholder="NOC Date" /></p>
        <p>Place : New Delhi</p>
      </div>
    </div>
  )
}
