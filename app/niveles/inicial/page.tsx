import { Metadata } from 'next'
import NivelLanding from '@/components/niveles/NivelLanding'
import { NIVELES_LANDING } from '@/lib/niveles-landing'
import { getNivelesInversion } from '@/lib/niveles-inversion'
import { getFaqsParaNivel } from '@/lib/faqs'
import { getAdmisionConfigPublica } from '@/lib/admision-config'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Educación Inicial - Vanguard Schools',
  description:
    'Educación Inicial en Vanguard Schools. Niños de 3 a 5 años con STEAM, juego, piscina patera y 10 estudiantes por maestra.',
}

export default async function InicialPage() {
  const [inversion, faqs, admision] = await Promise.all([
    getNivelesInversion(),
    getFaqsParaNivel('inicial'),
    getAdmisionConfigPublica(),
  ])
  return (
    <NivelLanding
      data={NIVELES_LANDING.inicial}
      monto={inversion.inicial}
      textoLinea={inversion.textoLinea}
      descuentoHermano={inversion.descuentoHermano}
      faqs={faqs}
      admisionHref={admision.rutaFormulario || '/admision'}
      admisionLabel={admision.etiquetaBoton || 'Admisión'}
    />
  )
}
