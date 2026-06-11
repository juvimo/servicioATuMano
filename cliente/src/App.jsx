import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing    from './pages/Landing'
import Login      from './pages/Login'
import Dashboard  from './pages/Dashboard'
import Cotizacion from './pages/Cotizacion'
import Registro   from './pages/Registro'          // ← nueva línea

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Landing />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/registro"    element={<Registro />} />  {/* ← nueva línea */}
        <Route path="/dashboard"   element={<Dashboard />} />
        <Route path="/cotizacion"  element={<Cotizacion />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
