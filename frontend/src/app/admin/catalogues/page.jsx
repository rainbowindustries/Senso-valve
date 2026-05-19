'use client'
import { useState, useEffect } from 'react'
import {
  IconFileTypePdf,
  IconUpload,
  IconTrash,
  IconEye,
  IconX,
  IconPlus,
} from '@tabler/icons-react'

export default function AdminCataloguesPage() {
  const [catalogues, setCatalogues] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    title: '',
    description: '',
    product_id: '',
  })
  const [pdf, setPdf] = useState(null)

  useEffect(() => {
    fetchCatalogues()
    fetchProducts()
  }, [])

  const fetchCatalogues = async () => {
    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/catalogues`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )
      const data = await res.json()
      setCatalogues(data.data || [])
    } catch (error) {
      console.error('Failed to fetch catalogues:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )
      const data = await res.json()
      setProducts(data.data || [])
    } catch (error) {
      console.error('Failed to fetch products:', error)
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
      formData.append('title', form.title)
      formData.append('description', form.description)
      if (form.product_id) {
        formData.append('product_id', form.product_id)
      }
      formData.append('pdf', pdf)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/catalogues`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        }
      )
      const data = await res.json()

      if (data.success) {
        setSuccess('Catalogue uploaded successfully!')
        setForm({ title: '', description: '', product_id: '' })
        setPdf(null)
        setShowForm(false)
        fetchCatalogues()
      } else {
        setError(data.message || 'Failed to upload catalogue')
      }
    } catch (error) {
      setError('Failed to upload catalogue')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return
    setDeleting(id)
    const token = localStorage.getItem('adminToken')

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/catalogues/${id}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )
      const data = await res.json()
      if (data.success) {
        setCatalogues(prev => prev.filter(c => c.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete catalogue:', error)
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
            Catalogues
          </h1>
          <p className="text-[13px] text-slate-400 mt-1">
            {catalogues.length} catalogues uploaded
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-[13px] font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          {showForm ? <IconX size={16} /> : <IconPlus size={16} />}
          {showForm ? 'Cancel' : 'Upload catalogue'}
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
            Upload new catalogue
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Title */}
            <div>
              <label className="text-[12px] text-slate-500 font-medium mb-1.5 block">
                Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                placeholder="e.g. Ball Valve Catalogue 2024"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-[12px] text-slate-500 font-medium mb-1.5 block">
                Description
              </label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of this catalogue"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
            </div>

            {/* Link to product */}
            <div>
              <label className="text-[12px] text-slate-500 font-medium mb-1.5 block">
                Link to product (optional)
              </label>
              <select
                value={form.product_id}
                onChange={(e) => setForm({ ...form, product_id: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-900 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              >
                <option value="">No product link</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* PDF upload */}
            <div>
              <label className="text-[12px] text-slate-500 font-medium mb-1.5 block">
                PDF file *
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
                    Upload catalogue
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

      {/* Catalogues list */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {catalogues.length === 0 ? (
          <div className="text-center py-16">
            <IconFileTypePdf
              size={36}
              className="text-slate-200 mx-auto mb-3"
            />
            <p className="text-[14px] font-medium text-slate-900 mb-1">
              No catalogues yet
            </p>
            <p className="text-[13px] text-slate-400 mb-5">
              Upload your first catalogue PDF
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <IconPlus size={15} />
              Upload catalogue
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                  Title
                </th>
                <th className="text-left px-5 py-3 text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                  Product
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
              {catalogues.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors"
                >
                  {/* Title */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconFileTypePdf size={18} className="text-red-400" />
                      </div>
                      <div>
                        <div className="text-[13px] font-medium text-slate-900">
                          {cat.title}
                        </div>
                        {cat.description && (
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {cat.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Product */}
                  <td className="px-5 py-4">
                    {cat.products ? (
                      <span className="text-[12px] bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full">
                        {cat.products.name}
                      </span>
                    ) : (
                      <span className="text-[12px] text-slate-300">
                        No product
                      </span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4 text-[12px] text-slate-400">
                    {new Date(cat.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <a
                        href={cat.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <IconEye size={14} className="text-blue-500" />
                      </a>
                      <button
                        onClick={() => handleDelete(cat.id, cat.title)}
                        disabled={deleting === cat.id}
                        className="w-8 h-8 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                      >
                        {deleting === cat.id ? (
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