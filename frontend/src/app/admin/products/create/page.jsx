'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  IconArrowLeft,
  IconUpload,
  IconX,
  IconPlus,
} from '@tabler/icons-react'

export default function CreateProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState([])
  const [imagesPreviews, setImagesPreviews] = useState([])
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
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
      const data = await res.json()
      setCategories(data.data || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  // Auto generate slug from name
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

  // Handle image selection
  const handleImages = (e) => {
    const files = Array.from(e.target.files)
    setImages(prev => [...prev, ...files])

    // Create previews
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagesPreviews(prev => [...prev, e.target.result])
      }
      reader.readAsDataURL(file)
    })
  }

  // Remove image
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagesPreviews(prev => prev.filter((_, i) => i !== index))
  }

  // Handle spec rows
  const addSpec = () => {
    setSpecs([...specs, { key: '', value: '' }])
  }

  const removeSpec = (index) => {
    setSpecs(specs.filter((_, i) => i !== index))
  }

  const updateSpec = (index, field, value) => {
    const updated = [...specs]
    updated[index][field] = value
    setSpecs(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const token = localStorage.getItem('adminToken')

    try {
      // Build specifications object from specs array
      const specifications = {}
      specs.forEach(spec => {
        if (spec.key && spec.value) {
          specifications[spec.key] = spec.value
        }
      })

      // Build form data
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('slug', form.slug)
      formData.append('description', form.description)
      formData.append('category_id', form.category_id)
      formData.append('featured', form.featured)
      formData.append('specifications', JSON.stringify(specifications))

      // Append images
      images.forEach(img => {
        formData.append('images', img)
      })

      // Append PDF
      if (pdf) {
        formData.append('pdf', pdf)
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        }
      )

      const data = await res.json()

      if (data.success) {
        router.push('/admin/products')
      } else {
        setError(data.message || 'Failed to create product')
      }

    } catch (err) {
      setError('Failed to create product. Please try again.')
    } finally {
      setLoading(false)
    }
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
            Add new product
          </h1>
          <p className="text-[13px] text-slate-400 mt-0.5">
            Fill in the details to create a new product listing
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

            {/* Name */}
            <div>
              <label className="text-[12px] text-slate-500 font-medium mb-1.5 block">
                Product name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={handleNameChange}
                required
                placeholder="e.g. Ball Valve"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="text-[12px] text-slate-500 font-medium mb-1.5 block">
                Slug (auto generated)
              </label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                required
                placeholder="ball-valve"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-400 bg-slate-50 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                URL: /products/{form.slug || 'product-slug'}
              </p>
            </div>

            {/* Category */}
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

            {/* Description */}
            <div>
              <label className="text-[12px] text-slate-500 font-medium mb-1.5 block">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the product..."
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
              />
            </div>

            {/* Featured */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="w-4 h-4 text-blue-500 rounded border-slate-300 focus:ring-blue-400"
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
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => updateSpec(index, 'value', e.target.value)}
                  placeholder="e.g. SS316 / WCB"
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400"
                />
                <button
                  type="button"
                  onClick={() => removeSpec(index)}
                  className="w-8 h-8 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                >
                  <IconX size={13} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-[15px] font-medium text-slate-900 mb-5">
            Product images
          </h2>

          {/* Upload area */}
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
              onChange={handleImages}
              className="hidden"
            />
          </label>

          {/* Image previews */}
          {imagesPreviews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {imagesPreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group"
                >
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <IconX size={10} color="#fff" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PDF */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-[15px] font-medium text-slate-900 mb-5">
            Product datasheet (PDF)
          </h2>
          <label className="block border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors">
            <IconUpload size={20} className="text-slate-300 mx-auto mb-2" />
            {pdf ? (
              <p className="text-[13px] text-green-600 font-medium">
                ✓ {pdf.name}
              </p>
            ) : (
              <>
                <p className="text-[13px] text-slate-500 mb-1">
                  Click to upload PDF datasheet
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
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-[13px] font-medium px-6 py-3 rounded-lg transition-colors"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating product...
              </>
            ) : (
              'Create product'
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