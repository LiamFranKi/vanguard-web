import { formatSoles, textoDescuentoHermano } from '@/lib/niveles-inversion'

type Grupo = {
  etiqueta: string
}

type Props = {
  titulo: string
  grupos: Grupo[]
  monto: number
  textoLinea: string
  descuentoHermano: number
}

export default function NivelInversion({
  titulo,
  grupos,
  monto,
  textoLinea,
  descuentoHermano,
}: Props) {
  const cols =
    grupos.length === 2 ? 'md:grid-cols-2' : grupos.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-1'

  return (
    <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-8 border-2 border-primary-200">
      <h2 className="text-3xl font-extrabold text-primary-800 mb-6 text-center">{titulo}</h2>
      <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-8"></div>
      <div className={`grid ${cols} gap-6 mb-6`}>
        {grupos.map((g) => (
          <div key={g.etiqueta} className="bg-white rounded-xl p-6 text-center shadow-md">
            <h3 className="font-bold text-lg text-gray-900 mb-3">{g.etiqueta}</h3>
            <div className="text-3xl font-extrabold text-primary-600 mb-2">{formatSoles(monto)}</div>
            <p className="text-sm text-gray-600">{textoLinea}</p>
          </div>
        ))}
      </div>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg text-center">
        <p className="text-gray-800 font-semibold">{textoDescuentoHermano(descuentoHermano)}</p>
      </div>
    </div>
  )
}
