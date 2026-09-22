/** Grados del formulario de visita guiada, según el nivel. */
export const GRADOS_POR_NIVEL: Record<string, string[]> = {
  Inicial: ['Inicial 03 años', 'Inicial 04 años', 'Inicial 05 años'],
  Primaria: ['1er grado', '2do grado', '3° grado', '4° grado', '5° grado', '6° grado'],
  Secundaria: ['1er año', '2do año', '3er año', '4to año', '5to año'],
}

export function gradosParaNivel(nivel: string): string[] {
  return GRADOS_POR_NIVEL[String(nivel || '').trim()] || []
}

export function validarGradoVisita(nivel: string, grado: string): { ok: true; grado: string } | { ok: false; error: string } {
  const n = String(nivel || '').trim()
  const g = String(grado || '').trim()
  const opciones = gradosParaNivel(n)
  if (!opciones.length) {
    return { ok: true, grado: '' }
  }
  if (!g) {
    return { ok: false, error: 'Seleccione el grado de interés' }
  }
  if (!opciones.includes(g)) {
    return { ok: false, error: 'El grado no corresponde al nivel elegido' }
  }
  return { ok: true, grado: g }
}
