import { useState } from 'react'
import { useAuth } from '../lib/auth'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(username, password)
    } catch {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl p-12 w-full max-w-sm shadow-2xl text-center">
        <h1 className="text-2xl font-extrabold mb-1 gt">Promotix Admin</h1>
        <p className="text-slate text-sm mb-8">Sign in to manage website content</p>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full px-4 py-3 border border-slate-200 rounded-lg mb-4 outline-none focus:border-violet text-sm"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
          <input
            className="w-full px-4 py-3 border border-slate-200 rounded-lg mb-4 outline-none focus:border-violet text-sm"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-violet to-indigo-600 text-white rounded-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet/40"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
