import type { CSSProperties } from 'react'

/** Temas de color para /lista-utiles — presets Tailwind o hex desde MySQL */

export type PresetTheme = {
  kind: 'preset'
  gradient: string
  bg: string
  text: string
  hover: string
  border: string
  icon: string
}

export type HexTheme = {
  kind: 'hex'
  hex: string
  headerStyle: CSSProperties
  cardStyle: CSSProperties
  cardBorderClass: string
  textStyle: CSSProperties
  iconStyle: CSSProperties
  buttonStyle: CSSProperties
}

export type NivelTheme = PresetTheme | HexTheme

const colorConfig = {
  inicial: {
    gradient: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50',
    text: 'text-pink-600',
    hover: 'hover:bg-pink-100',
    border: 'border-pink-200',
    icon: 'bg-pink-500',
  },
  primaria: {
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    hover: 'hover:bg-blue-100',
    border: 'border-blue-200',
    icon: 'bg-blue-500',
  },
  secundaria: {
    gradient: 'from-purple-500 to-indigo-500',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    hover: 'hover:bg-purple-100',
    border: 'border-purple-200',
    icon: 'bg-purple-500',
  },
} as const

const presetByColorName: Record<string, keyof typeof colorConfig> = {
  pink: 'inicial',
  blue: 'primaria',
  purple: 'secundaria',
}

function presetTheme(key: keyof typeof colorConfig): PresetTheme {
  const c = colorConfig[key]
  return { kind: 'preset', ...c }
}

/** Normaliza #rgb → #rrggbb; null si no es hex válido */
export function parseHexColor(color: string): string | null {
  const c = color.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(c)) return c.toLowerCase()
  if (/^#[0-9a-fA-F]{3}$/.test(c)) {
    const r = c[1]
    const g = c[2]
    const b = c[3]
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase()
  }
  return null
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const n = parseHexColor(hex)
  if (!n) return null
  return {
    r: parseInt(n.slice(1, 3), 16),
    g: parseInt(n.slice(3, 5), 16),
    b: parseInt(n.slice(5, 7), 16),
  }
}

function clamp(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)))
}

function darkenRgb(rgb: { r: number; g: number; b: number }, amount: number) {
  return {
    r: clamp(rgb.r - amount),
    g: clamp(rgb.g - amount),
    b: clamp(rgb.b - amount),
  }
}

function rgba(rgb: { r: number; g: number; b: number }, alpha: number) {
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
}

function hexTheme(hex: string): HexTheme {
  const normalized = parseHexColor(hex)!
  const rgb = hexToRgb(normalized)!
  const end = darkenRgb(rgb, 28)

  return {
    kind: 'hex',
    hex: normalized,
    headerStyle: {
      background: `linear-gradient(to right, ${normalized}, rgb(${end.r}, ${end.g}, ${end.b}))`,
      color: '#ffffff',
    },
    cardStyle: {
      backgroundColor: rgba(rgb, 0.08),
      borderColor: rgba(rgb, 0.35),
    },
    cardBorderClass: 'border-2',
    textStyle: { color: normalized },
    iconStyle: { backgroundColor: normalized },
    buttonStyle: {
      backgroundColor: rgba(rgb, 0.08),
      color: normalized,
      borderColor: rgba(rgb, 0.35),
      borderWidth: 2,
      borderStyle: 'solid',
    },
  }
}

/**
 * pink | blue | purple | id nivel → presets Tailwind.
 * #rrggbb / #rgb → tema dinámico.
 * Desconocido → primaria (azul).
 */
export function resolveNivelTheme(nivelId: string, color: string): NivelTheme {
  const hex = parseHexColor(color)
  if (hex) return hexTheme(hex)

  const normalized = color.trim().toLowerCase()
  if (normalized in colorConfig) {
    return presetTheme(normalized as keyof typeof colorConfig)
  }
  if (nivelId in colorConfig) {
    return presetTheme(nivelId as keyof typeof colorConfig)
  }
  const mapped = presetByColorName[normalized]
  if (mapped) return presetTheme(mapped)

  return presetTheme('primaria')
}
