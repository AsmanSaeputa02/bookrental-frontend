"use client"


import { useState, useEffect } from 'react'
import { DashboardData, DashboardApiResponseType } from '@/types/dashbord'
import { getTenantApi } from '@/services/tenantApi'
// import { getTenantApi } from '@/utils/api' // Assuming this is where getTenantApi comes from

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData[] | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError('') // Clear previous errors
        
        const token = localStorage.getItem('tenant_token')
        if (!token) {
          setError('ไม่พบ token กรุณาเข้าสู่ระบบใหม่')
          return
        }

        const tenantApi = getTenantApi()
        const res = await tenantApi.get<DashboardApiResponseType>('/api/dashboard/')
        const resData = res.data
        console.log('📦 API Response:', resData)
        
        // Extract the actual data array from different response structures
        let dashboardData: DashboardData[] = []
        
        if (Array.isArray(resData)) {
          // Case: DashboardData[]
          dashboardData = resData
        } else if ('data' in resData) {
          // Case: DashbordApiResponse
          dashboardData = resData.data
        } else if ('results' in resData) {
          // Case: DashboarListResponse
          dashboardData = resData.results
        }
        
        setData(dashboardData)
      } catch (err: any) {
        console.error('Dashboard API Error:', err)
        setError('เกิดข้อผิดพลาดขณะดึงข้อมูล: ' + (err.message || 'Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">เกิดข้อผิดพลาด</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
            >
              รีเฟรชหน้า
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Main dashboard content
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add your dashboard components here based on the data structure */}
          {data.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">รายการที่ {index + 1}</h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(item, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          ไม่พบข้อมูลในระบบ
        </div>
      )}
    </div>
  )
}