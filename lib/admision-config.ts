export type AdmisionConfigPublica = {
  anio: number
  bannerFlotante: boolean
  chipHero: boolean
  etiquetaBoton: string
  tituloPagina: string
  textoBanner: string
  textoChip: string
  textoChipSub: string
  rutaFormulario: string
  source?: string
  generatedAt?: string
}

export function getFallbackAdmisionConfig(): AdmisionConfigPublica {
  return {
    anio: 2027,
    bannerFlotante: false,
    chipHero: false,
    etiquetaBoton: 'Admisión 2027',
    tituloPagina: 'Admisión y Ratificación 2027',
    textoBanner: 'Ya abrió Admisión 2027',
    textoChip: 'Inscripciones abiertas 2027',
    textoChipSub: 'Cupos limitados · Inicial, Primaria y Secundaria',
    rutaFormulario: '/admision',
    source: 'fallback',
    generatedAt: new Date().toISOString(),
  }
}

function normalize(data: Record<string, unknown>, source: string): AdmisionConfigPublica {
  const fallback = getFallbackAdmisionConfig()
  const anioRaw = Number(data.anio)
  const anio = anioRaw >= 2020 && anioRaw <= 2100 ? anioRaw : fallback.anio
  return {
    anio,
    bannerFlotante: data.bannerFlotante === true,
    chipHero: data.chipHero === true,
    etiquetaBoton: String(data.etiquetaBoton || `Admisión ${anio}`),
    tituloPagina: String(data.tituloPagina || `Admisión y Ratificación ${anio}`),
    textoBanner: String(data.textoBanner || `Ya abrió Admisión ${anio}`),
    textoChip: String(data.textoChip || `Inscripciones abiertas ${anio}`),
    textoChipSub: String(data.textoChipSub || fallback.textoChipSub),
    rutaFormulario: String(data.rutaFormulario || '/admision'),
    source,
    generatedAt: String(data.generatedAt || new Date().toISOString()),
  }
}

async function fetchFromIntranet(): Promise<AdmisionConfigPublica | null> {
  const base = String(process.env.INTRANET_API_URL || 'http://127.0.0.1:5000').replace(/\/$/, '')
  const url = `${base}/api/public/admision-config?t=${Date.now()}`
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 4000)
    const res = await fetch(url, {
      cache: 'no-store',
      signal: ctrl.signal,
      headers: { Accept: 'application/json', Pragma: 'no-cache' },
    })
    clearTimeout(timer)
    if (!res.ok) return null
    const data = (await res.json()) as Record<string, unknown>
    return normalize(data, 'intranet')
  } catch {
    return null
  }
}

export async function getAdmisionConfigPublica(): Promise<AdmisionConfigPublica> {
  const fromIntranet = await fetchFromIntranet()
  if (fromIntranet) return fromIntranet
  return getFallbackAdmisionConfig()
}
