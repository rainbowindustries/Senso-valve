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
} from '@tabler/icons-react'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    inquiries: 0,
    unreadInquiries: 0,
    catalogues: 0,
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
      const [productsRes, inquiriesRes, cataloguesRes, unreadRes] =
        await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/inquiries`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/catalogues`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/inquiries/unread-count`, { headers }),
        ])

      const [products, inquiries, catalogues, unread] = await Promise.all([
        productsRes.json(),
        inquiriesRes.json(),
        cataloguesRes.json(),
        unreadRes.json(),
      ])

      setStats({
        products: products.data?.length || 0,
        inquiries: inquiries.data?.total || 0,
        unreadInquiries: unread.data?.unread || 0,
        catalogues: catalogues.data?.length || 0,
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
      href: '/admin/products',
    },
    {
      label: 'Total inquiries',
      value: stats.inquiries,
      icon: IconMail,
      color: 'green',
      href: '/admin/inquiries',
    },
    {
      label: 'Unread inquiries',
      value: stats.unreadInquiries,
      icon: IconMailOpened,
      color: 'red',
      href: '/admin/inquiries',
    },
    {
      label: 'Catalogues',
      value: stats.catalogues,
      icon: IconFileTypePdf,
      color: 'purple',
      href: '/admin/catalogues',
    },
  ]

  const colorMap = {
    blue: 'bg-blue-50 text-blue-500 border-blue-100',
    green: 'bg-green-50 text-green-500 border-green-100',
    red: 'bg-red-50 text-red-500 border-red-100',
    purple: 'bg-purple-50 text-purple-500 border-purple-100',
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
          Welcome back — here's what's happening
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Quick actions */}
      <div>
        <h2 className="text-[16px] font-medium text-slate-900 mb-4">
          Quick actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/admin/products/create"
            className="flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white px-5 py-3.5 rounded-xl transition-colors"
          >
            <IconPackage size={18} />
            <div>
              <div className="text-[13px] font-medium">Add new product</div>
              <div className="text-[11px] text-blue-200">Create product listing</div>
            </div>
          </Link>
          <Link
            href="/admin/inquiries"
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
            href="/admin/catalogues"
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

      {/* Recent inquiries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-medium text-slate-900">
            Recent inquiries
          </h2>
          <Link
            href="/admin/inquiries"
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
                  <th className="text-left px-5 py-3 text-[11px] text-slate-400 uppercase tracking-wider font-medium">Company</th>
                  <th className="text-left px-5 py-3 text-[11px] text-slate-400 uppercase tracking-wider font-medium">Status</th>
                  <th className="text-left px-5 py-3 text-[11px] text-slate-400 uppercase tracking-wider font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentInquiries.map((inq) => (
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
                    <td className="px-5 py-3.5 text-[13px] text-slate-500">
                      {inq.company || '—'}
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
                    <td className="px-5 py-3.5 text-[12px] text-slate-400 flex items-center gap-1">
                      <IconClock size={12} />
                      {new Date(inq.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  )
}