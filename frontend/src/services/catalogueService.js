import API from '@/lib/axios'

// Get all catalogues
export const getAllCatalogues = async () => {
    const { data } = await API.get('/catalogues')
    return data
}