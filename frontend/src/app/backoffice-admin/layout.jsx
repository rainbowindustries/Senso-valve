'use client'
import { useState, useEffect, useCallback } from 'react'
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
  IconPhoto,
  IconBell,
  IconBrandWhatsapp,
} from '@tabler/icons-react'

const menuItems = [
  {
    label: 'Dashboard',
    href: '/backoffice-admin/dashboard',
    icon: IconLayoutDashboard,
  },
  {
    label: 'Products',
    href: '/backoffice-admin/products',
    icon: IconPackage,
  },
  {
    label: 'Inquiries',
    href: '/backoffice-admin/inquiries',
    icon: IconMail,
    badgeKey: 'unread',
  },
  {
    label: 'Catalogues',
    href: '/backoffice-admin/catalogues',
    icon: IconFileTypePdf,
  },
  {
    label: 'Certificates',
    href: '/backoffice-admin/certificates',
    icon: IconAward,
  },
  {
    label: 'Gallery',
    href: '/backoffice-admin/gallery',
    icon: IconPhoto,
  },
]

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifDropdown, setShowNotifDropdown] = useState(false)
  const [recentUnread, setRecentUnread] = useState([])

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken')
    if (!token && pathname !== '/backoffice-admin/login') {
      router.push('/backoffice-admin/login')
    }
  }, [pathname])

  // Fetch unread count periodically
  const fetchUnreadCount = useCallback(async () => {
    const token = localStorage.getItem('adminToken')
    if (!token) return

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
      const res = await fetch(`${apiUrl}/inquiries/unread-count`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setUnreadCount(data.data?.unread || 0)
      }
    } catch { }
  }, [])

  // Fetch recent unread inquiries for notification dropdown
  const fetchRecentUnread = useCallback(async () => {
    const token = localStorage.getItem('adminToken')
    if (!token) return

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
      const res = await fetch(`${apiUrl}/inquiries?is_read=false&limit=5`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setRecentUnread(data.data?.inquiries || [])
      }
    } catch { }
  }, [])

  useEffect(() => {
    if (pathname !== '/backoffice-admin/login') {
      fetchUnreadCount()
      fetchRecentUnread()

      // Poll every 30 seconds for new inquiries
      const interval = setInterval(() => {
        fetchUnreadCount()
        fetchRecentUnread()
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [pathname, fetchUnreadCount, fetchRecentUnread])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/backoffice-admin/login')
  }

  // Source icon/label helpers
  const sourceIcons = {
    contact_form: '📋',
    whatsapp: '💬',
    email: '✉️',
    phone: '📞',
    product_inquiry: '🔧',
  }

  // Don't show sidebar on login page
  if (pathname === '/backoffice-admin/login') {
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
              Vertex Valve
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
            const badgeCount = item.badgeKey === 'unread' ? unreadCount : 0

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all relative ${
                  isActive
                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={17} />
                {item.label}
                {badgeCount > 0 && (
                  <span className="ml-auto min-w-[20px] h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1.5 animate-pulse">
                    {badgeCount > 99 ? '99+' : badgeCount}
                  </span>
                )}
                {isActive && badgeCount === 0 && (
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

          {/* Right side — notification bell + admin info */}
          <div className="flex items-center gap-4">

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifDropdown(!showNotifDropdown)
                  if (!showNotifDropdown) fetchRecentUnread()
                }}
                className="relative w-9 h-9 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors"
              >
                <IconBell size={17} className="text-slate-500" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse shadow-sm">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {showNotifDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifDropdown(false)}
                  />
                  <div className="absolute right-0 top-11 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                    {/* Dropdown header */}
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                      <div className="text-[13px] font-semibold text-slate-900">
                        Notifications
                      </div>
                      {unreadCount > 0 && (
                        <span className="text-[11px] bg-red-50 text-red-500 font-medium px-2 py-0.5 rounded-full border border-red-100">
                          {unreadCount} new
                        </span>
                      )}
                    </div>

                    {/* Recent unread */}
                    <div className="max-h-[320px] overflow-y-auto">
                      {recentUnread.length === 0 ? (
                        <div className="py-10 text-center">
                          <IconMail size={28} className="text-slate-200 mx-auto mb-2" />
                          <p className="text-[12px] text-slate-400">No new inquiries</p>
                        </div>
                      ) : (
                        recentUnread.map((inq) => (
                          <Link
                            key={inq.id}
                            href="/backoffice-admin/inquiries"
                            onClick={() => setShowNotifDropdown(false)}
                            className="flex items-start gap-3 px-4 py-3 hover:bg-blue-50/50 transition-colors border-b border-slate-50 last:border-b-0"
                          >
                            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-[12px] font-semibold text-blue-500">
                                {inq.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[13px] font-medium text-slate-900 truncate">
                                  {inq.name}
                                </span>
                                <span className="text-[10px] text-slate-400 flex-shrink-0">
                                  {sourceIcons[inq.source] || '📋'}
                                </span>
                              </div>
                              <p className="text-[12px] text-slate-400 truncate mt-0.5">
                                {inq.message}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-slate-300">
                                  {new Date(inq.created_at).toLocaleDateString('en-IN', {
                                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                  })}
                                </span>
                                {inq.phone && (
                                  <a
                                    href={`https://wa.me/${inq.phone.replace(/\D/g, '')}?text=Hello ${inq.name}, thank you for contacting Vertex Valve.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-[10px] text-green-500 hover:text-green-600 font-medium flex items-center gap-0.5"
                                  >
                                    <IconBrandWhatsapp size={10} />
                                    Reply
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                          </Link>
                        ))
                      )}
                    </div>

                    {/* Dropdown footer */}
                    <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50">
                      <Link
                        href="/backoffice-admin/inquiries"
                        onClick={() => setShowNotifDropdown(false)}
                        className="text-[12px] text-blue-500 hover:text-blue-600 font-medium"
                      >
                        View all inquiries →
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="text-[12px] text-slate-400 hidden sm:block">
              tempjkjd@gmail.com
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-x-hidden min-w-0">
          {children}
        </main>

      </div>
    </div>
  )
}