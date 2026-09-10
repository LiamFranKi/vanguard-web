import Link from 'next/link'

export default function NivelClasicoAviso({ hrefNuevo }: { hrefNuevo: string }) {
  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-950 text-sm">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <p>Estás viendo el diseño anterior de esta página.</p>
        <Link href={hrefNuevo} className="font-semibold text-amber-800 underline underline-offset-2 hover:text-amber-950">
          Volver al diseño nuevo
        </Link>
      </div>
    </div>
  )
}
