'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getTenantApi } from '@/services/tenantApi'
import { BookApiResponseType, Typebook } from '@/types/book'
import Cookies from 'js-cookie'

export default function BookPage() {
  const [books, setBooks] = useState<Typebook[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAndFetchBooks = async () => {
      try {
        setLoading(true)
        setError('')

        // ตรวจสอบ token ทุกแหล่ง
        const tokenFromLocalStorage = localStorage.getItem('tenant_token')
        const tokenFromCookie = Cookies.get('token')
        
        console.log('🔍 Token check:')
        console.log('  - localStorage:', !!tokenFromLocalStorage)
        console.log('  - Cookie:', !!tokenFromCookie)
        
        // ใช้ token ที่มี
        const token = tokenFromLocalStorage || tokenFromCookie

        if (!token) {
          setError('ไม่พบ token การเข้าสู่ระบบ กรุณาเข้าสู่ระบบใหม่')
          setTimeout(() => {
            router.push('/auth/login')
          }, 2000)
          return
        }

        // ถ้ามี token แต่ไม่มีใน localStorage ให้เก็บไว้
        if (!tokenFromLocalStorage && tokenFromCookie) {
          localStorage.setItem('tenant_token', tokenFromCookie)
          console.log('✅ Copied token from cookie to localStorage')
        }

        const tenantApi = getTenantApi()
        console.log('🚀 Calling API with token:', token.substring(0, 20) + '...')

        const res = await tenantApi.get<BookApiResponseType>('/api/book/')
        const resData = res.data

        console.log('📦 API Response:', resData)

        let booksData: Typebook[] = []

        if (Array.isArray(resData)) {
          booksData = resData
        } else if ('data' in resData && Array.isArray(resData.data)) {
          booksData = resData.data
        } else if ('results' in resData && Array.isArray(resData.results)) {
          booksData = resData.results
        } else {
          console.error('Unexpected response format:', resData)
          setError('รูปแบบข้อมูลจาก API ไม่ถูกต้อง')
          return
        }

        console.log('📚 Books loaded:', booksData.length)
        setBooks(booksData)

      } catch (err: any) {
        console.error('❌ Error details:', err)
        
        if (err.response) {
          console.log('Response status:', err.response.status)
          console.log('Response data:', err.response.data)
          
          switch (err.response.status) {
            case 401:
              setError('ไม่มีสิทธิ์เข้าถึง กรุณาเข้าสู่ระบบใหม่')
              // ล้าง token และ redirect
              localStorage.removeItem('tenant_token')
              Cookies.remove('token')
              setTimeout(() => {
                router.push('/auth/login')
              }, 2000)
              break
            case 404:
              setError('ไม่พบ API endpoint นี้ (/api/book/)')
              break
            case 500:
              setError('เกิดข้อผิดพลาดที่เซิร์ฟเวอร์')
              break
            default:
              setError(`เกิดข้อผิดพลาด: ${err.response.status}`)
          }
        } else if (err.request) {
          setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้')
        } else {
          setError(`เกิดข้อผิดพลาด: ${err.message}`)
        }
      } finally {
        setLoading(false)
      }
    }

    // รอสักครู่ให้ localStorage โหลดเสร็จ
    const timeoutId = setTimeout(checkAndFetchBooks, 100)
    
    return () => clearTimeout(timeoutId)
  }, [router])

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2">กำลังโหลดข้อมูล...</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📚 รายการหนังสือ</h1>
        <button 
          onClick={() => {
            localStorage.removeItem('tenant_token')
            Cookies.remove('token')
            router.push('/auth/login')
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          ออกจากระบบ
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {books.length === 0 && !error ? (
        <div className="text-center text-gray-500 py-8">ไม่มีหนังสือในระบบ</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border border-gray-300 text-left">#</th>
                <th className="p-3 border border-gray-300 text-left">ชื่อหนังสือ</th>
                <th className="p-3 border border-gray-300 text-left">ผู้แต่ง</th>
                <th className="p-3 border border-gray-300 text-left">จำนวนคงเหลือ</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="p-3 border border-gray-300">{index + 1}</td>
                  <td className="p-3 border border-gray-300 font-medium">{book.title}</td>
                  <td className="p-3 border border-gray-300">{book.author}</td>
                  <td className="p-3 border border-gray-300">
                    <span className={`px-2 py-1 rounded text-sm ${
                      book.stock > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {book.available_count}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Debug Info */}
      <div className="mt-6 p-4 bg-gray-100 text-sm rounded">
        <p><strong>Debug Info:</strong></p>
        <p>Books count: {books.length}</p>
        <p>API Host: {typeof window !== 'undefined' ? window.location.hostname : 'loading'}</p>
        <p>Has localStorage token: {typeof window !== 'undefined' ? !!localStorage.getItem('tenant_token') : 'loading'}</p>
        <p>Has cookie token: {typeof window !== 'undefined' ? !!Cookies.get('token') : 'loading'}</p>
        <p>Current URL: {typeof window !== 'undefined' ? window.location.href : 'loading'}</p>
      </div>
    </div>
  )
}