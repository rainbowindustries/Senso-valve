'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  IconUpload,
  IconTrash,
  IconX,
  IconPlus,
  IconPhoto,
  IconPencil,
  IconCheck,
} from '@tabler/icons-react'

export default function AdminGalleryPage() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  // Rename state
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [renaming, setRenaming] = useState(false)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setImages(data.data || [])
    } catch (error) {
      console.error('Failed to fetch images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    setFile(selected)
    if (selected) {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(selected)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Please select an image')
      return
    }
    if (!name.trim()) {
      setError('Please enter a name')
      return
    }

    setUploading(true)
    setError('')
    const token = localStorage.getItem('adminToken')

    try {
      const formData = new FormData()
      formData.append('name', name.trim())
      formData.append('image', file)

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()

      if (data.success) {
        setName('')
        setFile(null)
        setPreview(null)
        setShowForm(false)
        fetchImages()
      } else {
        setError(data.message || 'Failed to upload image')
      }
    } catch (error) {
      setError('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id, imgName) => {
    if (!confirm(`Delete "${imgName}"?`)) return
    setDeleting(id)
    const token = localStorage.getItem('adminToken')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setImages(prev => prev.filter(img => img.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete:', error)
    } finally {
      setDeleting(null)
    }
  }

  const startEdit = (img) => {
    setEditingId(img.id)
    setEditValue(img.name)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  const saveEdit = async (id) => {
    if (!editValue.trim()) return
    setRenaming(true)
    const token = localStorage.getItem('adminToken')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editValue.trim() }),
      })
      const data = await res.json()

      if (data.success) {
        setImages(prev =>
          prev.map(img => img.id === id ? { ...img, name: editValue.trim() } : img)
        )
        setEditingId(null)
        setEditValue('')
      } else {
        alert(data.message || 'Failed to rename')
      }
    } catch (error) {
      console.error('Failed to rename:', error)
    } finally {
      setRenaming(false)
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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] sm:text-[24px] font-medium text-slate-900">Gallery</h1>
          <p className="text-[13px] text-slate-400 mt-1">{images.length} images uploaded</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-[13px] font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          {showForm ? <IconX size={16} /> : <IconPlus size={16} />}
          {showForm ? 'Cancel' : 'Upload image'}
        </button>
      </div>

      {/* Upload form */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-[15px] font-medium text-slate-900 mb-5">Upload new image</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div>
              <label className="text-[12px] text-slate-500 font-medium mb-1.5 block">
                Image name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Manufacturing Facility"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-[12px] text-slate-500 font-medium mb-1.5 block">
                Image file *
              </label>
              <label className="block border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors">
                {preview ? (
                  <div className="relative w-32 h-32 mx-auto rounded-lg overflow-hidden">
                    <Image src={preview} alt="Preview" fill className="object-cover" />
                  </div>
                ) : (
                  <>
                    <IconUpload size={22} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-[13px] text-slate-500 mb-1">Click to select image</p>
                    <p className="text-[11px] text-slate-400">JPG, PNG, WebP up to 10MB</p>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-[13px] text-red-600">
                {error}
              </div>
            )}

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
                    Upload image
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

      {/* Images grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        {images.length === 0 ? (
          <div className="text-center py-16">
            <IconPhoto size={36} className="text-slate-200 mx-auto mb-3" />
            <p className="text-[14px] font-medium text-slate-900 mb-1">No images yet</p>
            <p className="text-[13px] text-slate-400">Upload your first gallery image</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-50">
                <div className="absolute inset-0 p-3">
                  <div className="relative w-full h-full">
                    <Image src={img.image_url} alt={img.name} fill className="object-contain" />
                  </div>
                </div>

                {/* Hover actions */}
                {editingId !== img.id && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2">
                    <button
                      onClick={() => startEdit(img)}
                      className="opacity-0 group-hover:opacity-100 w-9 h-9 bg-white hover:bg-slate-100 rounded-full flex items-center justify-center transition-all"
                    >
                      <IconPencil size={15} className="text-slate-700" />
                    </button>
                    <button
                      onClick={() => handleDelete(img.id, img.name)}
                      disabled={deleting === img.id}
                      className="opacity-0 group-hover:opacity-100 w-9 h-9 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all"
                    >
                      {deleting === img.id ? (
                        <div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <IconTrash size={15} color="#fff" />
                      )}
                    </button>
                  </div>
                )}

                {/* Name / edit input */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-2.5 py-2">
                  {editingId === img.id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(img.id)
                          if (e.key === 'Escape') cancelEdit()
                        }}
                        className="flex-1 min-w-0 bg-white/95 text-slate-900 text-[12px] font-medium rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <button
                        onClick={() => saveEdit(img.id)}
                        disabled={renaming}
                        className="w-6 h-6 bg-green-500 hover:bg-green-600 rounded-md flex items-center justify-center flex-shrink-0 disabled:opacity-50"
                      >
                        {renaming ? (
                          <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <IconCheck size={13} color="#fff" />
                        )}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="w-6 h-6 bg-slate-400 hover:bg-slate-500 rounded-md flex items-center justify-center flex-shrink-0"
                      >
                        <IconX size={13} color="#fff" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[13px] font-bold text-white line-clamp-1">{img.name}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}