import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AIS from './pages/AIS'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ais" element={<AIS />} />
    </Routes>
  )
}

export default App
