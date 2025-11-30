import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AIS from './pages/AIS'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfUse from './pages/TermsOfUse'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ais" element={<AIS />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfUse />} />
    </Routes>
  )
}

export default App
