/**
 * Fecha/hora en zona Perú (UTC-5, America/Lima).
 * Evita guardar UTC (toISOString) y que phpMyAdmin muestre +5 horas.
 */

const TZ_PERU = 'America/Lima'

function partsNow() {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ_PERU,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })
  const map: Record<string, string> = {}
  for (const p of fmt.formatToParts(new Date())) {
    if (p.type !== 'literal') map[p.type] = p.value
  }
  let hour = map.hour || '00'
  if (hour === '24') hour = '00'
  return {
    year: map.year,
    month: map.month,
    day: map.day,
    hour,
    minute: map.minute || '00',
    second: map.second || '00',
  }
}

/** MySQL DATETIME: YYYY-MM-DD HH:mm:ss (hora Perú) */
export function nowPeruMysql(): string {
  const p = partsNow()
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second}`
}

/** Solo fecha YYYY-MM-DD en Perú */
export function todayPeruDate(): string {
  const p = partsNow()
  return `${p.year}-${p.month}-${p.day}`
}

/**
 * Normaliza una fecha de registro a DATETIME MySQL en hora legible.
 * Si ya viene en formato MySQL (sin Z), se deja igual.
 * Si viene ISO con Z (UTC), se convierte a America/Lima.
 */
export function toPeruMysqlDatetime(input?: string | null): string {
  if (!input) return nowPeruMysql()

  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(input.trim())) {
    return input.trim()
  }

  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return nowPeruMysql()

  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ_PERU,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })
  const map: Record<string, string> = {}
  for (const p of fmt.formatToParts(d)) {
    if (p.type !== 'literal') map[p.type] = p.value
  }
  let hour = map.hour || '00'
  if (hour === '24') hour = '00'
  return `${map.year}-${map.month}-${map.day} ${hour}:${map.minute}:${map.second}`
}
