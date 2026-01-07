import fs from 'fs'
import path from 'path'

export interface FaqItem {
  categoria?: string
  pregunta: string
  respuesta: string
}

interface FaqConfig {
  faqs: FaqItem[]
}

export function getFaqs(): FaqItem[] {
  try {
    const filePath = path.join(process.cwd(), 'config', 'faqs.json')
    const data = fs.readFileSync(filePath, 'utf8')
    const parsed = JSON.parse(data) as FaqConfig
    return parsed.faqs || []
  } catch (error) {
    console.error('Error leyendo config/faqs.json:', error)
    return []
  }
}



