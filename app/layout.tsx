import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import ChatWidget from '@/components/ChatWidget'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: 'Vanguard Schools - A la Vanguardia de la Tecnología',
    template: '%s | Vanguard Schools',
  },
  description: 'Colegio Vanguard Schools en San Martín de Porres, Lima. Educación Inicial, Primaria y Secundaria con metodología STEAM, inglés intensivo, piscinas temperadas y tecnología de vanguardia. Formamos líderes del mañana.',
  keywords: [
    'colegio Lima',
    'colegio San Martín de Porres',
    'educación inicial',
    'educación primaria',
    'educación secundaria',
    'colegio privado Lima',
    'colegio con inglés',
    'colegio STEAM',
    'colegio tecnología',
    'colegio piscina',
    'colegio Vanguard Schools',
    'mejor colegio SMP',
    'colegio bilingüe Lima',
    'colegio innovación educativa',
  ],
  authors: [{ name: 'Vanguard Schools' }],
  creator: 'Vanguard Schools',
  publisher: 'Vanguard Schools',
  metadataBase: new URL('https://www.vanguardschools.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: 'https://www.vanguardschools.com',
    siteName: 'Vanguard Schools',
    title: 'Vanguard Schools - A la Vanguardia de la Tecnología',
    description: 'Colegio Vanguard Schools - Educación Inicial, Primaria y Secundaria con metodología STEAM, inglés intensivo y tecnología de vanguardia en San Martín de Porres, Lima.',
    images: [
      {
        url: '/LOGO6.png',
        width: 1200,
        height: 630,
        alt: 'Vanguard Schools Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vanguard Schools - A la Vanguardia de la Tecnología',
    description: 'Colegio Vanguard Schools - Educación Inicial, Primaria y Secundaria con metodología STEAM y tecnología de vanguardia.',
    images: ['/LOGO6.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Agregar cuando tengas Google Search Console
    // google: 'tu-codigo-de-verificacion',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon-ico.png" />
        <link rel="canonical" href="https://www.vanguardschools.com" />
      </head>
      <body className="min-h-screen flex flex-col">
        <StructuredData />
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  )
}

