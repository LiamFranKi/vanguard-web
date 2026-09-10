import { Metadata } from 'next'
import NivelLanding from '@/components/niveles/NivelLanding'
import { NIVELES_LANDING } from '@/lib/niveles-landing'
import { getNivelesInversion } from '@/lib/niveles-inversion'
import { getFaqsParaNivel } from '@/lib/faqs'
import { getAdmisionConfigPublica } from '@/lib/admision-config'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Educación Primaria - Vanguard Schools',
  description:
    'Educación Primaria en Vanguard Schools. 1.° a 6.° con aula invertida, inglés vivencial, tablets, piscinas y canchas sintéticas.',
}

export default async function PrimariaPage() {
  const [inversion, faqs, admision] = await Promise.all([
    getNivelesInversion(),
    getFaqsParaNivel('primaria'),
    getAdmisionConfigPublica(),
  ])
  return (
    <NivelLanding
      data={NIVELES_LANDING.primaria}
      monto={inversion.primaria}
      textoLinea={inversion.textoLinea}
      descuentoHermano={inversion.descuentoHermano}
      faqs={faqs}
      admisionHref={admision.rutaFormulario || '/admision'}
      admisionLabel={admision.etiquetaBoton || 'Admisión'}
    />
  )
}
