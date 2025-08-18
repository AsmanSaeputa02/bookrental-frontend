/// src/contexts/AuthContext.tsx


'use client'

import { createContext, useContext, useState, useEffect } from 'react'

// กำหนด schema ประเภท
type SchemaType = 'public' | 'tenant'

type AuthContextType = {
  token: string | null
  schemaType: SchemaType
  setToken: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  schemaType: 'tenant',
  setToken: () => {},
  logout: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // ตรวจ schema จาก hostname
  const hostname = typeof window !== 'undefined' ? window.location.hostname : ''
  const schemaType: SchemaType = hostname === 'localhost' ? 'public' : 'tenant'

  const storageKey = schemaType === 'public' ? 'public_token' : 'tenant_token'

  const [token, setTokenState] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null
  )

  const setToken = (newToken: string) => {
    localStorage.setItem(storageKey, newToken)
    setTokenState(newToken)
  }

  const logout = () => {
    localStorage.removeItem(storageKey)
    setTokenState(null)
    window.location.href = schemaType === 'public' ? '/admin/login' : '/auth/login'
  }

  return (
    <AuthContext.Provider value={{ token, schemaType, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
