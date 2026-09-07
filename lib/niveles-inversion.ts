import { RowDataPacket } from 'mysql2/promise'
import { getPool } from '@/lib/db'

export type NivelesInversion = {
  inicial: number
  primaria: number
  secundaria: number
  descuentoHermano: number
  textoLinea: string
  source: 'mysql' | 'fallback'
}

export function getFallbackNivelesInversion(): NivelesInversion {
  return {
    inicial: 510,
    primaria: 510,
    secundaria: 530,
    descuentoHermano: 20,
    textoLinea: 'Matrícula y Pensión',
    source: 'fallback',
  }
}

function toMonto(raw: unknown, fallback: number): number {
  const n = Number(raw)
  return Number.isFinite(n) && n >= 0 && n <= 99999.99 ? Math.round(n * 100) / 100 : fallback
}

export function formatSoles(monto: number): string {
  const n = Number(monto)
  if (!Number.isFinite(n)) return 'S/.0.00'
  return `S/.${n.toFixed(2)}`
}

export function textoDescuentoHermano(monto: number): string {
  return `Descuento de ${formatSoles(monto)} soles por cada hermano matriculado.`
}

export function priceRangeSeo(inv: NivelesInversion): string {
  const montos = [inv.inicial, inv.primaria, inv.secundaria]
  const min = Math.min(...montos)
  const max = Math.max(...montos)
  return min === max ? formatSoles(min) : `${formatSoles(min)} - ${formatSoles(max)}`
}

export async function getNivelesInversion(): Promise<NivelesInversion> {
  const fallback = getFallbackNivelesInversion()
  const db = getPool()
  if (!db) return fallback

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT monto_inicial, monto_primaria, monto_secundaria, descuento_hermano, texto_linea
       FROM web_paginas_niveles WHERE id = 1 LIMIT 1`
    )
    const r = rows?.[0]
    if (!r) return fallback
    return {
      inicial: toMonto(r.monto_inicial, fallback.inicial),
      primaria: toMonto(r.monto_primaria, fallback.primaria),
      secundaria: toMonto(r.monto_secundaria, fallback.secundaria),
      descuentoHermano: toMonto(r.descuento_hermano, fallback.descuentoHermano),
      textoLinea: String(r.texto_linea || fallback.textoLinea).trim() || fallback.textoLinea,
      source: 'mysql',
    }
  } catch (error) {
    console.error('[niveles-inversion] MySQL, se usan montos de respaldo:', error)
    return fallback
  }
}
