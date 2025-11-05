import { Link } from 'react-router-dom'
import { Ship, Compass, Anchor, MapPin, Radio, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 wave-animation opacity-30"></div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Icon Grid Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <div className="grid grid-cols-3 gap-8">
                <Ship className="w-20 h-20 text-adyk-navy" />
                <Compass className="w-20 h-20 text-adyk-navy" />
                <Anchor className="w-20 h-20 text-adyk-navy" />
                <MapPin className="w-20 h-20 text-adyk-navy" />
                <Radio className="w-20 h-20 text-adyk-navy" />
                <Ship className="w-20 h-20 text-adyk-navy" />
              </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center space-x-2 bg-adyk-ocean/10 px-4 py-2 rounded-full mb-6">
                <Radio className="w-4 h-4 text-adyk-ocean animate-pulse" />
                <span className="text-sm font-medium text-adyk-navy">
                  Gerçek Zamanlı AIS Takip Sistemi
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-adyk-navy mb-6">
                Türk Denizlerinde
                <br />
                <span className="bg-gradient-to-r from-adyk-ocean to-adyk-accent bg-clip-text text-transparent">
                  Gemilerinizi İzleyin
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                ADYK AIS Gemi Takip Sistemi ile Türk karasularındaki gemileri gerçek zamanlı olarak takip edin.
                Konum, hız, rota ve daha fazla bilgiye anında erişin.
              </p>

              <Link
                to="/ais"
                className="inline-flex items-center space-x-2 btn-primary text-lg group"
              >
                <Ship className="w-5 h-5" />
                <span>Gemileri Görüntüle</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-adyk-navy mb-12">
            Sistem Özellikleri
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-adyk-ocean">
              <div className="w-12 h-12 bg-gradient-to-br from-adyk-ocean to-adyk-accent rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-adyk-navy mb-3">
                Gerçek Zamanlı Konum
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Gemilerin anlık konumlarını interaktif harita üzerinde görüntüleyin.
                Detaylı bilgilere tek tıkla erişin.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-adyk-ocean">
              <div className="w-12 h-12 bg-gradient-to-br from-adyk-ocean to-adyk-accent rounded-lg flex items-center justify-center mb-4">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-adyk-navy mb-3">
                Detaylı Seyir Bilgileri
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Hız, rota, başlangıç, hedef liman ve diğer tüm AIS verilerine
                profesyonel bir arayüzle ulaşın.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-adyk-ocean">
              <div className="w-12 h-12 bg-gradient-to-br from-adyk-ocean to-adyk-accent rounded-lg flex items-center justify-center mb-4">
                <Ship className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-adyk-navy mb-3">
                Gelişmiş Filtreleme
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Gemi tipi, durum, hız ve daha fazla kritere göre gemileri filtreleyin.
                Aradığınız gemiyi kolayca bulun.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-adyk-navy to-adyk-accent py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">53+</div>
              <div className="text-blue-200">Takip Edilen Gemi</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">7/24</div>
              <div className="text-blue-200">Kesintisiz İzleme</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">100%</div>
              <div className="text-blue-200">Türk Karasuları</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-adyk-navy text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Anchor className="w-6 h-6" />
            <span className="text-xl font-bold">ADYK</span>
          </div>
          <p className="text-blue-200 text-sm">
            Türk Denizcilik Derneği - AIS Gemi Takip Sistemi
          </p>
          <p className="text-blue-300 text-xs mt-2">
            © 2024 ADYK. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home
