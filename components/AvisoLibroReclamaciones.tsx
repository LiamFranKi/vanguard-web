import Link from 'next/link'
import LibroReclamacionesIcon from '@/components/icons/LibroReclamacionesIcon'
import { obtenerInstitucionPublica } from '@/lib/institucion-publica'

/** Aviso Anexo III: visible en el inicio, sutil, con enlace al libro virtual. */
export default async function AvisoLibroReclamaciones() {
  const inst = await obtenerInstitucionPublica()

  return (
    <section
      aria-label="Libro de Reclamaciones"
      className="border-t border-slate-200/70 bg-[#f7f8fa]"
    >
      <div className="container mx-auto px-4">
        <Link
          href="/libro-de-reclamaciones"
          className="group mx-auto flex max-w-2xl items-center justify-center gap-2.5 py-2.5 text-center"
        >
          <LibroReclamacionesIcon className="h-6 w-6 shrink-0 opacity-80" />
          <span className="min-w-0 text-left">
            <span className="block text-[12px] font-medium text-slate-600 group-hover:text-primary-800">
              Libro de Reclamaciones
            </span>
            <span className="block text-[11px] leading-snug text-slate-400">
              {inst.nombreComercial} pone a su disposición el libro virtual.
            </span>
          </span>
        </Link>
      </div>
    </section>
  )
}
