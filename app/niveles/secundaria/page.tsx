import { Metadata } from 'next'
import NivelLanding from '@/components/niveles/NivelLanding'
import { NIVELES_LANDING } from '@/lib/niveles-landing'
import { getNivelesInversion } from '@/lib/niveles-inversion'
import { getFaqsParaNivel } from '@/lib/faqs'
import { getAdmisionConfigPublica } from '@/lib/admision-config'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Educación Secundaria - Vanguard Schools',
  description:
    'Educación Secundaria en Vanguard Schools. Robótica, inglés con certificación, oratoria, proyecto de vida y campus con piscinas y canchas.',
}

export default async function SecundariaPage() {
  const [inversion, faqs, admision] = await Promise.all([
    getNivelesInversion(),
    getFaqsParaNivel('secundaria'),
    getAdmisionConfigPublica(),
  ])
  return (
    <NivelLanding
      data={NIVELES_LANDING.secundaria}
      monto={inversion.secundaria}
      textoLinea={inversion.textoLinea}
      descuentoHermano={inversion.descuentoHermano}
      faqs={faqs}
      admisionHref={admision.rutaFormulario || '/admision'}
      admisionLabel={admision.etiquetaBoton || 'Admisión'}
    />
  )
}
