'use client'

import { FiMapPin } from 'react-icons/fi'

export default function VideoSection() {
  // Dirección codificada para Google Maps
  const address = encodeURIComponent('Jr. Toribio De Luzuriaga Mz F, San Martín de Porres 15107, Perú')

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-800 mb-4">
              ¿Sabes cómo llegar a Vanguard?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-4"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Video del Mapa */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-2 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden">
                  <video
                    src="/mapa-vanguard.mp4"
                    controls
                    className="w-full h-full object-cover"
                    preload="metadata"
                  >
                    Tu navegador no soporta la reproducción de videos.
                  </video>
                </div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <FiMapPin className="text-primary-600" size={20} />
                    <span className="text-sm font-semibold text-gray-800">Ruta a Vanguard</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-2 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.234567890123!2d-77.0851712!3d-12.0140762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105ce93e7332faf%3A0x5419c3e0a840d1a1!2sColegio%20Vanguard%20School!5e0!3m2!1ses!2spe!4v1700000000000!5m2!1ses!2spe"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                    title="Ubicación Vanguard Schools - Jr. Toribio De Luzuriaga Mz F, San Martín de Porres 15107"
                  ></iframe>
                </div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <FiMapPin className="text-green-600" size={20} />
                    <span className="text-sm font-semibold text-gray-800">Ubicación</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

