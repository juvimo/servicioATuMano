import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Landing         from './pages/Landing'
import Login           from './pages/Login'
import Dashboard       from './pages/Dashboard'
import Cotizacion      from './pages/Cotizacion'
import Nosotros        from './pages/Nosotros'
import FAQ             from './pages/FAQ'
import Servicios       from './pages/Servicios'
import ServicioDetalle from './pages/ServicioDetalle'
import Registro           from './pages/Registro'
import VerificacionCodigo from './pages/VerificacionCodigo'
import Chatbot         from './components/Chatbot'
import WhatsAppButton  from './components/WhatsAppButton'
import ScrollToTop from './components/ScrollToTop'

const HIDDEN_FLOATING_ROUTES = ['/login', '/registro', '/verificar-codigo', '/dashboard']

function AppContent() {
  const { pathname } = useLocation()
  const showFloating = !HIDDEN_FLOATING_ROUTES.some(r => pathname.startsWith(r))

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/"                  element={<Landing />} />
        <Route path="/login"             element={<Login />} />
        <Route path="/registro"          element={<Registro />} />
        <Route path="/verificar-codigo"  element={<VerificacionCodigo />} />
        <Route path="/dashboard"         element={<Dashboard />} />
        <Route path="/cotizacion"        element={<Cotizacion />} />
        <Route path="/nosotros"          element={<Nosotros />} />
        <Route path="/faq"               element={<FAQ />} />
        <Route path="/servicios"         element={<Servicios />} />
        <Route path="/servicios/:slug"   element={<ServicioDetalle />} />
      </Routes>
      {showFloating && <Chatbot />}
      {showFloating && <WhatsAppButton />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
