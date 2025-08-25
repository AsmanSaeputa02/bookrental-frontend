// src/app/auth/login/page.tsx
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
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { setToken } = useAuth()

  const handleLogin = async () => {
    if (!email || !password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      const tenantApi = getTenantApi()
      const res = await tenantApi.post<AdminLoginResponse>('/api/auth/login/', {
        email,
        password,
      })

      console.log('Login success:', res.data)

      // 1. บันทึกใน localStorage ผ่าน AuthContext
      setToken(res.data.access)

      // 2. บันทึกใน localStorage ตรงๆ (เผื่อ AuthContext ไม่ทำงาน)
      localStorage.setItem('tenant_token', res.data.access)

      // 3. บันทึกใน cookie สำหรับ middleware
      Cookies.set('token', res.data.access, {
        expires: 1, // 1 วัน
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/' // เพิ่มนี้เพื่อให้ accessible ทุกหน้า
      })

      console.log('Token saved to localStorage and cookies')

      // รอสักครู่ก่อน redirect เพื่อให้แน่ใจว่า token ถูกบันทึก
      setTimeout(() => {
        router.push('/book')
        // หรือใช้ window.location.href = '/book'
      }, 100)

    } catch (err: any) {
      console.error('Login error:', err)
      setError('เข้าสู่ระบบไม่สำเร็จ: กรุณาตรวจสอบอีเมลหรือรหัสผ่าน')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <h1 className="text-2xl font-bold mb-6">📚 เข้าสู่ระบบสาขา (Tenant)</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <Input
          type="email"
          placeholder="อีเมล"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <Input
          type="password"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <Button 
          className="w-full" 
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </Button>
      </div>

      {/* Debug info */}
      <div className="mt-6 p-3 bg-gray-100 text-sm rounded">
        <p><strong>Debug:</strong></p>
        <p>Email: {email}</p>
        <p>Password: {'*'.repeat(password.length)}</p>
      </div>
    </div>
  )
}