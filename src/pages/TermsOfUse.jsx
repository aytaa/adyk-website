import { Link } from 'react-router-dom'
import { ArrowLeft, FileText, Anchor } from 'lucide-react'
import Navbar from '../components/Navbar'

const TermsOfUse = () => {
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
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-adyk-navy">Kullanım Koşulları</h1>
              <p className="text-gray-600">Son Güncelleme: 30 Kasım 2025</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-adyk-navy mb-4">1. Hizmet Koşullarının Kabulü</h2>
            <p className="text-gray-700 leading-relaxed">
              ADYK Online uygulamasını kullanarak, bu kullanım koşullarını kabul etmiş sayılırsınız.
              Bu koşulları kabul etmiyorsanız, lütfen uygulamayı kullanmayın.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-adyk-navy mb-4">2. Hizmet Tanımı</h2>
            <p className="text-gray-700 leading-relaxed">
              ADYK Online, Türk karasularında bulunan gemilerin AIS (Otomatik Tanımlama Sistemi)
              verilerini gerçek zamanlı olarak takip etmenizi sağlayan bir platformdur. Hizmetimiz,
              denizcilik profesyonelleri ve ilgilenen kullanıcılar için bilgi sağlamayı amaçlar.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-adyk-navy mb-4">3. Kullanıcı Hesapları</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              ADYK Online'ı kullanmak için bir hesap oluşturmanız gerekir. Hesap oluştururken:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Doğru ve güncel bilgiler sağlamalısınız</li>
              <li>Hesap güvenliğinden siz sorumlusunuz</li>
              <li>Hesabınızı başkalarıyla paylaşmamalısınız</li>
              <li>Şüpheli aktivite durumunda bizi bilgilendirmelisiniz</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-adyk-navy mb-4">4. Kabul Edilebilir Kullanım</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Uygulamayı kullanırken aşağıdaki kurallara uymalısınız:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Yalnızca yasal amaçlar için kullanın</li>
              <li>Diğer kullanıcıların haklarına saygı gösterin</li>
              <li>Sistemi manipüle etmeye çalışmayın</li>
              <li>Kötü amaçlı yazılım veya virüs yaymayın</li>
              <li>Hizmetimizi aşırı yüklememeye çalışın</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-adyk-navy mb-4">5. Veri ve Gizlilik</h2>
            <p className="text-gray-700 leading-relaxed">
              Kişisel verilerinizin işlenmesi ve korunmasıyla ilgili detaylı bilgi için
              Gizlilik Politikamızı inceleyiniz. Uygulamayı kullanarak, Gizlilik Politikamızda
              belirtilen veri işleme uygulamalarını kabul etmiş olursunuz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-adyk-navy mb-4">6. Fikri Mülkiyet Hakları</h2>
            <p className="text-gray-700 leading-relaxed">
              ADYK Online uygulaması ve içeriği, telif hakları, ticari markalar ve diğer fikri
              mülkiyet yasalarıyla korunmaktadır. Uygulama içeriğini izin almadan kopyalayamaz,
              değiştiremez veya dağıtamazsınız.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-adyk-navy mb-4">7. Hizmet Değişiklikleri</h2>
            <p className="text-gray-700 leading-relaxed">
              ADYK Online, hizmeti dilediği zaman değiştirme, askıya alma veya sonlandırma hakkını
              saklı tutar. Bu tür değişiklikler önceden bildirimle veya bildirimsiz yapılabilir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-adyk-navy mb-4">8. Sorumluluk Reddi</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              ADYK Online hizmeti "olduğu gibi" sunulmaktadır. Aşağıdaki konularda garanti vermemekteyiz:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Hizmetin kesintisiz veya hatasız olacağı</li>
              <li>Verinin her zaman doğru veya güncel olacağı</li>
              <li>Hizmetin belirli ihtiyaçlarınızı karşılayacağı</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-adyk-navy mb-4">9. Sorumluluk Sınırlaması</h2>
            <p className="text-gray-700 leading-relaxed">
              ADYK Online, uygulamanın kullanımından kaynaklanan doğrudan veya dolaylı zararlardan
              sorumlu tutulamaz. Deniz seyri kararlarınızı yalnızca bu uygulamaya dayanarak
              almayınız; resmi denizcilik kaynaklarını kullanınız.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-adyk-navy mb-4">10. Üçüncü Taraf Bağlantıları</h2>
            <p className="text-gray-700 leading-relaxed">
              Uygulamamız üçüncü taraf web sitelerine veya hizmetlere bağlantılar içerebilir.
              Bu bağlantıların içeriğinden veya gizlilik uygulamalarından sorumlu değiliz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-adyk-navy mb-4">11. Hesap Sonlandırma</h2>
            <p className="text-gray-700 leading-relaxed">
              Bu koşulları ihlal ederseniz, hesabınızı önceden bildirimde bulunmaksızın
              askıya alabilir veya sonlandırabiliriz. Ayrıca, hesabınızı istediğiniz zaman
              kendi isteğinizle kapatabilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-adyk-navy mb-4">12. Yasal Uyum</h2>
            <p className="text-gray-700 leading-relaxed">
              Bu kullanım koşulları, Türkiye Cumhuriyeti yasalarına tabidir. Uyuşmazlıklar,
              Türkiye mahkemelerinde çözümlenecektir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-adyk-navy mb-4">13. Koşullar Güncellemeleri</h2>
            <p className="text-gray-700 leading-relaxed">
              Bu kullanım koşullarını zaman zaman güncelleyebiliriz. Önemli değişiklikler
              yapıldığında kullanıcılarımızı bilgilendireceğiz. Güncellemelerden sonra
              uygulamayı kullanmaya devam etmeniz, yeni koşulları kabul ettiğiniz anlamına gelir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-adyk-navy mb-4">14. İletişim</h2>
            <p className="text-gray-700 leading-relaxed">
              Kullanım koşulları hakkında sorularınız varsa, lütfen bizimle iletişime geçin:
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <p className="text-gray-700">
                <strong>E-posta:</strong> info@adyk.online
              </p>
            </div>
          </section>

          <section className="border-t pt-6">
            <p className="text-gray-600 text-sm italic">
              Bu kullanım koşullarını okuyup anladığınızı ve bunlara uymayı kabul ettiğinizi
              onaylıyorsunuz. ADYK Online uygulamasını kullanarak, bu koşulları kabul etmiş
              sayılırsınız.
            </p>
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

export default TermsOfUse
