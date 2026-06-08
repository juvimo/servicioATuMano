import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing    from './pages/Landing'
import Login      from './pages/Login'
import Dashboard  from './pages/Dashboard'
import Cotizacion from './pages/Cotizacion'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Landing />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/dashboard"   element={<Dashboard />} />
        <Route path="/cotizacion"  element={<Cotizacion />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
