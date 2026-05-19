import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import supabase from '../config/supabase.js'
import { uploadOnCloudinary, deleteFromCloudinary } from '../config/cloudinary.js'

// ─── Get All Certificates (Public) ─────────────────
const getAllCertificates = asyncHandler(async (req, res) => {
    const { data: certificates, error } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        throw new ApiError(500, 'Failed to fetch certificates')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, certificates, 'Certificates fetched successfully'))
})

// ─── Create Certificate (Admin) ────────────────────
const createCertificate = asyncHandler(async (req, res) => {
    const { name } = req.body

    if (!name) {
        throw new ApiError(400, 'Certificate name is required')
    }

    if (!req.file) {
        throw new ApiError(400, 'PDF file is required')
    }

    // Upload to Cloudinary
    const uploaded = await uploadOnCloudinary(
        req.file.path,
        'hammer-valve/certificates'
    )

    if (!uploaded) {
        throw new ApiError(500, 'Failed to upload certificate')
    }

    const { data: certificate, error } = await supabase
        .from('certificates')
        .insert({
            name,
            file_url: uploaded.secure_url
        })
        .select()
        .single()

    if (error) {
        throw new ApiError(500, 'Failed to save certificate')
    }

    return res
        .status(201)
        .json(new ApiResponse(201, certificate, 'Certificate created successfully'))
})

// ─── Delete Certificate (Admin) ────────────────────
const deleteCertificate = asyncHandler(async (req, res) => {
    const { id } = req.params

    const { data: existing } = await supabase
        .from('certificates')
        .select('*')
        .eq('id', id)
        .single()

    if (!existing) {
        throw new ApiError(404, 'Certificate not found')
    }

    // Delete from Cloudinary
    if (existing.file_url) {
        const publicId = existing.file_url
            .split('/')
            .slice(-4)
            .join('/')
            .replace(/\.[^/.]+$/, '')
        await deleteFromCloudinary(publicId)
    }

    const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id)

    if (error) {
        throw new ApiError(500, 'Failed to delete certificate')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Certificate deleted successfully'))
})

export { getAllCertificates, createCertificate, deleteCertificate }