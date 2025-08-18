/// src/services/tenantApi.ts 

import axios from 'axios'

// สำหรับ tenant schema → ใช้ hostname เป็น base
export const tenantApi = axios.create({
  baseURL: `http://${window.location.hostname}:8003`,
})

tenantApi.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('tenant_token') : null
  if (token){
    config.headers ={
        ...config.headers,
        Authorization: `Bearer ${token}`
    }
  }
  return config
})

tenantApi.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('tenant_token')
      window.location.href = '/auth/login'
    }
    return Promise.reject(err)
  }
)
