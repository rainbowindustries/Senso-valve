import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import supabase from '../config/supabase.js'
import { uploadOnCloudinary, deleteFromCloudinary } from '../config/cloudinary.js'

// ─── Get All Gallery Images (Public) ───────────────
const getGalleryImages = asyncHandler(async (req, res) => {
    const { data: images, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        throw new ApiError(500, 'Failed to fetch gallery images')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, images, 'Gallery images fetched successfully'))
})

// ─── Upload Gallery Image (Admin) ──────────────────
const uploadGalleryImage = asyncHandler(async (req, res) => {
    const { name } = req.body

    if (!name || !name.trim()) {
        throw new ApiError(400, 'Image name is required')
    }

    if (!req.file) {
        throw new ApiError(400, 'Image file is required')
    }

    const uploaded = await uploadOnCloudinary(
        req.file.path,
        'hammer-valve/gallery'
    )

    if (!uploaded) {
        throw new ApiError(500, 'Failed to upload image')
    }

    const { data: image, error } = await supabase
        .from('gallery')
        .insert({
            name: name.trim(),
            image_url: uploaded.secure_url
        })
        .select()
        .single()

    if (error) {
        throw new ApiError(500, 'Failed to save image')
    }

    return res
        .status(201)
        .json(new ApiResponse(201, image, 'Image uploaded successfully'))
})

// ─── Rename Gallery Image (Admin) ──────────────────
const renameGalleryImage = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { name } = req.body

    if (!name || !name.trim()) {
        throw new ApiError(400, 'Name is required')
    }

    const { data: image, error } = await supabase
        .from('gallery')
        .update({ name: name.trim() })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        throw new ApiError(500, 'Failed to rename image')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, image, 'Image renamed successfully'))
})

// ─── Delete Gallery Image (Admin) ──────────────────
const deleteGalleryImage = asyncHandler(async (req, res) => {
    const { id } = req.params

    const { data: existing } = await supabase
        .from('gallery')
        .select('*')
        .eq('id', id)
        .single()

    if (!existing) {
        throw new ApiError(404, 'Image not found')
    }

    if (existing.image_url) {
        const publicId = existing.image_url
            .split('/')
            .slice(-4)
            .join('/')
            .replace(/\.[^/.]+$/, '')
        await deleteFromCloudinary(publicId)
    }

    const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id)

    if (error) {
        throw new ApiError(500, 'Failed to delete image')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Image deleted successfully'))
})

export {
    getGalleryImages,
    uploadGalleryImage,
    renameGalleryImage,
    deleteGalleryImage
}