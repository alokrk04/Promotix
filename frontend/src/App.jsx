import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import Home from './app/page'
import Dashboard from './admin/Dashboard'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Dashboard />} />
      </Routes>
    </AuthProvider>
  )
}
