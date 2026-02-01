import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AIS from './pages/AIS'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfUse from './pages/TermsOfUse'
import Login from './pages/Login'
import Subscription from './pages/Subscription'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFail from './pages/PaymentFail'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/ais" element={<ProtectedRoute><AIS /></ProtectedRoute>} />
      <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/fail" element={<PaymentFail />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfUse />} />
    </Routes>
  )
}

export default App
