// Retorna o status de glicemia com base no valor em mg/dL
export type GlucoseStatus = 'critical-low' | 'normal' | 'warning' | 'critical-high'

export function getGlucoseStatus(value: number): GlucoseStatus {
  if (value < 70) return 'critical-low'
  if (value <= 180) return 'normal'
  if (value <= 250) return 'warning'
  return 'critical-high'
}

// Retorna a classe de cor do Tailwind para o valor de glicemia
export function getGlucoseColorClass(value: number): string {
  const status = getGlucoseStatus(value)
  switch (status) {
    case 'critical-low':
    case 'critical-high':
      return 'text-red-600'
    case 'warning':
      return 'text-orange-600'
    case 'normal':
      return 'text-green-600'
  }
}

// Retorna a classe de cor de fundo para o valor de glicemia
export function getGlucoseBgClass(value: number): string {
  const status = getGlucoseStatus(value)
  switch (status) {
    case 'critical-low':
    case 'critical-high':
      return 'bg-red-50 border-red-200'
    case 'warning':
      return 'bg-orange-50 border-orange-200'
    case 'normal':
      return 'bg-green-50 border-green-200'
  }
}

// Retorna um label legível para o status
export function getGlucoseLabel(value: number): string {
  const status = getGlucoseStatus(value)
  switch (status) {
    case 'critical-low':
      return 'Hipoglicemia'
    case 'normal':
      return 'Normal'
    case 'warning':
      return 'Atenção'
    case 'critical-high':
      return 'Hiperglicemia'
  }
}

// Formata data para exibição em português
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

// Formata data e hora para exibição em português
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

// Labels para os momentos de medição
export const momentLabels: Record<string, string> = {
  fasting: 'Jejum',
  pre_meal: 'Pré-refeição',
  post_meal: 'Pós-refeição',
  bedtime: 'Antes de dormir',
}

// Labels para os tipos de insulina
export const insulinTypeLabels: Record<string, string> = {
  fast: 'Rápida',
  slow: 'Lenta',
  ultra_fast: 'Ultra-rápida',
  mixed: 'Mista',
}

// Labels para categorias de refeição
export const mealCategoryLabels: Record<string, string> = {
  breakfast: 'Café da manhã',
  lunch: 'Almoço',
  dinner: 'Jantar',
  snack: 'Lanche',
}

// Labels para intensidade de atividade
export const intensityLabels: Record<string, string> = {
  low: 'Leve',
  moderate: 'Moderada',
  high: 'Intensa',
}
