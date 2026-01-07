'use client'

import { useState, useMemo } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import calendarizacionData from '@/config/calendarizacion.json'

interface Evento {
  tipo: string
  color: string
  colorTexto: string
  dia?: number
  rango?: {
    inicio: number
    fin: number
  }
  texto: string
}

interface MesData {
  nombre: string
  eventos: Evento[]
}

type MesNumero = 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export default function CalendarizationCalendar() {
  const año = calendarizacionData.año
  const [mesActual, setMesActual] = useState<MesNumero>(3) // Empezar en Marzo
  
  const meses: MesNumero[] = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const nombresMeses = ['', '', '', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  const mesData = (calendarizacionData.meses as Record<string, MesData>)[mesActual.toString()] as MesData | undefined

  // Obtener el primer día del mes y cuántos días tiene
  const obtenerInfoMes = (año: number, mes: number) => {
    const primerDia = new Date(año, mes - 1, 1)
    const ultimoDia = new Date(año, mes, 0)
    const diaSemanaInicio = primerDia.getDay() // 0 = Domingo, 1 = Lunes, etc.
    const diasEnMes = ultimoDia.getDate()
    return { diaSemanaInicio, diasEnMes }
  }

  const { diaSemanaInicio, diasEnMes } = obtenerInfoMes(año, mesActual)

  // Función para obtener eventos de un día específico
  const obtenerEventosDia = (dia: number): Evento[] => {
    if (!mesData) return []
    
    return mesData.eventos.filter(evento => {
      // Evento por día específico
      if (evento.dia === dia) return true
      
      // Evento por rango
      if (evento.rango) {
        return dia >= evento.rango.inicio && dia <= evento.rango.fin
      }
      
      return false
    })
  }

  // Calcular días del calendario (con días vacíos al inicio)
  const diasCalendario = useMemo(() => {
    const dias: (number | null)[] = []
    
    // Agregar días vacíos al inicio
    for (let i = 0; i < diaSemanaInicio; i++) {
      dias.push(null)
    }
    
    // Agregar días del mes
    for (let i = 1; i <= diasEnMes; i++) {
      dias.push(i)
    }
    
    return dias
  }, [diaSemanaInicio, diasEnMes])

  const navegarMes = (direccion: 'anterior' | 'siguiente') => {
    const indiceActual = meses.indexOf(mesActual)
    
    if (direccion === 'anterior' && indiceActual > 0) {
      setMesActual(meses[indiceActual - 1])
    } else if (direccion === 'siguiente' && indiceActual < meses.length - 1) {
      setMesActual(meses[indiceActual + 1])
    }
  }

  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
      {/* Header del calendario */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navegarMes('anterior')}
          disabled={mesActual === 3}
          className={`p-2 rounded-lg transition-all ${
            mesActual === 3
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
          }`}
        >
          <FiChevronLeft size={24} />
        </button>
        
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {nombresMeses[mesActual]} {año}
        </h2>
        
        <button
          onClick={() => navegarMes('siguiente')}
          disabled={mesActual === 12}
          className={`p-2 rounded-lg transition-all ${
            mesActual === 12
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
          }`}
        >
          <FiChevronRight size={24} />
        </button>
      </div>

      {/* Indicador de meses */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {meses.map(mes => (
          <button
            key={mes}
            onClick={() => setMesActual(mes)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              mesActual === mes
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {nombresMeses[mes].substring(0, 3)}
          </button>
        ))}
      </div>

      {/* Calendario */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {diasSemana.map(dia => (
              <div
                key={dia}
                className="text-center font-semibold text-gray-700 py-2 bg-gray-50 rounded-lg text-sm md:text-base"
              >
                {dia.substring(0, 3)}
              </div>
            ))}
          </div>

          {/* Días del mes */}
          <div className="grid grid-cols-7 gap-2">
            {diasCalendario.map((dia, index) => {
              if (dia === null) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="min-h-[120px] bg-gray-50 rounded-lg"
                  />
                )
              }

              const eventos = obtenerEventosDia(dia)

              const esDiaActual = new Date().getDate() === dia && 
                                  new Date().getMonth() + 1 === mesActual &&
                                  new Date().getFullYear() === año

              return (
                <div
                  key={`dia-${dia}`}
                  className={`min-h-[120px] md:min-h-[140px] border-2 rounded-lg p-2 bg-white transition-all ${
                    esDiaActual
                      ? 'border-primary-500 bg-primary-50 shadow-md'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  {/* Número del día */}
                  <div className={`text-sm font-bold mb-1 ${
                    esDiaActual ? 'text-primary-700' : 'text-gray-700'
                  }`}>
                    {dia}
                    {esDiaActual && (
                      <span className="ml-1 text-xs text-primary-600">●</span>
                    )}
                  </div>

                  {/* Eventos */}
                  <div className="space-y-1 flex flex-col overflow-hidden">
                    {eventos.slice(0, 3).map((evento, eventoIndex) => (
                      <div
                        key={`evento-${dia}-${eventoIndex}`}
                        className="text-[9px] md:text-[10px] font-semibold p-1 rounded text-center leading-tight break-words"
                        style={{
                          backgroundColor: evento.color,
                          color: evento.colorTexto,
                        }}
                        title={evento.texto}
                      >
                        {evento.texto.split('\n').map((linea, i) => (
                          <div key={i} className="truncate">{linea}</div>
                        ))}
                      </div>
                    ))}
                    {eventos.length > 3 && (
                      <div className="text-[9px] font-semibold text-gray-600 text-center p-1">
                        +{eventos.length - 3} más
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

