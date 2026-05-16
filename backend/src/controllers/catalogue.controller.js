import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import supabase from '../config/supabase.js'
import { uploadOnCloudinary, deleteFromCloudinary } from '../config/cloudinary.js'

// ─── Get All Catalogues (Public) ───────────────────
const getAllCatalogues = asyncHandler(async (req, res) => {

    const { data: catalogues, error } = await supabase
        .from('catalogues')
        .select(`
            *,
            products (
                id,
                name,
                slug
            )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        throw new ApiError(500, 'Failed to fetch catalogues')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, catalogues, 'Catalogues fetched successfully'))
})

// ─── Get Single Catalogue (Public) ─────────────────
const getCatalogueById = asyncHandler(async (req, res) => {
    const { id } = req.params

    const { data: catalogue, error } = await supabase
        .from('catalogues')
        .select(`
            *,
            products (
                id,
                name,
                slug
            )
        `)
        .eq('id', id)
        .single()

    if (error || !catalogue) {
        throw new ApiError(404, 'Catalogue not found')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, catalogue, 'Catalogue fetched successfully'))
})

// ─── Create Catalogue (Admin) ───────────────────────
const createCatalogue = asyncHandler(async (req, res) => {
    const { title, description, product_id } = req.body

    if (!title) {
        throw new ApiError(400, 'Title is required')
    }

    // Upload PDF to Cloudinary
    if (!req.file) {
        throw new ApiError(400, 'PDF file is required')
    }

    const uploaded = await uploadOnCloudinary(
        req.file.path,
        'hammer-valve/documents'
    )

    if (!uploaded) {
        throw new ApiError(500, 'Failed to upload PDF')
    }

    // Save to Supabase
    const { data: catalogue, error } = await supabase
        .from('catalogues')
        .insert({
            title,
            description: description || null,
            file_url: uploaded.secure_url,
            product_id: product_id || null
        })
        .select()
        .single()

    if (error) {
        throw new ApiError(500, 'Failed to create catalogue')
    }

    return res
        .status(201)
        .json(new ApiResponse(201, catalogue, 'Catalogue created successfully'))
})

// ─── Update Catalogue (Admin) ───────────────────────
const updateCatalogue = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { title, description, product_id } = req.body

    // Check catalogue exists
    const { data: existing } = await supabase
        .from('catalogues')
        .select('*')
        .eq('id', id)
        .single()

    if (!existing) {
        throw new ApiError(404, 'Catalogue not found')
    }

    // Upload new PDF if provided
    let fileUrl = existing.file_url
    if (req.file) {
        // Delete old PDF from Cloudinary
        if (existing.file_url) {
            const publicId = existing.file_url
                .split('/')
                .slice(-3)
                .join('/')
                .replace(/\.[^/.]+$/, '')
            await deleteFromCloudinary(publicId)
        }

        // Upload new PDF
        const uploaded = await uploadOnCloudinary(
            req.file.path,
            'hammer-valve/documents'
        )

        if (!uploaded) {
            throw new ApiError(500, 'Failed to upload new PDF')
        }

        fileUrl = uploaded.secure_url
    }

    // Update in Supabase
    const { data: catalogue, error } = await supabase
        .from('catalogues')
        .update({
            title: title || existing.title,
            description: description || existing.description,
            file_url: fileUrl,
            product_id: product_id || existing.product_id
        })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        throw new ApiError(500, 'Failed to update catalogue')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, catalogue, 'Catalogue updated successfully'))
})

// ─── Delete Catalogue (Admin) ───────────────────────
const deleteCatalogue = asyncHandler(async (req, res) => {
    const { id } = req.params

    // Get catalogue first
    const { data: existing } = await supabase
        .from('catalogues')
        .select('*')
        .eq('id', id)
        .single()

    if (!existing) {
        throw new ApiError(404, 'Catalogue not found')
    }

    // Delete PDF from Cloudinary
    if (existing.file_url) {
        const publicId = existing.file_url
            .split('/')
            .slice(-3)
            .join('/')
            .replace(/\.[^/.]+$/, '')
        await deleteFromCloudinary(publicId)
    }

    // Delete from Supabase
    const { error } = await supabase
        .from('catalogues')
        .delete()
        .eq('id', id)

    if (error) {
        throw new ApiError(500, 'Failed to delete catalogue')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Catalogue deleted successfully'))
})

export {
    getAllCatalogues,
    getCatalogueById,
    createCatalogue,
    updateCatalogue,
    deleteCatalogue
}