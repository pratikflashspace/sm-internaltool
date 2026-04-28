'use client'
import { useState, useCallback } from 'react'
import type { AgreementFormData } from '@/types'
import type { GDocResult } from '@/types'
import { buildGDocsPayload } from '@/lib/agreement/helpers'

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || ''

const EMPTY: AgreementFormData = {
  agrDate: '', room: '', company: '', director: '',
  position: '', relation: '', fatherName: '', address: '',
  pan: '', mobile: '', planType: '', fee: '',
  hideAmount: false, nocDate: '', clientEmail: '', clientPhone: '',
}

export function useAgreementForm() {
  const [data, setData] = useState<AgreementFormData>(EMPTY)
  const [gdocResult, setGdocResult] = useState<GDocResult | null>(null)
  const [gdocLoading, setGdocLoading] = useState(false)

  const update = useCallback(<K extends keyof AgreementFormData>(key: K, value: AgreementFormData[K]) => {
    setData(prev => ({ ...prev, [key]: value }))
  }, [])

  const reset = useCallback(() => {
    setData(EMPTY)
    setGdocResult(null)
  }, [])

  const generateDoc = useCallback(async () => {
    if (!data.company || !data.director || !data.clientEmail) {
      return { error: 'Fill Company Name, Director & Client Email first' }
    }
    setGdocLoading(true)
    setGdocResult(null)
    try {
      const payload = buildGDocsPayload(data)
      const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      })
      const result: GDocResult = await res.json()
      setGdocResult(result)
      return result
    } catch (err) {
      const errResult: GDocResult = { success: false, error: 'Failed to connect to Google Apps Script' }
      setGdocResult(errResult)
      return errResult
    } finally {
      setGdocLoading(false)
    }
  }, [data])

  const sendEmail = useCallback(() => {
    if (!gdocResult?.url || !data.clientEmail) return
    const subject = encodeURIComponent(`Leave & License Agreement – ${data.company.toUpperCase()}`)
    const body = encodeURIComponent(
`Dear ${data.director.toUpperCase()},

Please find your Leave & License Agreement with Stirring Minds below.

📄 Agreement Document: ${gdocResult.url}

Kindly review the agreement and revert with any queries.

For any assistance:
📞 +91 80 1075 1075
📧 contact@stirringminds.com

Warm regards,
Stirring Minds Services Pvt Ltd
2-A/3, Kundan Mansion, Asaf Ali Road, Delhi – 110002`
    )
    window.open(`mailto:${data.clientEmail}?subject=${subject}&body=${body}`)
  }, [gdocResult, data])

  const sendWhatsApp = useCallback(() => {
    if (!gdocResult?.url || !data.clientPhone) return
    const msg = encodeURIComponent(
`Hello ${data.director.toUpperCase()},

Your Leave & License Agreement with *Stirring Minds* is ready. 📄

Please review it here:
${gdocResult.url}

Warm regards,
*Stirring Minds Services Pvt Ltd*
📞 +91 80 1075 1075`
    )
    window.open(`https://wa.me/91${data.clientPhone.replace(/\D/g,'')}?text=${msg}`)
  }, [gdocResult, data])

  // Count filled fields for progress indicator
  const filledCount = [
    data.agrDate, data.room, data.company, data.director, data.position,
    data.relation, data.fatherName, data.address, data.pan, data.mobile,
    data.planType, data.nocDate, data.clientEmail,
  ].filter(Boolean).length + (data.hideAmount || data.fee ? 1 : 0)
  const totalFields = 14

  return { data, update, reset, filledCount, totalFields, gdocResult, gdocLoading, generateDoc, sendEmail, sendWhatsApp }
}
