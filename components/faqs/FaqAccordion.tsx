import type { FaqItem } from '@/lib/faqs'

const TONES = {
  gold: {
    item: 'border-primary-100 hover:border-gold-300/80',
    open: 'open:border-gold-400 open:shadow-xl open:shadow-gold-500/10',
    num: 'bg-gradient-to-br from-primary-700 to-primary-900 text-white',
    chevron: 'text-primary-700',
    bar: 'from-gold-400 to-primary-700',
  },
  rose: {
    item: 'border-rose-100 hover:border-rose-300/80',
    open: 'open:border-rose-300 open:shadow-xl open:shadow-rose-500/10',
    num: 'bg-rose-100 text-rose-800',
    chevron: 'text-rose-700',
    bar: 'from-rose-400 to-orange-400',
  },
  sky: {
    item: 'border-sky-100 hover:border-sky-300/80',
    open: 'open:border-sky-300 open:shadow-xl open:shadow-sky-500/10',
    num: 'bg-sky-100 text-sky-900',
    chevron: 'text-sky-800',
    bar: 'from-sky-400 to-indigo-500',
  },
  emerald: {
    item: 'border-emerald-100 hover:border-teal-300/80',
    open: 'open:border-emerald-300 open:shadow-xl open:shadow-emerald-500/10',
    num: 'bg-emerald-100 text-emerald-900',
    chevron: 'text-emerald-800',
    bar: 'from-emerald-400 to-teal-600',
  },
} as const

export type FaqAccordionTone = keyof typeof TONES

export default function FaqAccordion({
  faqs,
  tone = 'gold',
}: {
  faqs: FaqItem[]
  tone?: FaqAccordionTone
}) {
  if (!faqs.length) return null
  const t = TONES[tone]

  return (
    <div className="flex flex-col gap-3">
      {faqs.map((faq, i) => (
        <details
          key={`${faq.pregunta}-${i}`}
          className={`v-faq group rounded-2xl bg-white border shadow-sm ${t.item} ${t.open} transition-all duration-300`}
        >
          <summary className="cursor-pointer list-none px-5 py-4 md:px-6 md:py-5 flex items-start gap-4">
            <span
              className={`shrink-0 w-10 h-10 rounded-2xl ${t.num} flex items-center justify-center text-sm font-extrabold tabular-nums`}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="flex-1 font-bold text-gray-900 text-[1.02rem] md:text-lg leading-snug pt-1.5">
              {faq.pregunta}
            </span>
            <span
              className={`shrink-0 mt-2 text-lg leading-none ${t.chevron} transition-transform duration-300 group-open:rotate-180`}
              aria-hidden
            >
              ▾
            </span>
          </summary>
          <div className="px-5 md:px-6 pb-5 md:pl-[4.5rem]">
            <div className={`h-0.5 w-14 rounded-full bg-gradient-to-r ${t.bar} mb-3`} />
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{faq.respuesta}</p>
          </div>
        </details>
      ))}
    </div>
  )
}
