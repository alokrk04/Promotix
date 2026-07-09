import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api, setOnUnauthorized } from './client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setAdmin(null)
  }, [])

  useEffect(() => {
    setOnUnauthorized(logout)
  }, [logout])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.verifyToken()
        .then((d) => setAdmin(d))
        .catch(() => {
          localStorage.removeItem('token')
          setAdmin(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    const data = await api.login(username, password)
    localStorage.setItem('token', data.access_token)
    const info = await api.verifyToken()
    setAdmin(info)
    return info
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
