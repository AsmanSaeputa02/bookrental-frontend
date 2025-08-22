'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Books', href: '/book' },
  { label: 'Rentals', href: '/rental' },
  { label: 'Customers', href: '/customers' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white shadow-md h-full">
      <div className="p-6 font-bold text-xl border-b">SaaS Rental Book</div>
      <nav className="mt-4 space-y-1 px-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-3 py-2 rounded ${
              pathname.startsWith(link.href) ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-4 border-t">
        <button className="text-sm text-gray-600">🔒 Log out</button>
      </div>
    </aside>
  )
}
