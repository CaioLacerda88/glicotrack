'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { generateAndDownloadPDF } from '@/components/reports/GlucosePDF'

interface ReportData {
  period: string
  readings: Array<{ value: number; moment: string; measured_at: string; notes: string | null }>
  doses: Array<{ units: number; type: string; taken_at: string; notes: string | null }>
  userEmail: string
}

export function ReportDownloadButton({ data }: { data: ReportData }) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    setLoading(true)
    await generateAndDownloadPDF(data)
    setLoading(false)
  }

  return (
    <Button onClick={handleDownload} loading={loading}>
      📄 Baixar PDF
    </Button>
  )
}
