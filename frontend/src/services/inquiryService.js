import API from '@/lib/axios'

// Submit contact form
export const submitInquiry = async (formData) => {
    const { data } = await API.post('/inquiries', formData)
    return data
}