'use client'

import {
  Document, Page, Text, View, StyleSheet, pdf,
} from '@react-pdf/renderer'
import { getGlucoseLabel, getGlucoseStatus, momentLabels, formatDateTime } from '@/lib/utils'

interface GlucoseReading {
  value: number
  moment: string
  measured_at: string
  notes: string | null
}

interface InsulinDose {
  units: number
  type: string
  taken_at: string
  notes: string | null
}

interface ReportData {
  period: string
  readings: GlucoseReading[]
  doses: InsulinDose[]
  userEmail: string
}

const insulinTypeLabels: Record<string, string> = {
  fast: 'Rápida', ultra_fast: 'Ultra-rápida', slow: 'Lenta', mixed: 'Mista',
}

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#111' },
  header: { marginBottom: 24 },
  title: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: '#1d4ed8' },
  subtitle: { fontSize: 10, color: '#6b7280', marginTop: 4 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 13, fontFamily: 'Helvetica-Bold', marginBottom: 8, color: '#1e3a5f', borderBottom: '1pt solid #e5e7eb', paddingBottom: 4 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  statBox: { flex: 1, borderRadius: 6, backgroundColor: '#f8fafc', border: '1pt solid #e2e8f0', padding: 10 },
  statLabel: { fontSize: 8, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { fontSize: 18, fontFamily: 'Helvetica-Bold', marginTop: 2 },
  statUnit: { fontSize: 9, color: '#6b7280' },
  table: { width: '100%' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f1f5f9', padding: '6 8', borderRadius: 4, marginBottom: 2 },
  tableRow: { flexDirection: 'row', padding: '5 8', borderBottom: '0.5pt solid #f1f5f9' },
  col1: { flex: 1.2 },
  col2: { flex: 1 },
  col3: { flex: 1 },
  col4: { flex: 2 },
  headerText: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#475569' },
  cellText: { fontSize: 9, color: '#374151' },
  normalText: { color: '#16a34a' },
  warningText: { color: '#ea580c' },
  criticalText: { color: '#dc2626' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: '#9ca3af' },
})

function getStatusStyle(value: number) {
  const s = getGlucoseStatus(value)
  if (s === 'normal') return styles.normalText
  if (s === 'warning') return styles.warningText
  return styles.criticalText
}

function GlucoseReportDocument({ data }: { data: ReportData }) {
  const values = data.readings.map((r) => r.value)
  const avg = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0
  const min = values.length ? Math.min(...values) : 0
  const max = values.length ? Math.max(...values) : 0
  const inRange = values.filter((v) => v >= 70 && v <= 180).length
  const pct = values.length ? Math.round((inRange / values.length) * 100) : 0

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.title}>GlicoTrack</Text>
          <Text style={styles.subtitle}>Relatório de Glicemia · {data.period} · {data.userEmail}</Text>
        </View>

        {/* Resumo estatístico */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Média</Text>
              <Text style={[styles.statValue, getStatusStyle(avg)]}>{avg}</Text>
              <Text style={styles.statUnit}>mg/dL</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Mínimo</Text>
              <Text style={[styles.statValue, getStatusStyle(min)]}>{min}</Text>
              <Text style={styles.statUnit}>mg/dL</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Máximo</Text>
              <Text style={[styles.statValue, getStatusStyle(max)]}>{max}</Text>
              <Text style={styles.statUnit}>mg/dL</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>No alvo (70–180)</Text>
              <Text style={styles.statValue}>{pct}%</Text>
              <Text style={styles.statUnit}>{inRange} de {values.length} medições</Text>
            </View>
          </View>
        </View>

        {/* Tabela de glicemia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medições de Glicemia ({data.readings.length})</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerText, styles.col1]}>Data/Hora</Text>
              <Text style={[styles.headerText, styles.col2]}>Valor</Text>
              <Text style={[styles.headerText, styles.col3]}>Momento</Text>
              <Text style={[styles.headerText, styles.col4]}>Observações</Text>
            </View>
            {data.readings.map((r, i) => (
              <View key={i} style={[styles.tableRow, i % 2 === 0 ? {} : { backgroundColor: '#fafafa' }]}>
                <Text style={[styles.cellText, styles.col1]}>{formatDateTime(r.measured_at)}</Text>
                <Text style={[styles.cellText, styles.col2, getStatusStyle(r.value)]}>
                  {r.value} mg/dL · {getGlucoseLabel(r.value)}
                </Text>
                <Text style={[styles.cellText, styles.col3]}>{momentLabels[r.moment] ?? r.moment}</Text>
                <Text style={[styles.cellText, styles.col4]}>{r.notes ?? ''}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tabela de insulina */}
        {data.doses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Doses de Insulina ({data.doses.length})</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.headerText, styles.col1]}>Data/Hora</Text>
                <Text style={[styles.headerText, styles.col2]}>Dose</Text>
                <Text style={[styles.headerText, styles.col3]}>Tipo</Text>
                <Text style={[styles.headerText, styles.col4]}>Observações</Text>
              </View>
              {data.doses.map((d, i) => (
                <View key={i} style={[styles.tableRow, i % 2 === 0 ? {} : { backgroundColor: '#fafafa' }]}>
                  <Text style={[styles.cellText, styles.col1]}>{formatDateTime(d.taken_at)}</Text>
                  <Text style={[styles.cellText, styles.col2]}>{d.units} UI</Text>
                  <Text style={[styles.cellText, styles.col3]}>{insulinTypeLabels[d.type] ?? d.type}</Text>
                  <Text style={[styles.cellText, styles.col4]}>{d.notes ?? ''}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <Text style={styles.footer}>
          Gerado pelo GlicoTrack em {new Date().toLocaleDateString('pt-BR')} · Este relatório é informativo. Consulte sempre seu médico.
        </Text>
      </Page>
    </Document>
  )
}

export async function generateAndDownloadPDF(data: ReportData) {
  const blob = await pdf(<GlucoseReportDocument data={data} />).toBlob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `glicotrack-relatorio-${data.period.replace(/\s/g, '-')}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}
