const BACKEND_URL = 'https://promotix-cpuq.onrender.com'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/resources/')) {
      const backendUrl = new URL(url.pathname + url.search, BACKEND_URL)
      const headers = new Headers(request.headers)
      headers.set('Host', backendUrl.host)
      const response = await fetch(backendUrl, {
        method: request.method,
        headers,
        body: request.body,
      })
      return response
    }

    if (url.pathname === '/login') {
      return env.ASSETS.fetch(new Request(new URL('/login.html', url)))
    }

    return env.ASSETS.fetch(request)
  },
}
