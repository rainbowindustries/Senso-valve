import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import supabase from '../config/supabase.js'
import { uploadOnCloudinary, deleteFromCloudinary } from '../config/cloudinary.js'

// ─── Get All Products ──────────────────────────────
const getAllProducts = asyncHandler(async (req, res) => {
    const { category, featured, search } = req.query

    let query = supabase
        .from('products')
        .select(`
            *,
            categories (
                id,
                name,
                slug
            )
        `)
        .order('created_at', { ascending: false })

    // Filter by category slug
    if (category) {
        const { data: cat } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', category)
            .single()

        if (cat) {
            query = query.eq('category_id', cat.id)
        }
    }

    // Filter featured products
    if (featured === 'true') {
        query = query.eq('featured', true)
    }

    // Search by name
    if (search) {
        query = query.ilike('name', `%${search}%`)
    }

    const { data: products, error } = await query

    if (error) {
        throw new ApiError(500, 'Failed to fetch products')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, products, 'Products fetched successfully'))
})

// ─── Get Single Product ────────────────────────────
const getProductBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params

    const { data: product, error } = await supabase
        .from('products')
        .select(`
            *,
            categories (
                id,
                name,
                slug
            )
        `)
        .eq('slug', slug)
        .single()

    if (error || !product) {
        throw new ApiError(404, 'Product not found')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, product, 'Product fetched successfully'))
})

// ─── Get Single Product by ID ──────────────────────
const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params

    const { data: product, error } = await supabase
        .from('products')
        .select(`
            *,
            categories (
                id,
                name,
                slug
            )
        `)
        .eq('id', id)
        .single()

    if (error || !product) {
        throw new ApiError(404, 'Product not found')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, product, 'Product fetched successfully'))
})

// ─── Create Product ────────────────────────────────
const createProduct = asyncHandler(async (req, res) => {

    const {
        name: rawName,
        'name ': altName,
        slug,
        description,
        category_id,
        specifications,
        featured
    } = req.body

    const name = (rawName || altName)?.trim()

    // Validate required fields
    if (!name || !slug || !category_id) {
        throw new ApiError(400, 'Name, slug and category are required')
    }

    // Check slug is unique
    const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('slug', slug)
        .single()

    if (existing) {
        throw new ApiError(409, 'Product with this slug already exists')
    }

    // Upload images to Cloudinary
    let imageUrls = []
    if (req.files?.images) {
        const imageFiles = Array.isArray(req.files.images)
            ? req.files.images
            : [req.files.images]

        for (const file of imageFiles) {
            const uploaded = await uploadOnCloudinary(
                file.path,
                'hammer-valve/products'
            )
            if (uploaded) {
                imageUrls.push(uploaded.secure_url)
            }
        }
    }

    // Upload PDF to Cloudinary
    let pdfUrl = null
    if (req.files?.pdf?.[0]) {
        const uploaded = await uploadOnCloudinary(
            req.files.pdf[0].path,
            'hammer-valve/documents'
        )
        if (uploaded) {
            pdfUrl = uploaded.secure_url
        }
    }

    // Parse specifications if sent as string
    let specs = {}
    if (specifications) {
        specs = typeof specifications === 'string'
            ? JSON.parse(specifications)
            : specifications
    }

    // Save product to Supabase
    const { data: product, error } = await supabase
        .from('products')
        .insert({
            name,
            slug,
            description,
            category_id,
            images: imageUrls,
            pdf_url: pdfUrl,
            specifications: specs,
            featured: featured === 'true' || featured === true
        })
        .select()
        .single()

    if (error) {
        throw new ApiError(500, 'Failed to create product')
    }

    return res
        .status(201)
        .json(new ApiResponse(201, product, 'Product created successfully'))
})

// ─── Update Product ────────────────────────────────
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    const {
        name,
        slug,
        description,
        category_id,
        specifications,
        featured
    } = req.body

    // Check product exists
    const { data: existing } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (!existing) {
        throw new ApiError(404, 'Product not found')
    }

    // Upload new images if provided
    let imageUrls = existing.images || []
    if (req.files?.images) {
        const imageFiles = Array.isArray(req.files.images)
            ? req.files.images
            : [req.files.images]

        for (const file of imageFiles) {
            const uploaded = await uploadOnCloudinary(
                file.path,
                'hammer-valve/products'
            )
            if (uploaded) {
                imageUrls.push(uploaded.secure_url)
            }
        }
    }

    // Upload new PDF if provided
    // Handle PDF
    let pdfUrl = existing.pdf_url

    // Remove PDF if requested
    if (req.body.remove_pdf === 'true') {
        if (existing.pdf_url) {
            const publicId = existing.pdf_url
                .split('/')
                .slice(-4)
                .join('/')
                .replace(/\.[^/.]+$/, '')
            await deleteFromCloudinary(publicId)
        }
        pdfUrl = null
    }

    // Upload new PDF if provided
    if (req.files?.pdf?.[0]) {
        const uploaded = await uploadOnCloudinary(
            req.files.pdf[0].path,
            'hammer-valve/documents'
        )
        if (uploaded) {
            pdfUrl = uploaded.secure_url
        }
    }

    // Parse specifications
    let specs = existing.specifications
    if (specifications) {
        specs = typeof specifications === 'string'
            ? JSON.parse(specifications)
            : specifications
    }

    // Update product
    const { data: product, error } = await supabase
        .from('products')
        .update({
            name: name || existing.name,
            slug: slug || existing.slug,
            description: description || existing.description,
            category_id: category_id || existing.category_id,
            images: imageUrls,
            pdf_url: pdfUrl,
            specifications: specs,
            featured: featured !== undefined
                ? (featured === 'true' || featured === true)
                : existing.featured,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        throw new ApiError(500, 'Failed to update product')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, product, 'Product updated successfully'))
})

// ─── Delete Product Image ──────────────────────────
const deleteProductImage = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { imageUrl } = req.body

    if (!imageUrl) {
        throw new ApiError(400, 'Image URL is required')
    }

    // Get product
    const { data: product } = await supabase
        .from('products')
        .select('images')
        .eq('id', id)
        .single()

    if (!product) {
        throw new ApiError(404, 'Product not found')
    }

    // Extract public ID from Cloudinary URL
    const publicId = imageUrl
        .split('/')
        .slice(-3)
        .join('/')
        .replace(/\.[^/.]+$/, '')

    // Delete from Cloudinary
    await deleteFromCloudinary(publicId)

    // Remove URL from images array
    const updatedImages = product.images.filter(img => img !== imageUrl)

    // Update Supabase
    const { error } = await supabase
        .from('products')
        .update({ images: updatedImages })
        .eq('id', id)

    if (error) {
        throw new ApiError(500, 'Failed to delete image')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Image deleted successfully'))
})

// ─── Delete Product ────────────────────────────────
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params

    // Get product first to delete images from Cloudinary
    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (!product) {
        throw new ApiError(404, 'Product not found')
    }

    // Delete all images from Cloudinary
    if (product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
            const publicId = imageUrl
                .split('/')
                .slice(-3)
                .join('/')
                .replace(/\.[^/.]+$/, '')
            await deleteFromCloudinary(publicId)
        }
    }

    // Delete PDF from Cloudinary
    if (product.pdf_url) {
        const publicId = product.pdf_url
            .split('/')
            .slice(-3)
            .join('/')
            .replace(/\.[^/.]+$/, '')
        await deleteFromCloudinary(publicId)
    }

    // Delete from Supabase
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

    if (error) {
        throw new ApiError(500, 'Failed to delete product')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Product deleted successfully'))
})

export {
    getAllProducts,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProductImage,
    deleteProduct,
    getProductById
}