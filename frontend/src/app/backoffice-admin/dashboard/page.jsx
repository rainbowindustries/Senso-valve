'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  IconPackage,
  IconMail,
  IconFileTypePdf,
  IconArrowRight,
  IconMailOpened,
  IconClock,
  IconBrandWhatsapp,
  IconPhone,
  IconTrendingUp,
  IconInbox,
} from '@tabler/icons-react'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    inquiries: 0,
    unreadInquiries: 0,
    catalogues: 0,
    todayInquiries: 0,
    bySource: {},
  })
  const [recentInquiries, setRecentInquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const token = localStorage.getItem('adminToken')
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
      const [productsRes, inquiriesRes, cataloguesRes, statsRes] =
        await Promise.all([
          fetch(`${apiUrl}/products`, { headers }),
          fetch(`${apiUrl}/inquiries`, { headers }),
          fetch(`${apiUrl}/catalogues`, { headers }),
          fetch(`${apiUrl}/inquiries/stats`, { headers }),
        ])

      const [products, inquiries, catalogues, inquiryStats] = await Promise.all([
        productsRes.json(),
        inquiriesRes.json(),
        cataloguesRes.json(),
        statsRes.json(),
      ])

      setStats({
        products: products.data?.length || 0,
        inquiries: inquiryStats.data?.total || inquiries.data?.total || 0,
        unreadInquiries: inquiryStats.data?.unread || 0,
        catalogues: catalogues.data?.length || 0,
        todayInquiries: inquiryStats.data?.today || 0,
        bySource: inquiryStats.data?.by_source || {},
      })

      setRecentInquiries(inquiries.data?.inquiries?.slice(0, 5) || [])

    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      label: 'Total products',
      value: stats.products,
      icon: IconPackage,
      color: 'blue',
      href: '/backoffice-admin/products',
    },
    {
      label: 'Total inquiries',
      value: stats.inquiries,
      icon: IconMail,
      color: 'green',
      href: '/backoffice-admin/inquiries',
    },
    {
      label: 'Unread inquiries',
      value: stats.unreadInquiries,
      icon: IconMailOpened,
      color: 'red',
      href: '/backoffice-admin/inquiries',
    },
    {
      label: "Today's inquiries",
      value: stats.todayInquiries,
      icon: IconTrendingUp,
      color: 'amber',
      href: '/backoffice-admin/inquiries',
    },
    {
      label: 'Catalogues',
      value: stats.catalogues,
      icon: IconFileTypePdf,
      color: 'purple',
      href: '/backoffice-admin/catalogues',
    },
  ]

  const colorMap = {
    blue: 'bg-blue-50 text-blue-500 border-blue-100',
    green: 'bg-green-50 text-green-500 border-green-100',
    red: 'bg-red-50 text-red-500 border-red-100',
    purple: 'bg-purple-50 text-purple-500 border-purple-100',
    amber: 'bg-amber-50 text-amber-500 border-amber-100',
  }

  // Source label mapping
  const sourceLabels = {
    contact_form: { label: 'Contact Form', icon: '📋', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    whatsapp: { label: 'WhatsApp', icon: '💬', color: 'bg-green-50 text-green-600 border-green-100' },
    email: { label: 'Email', icon: '✉️', color: 'bg-purple-50 text-purple-600 border-purple-100' },
    phone: { label: 'Phone', icon: '📞', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    product_inquiry: { label: 'Product Page', icon: '🔧', color: 'bg-teal-50 text-teal-600 border-teal-100' },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div>
        <h1 className="text-[24px] font-medium text-slate-900">
          Dashboard
        </h1>
        <p className="text-[13px] text-slate-400 mt-1">
          Welcome back — here&apos;s what&apos;s happening
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${colorMap[card.color]}`}>
                  <Icon size={18} />
                </div>
                <IconArrowRight
                  size={15}
                  className="text-slate-300 group-hover:text-blue-400 transition-colors"
                />
              </div>
              <div className="text-[28px] font-medium text-slate-900 leading-none mb-1">
                {card.value}
              </div>
              <div className="text-[12px] text-slate-400">
                {card.label}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Source breakdown + Quick actions row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Inquiry Sources */}
        <div>
          <h2 className="text-[16px] font-medium text-slate-900 mb-4">
            Inquiry sources
          </h2>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            {Object.keys(stats.bySource).length === 0 ? (
              <div className="text-center py-6">
                <IconInbox size={28} className="text-slate-200 mx-auto mb-2" />
                <p className="text-[13px] text-slate-400">No inquiry data yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {Object.entries(stats.bySource).map(([src, count]) => {
                  const info = sourceLabels[src] || sourceLabels.contact_form
                  const percentage = stats.inquiries > 0 ? Math.round((count / stats.inquiries) * 100) : 0
                  return (
                    <div key={src} className="flex items-center gap-3">
                      <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium border ${info.color} min-w-[110px] text-center`}>
                        {info.icon} {info.label}
                      </span>
                      <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-700"
                          style={{ width: `${Math.max(percentage, 5)}%` }}
                        />
                      </div>
                      <span className="text-[12px] font-medium text-slate-600 min-w-[50px] text-right">
                        {count} ({percentage}%)
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-[16px] font-medium text-slate-900 mb-4">
            Quick actions
          </h2>
          <div className="flex flex-col gap-3">
            <Link
              href="/backoffice-admin/products/create"
              className="flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white px-5 py-3.5 rounded-xl transition-colors"
            >
              <IconPackage size={18} />
              <div>
                <div className="text-[13px] font-medium">Add new product</div>
                <div className="text-[11px] text-blue-200">Create product listing</div>
              </div>
            </Link>
            <Link
              href="/backoffice-admin/inquiries"
              className="flex items-center gap-3 bg-white border border-slate-200 hover:border-blue-300 text-slate-700 px-5 py-3.5 rounded-xl transition-colors"
            >
              <IconMail size={18} className="text-blue-500" />
              <div>
                <div className="text-[13px] font-medium">View inquiries</div>
                <div className="text-[11px] text-slate-400">
                  {stats.unreadInquiries} unread
                </div>
              </div>
            </Link>
            <Link
              href="/backoffice-admin/catalogues"
              className="flex items-center gap-3 bg-white border border-slate-200 hover:border-blue-300 text-slate-700 px-5 py-3.5 rounded-xl transition-colors"
            >
              <IconFileTypePdf size={18} className="text-red-400" />
              <div>
                <div className="text-[13px] font-medium">Upload catalogue</div>
                <div className="text-[11px] text-slate-400">Add PDF datasheet</div>
              </div>
            </Link>
          </div>
        </div>

      </div>

      {/* Recent inquiries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-medium text-slate-900">
            Recent inquiries
          </h2>
          <Link
            href="/backoffice-admin/inquiries"
            className="text-[12px] text-blue-500 hover:text-blue-600 flex items-center gap-1"
          >
            View all <IconArrowRight size={12} />
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {recentInquiries.length === 0 ? (
            <div className="text-center py-12">
              <IconMail size={32} className="text-slate-200 mx-auto mb-3" />
              <p className="text-[13px] text-slate-400">No inquiries yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-[11px] text-slate-400 uppercase tracking-wider font-medium">Name</th>
                  <th className="text-left px-5 py-3 text-[11px] text-slate-400 uppercase tracking-wider font-medium">Email</th>
                  <th className="text-left px-5 py-3 text-[11px] text-slate-400 uppercase tracking-wider font-medium hidden md:table-cell">Source</th>
                  <th className="text-left px-5 py-3 text-[11px] text-slate-400 uppercase tracking-wider font-medium">Status</th>
                  <th className="text-left px-5 py-3 text-[11px] text-slate-400 uppercase tracking-wider font-medium hidden sm:table-cell">Date</th>
                  <th className="text-left px-5 py-3 text-[11px] text-slate-400 uppercase tracking-wider font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentInquiries.map((inq) => {
                  const srcInfo = sourceLabels[inq.source] || sourceLabels.contact_form
                  return (
                    <tr
                      key={inq.id}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          {!inq.is_read && (
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                          <span className="text-[13px] font-medium text-slate-900">
                            {inq.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-slate-500">
                        {inq.email}
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${srcInfo.color}`}>
                          {srcInfo.icon} {srcInfo.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${
                          inq.is_read
                            ? 'bg-slate-100 text-slate-500'
                            : 'bg-blue-50 text-blue-600 border border-blue-100'
                        }`}>
                          {inq.is_read ? 'Read' : 'Unread'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[12px] text-slate-400 hidden sm:table-cell">
                        <div className="flex items-center gap-1">
                          <IconClock size={12} />
                          {new Date(inq.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`mailto:${inq.email}?subject=Re: Your inquiry to Vertex Valve`}
                            className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-200 flex items-center justify-center transition-colors"
                            title="Reply via Email"
                          >
                            <IconMail size={13} className="text-blue-500" />
                          </a>
                          {inq.phone && (
                            <>
                              <a
                                href={`https://wa.me/${inq.phone.replace(/\D/g, '')}?text=Hello ${inq.name}, thank you for contacting Vertex Valve. We received your inquiry and will assist you shortly.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-green-50 hover:border-green-200 flex items-center justify-center transition-colors"
                                title="Reply via WhatsApp"
                              >
                                <IconBrandWhatsapp size={13} className="text-green-500" />
                              </a>
                              <a
                                href={`tel:${inq.phone}`}
                                className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-amber-50 hover:border-amber-200 flex items-center justify-center transition-colors"
                                title="Call"
                              >
                                <IconPhone size={13} className="text-amber-500" />
                              </a>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  )
}