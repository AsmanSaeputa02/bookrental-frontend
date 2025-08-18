///src/app/admin/login/page.tsx


'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { publicApi } from '@/services/publicApi'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

import { AdminLoginResponse } from '@/types/auth'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const { setToken } = useAuth()

  const handleLogin = async () => {
    try {
      const res = await publicApi.post<AdminLoginResponse>('/api/admin/login/', {
        email,
        password,
      })
      setToken(res.data.access) // เก็บ public_token
      router.push('/admin/tenants')
    } catch (err: any) {
      setError('เข้าสู่ระบบไม่สำเร็จ: อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    }
  }

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <h1 className="text-2xl font-bold mb-6">🔐 เข้าสู่ระบบ Superadmin</h1>

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
        className="mt-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleLogin} className="mt-4 w-full">
        เข้าสู่ระบบ
      </Button>
    </div>
  )
}
