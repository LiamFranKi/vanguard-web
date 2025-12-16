'use client'

import { useState, useEffect, useRef } from 'react'
import { FiMessageCircle, FiX, FiSend, FiSmile, FiPaperclip } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import Image from 'next/image'

interface Message {
  id: string
  text: string
  timestamp: string
  isUser: boolean
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [userName, setName] = useState('')
  const [userEmail, setEmail] = useState('')
  const [userPhone, setPhone] = useState('')
  const [showForm, setShowForm] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Cargar mensajes guardados del localStorage
  useEffect(() => {
    if (isOpen) {
      const savedMessages = localStorage.getItem('vanguard-chat-messages')
      if (savedMessages) {
        try {
          setMessages(JSON.parse(savedMessages))
        } catch (e) {
          console.error('Error loading messages:', e)
        }
      }
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    // Si no hay datos del usuario, mostrar formulario
    if (!userName || !userEmail) {
      setShowForm(true)
      return
    }

    setIsSending(true)

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      timestamp: new Date().toISOString(),
      isUser: true,
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    localStorage.setItem('vanguard-chat-messages', JSON.stringify(newMessages))
    setInputMessage('')

    try {
      // Enviar mensaje al servidor
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: userName,
          email: userEmail,
          telefono: userPhone,
          mensaje: inputMessage,
        }),
      })

      if (response.ok) {
        // Mensaje de confirmación automático
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: '¡Gracias por tu mensaje! Hemos recibido tu consulta y te responderemos pronto. Mientras tanto, puedes contactarnos directamente por WhatsApp.',
          timestamp: new Date().toISOString(),
          isUser: false,
        }
        const updatedMessages = [...newMessages, botMessage]
        setMessages(updatedMessages)
        localStorage.setItem('vanguard-chat-messages', JSON.stringify(updatedMessages))
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleSubmitForm = () => {
    if (userName && userEmail) {
      setShowForm(false)
      if (inputMessage.trim()) {
        handleSendMessage()
      }
    }
  }

  const openWhatsApp = () => {
    const phone = '51970877642' // Número sin espacios ni guiones
    const message = encodeURIComponent(
      `Hola, tengo una consulta sobre Vanguard Schools. ${messages.length > 0 ? `\n\nÚltimo mensaje: ${messages[messages.length - 1]?.text}` : ''}`
    )
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-full shadow-2xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-110 flex items-center justify-center group"
          aria-label="Abrir chat"
        >
          <FiMessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Widget de Chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Image
                  src="/LOGO3.png"
                  alt="Vanguard Schools"
                  width={40}
                  height={40}
                  className="object-contain rounded-full"
                  unoptimized
                />
              </div>
              <div>
                <h3 className="font-bold text-sm">Vanguard Schools</h3>
                <p className="text-xs text-white/90">Te responderemos tan pronto como sea posible</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors p-1"
              aria-label="Cerrar chat"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Formulario inicial (si no hay datos) */}
          {showForm && (
            <div className="p-4 bg-gray-50 border-b">
              <p className="text-sm text-gray-700 mb-3 font-semibold">Por favor, completa tus datos para continuar:</p>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Nombre completo *"
                  value={userName}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={userEmail}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="Teléfono (opcional)"
                  value={userPhone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={handleSubmitForm}
                  disabled={!userName || !userEmail}
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 min-h-[300px] max-h-[400px]">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-8">
                <FiMessageCircle size={48} className="mx-auto mb-3 text-gray-300" />
                <p>¡Hola! ¿En qué podemos ayudarte?</p>
                <p className="text-xs mt-2">Escribe tu mensaje y te responderemos pronto</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.isUser
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.isUser ? 'text-green-100' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Botones de acción rápida */}
          {messages.length > 0 && (
            <div className="p-3 bg-white border-t flex gap-2">
              <button
                onClick={openWhatsApp}
                className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <FaWhatsapp size={18} />
                <span>WhatsApp</span>
              </button>
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white border-t">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                disabled={isSending || showForm}
              />
              <button
                onClick={handleSendMessage}
                disabled={isSending || !inputMessage.trim() || showForm}
                className="bg-green-600 text-white p-2.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Enviar mensaje"
              >
                <FiSend size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

