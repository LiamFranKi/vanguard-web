import { getNivelesInversion, priceRangeSeo } from '@/lib/niveles-inversion'
import { obtenerContactoInstitucional } from '@/lib/contacto-institucional'

export default async function StructuredData() {
  const inversion = await getNivelesInversion()
  const contacto = await obtenerContactoInstitucional()
  const priceRange = priceRangeSeo(inversion)
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Vanguard Schools',
    alternateName: 'Colegio Vanguard Schools',
    url: 'https://www.vanguardschools.com',
    logo: 'https://www.vanguardschools.com/LOGO6.png',
    description: 'Colegio Vanguard Schools - Educación Inicial, Primaria y Secundaria con metodología STEAM, inglés intensivo y tecnología de vanguardia en San Martín de Porres, Lima.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: contacto.direccion,
      addressLocality: 'San Martín de Porres',
      addressRegion: 'Lima',
      addressCountry: 'PE',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: contacto.telefonosSchema[0],
      contactType: 'Admisiones',
      areaServed: 'PE',
      availableLanguage: ['Spanish', 'English'],
    },
    sameAs: [
      'https://facebook.com',
      'https://instagram.com',
      'https://tiktok.com',
      'https://youtube.com',
    ],
  }

  const schoolSchema = {
    '@context': 'https://schema.org',
    '@type': 'School',
    name: 'Vanguard Schools',
    description: 'Colegio privado en San Martín de Porres, Lima. Ofrecemos Educación Inicial, Primaria y Secundaria con metodología STEAM, inglés intensivo, piscinas temperadas y tecnología de vanguardia.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: contacto.direccion,
      addressLocality: 'San Martín de Porres',
      addressRegion: 'Lima',
      postalCode: '15107',
      addressCountry: 'PE',
    },
    telephone: [...contacto.telefonosSchema],
    email: contacto.correo,
    url: 'https://www.vanguardschools.com',
    logo: 'https://www.vanguardschools.com/LOGO6.png',
    image: 'https://www.vanguardschools.com/api/banner-inicio',
    priceRange,
    areaServed: {
      '@type': 'City',
      name: 'Lima',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolSchema) }}
      />
    </>
  )
}


