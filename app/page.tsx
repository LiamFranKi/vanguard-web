import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Levels from '@/components/sections/Levels'
import AdmissionProcess from '@/components/sections/AdmissionProcess'
import VideoSection from '@/components/sections/VideoSection'
import { getBannerInicio } from '@/lib/paginas-inicio'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const fondoSrc = await getBannerInicio()
  return (
    <>
      <Hero fondoSrc={fondoSrc} />
      <About />
      <Levels />
      <AdmissionProcess />
      <VideoSection />
    </>
  )
}

