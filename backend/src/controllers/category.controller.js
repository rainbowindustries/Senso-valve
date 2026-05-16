import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import supabase from '../config/supabase.js'

// ─── Get All Categories ────────────────────────────
const getAllCategories = asyncHandler(async (req, res) => {

    const { data: categories, error } = await supabase
        .from('categories')
        .select(`
            *,
            products (
                id,
                name,
                slug,
                images,
                featured
            )
        `)
        .order('created_at', { ascending: true })

    if (error) {
        throw new ApiError(500, 'Failed to fetch categories')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, categories, 'Categories fetched successfully'))
})

// ─── Get Single Category ───────────────────────────
const getCategoryBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params

    const { data: category, error } = await supabase
        .from('categories')
        .select(`
            *,
            products (
                id,
                name,
                slug,
                images,
                specifications,
                featured
            )
        `)
        .eq('slug', slug)
        .single()

    if (error || !category) {
        throw new ApiError(404, 'Category not found')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, category, 'Category fetched successfully'))
})

// ─── Create Category ───────────────────────────────
const createCategory = asyncHandler(async (req, res) => {
    const { name, slug, description } = req.body

    if (!name || !slug) {
        throw new ApiError(400, 'Name and slug are required')
    }

    // Check slug is unique
    const { data: existing } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', slug)
        .single()

    if (existing) {
        throw new ApiError(409, 'Category with this slug already exists')
    }

    const { data: category, error } = await supabase
        .from('categories')
        .insert({ name, slug, description })
        .select()
        .single()

    if (error) {
        throw new ApiError(500, 'Failed to create category')
    }

    return res
        .status(201)
        .json(new ApiResponse(201, category, 'Category created successfully'))
})

// ─── Update Category ───────────────────────────────
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { name, slug, description } = req.body

    const { data: existing } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

    if (!existing) {
        throw new ApiError(404, 'Category not found')
    }

    const { data: category, error } = await supabase
        .from('categories')
        .update({
            name: name || existing.name,
            slug: slug || existing.slug,
            description: description || existing.description
        })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        throw new ApiError(500, 'Failed to update category')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, category, 'Category updated successfully'))
})

// ─── Delete Category ───────────────────────────────
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params

    const { data: existing } = await supabase
        .from('categories')
        .select('id')
        .eq('id', id)
        .single()

    if (!existing) {
        throw new ApiError(404, 'Category not found')
    }

    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

    if (error) {
        throw new ApiError(500, 'Failed to delete category')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Category deleted successfully'))
})

export {
    getAllCategories,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory
}