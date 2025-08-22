///  src/services/publicApi.ts

import axios from 'axios'

// สำหรับ public schema → ใช้กับ localhost เท่านั้น
export const publicApi = axios.create({
    baseURL: 'http://localhost/book_project',
})

// แนบ Authorization header ทุกครั้ง
publicApi.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('public_token') : null
  if (token) {
    config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
    }
  }
  return config
})

// ตรวจสอบ token หมดอายุ
publicApi.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('public_token')
      window.location.href = '/admin/login'
    }
    return Promise.reject(err)
  }
)
