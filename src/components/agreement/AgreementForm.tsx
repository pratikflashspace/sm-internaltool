'use client'
import { Input, Select, RadioGroup, SectionLabel } from '@/components/ui'
import type { AgreementFormData } from '@/types'

interface Props {
  data: AgreementFormData
  update: <K extends keyof AgreementFormData>(key: K, val: AgreementFormData[K]) => void
}

export function AgreementForm({ data, update }: Props) {
  return (
    <div className="flex flex-col gap-5">

      {/* Agreement Details */}
      <section>
        <SectionLabel>Agreement Details</SectionLabel>
        <div className="flex flex-col gap-2.5">
          <Input label="Agreement Date" type="date" required value={data.agrDate} onChange={e => update('agrDate', e.target.value)} />
          <Select
            label="Room Number" required
            value={data.room}
            onChange={e => update('room', e.target.value as AgreementFormData['room'])}
            options={[
              { value: '203', label: 'Room 203 — 2nd Floor' },
              { value: '112', label: 'Room 112 — 2nd Floor' },
              { value: '114', label: 'Room 114 — 2nd Floor' },
            ]}
            placeholder="Select room..."
          />
        </div>
      </section>

      {/* Company */}
      <section>
        <SectionLabel>Company & Director</SectionLabel>
        <div className="flex flex-col gap-2.5">
          <Input
            label="Company Name" required
            value={data.company}
            onChange={e => update('company', e.target.value.toUpperCase())}
            placeholder="e.g. ABC TECHNOLOGIES PVT LTD"
            style={{ textTransform: 'uppercase' }}
          />
          <Select
            label="Position" required
            value={data.position}
            onChange={e => update('position', e.target.value as AgreementFormData['position'])}
            options={[
              { value: 'Director', label: 'Director' },
              { value: 'Partner', label: 'Partner' },
              { value: 'Proprietor', label: 'Proprietor' },
              { value: 'Karta', label: 'Karta' },
              { value: 'Trustee', label: 'Trustee' },
            ]}
            placeholder="Select position..."
          />
          <Input
            label="Director / Authorised Person Name" required
            value={data.director}
            onChange={e => update('director', e.target.value.toUpperCase())}
            placeholder="e.g. RAHUL SHARMA"
            style={{ textTransform: 'uppercase' }}
          />
          <RadioGroup
            label="Relation" required
            name="relation"
            value={data.relation}
            onChange={v => update('relation', v as AgreementFormData['relation'])}
            options={[
              { value: 'S/O', label: 'S/O' },
              { value: 'D/O', label: 'D/O' },
              { value: 'W/O', label: 'W/O' },
            ]}
          />
          <Input
            label="Father / Husband Name" required
            value={data.fatherName}
            onChange={e => update('fatherName', e.target.value)}
            placeholder="Full name"
          />
          <Input
            label="Residential Address" required
            value={data.address}
            onChange={e => update('address', e.target.value)}
            placeholder="Full address"
          />
          <Input
            label="PAN Number" required
            value={data.pan}
            onChange={e => update('pan', e.target.value.toUpperCase())}
            placeholder="e.g. ABCDE1234F"
            maxLength={10}
          />
          <Input
            label="Mobile Number" required
            value={data.mobile}
            onChange={e => update('mobile', e.target.value)}
            placeholder="10-digit number"
            maxLength={10}
          />
        </div>
      </section>

      {/* Plan & Fee */}
      <section>
        <SectionLabel>Membership / Plan</SectionLabel>
        <div className="flex flex-col gap-2.5">
          <RadioGroup
            label="Plan Type" required
            name="planType"
            value={data.planType}
            onChange={v => update('planType', v as AgreementFormData['planType'])}
            options={[
              { value: 'BR', label: 'BR' },
              { value: 'GST', label: 'GST' },
              { value: 'Mailing Address', label: 'Mailing Address' },
            ]}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hideAmt"
              checked={data.hideAmount}
              onChange={e => update('hideAmount', e.target.checked)}
              className="accent-[#1ABCB0] cursor-pointer"
            />
            <label htmlFor="hideAmt" className="text-xs text-[#4a5568] cursor-pointer select-none">
              No amount (fee not mentioned in agreement)
            </label>
          </div>
          {!data.hideAmount && (
            <Input
              label="Membership Fee" hint="numeric only, INR added automatically"
              value={data.fee}
              onChange={e => update('fee', e.target.value)}
              placeholder="e.g. 12000"
              prefix="INR"
            />
          )}
        </div>
      </section>

      {/* NOC */}
      <section>
        <SectionLabel>NOC Letter</SectionLabel>
        <Input label="NOC Date" type="date" required value={data.nocDate} onChange={e => update('nocDate', e.target.value)} />
      </section>

      {/* Client Contact */}
      <section>
        <SectionLabel>Client Contact</SectionLabel>
        <div className="flex flex-col gap-2.5">
          <Input
            label="Client Email" required type="email"
            value={data.clientEmail}
            onChange={e => update('clientEmail', e.target.value)}
            placeholder="client@company.com"
          />
          <Input
            label="Client WhatsApp / Phone" required
            value={data.clientPhone}
            onChange={e => update('clientPhone', e.target.value)}
            placeholder="9876543210"
            maxLength={10}
            prefix="+91"
          />
        </div>
      </section>
    </div>
  )
}
