import API from '@/lib/axios'

// Get all products
export const getAllProducts = async (params = {}) => {
    const { data } = await API.get('/products', { params })
    return data
}

// Get single product by slug
export const getProductBySlug = async (slug) => {
    const { data } = await API.get(`/products/${slug}`)
    return data
}

// Get featured products
export const getFeaturedProducts = async () => {
    const { data } = await API.get('/products', {
        params: { featured: true }
    })
    return data
}