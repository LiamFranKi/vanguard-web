'use client'

import { useEffect } from 'react'
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi'

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message: string
  type?: 'error' | 'success' | 'info' | 'warning'
}

export default function AlertModal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'info' 
}: AlertModalProps) {
  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden'
    }

    return () => {
      window.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Configuración según el tipo
  const config = {
    error: {
      icon: FiAlertCircle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      titleColor: 'text-red-800',
      textColor: 'text-red-700',
      buttonColor: 'bg-red-600 hover:bg-red-700',
    },
    success: {
      icon: FiCheckCircle,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      titleColor: 'text-green-800',
      textColor: 'text-green-700',
      buttonColor: 'bg-green-600 hover:bg-green-700',
    },
    warning: {
      icon: FiAlertCircle,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      titleColor: 'text-amber-800',
      textColor: 'text-amber-700',
      buttonColor: 'bg-amber-600 hover:bg-amber-700',
    },
    info: {
      icon: FiInfo,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      titleColor: 'text-blue-800',
      textColor: 'text-blue-700',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
    },
  }

  const currentConfig = config[type]
  const Icon = currentConfig.icon

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Overlay con backdrop blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" />
      
      {/* Contenedor del modal */}
      <div
        className={`relative z-10 w-full max-w-md ${currentConfig.bgColor} border-2 ${currentConfig.borderColor} rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 animate-slide-up`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Contenido del modal */}
        <div className="p-6">
          {/* Icono y título */}
          <div className="flex items-start space-x-4 mb-4">
            <div className={`flex-shrink-0 ${currentConfig.iconColor}`}>
              <Icon size={32} className="animate-bounce-in" />
            </div>
            <div className="flex-1">
              {title && (
                <h3 className={`text-xl font-bold ${currentConfig.titleColor} mb-2`}>
                  {title}
                </h3>
              )}
              <p className={`${currentConfig.textColor} text-base leading-relaxed`}>
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`flex-shrink-0 ${currentConfig.iconColor} hover:opacity-70 transition-opacity transform hover:scale-110`}
              aria-label="Cerrar"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Botón de acción */}
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className={`${currentConfig.buttonColor} text-white px-6 py-2.5 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md hover:shadow-lg`}
            >
              Entendido
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes bounce-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .animate-bounce-in {
          animation: bounce-in 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}

