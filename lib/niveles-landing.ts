export type NivelKey = 'inicial' | 'primaria' | 'secundaria'

export type NivelLandingData = {
  key: NivelKey
  title: string
  kicker: string
  ages: string
  heroImage: string
  lead: string
  quote: string
  methodologyTitle: string
  methodologyBody: string
  pillars: { title: string; text: string }[]
  campus: { title: string; text: string; image: string }[]
  talleres: string[]
  grados: string[]
  clasicoHref: string
  showUtilesCta?: boolean
  showClasicoLink?: boolean
  priceNote?: string
  incluidos?: { badge: string; title: string; text: string }[]
}

export const NIVELES_LANDING: Record<NivelKey, NivelLandingData> = {
  inicial: {
    key: 'inicial',
    title: 'Educación Inicial',
    kicker: 'Pequeños exploradores',
    ages: '',
    heroImage: '/inicial.jpeg',
    lead: 'Acompañamos la primera infancia con juego, arte y asombro. Cada niña y niño explora, se expresa y construye conocimiento con alegría, en un campus seguro y lleno de color.',
    quote: 'Más que preparar para primaria: un desarrollo pleno, respetuoso y feliz.',
    methodologyTitle: 'STEAM a través del juego',
    methodologyBody:
      'Ciencia, tecnología, ingeniería, arte y matemáticas se viven en el aula de sectores, el patio y la piscina patera. Estimulamos curiosidad, autonomía y trabajo en equipo.',
    pillars: [
      { title: 'Psicomotricidad', text: 'Cuerpo, equilibrio y coordinación en espacios pensados para la primera infancia.' },
      { title: 'Aula de sectores', text: 'Ambientes que invitan a investigar, crear y convivir.' },
      { title: '10 niños por maestra', text: 'Acompañamiento cercano, cálido y especializado por edad.' },
      { title: 'Socialización', text: 'Aprender a compartir, hablar y cuidar al otro desde el primer día.' },
    ],
    campus: [
      { title: 'Piscina patera temperada', text: 'Natación desde inicial, con agua temperada y seguridad.', image: '/inicial.jpeg' },
      { title: 'Canchas de grass sintético', text: 'Dos canchas profesionales (una techada) para el juego motor.', image: '/FONDOBANNER.jpg' },
      { title: 'Campus de 7 500 m²', text: 'Infraestructura antisísmica, aulas amplias y libros COREFO incluidos.', image: '/primaria.jpeg' },
    ],
    talleres: ['Natación', 'Danza', 'Minichef', 'Escenificación', 'Psicomotricidad'],
    grados: ['Inicial 3 años', 'Inicial 4 años', 'Inicial 5 años'],
    clasicoHref: '/niveles/inicial/clasico',
    showUtilesCta: false,
    showClasicoLink: false,
    incluidos: [
      {
        badge: 'GRATIS',
        title: 'Lista de útiles',
        text: 'Ya está incluida en la pensión. No hay lista aparte ni compra extra: se entrega todo lo que tu hijo necesita.',
      },
      {
        badge: 'GRATIS',
        title: 'Pack de libros COREFO',
        text: 'El pack de libros COREFO también lo entregamos nosotros, sin costo adicional.',
      },
    ],
  },
  primaria: {
    key: 'primaria',
    title: 'Educación Primaria',
    kicker: 'Crece con propósito',
    ages: '6 a 11 años',
    heroImage: '/primaria.jpeg',
    lead: 'Construimos una base académica sólida, inglés vivencial y valores. Proyectos, aula invertida y tecnología se combinan con deporte, arte y un campus para moverse de verdad.',
    quote: 'Lectura, pensamiento crítico y corazón: listos para el salto a secundaria.',
    methodologyTitle: 'Proyectos y aula invertida',
    methodologyBody:
      'La teoría se trabaja en casa; en clase hay práctica, debate y proyectos. Tablets desde 4.° y pizarras interactivas en todas las aulas.',
    pillars: [
      { title: 'Base académica', text: 'Lectura, escritura, comprensión y hábitos de estudio con maestros especialistas.' },
      { title: 'Inglés vivencial', text: 'Inmersión diaria para comunicarse con seguridad y naturalidad.' },
      { title: 'Valores', text: 'Respeto, responsabilidad y trabajo en equipo en la vida cotidiana del aula.' },
      { title: 'Tablets desde 4.°', text: 'Herramienta de aprendizaje, más libros digitales gratuitos y tareas en línea.' },
    ],
    campus: [
      { title: 'Piscinas temperadas', text: 'Semiolímpica y patera: natación como parte de la formación.', image: '/FONDOBANNER.jpg' },
      { title: '2 canchas sintéticas', text: 'Deporte de alto nivel en un campus de más de 7 500 m².', image: '/primaria.jpeg' },
      { title: 'Lab de cómputo', text: 'Tecnología, intranet y app para familias. Exámenes y tareas virtuales.', image: '/secundaria.jpeg' },
    ],
    talleres: ['Natación', 'Danza', 'Minichef', 'Escenificación'],
    grados: [
      '1.° de Primaria',
      '2.° de Primaria',
      '3.° de Primaria',
      '4.° de Primaria',
      '5.° de Primaria',
      '6.° de Primaria',
    ],
    clasicoHref: '/niveles/primaria/clasico',
    showClasicoLink: false,
  },
  secundaria: {
    key: 'secundaria',
    title: 'Educación Secundaria',
    kicker: 'Listos para el mundo',
    ages: '12 a 16 años',
    heroImage: '/secundaria.jpeg',
    lead: 'Consolidamos competencias para la universidad, el trabajo y la ciudadanía. Robótica, inglés con certificación, oratoria y un proyecto de vida con psicología y vocación.',
    quote: 'Autonomía, rigor y sentido: adolescentes que deciden con responsabilidad.',
    methodologyTitle: 'Aula invertida y proyecto de vida',
    methodologyBody:
      'Práctica, debates y proyectos en clase. Inglés intensivo, robótica, tablets y charlas vocacionales para elegir con información, no por inercia.',
    pillars: [
      { title: 'Robótica y código', text: 'Pensamiento computacional en laboratorio de alta tecnología.' },
      { title: 'Inglés + certificación', text: 'Dominio real del idioma, con mirada internacional.' },
      { title: 'Proyecto de vida', text: 'Orientación vocacional, oratoria y psicología escolar.' },
      { title: 'Ciudadanía', text: 'Respeto, igualdad y responsabilidad para la vida adulta.' },
    ],
    campus: [
      { title: 'Piscina semiolímpica', text: 'Natación en instalaciones temperadas, nivel competencia y salud.', image: '/FONDOBANNER.jpg' },
      { title: 'Canchas profesionales', text: 'Dos grass sintéticos (uno techado) para fútbol, vóley y más.', image: '/primaria.jpeg' },
      { title: 'Tecnología e intranet', text: 'Tablets, libros digitales, exámenes en línea y app para la familia.', image: '/secundaria.jpeg' },
    ],
    talleres: ['Natación', 'Danza', 'Oratoria'],
    grados: [
      '1.° de Secundaria',
      '2.° de Secundaria',
      '3.° de Secundaria',
      '4.° de Secundaria',
      '5.° de Secundaria',
    ],
    clasicoHref: '/niveles/secundaria/clasico',
    showClasicoLink: false,
  },
}
