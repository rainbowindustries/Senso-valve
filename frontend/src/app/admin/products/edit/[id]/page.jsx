'use client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  IconArrowLeft,
  IconUpload,
  IconX,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react'

export default function EditProductPage({ params }) {
  const router = useRouter()
  const { id } = use(params)

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [newImages, setNewImages] = useState([])
  const [newImagesPreviews, setNewImagesPreviews] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [existingPdf, setExistingPdf] = useState(null)
  const [pdf, setPdf] = useState(null)
  const [specs, setSpecs] = useState([{ key: '', value: '' }])

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    category_id: '',
    featured: false,
  })

  useEffect(() => {
    fetchProduct()
    fetchCategories()
  }, [id])

  const fetchProduct = async () => {
    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/id/${id}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )
      const data = await res.json()
      const product = data.data

      if (product) {
        // Pre-fill form with existing values
        setForm({
          name: product.name || '',
          slug: product.slug || '',
          description: product.description || '',
          category_id: product.category_id || '',
          featured: product.featured || false,
        })

        // Set existing images
        setExistingImages(product.images || [])

        // Set existing PDF
        setExistingPdf(product.pdf_url || null)

        // Convert specifications object to array
        if (
          product.specifications &&
          Object.keys(product.specifications).length > 0
        ) {
          const specsArray = Object.entries(product.specifications).map(
            ([key, value]) => ({ key, value: String(value) })
          )
          setSpecs(specsArray)
        } else {
          setSpecs([{ key: '', value: '' }])
        }
      }
    } catch (error) {
      console.error('Failed to fetch product:', error)
      setError('Failed to load product data')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`
      )
      const data = await res.json()
      setCategories(data.data || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleNameChange = (e) => {
    const name = e.target.value
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    setForm({ ...form, name, slug })
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files)
    setNewImages(prev => [...prev, ...files])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewImagesPreviews(prev => [...prev, e.target.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index))
    setNewImagesPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const deleteExistingImage = async (imageUrl) => {
    if (!confirm('Delete this image?')) return
    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}/image`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageUrl }),
        }
      )
      const data = await res.json()
      if (data.success) {
        setExistingImages(prev => prev.filter(img => img !== imageUrl))
      }
    } catch (error) {
      console.error('Failed to delete image:', error)
    }
  }

  const addSpec = () => setSpecs([...specs, { key: '', value: '' }])
  const removeSpec = (index) => setSpecs(specs.filter((_, i) => i !== index))
  const updateSpec = (index, field, value) => {
    const updated = [...specs]
    updated[index][field] = value
    setSpecs(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const token = localStorage.getItem('adminToken')

    try {
      const specifications = {}
      specs.forEach(spec => {
        if (spec.key && spec.value) {
          specifications[spec.key] = spec.value
        }
      })

      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('slug', form.slug)
      formData.append('description', form.description)
      formData.append('category_id', form.category_id)
      formData.append('featured', form.featured)
      formData.append('specifications', JSON.stringify(specifications))

      newImages.forEach(img => {
        formData.append('images', img)
      })

      if (pdf) {
        formData.append('pdf', pdf)
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
        {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        }
      )

      const data = await res.json()

      if (data.success) {
        router.push('/admin/products')
      } else {
        setError(data.message || 'Failed to update product')
      }

    } catch (err) {
      setError('Failed to update product. Please try again.')
    } finally {
      setSaving(false)
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
    <div className="flex flex-col gap-6 max-w-4xl">

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <IconArrowLeft size={16} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-[24px] font-medium text-slate-900">
            Edit product
          </h1>
          <p className="text-[13px] text-slate-400 mt-0.5">
            {form.name}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Basic info */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-[15px] font-medium text-slate-900 mb-5">
            Basic information
          </h2>
          <div className="flex flex-col gap-4">

            <div>
              <label className="text-[12px] text-slate-500 font-medium mb-1.5 block">
                Product name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={handleNameChange}
                required
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-[12px] text-slate-500 font-medium mb-1.5 block">
                Slug
              </label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                required
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-900 bg-slate-50 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                URL: /products/{form.slug}
              </p>
            </div>

            <div>
              <label className="text-[12px] text-slate-500 font-medium mb-1.5 block">
                Category *
              </label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                required
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-900 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[12px] text-slate-500 font-medium mb-1.5 block">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="w-4 h-4 text-blue-500 rounded border-slate-300"
              />
              <label
                htmlFor="featured"
                className="text-[13px] text-slate-700 cursor-pointer"
              >
                Mark as featured product
                <span className="text-[11px] text-slate-400 ml-1">
                  (shows on home page slider)
                </span>
              </label>
            </div>

          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[15px] font-medium text-slate-900">
              Specifications
            </h2>
            <button
              type="button"
              onClick={addSpec}
              className="flex items-center gap-1.5 text-[12px] text-blue-500 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <IconPlus size={13} />
              Add row
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {specs.map((spec, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={spec.key}
                  onChange={(e) => updateSpec(index, 'key', e.target.value)}
                  placeholder="e.g. Material"
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2.5 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => updateSpec(index, 'value', e.target.value)}
                  placeholder="e.g. SS316"
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2.5 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400"
                />
                <button
                  type="button"
                  onClick={() => removeSpec(index)}
                  className="w-8 h-8 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <IconX size={13} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Existing images */}
        {existingImages.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-[15px] font-medium text-slate-900 mb-2">
              Current images
            </h2>
            <p className="text-[12px] text-slate-400 mb-4">
              Hover over image and click delete icon to remove
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {existingImages.map((img, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group"
                >
                  <Image
                    src={img}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => deleteExistingImage(img)}
                      className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <IconTrash size={14} color="#fff" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add new images */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-[15px] font-medium text-slate-900 mb-2">
            Add more images
          </h2>
          <p className="text-[12px] text-slate-400 mb-4">
            New images will be added to existing ones
          </p>
          <label className="block border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors mb-4">
            <IconUpload size={24} className="text-slate-300 mx-auto mb-2" />
            <p className="text-[13px] text-slate-500 mb-1">
              Click to upload images
            </p>
            <p className="text-[11px] text-slate-400">
              JPG, PNG, WebP up to 10MB each
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleNewImages}
              className="hidden"
            />
          </label>
          {newImagesPreviews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {newImagesPreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group"
                >
                  <Image
                    src={preview}
                    alt={`New image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <IconX size={14} color="#fff" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PDF section */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-[15px] font-medium text-slate-900 mb-2">
            Product datasheet (PDF)
          </h2>

          {/* Show existing PDF */}
          {existingPdf && !pdf && (
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mb-4">
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                <IconUpload size={15} className="text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] text-slate-700 font-medium">
                  Current PDF
                </p>
                <a
                  href={existingPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-blue-500 hover:text-blue-600"
                >
                  View current datasheet
                </a>
              </div>
            </div>
          )}

          <label className="block border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors">
            <IconUpload size={20} className="text-slate-300 mx-auto mb-2" />
            {pdf ? (
              <p className="text-[13px] text-green-600 font-medium">
                ✓ {pdf.name}
              </p>
            ) : (
              <>
                <p className="text-[13px] text-slate-500 mb-1">
                  {existingPdf
                    ? 'Upload new PDF to replace existing'
                    : 'Click to upload PDF datasheet'
                  }
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
        <div className="flex items-center gap-3 pb-10">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-[13px] font-medium px-6 py-3 rounded-lg transition-colors"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving changes...
              </>
            ) : (
              'Save changes'
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-[13px] text-slate-500 hover:text-slate-700 px-4 py-3"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  )
}