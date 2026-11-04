
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import App from './App.jsx'
import BuyerPage from './pages/BuyerPage.jsx'
import './index.css'
import FarmerPage from './pages/FarmerPage.jsx'

function FarmerPlaceholder() {
  return (
    <main style={{ padding: '60px 6%', background: '#f7f5ee', minHeight: '100vh', color: '#183823' }}>
      <a href="/" style={{ color: '#214a32' }}>← Back to home</a>
      <h1>Farmer Portal</h1>
      <p>Your farmer dashboard is coming next.</p>
    </main>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/buyer" element={<BuyerPage />} />
        <Route path="/farmer" element={<FarmerPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
