const BACKEND_URL = 'https://promotix-cpuq.onrender.com'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/resources/')) {
      const backendUrl = new URL(url.pathname + url.search, BACKEND_URL)
      const response = await fetch(backendUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      })
      return response
    }

    return env.ASSETS.fetch(request)
  },
}
