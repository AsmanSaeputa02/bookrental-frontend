'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { getTenantApi } from '@/services/tenantApi'
import { AdminLoginResponse } from '@/types/auth'
import Cookies from 'js-cookie'

export default function TenantLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const { setToken } = useAuth()

  const handleLogin = async () => {
  try {
    const tenantApi = getTenantApi()
    const res = await tenantApi.post<AdminLoginResponse>('/api/auth/login/', {
      email,
      password,
    })

    // ✅ Save to AuthContext (localStorage)
    setToken(res.data.access)

    // ✅ Also save to cookie for middleware to access
    Cookies.set('token', res.data.access, {
      expires: 1, // 1 วัน
      secure: process.env.NODE_ENV === 'production', // 👈 ใช้ secure เฉพาะใน production
      sameSite: 'lax',
    })

    window.location.href = '/book' 
  } catch (err: any) {
    setError('เข้าสู่ระบบไม่สำเร็จ: กรุณาตรวจสอบอีเมลหรือรหัสผ่าน')
  }
}

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <h1 className="text-2xl font-bold mb-6">📚 เข้าสู่ระบบสาขา (Tenant)</h1>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <Input
        type="email"
        placeholder="อีเมล"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="รหัสผ่าน"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-2"
      />
      <Button className="mt-4 w-full" onClick={handleLogin}>
        เข้าสู่ระบบ
      </Button>
    </div>
  )
}
