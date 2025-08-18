import axios from 'axios'

export const getTenantApi = () => {
  if (typeof window === 'undefined') {
    // ถ้ารันบน server → ส่ง dummy baseURL ไปก่อน (เช่นตอน SSR)
    return axios.create({ baseURL: '' })
  }

  const instance = axios.create({
    baseURL: `http://${window.location.hostname}:8003`,
  })

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('tenant_token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })


  instance.interceptors.response.use(
    res => res,
    err => {
      if (err.response?.status === 401) {
        localStorage.removeItem('tenant_token')
        window.location.href = '/auth/login'
      }
      return Promise.reject(err)
    }
  )

  return instance
}
