'use client'
import { useState, useEffect } from 'react'
import {
  IconFileTypePdf,
  IconUpload,
  IconTrash,
  IconEye,
  IconX,
  IconPlus,
  IconCertificate,
} from '@tabler/icons-react'

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({ name: '' })
  const [pdf, setPdf] = useState(null)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/certificates`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )
      const data = await res.json()
      setCertificates(data.data || [])
    } catch (error) {
      console.error('Failed to fetch certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!pdf) {
      setError('Please select a PDF file')
      return
    }

    setUploading(true)
    setError('')
    setSuccess('')

    const token = localStorage.getItem('adminToken')

    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('pdf', pdf)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/certificates`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        }
      )
      const data = await res.json()

      if (data.success) {
        setSuccess('Certificate uploaded successfully!')
        setForm({ name: '' })
        setPdf(null)
        setShowForm(false)
        fetchCertificates()
      } else {
        setError(data.message || 'Failed to upload certificate')
      }
    } catch (error) {
      setError('Failed to upload certificate')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return
    setDeleting(id)
    const token = localStorage.getItem('adminToken')

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/certificates/${id}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )
      const data = await res.json()
      if (data.success) {
        setCertificates(prev => prev.filter(c => c.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete:', error)
    } finally {
      setDeleting(null)
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
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-medium text-slate-900">
            Certificates
          </h1>
          <p className="text-[13px] text-slate-400 mt-1">
            {certificates.length} certificates uploaded
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-[13px] font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          {showForm ? <IconX size={16} /> : <IconPlus size={16} />}
          {showForm ? 'Cancel' : 'Upload certificate'}
        </button>
      </div>

      {/* Success message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-[13px] text-green-600">
          {success}
        </div>
      )}

      {/* Upload form */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-[15px] font-medium text-slate-900 mb-5">
            Upload new certificate
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Name */}
            <div>
              <label className="text-[12px] text-slate-500 font-medium mb-1.5 block">
                Certificate name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ name: e.target.value })}
                required
                placeholder="e.g. ISO 9001:2015"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
            </div>

            {/* PDF upload */}
            <div>
              <label className="text-[12px] text-slate-500 font-medium mb-1.5 block">
                Certificate PDF *
              </label>
              <label className="block border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors">
                <IconUpload size={22} className="text-slate-300 mx-auto mb-2" />
                {pdf ? (
                  <p className="text-[13px] text-green-600 font-medium">
                    ✓ {pdf.name}
                  </p>
                ) : (
                  <>
                    <p className="text-[13px] text-slate-500 mb-1">
                      Click to select PDF file
                    </p>
                    <p className="text-[11px] text-slate-400">
                      PDF up to 10MB
                    </p>
                  </>
                )}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdf(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-[13px] text-red-600">
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={uploading}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-[13px] font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <IconUpload size={15} />
                    Upload certificate
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-[13px] text-slate-500 hover:text-slate-700 px-4"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Certificates list */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {certificates.length === 0 ? (
          <div className="text-center py-16">
            <IconCertificate size={36} className="text-slate-200 mx-auto mb-3" />
            <p className="text-[14px] font-medium text-slate-900 mb-1">
              No certificates yet
            </p>
            <p className="text-[13px] text-slate-400 mb-5">
              Upload your first certificate PDF
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <IconPlus size={15} />
              Upload certificate
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                  Certificate
                </th>
                <th className="text-left px-5 py-3 text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                  Uploaded
                </th>
                <th className="text-left px-5 py-3 text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert) => (
                <tr
                  key={cert.id}
                  className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors"
                >
                  {/* Name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconCertificate size={18} className="text-green-500" />
                      </div>
                      <div className="text-[13px] font-medium text-slate-900">
                        {cert.name}
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4 text-[12px] text-slate-400">
                    {new Date(cert.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <a
                        href={cert.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <IconEye size={14} className="text-blue-500" />
                      </a>
                      <button
                        onClick={() => handleDelete(cert.id, cert.name)}
                        disabled={deleting === cert.id}
                        className="w-8 h-8 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                      >
                        {deleting === cert.id ? (
                          <div className="w-3 h-3 border border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                        ) : (
                          <IconTrash size={14} className="text-red-400" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}