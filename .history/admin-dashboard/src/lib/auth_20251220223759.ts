import api from './api'

export const authService = {
  async login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password })
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', data.accessToken)
    }
    return data.user
  },

  async logout() {
    try {
      await api.post('/auth/logout')
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
      }
    }
  },

  async getCurrentUser() {
    const { data, status } = await api.get('/auth/me', {
      headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      params: { ts: Date.now() },
    })
    // Chấp nhận cả 2 dạng payload
    return (data as any)?.user ?? (data as any)
  },

  getAccessToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken')
    }
    return null
  },
}
