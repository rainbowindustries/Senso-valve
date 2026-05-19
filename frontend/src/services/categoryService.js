import API from '@/lib/axios'

// Get all categories
export const getAllCategories = async () => {
    const { data } = await API.get('/categories')
    return data
}

// Get category by slug with products
export const getCategoryBySlug = async (slug) => {
    const { data } = await API.get(`/categories/${slug}`)
    return data
}