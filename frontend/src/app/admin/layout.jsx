'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  IconSettings2,
  IconLayoutDashboard,
  IconPackage,
  IconMail,
  IconFileTypePdf,
  IconLogout,
  IconMenu2,
  IconX,
  IconChevronRight,
  IconAward,
} from '@tabler/icons-react'

const menuItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: IconLayoutDashboard,
  },
  {
    label: 'Products',
    href: '/admin/products',
    icon: IconPackage,
  },
  {
    label: 'Inquiries',
    href: '/admin/inquiries',
    icon: IconMail,
  },
  {
    label: 'Catalogues',
    href: '/admin/catalogues',
    icon: IconFileTypePdf,
  },
  {
    label: 'Certificates',
    href: '/admin/certificates',
    icon: IconAward,
  },
]

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [admin, setAdmin] = useState(null)

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken')
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
          <div className="w-8 h-8 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
            <IconSettings2 size={16} color="#60a5fa" />
          </div>
          <div>
            <div className="text-[14px] font-medium text-white">
              Hammer Valve
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wide">
              Admin panel
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href ||
              pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                  isActive
                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={17} />
                {item.label}
                {isActive && (
                  <IconChevronRight size={13} className="ml-auto" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/5">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-slate-400 hover:text-white hover:bg-white/5 transition-all mb-1"
          >
            <IconSettings2 size={17} />
            View website
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <IconLogout size={17} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-slate-600"
          >
            {sidebarOpen ? <IconX size={22} /> : <IconMenu2 size={22} />}
          </button>
          <div className="text-[14px] font-medium text-slate-900">
            {menuItems.find(m => pathname.startsWith(m.href))?.label || 'Admin'}
          </div>
          <div className="text-[12px] text-slate-400">
            admin@hammervalve.com
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>

      </div>
    </div>
  )
}