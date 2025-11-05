# ADYK AIS Gemi Takip Sistemi

Türk Denizcilik Derneği (ADYK) için geliştirilmiş modern, gerçek zamanlı gemi takip web uygulaması.

## 🚢 Özellikler

- **Gerçek Zamanlı Takip**: WebSocket ile canlı AIS verisi (wss://ws.adyk.online)
- **İnteraktif Harita**: Leaflet tabanlı detaylı harita görünümü
- **Gelişmiş Filtreleme**: Gemi tipi, durum ve hız bazlı filtreleme
- **Detaylı Gemi Bilgileri**: Konum, hız, rota, hedef liman ve daha fazlası
- **Otomatik Yeniden Bağlanma**: WebSocket bağlantısı kesilirse otomatik yeniden bağlanır
- **Bağlantı Durumu**: Canlı bağlantı durumu göstergesi
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu arayüz
- **Türkçe Arayüz**: Tam Türkçe dil desteği

## 🎨 Teknolojiler

- **React 18** - UI kütüphanesi
- **Vite** - Build tool ve dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Sayfa yönlendirme
- **Leaflet & React-Leaflet** - Harita entegrasyonu
- **Lucide React** - Modern icon seti

## 🚀 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Build önizleme
npm preview
```

## 📁 Proje Yapısı

```
adyk-website/
├── public/
│   └── anchor.svg          # Favicon
├── src/
│   ├── components/         # React bileşenleri
│   │   ├── Navbar.jsx
│   │   ├── SearchBar.jsx
│   │   ├── FilterPanel.jsx
│   │   ├── VesselCard.jsx
│   │   ├── VesselSidebar.jsx
│   │   ├── MapView.jsx
│   │   ├── VesselDetailModal.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── EmptyState.jsx
│   ├── pages/              # Sayfa bileşenleri
│   │   ├── Home.jsx
│   │   └── AIS.jsx
│   ├── hooks/              # Custom React hooks
│   │   └── useVesselWebSocket.js
│   ├── data/               # Mock data (reference)
│   │   └── mockVessels.js
│   ├── utils/              # Yardımcı fonksiyonlar
│   │   └── helpers.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🎨 Renk Paleti

- **Primary (Navy)**: `#0A2463` - Ana başlıklar ve önemli elementler
- **Secondary (Ocean Blue)**: `#3E92CC` - Butonlar ve vurgu renkleri
- **Accent**: `#1E5F8C` - Hover durumları
- **Light**: `#D8E9F0` - Arka plan ve açık tonlar

## 🔌 WebSocket Entegrasyonu

Proje **gerçek zamanlı WebSocket** ile çalışmaktadır:

- **WebSocket URL**: `wss://ws.adyk.online`
- **Hook**: `src/hooks/useVesselWebSocket.js`
- **Otomatik Bağlantı**: Sayfa açıldığında otomatik bağlanır
- **Otomatik Yeniden Bağlanma**: Bağlantı kesilirse 5-30 saniye içinde tekrar bağlanır
- **Veri Dönüşümü**: WebSocket verisi otomatik olarak uygulama formatına dönüştürülür

### WebSocket Veri Formatı (Gelen)

```json
{
  "trackers": [],
  "vessels": [
    {
      "mmsi": 271044731,
      "type": "vessel",
      "name": "OZI",
      "timestamp": "2025-10-30T11:27:26Z",
      "gps": {
        "latitude": 36.66924,
        "longitude": 27.50231,
        "speed": 0,
        "direction": 251
      },
      "vessel": {
        "imo": null,
        "callsign": "YMA3094",
        "flag": "TR",
        "shipType": "Sailing",
        "destination": "",
        "navStatus": 15,
        "aisType": 36,
        "currentPort": null,
        "lastPort": "PALOI"
      }
    }
  ],
  "timestamp": "2025-10-31T08:53:59.012Z"
}
```

### Hook Kullanımı

```javascript
import { useVesselWebSocket } from '../hooks/useVesselWebSocket'

function AISPage() {
  const {
    vessels,          // Dönüştürülmüş gemi verisi
    trackers,         // Tracker verisi
    isConnected,      // Bağlantı durumu
    lastUpdate,       // Son güncelleme zamanı
    error,            // Hata mesajı (varsa)
    vesselsCount      // Toplam gemi sayısı
  } = useVesselWebSocket()

  return (
    <div>
      {isConnected ? '✅ Bağlı' : '⏳ Bağlanıyor...'}
      <VesselList vessels={vessels} />
    </div>
  )
}
```

## 📱 Sayfalar

### Ana Sayfa (`/`)
- Hero section
- Özellikler
- İstatistikler
- CTA butonları

### AIS Takip (`/ais`)
- Gemi listesi (sidebar)
- İnteraktif harita
- Arama ve filtreleme
- Gemi detay modalı

## 🛠️ Geliştirme

### Yeni Bileşen Ekleme

```jsx
// src/components/YeniComponent.jsx
const YeniComponent = () => {
  return (
    <div className="p-4 bg-white rounded-lg">
      {/* İçerik */}
    </div>
  )
}

export default YeniComponent
```

### Tailwind Özel Sınıflar

```css
/* src/index.css */
.btn-primary      - Ana buton stili
.btn-secondary    - İkincil buton stili
.vessel-card      - Gemi kartı hover efekti
.wave-animation   - Dalga animasyonu
.custom-scrollbar - Özel scrollbar
```

## 🌐 Tarayıcı Desteği

- Chrome (son 2 versiyon)
- Firefox (son 2 versiyon)
- Safari (son 2 versiyon)
- Edge (son 2 versiyon)

## 📄 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👥 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📞 İletişim

ADYK - Türk Denizcilik Derneği

Proje Linki: [https://github.com/your-username/adyk-website](https://github.com/your-username/adyk-website)

---

⚓ **ADYK** ile güvenli seyirler!
