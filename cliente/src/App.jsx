import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing       from './pages/Landing'
import Login         from './pages/Login'
import Dashboard     from './pages/Dashboard'
import Cotizacion    from './pages/Cotizacion'
import Nosotros      from './pages/Nosotros'
import FAQ           from './pages/FAQ'
import Register      from './pages/Register'
import Servicios     from './pages/Servicios'
import ServicioDetalle from './pages/ServicioDetalle'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                  element={<Landing />} />
        <Route path="/login"             element={<Login />} />
        <Route path="/dashboard"         element={<Dashboard />} />
        <Route path="/cotizacion"        element={<Cotizacion />} />
        <Route path="/nosotros"          element={<Nosotros />} />
        <Route path="/faq"               element={<FAQ />} />
        <Route path="/register"          element={<Register />} />
        <Route path="/servicios"         element={<Servicios />} />
        <Route path="/servicios/:slug"   element={<ServicioDetalle />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App