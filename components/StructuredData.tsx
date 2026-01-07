export default function StructuredData() {
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
      streetAddress: 'Jr. Toribio de Luzuriaga Mz F Lote 18 y 19',
      addressLocality: 'San Martín de Porres',
      addressRegion: 'Lima',
      addressCountry: 'PE',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+51-946-592-100',
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
      streetAddress: 'Jr. Toribio de Luzuriaga Mz F Lote 18 y 19',
      addressLocality: 'San Martín de Porres',
      addressRegion: 'Lima',
      postalCode: '15107',
      addressCountry: 'PE',
    },
    telephone: ['+51-946-592-100', '+51-922-084-833'],
    email: 'admin@vanguardschools.edu.pe',
    url: 'https://www.vanguardschools.com',
    logo: 'https://www.vanguardschools.com/LOGO6.png',
    image: 'https://www.vanguardschools.com/FONDOBANNER.jpg',
    priceRange: 'S/.510.00 - S/.530.00',
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


