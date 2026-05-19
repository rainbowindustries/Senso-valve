'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconPackage,
  IconStar,
  IconStarFilled,
} from '@tabler/icons-react'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

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
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    setDeleting(id)
    const token = localStorage.getItem('adminToken')

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )
      const data = await res.json()
      if (data.success) {
        setProducts(products.filter(p => p.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
    } finally {
      setDeleting(null)
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

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
          <h1 className="text-[24px] font-medium text-slate-900">Products</h1>
          <p className="text-[13px] text-slate-400 mt-1">
            {products.length} products total
          </p>
        </div>
        <Link
          href="/admin/products/create"
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-[13px] font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <IconPlus size={16} />
          Add product
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <IconSearch
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
        />
      </div>

      {/* Products table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <IconPackage size={36} className="text-slate-200 mx-auto mb-3" />
            <p className="text-[14px] font-medium text-slate-900 mb-1">
              No products found
            </p>
            <p className="text-[13px] text-slate-400 mb-5">
              Add your first product to get started
            </p>
            <Link
              href="/admin/products/create"
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <IconPlus size={15} />
              Add product
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                  Product
                </th>
                <th className="text-left px-5 py-3 text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                  Category
                </th>
                <th className="text-left px-5 py-3 text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                  Images
                </th>
                <th className="text-left px-5 py-3 text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                  Featured
                </th>
                <th className="text-left px-5 py-3 text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors"
                >
                  {/* Product */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="object-contain w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <IconPackage size={18} className="text-slate-300" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-[13px] font-medium text-slate-900">
                          {product.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          /{product.slug}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-4">
                    <span className="text-[12px] bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full">
                      {product.categories?.name || '—'}
                    </span>
                  </td>

                  {/* Images count */}
                  <td className="px-5 py-4 text-[13px] text-slate-500">
                    {product.images?.length || 0} image{product.images?.length !== 1 ? 's' : ''}
                  </td>

                  {/* Featured */}
                  <td className="px-5 py-4">
                    {product.featured ? (
                      <IconStarFilled size={16} className="text-yellow-400" />
                    ) : (
                      <IconStar size={16} className="text-slate-300" />
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="w-8 h-8 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <IconEdit size={14} className="text-blue-500" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deleting === product.id}
                        className="w-8 h-8 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                      >
                        {deleting === product.id ? (
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