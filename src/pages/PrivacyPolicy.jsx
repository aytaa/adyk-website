import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, Anchor } from 'lucide-react'
import Navbar from '../components/Navbar'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar title="ADYK Online" />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-adyk-ocean hover:text-adyk-accent transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ana Sayfaya Dön</span>
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-gradient-to-br from-adyk-ocean to-adyk-accent p-4 rounded-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-adyk-navy">Gizlilik Politikası</h1>
              <p className="text-gray-600">Son Güncelleme: 30 Kasım 2025</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-adyk-navy mb-4">1. Giriş</h2>
            <p className="text-gray-700 leading-relaxed">
              ADYK Online, kullanıcılarımızın gizliliğini korumayı taahhüt eder. Bu Gizlilik Politikası,
              uygulamamızı kullanırken toplanan, kullanılan ve paylaşılan kişisel bilgilerinizi açıklar.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-adyk-navy mb-4">2. Toplanan Bilgiler</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              ADYK Online uygulamasını kullanırken aşağıdaki bilgileri toplayabiliriz:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Hesap bilgileri (e-posta adresi, kullanıcı adı)</li>
              <li>Konum bilgileri (sadece uygulama kullanımı sırasında)</li>
              <li>Cihaz bilgileri (cihaz tipi, işletim sistemi)</li>
              <li>Kullanım verileri (uygulama içi aktiviteler)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-adyk-navy mb-4">3. Bilgilerin Kullanımı</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Topladığımız bilgileri şu amaçlarla kullanırız:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>AIS takip hizmetlerini sağlamak</li>
              <li>Kullanıcı hesaplarını yönetmek</li>
              <li>Uygulama performansını iyileştirmek</li>
              <li>Teknik destek sağlamak</li>
              <li>Güvenlik ve dolandırıcılığı önlemek</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-adyk-navy mb-4">4. Bilgi Paylaşımı</h2>
            <p className="text-gray-700 leading-relaxed">
              Kişisel bilgilerinizi üçüncü taraflarla paylaşmıyoruz. Bilgileriniz yalnızca hizmetlerimizi
              sağlamak için kullanılır ve yasal gereklilikler dışında başka amaçlarla paylaşılmaz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-adyk-navy mb-4">5. Veri Güvenliği</h2>
            <p className="text-gray-700 leading-relaxed">
              Kişisel bilgilerinizi korumak için endüstri standardı güvenlik önlemleri kullanırız.
              Tüm veriler şifrelenmiş bağlantılar üzerinden iletilir ve güvenli sunucularda saklanır.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-adyk-navy mb-4">6. Konum Verileri</h2>
            <p className="text-gray-700 leading-relaxed">
              Uygulamamız, AIS takip özelliklerini sağlamak için konum verilerini kullanır.
              Konum izni yalnızca uygulamayı kullanırken gereklidir ve arka planda konum takibi yapmayız.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-adyk-navy mb-4">7. Kullanıcı Hakları</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Kullanıcılarımız aşağıdaki haklara sahiptir:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Kişisel bilgilerinize erişim talep etme</li>
              <li>Bilgilerinizin düzeltilmesini isteme</li>
              <li>Bilgilerinizin silinmesini talep etme</li>
              <li>Veri işleme faaliyetlerine itiraz etme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-adyk-navy mb-4">8. Çerezler ve Takip Teknolojileri</h2>
            <p className="text-gray-700 leading-relaxed">
              Uygulamamız, kullanıcı deneyimini iyileştirmek için çerezler ve benzer teknolojiler kullanabilir.
              Bu teknolojiler, tercihlerinizi hatırlamak ve uygulama performansını analiz etmek için kullanılır.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-adyk-navy mb-4">9. Çocukların Gizliliği</h2>
            <p className="text-gray-700 leading-relaxed">
              Uygulamamız 13 yaşın altındaki çocuklara yönelik değildir. Bilerek 13 yaşın altındaki
              çocuklardan kişisel bilgi toplamıyoruz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-adyk-navy mb-4">10. Politika Değişiklikleri</h2>
            <p className="text-gray-700 leading-relaxed">
              Bu Gizlilik Politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler olduğunda
              kullanıcılarımızı uygulama içi bildirimlerle bilgilendireceğiz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-adyk-navy mb-4">11. İletişim</h2>
            <p className="text-gray-700 leading-relaxed">
              Gizlilik politikamız hakkında sorularınız varsa, lütfen bizimle iletişime geçin:
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <p className="text-gray-700">
                <strong>E-posta:</strong> info@adyk.online
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-adyk-ocean hover:text-adyk-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-adyk-navy text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Anchor className="w-6 h-6" />
            <span className="text-xl font-bold">ADYK Online</span>
          </div>
          <p className="text-blue-200 text-sm">
            Türk Denizcilik Derneği - AIS Gemi Takip Sistemi
          </p>
          <p className="text-blue-300 text-xs mt-2">
            © 2025 ADYK Online. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default PrivacyPolicy
