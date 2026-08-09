'use client'
import { useState, useEffect } from 'react'
import {
  IconMail,
  IconMailOpened,
  IconTrash,
  IconPhone,
  IconBuilding,
  IconClock,
  IconFilter,
  IconSquare,
  IconSquareCheck,
  IconSquareCheckFilled,
  IconArrowLeft,
} from '@tabler/icons-react'

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [checked, setChecked] = useState([])
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false)

  useEffect(() => {
    fetchInquiries()
  }, [filter])

  const fetchInquiries = async () => {
    const token = localStorage.getItem('adminToken')
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/inquiries`
      if (filter === 'unread') url += '?is_read=false'
      if (filter === 'read') url += '?is_read=true'

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setInquiries(data.data?.inquiries || [])
      setChecked([])
    } catch (error) {
      console.error('Failed to fetch inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inquiries/${id}/read`,
        {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )
      const data = await res.json()
      if (data.success) {
        setInquiries(prev =>
          prev.map(inq => inq.id === id ? { ...inq, is_read: true } : inq)
        )
        if (selected?.id === id) {
          setSelected({ ...selected, is_read: true })
        }
      }
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const deleteInquiry = async (id) => {
    if (!confirm('Delete this inquiry?')) return
    setDeleting(id)
    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inquiries/${id}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )
      const data = await res.json()
      if (data.success) {
        setInquiries(prev => prev.filter(inq => inq.id !== id))
        setChecked(prev => prev.filter(c => c !== id))
        if (selected?.id === id) {
          setSelected(null)
          setMobileDetailOpen(false)
        }
      }
    } catch (error) {
      console.error('Failed to delete:', error)
    } finally {
      setDeleting(null)
    }
  }

  const bulkDelete = async () => {
    if (checked.length === 0) return
    if (!confirm(`Delete ${checked.length} selected inquiries?`)) return

    setBulkDeleting(true)
    const token = localStorage.getItem('adminToken')

    try {
      await Promise.all(
        checked.map(id =>
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/inquiries/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          })
        )
      )
      setInquiries(prev => prev.filter(inq => !checked.includes(inq.id)))
      if (checked.includes(selected?.id)) {
        setSelected(null)
        setMobileDetailOpen(false)
      }
      setChecked([])
    } catch (error) {
      console.error('Bulk delete failed:', error)
    } finally {
      setBulkDeleting(false)
    }
  }

  const toggleCheck = (id) => {
    setChecked(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (checked.length === inquiries.length) {
      setChecked([])
    } else {
      setChecked(inquiries.map(inq => inq.id))
    }
  }

  const isAllSelected = inquiries.length > 0 &&
    checked.length === inquiries.length

  const isPartialSelected = checked.length > 0 &&
    checked.length < inquiries.length

  const openInquiry = async (inquiry) => {
    setSelected(inquiry)
    setMobileDetailOpen(true)
    if (!inquiry.is_read) {
      await markAsRead(inquiry.id)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 w-full min-w-0">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[22px] sm:text-[24px] font-medium text-slate-900">
            Inquiries
          </h1>
          <p className="text-[12px] sm:text-[13px] text-slate-400 mt-1">
            {inquiries.length} total
            {checked.length > 0 && (
              <span className="ml-2 text-blue-500 font-medium">
                · {checked.length} selected
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {checked.length > 0 && (
            <button
              onClick={bulkDelete}
              disabled={bulkDeleting}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-[12px] font-medium px-3 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              {bulkDeleting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="hidden sm:inline">Deleting {checked.length}...</span>
                  <span className="sm:hidden">{checked.length}...</span>
                </>
              ) : (
                <>
                  <IconTrash size={14} />
                  <span className="hidden sm:inline">Delete {checked.length} selected</span>
                  <span className="sm:hidden">Delete ({checked.length})</span>
                </>
              )}
            </button>
          )}

          <div className="flex items-center gap-1.5">
            <IconFilter size={13} className="text-slate-400 hidden sm:block" />
            {['all', 'unread', 'read'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[11px] sm:text-[12px] px-2.5 sm:px-3 py-1.5 rounded-lg capitalize transition-colors whitespace-nowrap ${
                  filter === f
                    ? 'bg-[#1e3a5f] text-white'
                    : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full min-w-0">

        {/* Inquiries list — hidden on mobile when detail open */}
        <div
          className={`lg:col-span-1 flex flex-col gap-2 min-w-0 ${
            mobileDetailOpen ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {inquiries.length > 0 && (
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 min-w-0">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2 text-[12px] text-slate-600 hover:text-slate-900 transition-colors min-w-0"
              >
                {isAllSelected ? (
                  <IconSquareCheckFilled size={16} className="text-blue-500 flex-shrink-0" />
                ) : isPartialSelected ? (
                  <IconSquareCheck size={16} className="text-blue-400 flex-shrink-0" />
                ) : (
                  <IconSquare size={16} className="text-slate-300 flex-shrink-0" />
                )}
                <span className="truncate">{isAllSelected ? 'Deselect all' : 'Select all'}</span>
              </button>
              {checked.length > 0 && (
                <span className="text-[11px] text-slate-400 ml-auto flex-shrink-0">
                  {checked.length}/{inquiries.length}
                </span>
              )}
            </div>
          )}

          {inquiries.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
              <IconMail size={32} className="text-slate-200 mx-auto mb-3" />
              <p className="text-[13px] text-slate-400">
                No inquiries found
              </p>
            </div>
          ) : (
            inquiries.map((inq) => (
              <div
                key={inq.id}
                className={`flex items-start gap-1 sm:gap-2 bg-white border rounded-xl transition-all min-w-0 ${
                  selected?.id === inq.id
                    ? 'border-blue-400 bg-blue-50'
                    : checked.includes(inq.id)
                    ? 'border-blue-200 bg-blue-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggleCheck(inq.id)}
                  className="flex-shrink-0 pt-4 pl-2 sm:pl-3"
                >
                  {checked.includes(inq.id) ? (
                    <IconSquareCheckFilled size={15} className="text-blue-500" />
                  ) : (
                    <IconSquare size={15} className="text-slate-300 hover:text-slate-400" />
                  )}
                </button>

                <button
                  onClick={() => openInquiry(inq)}
                  className="flex-1 text-left p-2.5 sm:p-3 pl-1 min-w-0 overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2 mb-1 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {!inq.is_read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-[13px] truncate ${!inq.is_read ? 'font-medium text-slate-900' : 'text-slate-600'}`}>
                        {inq.name}
                      </span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${
                      inq.is_read
                        ? 'bg-slate-100 text-slate-400'
                        : 'bg-blue-50 text-blue-500 border border-blue-100'
                    }`}>
                      {inq.is_read ? 'Read' : 'New'}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-400 truncate">
                    {inq.message}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <IconClock size={11} className="text-slate-300 flex-shrink-0" />
                    <span className="text-[11px] text-slate-300 truncate">
                      {new Date(inq.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => deleteInquiry(inq.id)}
                  disabled={deleting === inq.id}
                  className="flex-shrink-0 pt-3 pr-2 sm:pr-3 text-slate-300 hover:text-red-400 transition-colors disabled:opacity-50"
                >
                  {deleting === inq.id ? (
                    <div className="w-3.5 h-3.5 border border-red-300/30 border-t-red-300 rounded-full animate-spin" />
                  ) : (
                    <IconTrash size={14} />
                  )}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Inquiry detail — shown on mobile only when opened */}
        <div
          className={`lg:col-span-2 min-w-0 ${
            mobileDetailOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          {selected ? (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden min-w-0">

              {/* Mobile back button */}
              <button
                onClick={() => setMobileDetailOpen(false)}
                className="lg:hidden flex items-center gap-2 px-4 py-3 border-b border-slate-100 text-[13px] text-slate-500 hover:text-slate-900 w-full"
              >
                <IconArrowLeft size={15} />
                Back to inquiries
              </button>

              {/* Detail header */}
              <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[14px] font-medium text-blue-500">
                      {selected.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[14px] font-medium text-slate-900 truncate">
                      {selected.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {new Date(selected.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!selected.is_read && (
                    <button
                      onClick={() => markAsRead(selected.id)}
                      className="flex items-center gap-1.5 text-[12px] text-blue-500 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
                    >
                      <IconMailOpened size={13} />
                      <span className="hidden sm:inline">Mark read</span>
                    </button>
                  )}
                  <button
                    onClick={() => deleteInquiry(selected.id)}
                    disabled={deleting === selected.id}
                    className="flex items-center gap-1.5 text-[12px] text-red-400 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    <IconTrash size={13} />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>

              {/* Contact info */}
              <div className="px-4 sm:px-6 py-4 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <IconMail size={14} className="text-blue-400 flex-shrink-0" />
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-[13px] text-blue-500 hover:text-blue-600 truncate min-w-0"
                  >
                    {selected.email}
                  </a>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2 min-w-0">
                    <IconPhone size={14} className="text-slate-400 flex-shrink-0" />
                    <a
                      href={`tel:${selected.phone}`}
                      className="text-[13px] text-slate-600 truncate"
                    >
                      {selected.phone}
                    </a>
                  </div>
                )}
                {selected.company && (
                  <div className="flex items-center gap-2 min-w-0">
                    <IconBuilding size={14} className="text-slate-400 flex-shrink-0" />
                    <span className="text-[13px] text-slate-600 truncate">
                      {selected.company}
                    </span>
                  </div>
                )}
              </div>

              {/* Message */}
              <div className="px-4 sm:px-6 py-5 min-w-0">
                <h3 className="text-[11px] text-slate-400 uppercase tracking-widest font-medium mb-3">
                  Message
                </h3>
                <p className="text-[14px] text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                  {selected.message}
                </p>

                {selected.products && (
                  <div className="mt-5 pt-5 border-t border-slate-100">
                    <h3 className="text-[11px] text-slate-400 uppercase tracking-widest font-medium mb-2">
                      Related product
                    </h3>
                    <span className="text-[13px] text-blue-500 break-words">
                      {selected.products.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Reply */}
              <div className="px-4 sm:px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <a
                  href={`mailto:${selected.email}?subject=Re: Your inquiry about ${selected.products?.name || 'our products'}`}
                  className="flex items-center justify-center gap-2 bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <IconMail size={14} />
                  Reply via email
                </a>
                {selected.phone && (
                  <a
                    href={`https://wa.me/${selected.phone.replace(/\D/g, '')}?text=Hello ${selected.name}, thank you for your inquiry.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    WhatsApp reply
                  </a>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl h-64 flex items-center justify-center">
              <div className="text-center">
                <IconMail size={32} className="text-slate-200 mx-auto mb-3" />
                <p className="text-[13px] text-slate-400">
                  Select an inquiry to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}