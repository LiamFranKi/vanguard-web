import { Metadata } from 'next'
import NivelLanding from '@/components/niveles/NivelLanding'
import { NIVELES_LANDING } from '@/lib/niveles-landing'
import { getNivelesInversion } from '@/lib/niveles-inversion'
import { getFaqsParaNivel } from '@/lib/faqs'
import { getAdmisionConfigPublica } from '@/lib/admision-config'
import { aplicarMedia, getNivelMedia } from '@/lib/niveles-media'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Educación Inicial - Vanguard Schools',
  description:
    'Educación Inicial en Vanguard Schools. Early Year, Pre Kinder y Kinder con STEAM, juego, piscina patera y dos maestras por aula.',
}

export default async function InicialPage() {
  const [inversion, faqs, admision, media] = await Promise.all([
    getNivelesInversion(),
    getFaqsParaNivel('inicial'),
    getAdmisionConfigPublica(),
    getNivelMedia('inicial'),
  ])
  return (
    <NivelLanding
      data={aplicarMedia(NIVELES_LANDING.inicial, media)}
      monto={inversion.inicial}
      textoLinea={inversion.textoLinea}
      descuentoHermano={inversion.descuentoHermano}
      faqs={faqs}
      admisionHref={admision.rutaFormulario || '/admision'}
      admisionLabel={admision.etiquetaBoton || 'Admisión'}
    />
  )
}
