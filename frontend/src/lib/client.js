const API_BASE = '/api'

async function request(path, options = {}) {
  const token = localStorage.getItem('token')
  const headers = { ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const text = await res.text()
    let detail
    try { detail = JSON.parse(text) } catch {}
    throw new Error(detail?.detail || detail?.error || 'Request failed')
  }
  const data = await res.json()
  return data
}

export const api = {
  // Public
  getWebsite: () => request('/public/website'),
  submitContact: (body) => request('/contact', { method: 'POST', body: JSON.stringify(body) }),

  // Auth
  login: (username, password) => request('/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  checkAuth: () => request('/check-auth'),

  // Admin: Sections
  getSections: () => request('/admin/sections'),
  updateSection: (id, body) => request(`/admin/sections/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  // Admin: Services
  getServices: () => request('/admin/services'),
  createService: (body) => request('/admin/services', { method: 'POST', body: JSON.stringify(body) }),
  updateService: (id, body) => request(`/admin/services/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteService: (id) => request(`/admin/services/${id}`, { method: 'DELETE' }),

  // Admin: Portfolio
  getPortfolio: () => request('/admin/portfolio'),
  createPortfolio: (body) => request('/admin/portfolio', { method: 'POST', body: JSON.stringify(body) }),
  updatePortfolio: (id, body) => request(`/admin/portfolio/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletePortfolio: (id) => request(`/admin/portfolio/${id}`, { method: 'DELETE' }),

  // Admin: Testimonials
  getTestimonials: () => request('/admin/testimonials'),
  createTestimonial: (body) => request('/admin/testimonials', { method: 'POST', body: JSON.stringify(body) }),
  updateTestimonial: (id, body) => request(`/admin/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteTestimonial: (id) => request(`/admin/testimonials/${id}`, { method: 'DELETE' }),

  // Admin: Messages
  getMessages: () => request('/admin/messages'),
  markRead: (id) => request(`/admin/messages/${id}/read`, { method: 'POST' }),
  deleteMessage: (id) => request(`/admin/messages/${id}`, { method: 'DELETE' }),
}
