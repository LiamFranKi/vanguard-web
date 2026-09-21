import { Metadata } from 'next'
import Link from 'next/link'
import { getFaqs } from '@/lib/faqs'
import FaqAccordion from '@/components/faqs/FaqAccordion'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes - Vanguard Schools',
  description:
    'Admisión, vacantes, traslados y visitas al campus de Vanguard Schools. Resuelve tus dudas antes de dar el siguiente paso.',
}

const NIVELES = [
  {
    href: '/niveles/inicial',
    label: 'Inicial',
    hint: '3, 4 y 5 años · STEAM e inmersión en inglés',
    className: 'from-rose-50 to-orange-50 border-rose-100 hover:border-rose-300',
    chip: 'bg-rose-500',
  },
  {
    href: '/niveles/primaria',
    label: 'Primaria',
    hint: 'Aula invertida, inglés vivencial y tablets',
    className: 'from-sky-50 to-blue-50 border-sky-100 hover:border-sky-300',
    chip: 'bg-sky-500',
  },
  {
    href: '/niveles/secundaria',
    label: 'Secundaria',
    hint: 'Proyecto de vida, Cambridge y tecnología',
    className: 'from-emerald-50 to-teal-50 border-emerald-100 hover:border-emerald-300',
    chip: 'bg-emerald-600',
  },
]

export default async function PreguntasFrecuentesPage() {
  const faqs = await getFaqs()

  return (
    <div className="pt-20">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-900 to-slate-950 text-white py-16 md:py-20">
        <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-gold-400/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-10 h-56 w-56 rounded-full bg-primary-400/20 blur-3xl" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-bold tracking-[0.18em] uppercase text-gold-200 mb-5">
              Admisión y visitas
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
              Preguntas frecuentes
            </h1>
            <p className="text-lg md:text-xl text-white/85 leading-relaxed">
              Cómo iniciar el proceso, qué documentos necesitas, vacantes y cómo agendar una visita al campus.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {faqs.length === 0 ? (
              <p className="text-center text-gray-500">Pronto publicaremos las preguntas más frecuentes.</p>
            ) : (
              <FaqAccordion faqs={faqs} tone="gold" />
            )}

            <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/visita-guiada"
                className="inline-flex justify-center rounded-2xl bg-gradient-to-r from-primary-700 to-primary-900 text-white font-bold px-6 py-3.5 hover:from-primary-800 hover:to-slate-900"
              >
                Agendar visita guiada
              </Link>
              <Link
                href="/admision"
                className="inline-flex justify-center rounded-2xl border border-primary-200 bg-white text-primary-900 font-bold px-6 py-3.5 hover:bg-primary-50"
              >
                Iniciar admisión
              </Link>
            </div>
          </div>

          <div className="max-w-5xl mx-auto mt-16">
            <p className="text-center text-sm font-bold tracking-[0.16em] uppercase text-gray-400 mb-5">
              Preguntas de cada nivel
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {NIVELES.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`rounded-3xl border bg-gradient-to-br ${n.className} p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg`}
                >
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${n.chip} mb-3`} />
                  <h2 className="text-xl font-extrabold text-gray-900">{n.label}</h2>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{n.hint}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
