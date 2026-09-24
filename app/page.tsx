import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Levels from '@/components/sections/Levels'
import AdmissionProcess from '@/components/sections/AdmissionProcess'
import VideoSection from '@/components/sections/VideoSection'
import AvisoLibroReclamaciones from '@/components/AvisoLibroReclamaciones'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Levels />
      <AdmissionProcess />
      <VideoSection />
      <AvisoLibroReclamaciones />
    </>
  )
}

