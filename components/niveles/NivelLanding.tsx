import Image from 'next/image'
import Link from 'next/link'
import type { NivelLandingData } from '@/lib/niveles-landing'
import type { FaqItem } from '@/lib/faqs'
import { formatSoles, textoDescuentoHermano } from '@/lib/niveles-inversion'

type Props = {
  data: NivelLandingData
  monto: number
  textoLinea: string
  descuentoHermano: number
  faqs: FaqItem[]
  admisionHref: string
  admisionLabel: string
}

const THEME = {
  inicial: {
    overlay: 'from-[#3b1020]/85 via-rose-900/45 to-amber-500/25',
    chip: 'bg-rose-500',
    cta: 'from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600',
    ghost: 'border-white/40 bg-white/10 hover:bg-white/20 text-white',
    soft: 'bg-rose-50',
    text: 'text-rose-700',
    bar: 'from-rose-400 via-amber-400 to-orange-300',
    pill: 'bg-rose-100 text-rose-800',
    price: 'from-rose-600 to-orange-500',
    section: 'from-orange-50 via-white to-rose-50',
  },
  primaria: {
    overlay: 'from-[#071536]/70 via-[#0b1f4a]/28 to-transparent',
    chip: 'bg-sky-500',
    cta: 'from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800',
    ghost: 'border-sky-200 bg-white text-sky-950 hover:bg-sky-50 shadow-lg',
    soft: 'bg-sky-50',
    text: 'text-sky-800',
    bar: 'from-sky-400 via-blue-500 to-indigo-400',
    pill: 'bg-sky-100 text-sky-900',
    price: 'from-sky-600 to-indigo-600',
    section: 'from-sky-50 via-white to-cyan-50',
  },
  secundaria: {
    overlay: 'from-[#04140f]/90 via-emerald-950/60 to-teal-700/25',
    chip: 'bg-emerald-600',
    cta: 'from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800',
    ghost: 'border-white/40 bg-white/10 hover:bg-white/20 text-white',
    soft: 'bg-emerald-50',
    text: 'text-emerald-800',
    bar: 'from-emerald-400 via-teal-400 to-gold-400',
    pill: 'bg-emerald-100 text-emerald-900',
    price: 'from-emerald-700 to-teal-600',
    section: 'from-emerald-50 via-white to-slate-50',
  },
} as const

export default function NivelLanding({
  data,
  monto,
  textoLinea,
  descuentoHermano,
  faqs,
  admisionHref,
  admisionLabel,
}: Props) {
  const t = THEME[data.key]

  return (
    <div className={`pt-28 md:pt-32 bg-gradient-to-b ${t.section}`}>
      <section className="relative min-h-[72vh] md:min-h-[88vh] flex items-end">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={data.heroImage}
            alt={data.title}
            fill
            priority
            unoptimized
            className={`object-cover scale-105 ${data.key === 'primaria' ? 'object-[center_32%]' : 'object-center'}`}
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${t.overlay}`} />
          <div className="absolute inset-0 nivel-hero-shine" />
        </div>
        <div className="relative z-10 container mx-auto px-4 pb-10 md:pb-20 pt-6 md:pt-32">
          <p className={`inline-flex items-center ${t.chip} text-white text-xs md:text-sm font-bold tracking-widest uppercase rounded-full px-4 py-1.5 shadow-lg mb-4 md:mb-5`}>
            {data.kicker}{data.ages ? ` · ${data.ages}` : ''}
          </p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white max-w-4xl leading-[0.95] drop-shadow-lg">
            {data.title}
          </h1>
          <p className="mt-4 md:mt-6 text-base md:text-xl text-white/90 max-w-2xl leading-relaxed">
            {data.lead}
          </p>
          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
            <Link
              href="/visita-guiada"
              className={`inline-flex justify-center items-center rounded-2xl bg-gradient-to-r ${t.cta} text-white font-bold px-6 py-3.5 shadow-xl`}
            >
              Agenda una visita guiada
            </Link>
            <Link
              href={admisionHref}
              className="inline-flex justify-center items-center rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold px-6 py-3.5 shadow-xl"
            >
              {admisionLabel}
            </Link>
            <Link
              href="/contacto"
              className={`inline-flex justify-center items-center rounded-2xl border ${t.ghost} font-semibold px-6 py-3.5`}
            >
              Contáctanos
            </Link>
            <a
              href="https://tour.vanguardschools.edu.pe/"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex justify-center items-center rounded-2xl border ${t.ghost} font-semibold px-6 py-3.5`}
            >
              Tour virtual
            </a>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 -mt-10 relative z-20 mb-8">
        <blockquote className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl px-6 py-5 md:px-10 md:py-7 max-w-4xl mx-auto text-center text-lg md:text-xl font-medium text-gray-800 border border-white">
          “{data.quote}”
        </blockquote>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
          <div>
            <p className={`text-sm font-bold uppercase tracking-widest ${t.text} mb-2`}>Cómo aprendemos</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{data.methodologyTitle}</h2>
            <div className={`h-1 w-24 bg-gradient-to-r ${t.bar} rounded-full mb-5`} />
            <p className="text-gray-700 text-lg leading-relaxed">{data.methodologyBody}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {data.pillars.map((p) => (
              <article
                key={p.title}
                className={`${t.soft} rounded-3xl p-5 border border-white shadow-sm hover:shadow-lg transition-shadow`}
              >
                <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-6 md:py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Campus que se vive</h2>
          <p className="text-gray-600 mb-8">Piscinas temperadas, canchas de sintético y más de 7 500 m² para crecer.</p>
          <div className="grid md:grid-cols-3 gap-5">
            {data.campus.map((c) => (
              <article key={c.title} className="group relative h-80 rounded-[2rem] overflow-hidden shadow-xl">
                <Image src={c.image} alt={c.title} fill unoptimized className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">{c.title}</h3>
                  <p className="text-sm text-white/85">{c.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 max-w-6xl">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Talleres (sin costo adicional)</h2>
        <div className="flex flex-wrap gap-3">
          {data.talleres.map((name) => (
            <span key={name} className={`${t.pill} font-semibold px-5 py-2.5 rounded-full text-sm md:text-base shadow-sm`}>
              {name}
            </span>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-8 max-w-6xl">
        <div className={`rounded-[2.2rem] bg-gradient-to-br ${t.price} text-white p-8 md:p-12 shadow-2xl overflow-hidden relative`}>
          <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/10" />
          <p className="uppercase tracking-[0.2em] text-xs font-bold text-white/80 mb-2">Esquema de pagos</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Un mismo monto en todo el nivel</h2>
          {data.priceNote && (
            <p className="text-white/85 mb-8 max-w-xl">{data.priceNote}</p>
          )}
          <div className="flex flex-wrap gap-2 mb-8">
            {data.grados.map((g) => (
              <span
                key={g}
                className="inline-flex justify-center min-w-[8.5rem] bg-white/18 border border-white/30 rounded-2xl px-3.5 py-2 text-sm font-semibold text-center"
              >
                {g}
              </span>
            ))}
          </div>
          <p className="text-5xl md:text-6xl font-extrabold tracking-tight">{formatSoles(monto)}</p>
          <p className="mt-2 text-lg text-white/90">{textoLinea}</p>
          <p className="mt-4 font-semibold bg-white/15 inline-block rounded-2xl px-4 py-2">
            {textoDescuentoHermano(descuentoHermano)}
          </p>
          {data.incluidos && data.incluidos.length > 0 && (
            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {data.incluidos.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl bg-white text-gray-900 p-5 shadow-lg border border-white/40"
                >
                  <span className="inline-block text-[11px] font-extrabold tracking-[0.18em] text-rose-600 mb-2">
                    {item.badge}
                  </span>
                  <h3 className="text-lg font-extrabold leading-tight">{item.title}</h3>
                  <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{item.text}</p>
                </article>
              ))}
            </div>
          )}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href={admisionHref} className="inline-flex justify-center bg-white text-gray-900 font-bold rounded-2xl px-6 py-3.5 hover:bg-amber-50">
              {admisionLabel}
            </Link>
            {data.showUtilesCta !== false && (
              <Link href="/lista-utiles" className="inline-flex justify-center border border-white/40 font-semibold rounded-2xl px-6 py-3.5 hover:bg-white/10">
                Lista de útiles
              </Link>
            )}
            <Link href="/documentos" className="inline-flex justify-center border border-white/40 font-semibold rounded-2xl px-6 py-3.5 hover:bg-white/10">
              Documentos
            </Link>
          </div>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="container mx-auto px-4 py-14 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Preguntas frecuentes</h2>
          <p className="text-gray-600 mb-8">Respuestas rápidas de este nivel. Si hace falta, también estamos en contacto.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {faqs.map((faq, i) => (
              <details
                key={`${faq.pregunta}-${i}`}
                className="nivel-faq group rounded-3xl bg-white border border-black/5 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <summary className="cursor-pointer list-none px-5 py-4 flex items-start gap-3">
                  <span className={`shrink-0 w-9 h-9 rounded-2xl ${t.pill} flex items-center justify-center text-sm font-extrabold`}>
                    {i + 1}
                  </span>
                  <span className="font-bold text-gray-900 leading-snug pt-1">{faq.pregunta}</span>
                  <span className="ml-auto text-gray-400 group-open:rotate-180 transition-transform pt-1">▾</span>
                </summary>
                <div className="px-5 pb-5 md:pl-16 text-gray-700 leading-relaxed whitespace-pre-line border-t border-black/5 pt-3">
                  {faq.respuesta}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto rounded-[2rem] bg-gray-900 text-white p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold">Ven a conocer {data.title.toLowerCase()}</h2>
            <p className="text-white/70 mt-2">Visita el campus, resuelve dudas y da el siguiente paso.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/visita-guiada" className={`inline-flex justify-center rounded-2xl bg-gradient-to-r ${t.cta} font-bold px-5 py-3`}>
              Visita guiada
            </Link>
            <Link href="/calendarizacion" className="inline-flex justify-center rounded-2xl bg-white/10 font-semibold px-5 py-3 hover:bg-white/20">
              Calendarización
            </Link>
          </div>
        </div>
        {data.showClasicoLink !== false && (
          <p className="text-center text-xs text-gray-400 mt-8">
            <Link href={data.clasicoHref} className="underline underline-offset-2 hover:text-gray-600">
              Ver el diseño anterior de esta página
            </Link>
          </p>
        )}
      </section>
    </div>
  )
}
