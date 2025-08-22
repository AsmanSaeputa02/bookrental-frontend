///src/app/layout.tsx

import AppLayout from '@/components/layout/AppLayout'
import '@/styles/globals.css'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book Rental SaaS',
  description: 'ระบบเช่าหนังสือแบบหลายสาขา',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  )
}
