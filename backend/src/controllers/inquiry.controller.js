import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import supabase from '../config/supabase.js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// ─── Create Inquiry (Public) ───────────────────────
const createInquiry = asyncHandler(async (req, res) => {
    const { name, email, phone, company, message, product_id } = req.body

    // Validate required fields
    if (!name || !email || !message) {
        throw new ApiError(400, 'Name, email and message are required')
    }

    // Save inquiry to Supabase
    const { data: inquiry, error } = await supabase
        .from('inquiries')
        .insert({
            name,
            email,
            phone: phone || null,
            company: company || null,
            message,
            product_id: product_id || null,
            is_read: false
        })
        .select()
        .single()

    if (error) {
        throw new ApiError(500, 'Failed to save inquiry')
    }

    // Send email notification to admin via Resend
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: process.env.ADMIN_EMAIL,
            subject: `New Inquiry from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1e3a5f; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
                        New Inquiry Received
                    </h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px; font-weight: bold; color: #64748b; width: 30%;">Name</td>
                            <td style="padding: 10px; color: #1e293b;">${name}</td>
                        </tr>
                        <tr style="background: #f8fafc;">
                            <td style="padding: 10px; font-weight: bold; color: #64748b;">Email</td>
                            <td style="padding: 10px; color: #1e293b;">
                                <a href="mailto:${email}">${email}</a>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; font-weight: bold; color: #64748b;">Phone</td>
                            <td style="padding: 10px; color: #1e293b;">${phone || 'Not provided'}</td>
                        </tr>
                        <tr style="background: #f8fafc;">
                            <td style="padding: 10px; font-weight: bold; color: #64748b;">Company</td>
                            <td style="padding: 10px; color: #1e293b;">${company || 'Not provided'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; font-weight: bold; color: #64748b;">Message</td>
                            <td style="padding: 10px; color: #1e293b;">${message}</td>
                        </tr>
                    </table>
                    <div style="margin-top: 20px; padding: 15px; background: #eff6ff; border-radius: 8px;">
                        <p style="margin: 0; color: #1e3a5f; font-size: 14px;">
                            Login to admin panel to view and manage this inquiry.
                        </p>
                    </div>
                </div>
            `
        })
    } catch (emailError) {
        // Don't throw error if email fails
        // Inquiry is already saved to database
        console.error('Email notification failed:', emailError)
    }

    return res
        .status(201)
        .json(new ApiResponse(201, inquiry, 'Inquiry submitted successfully'))
})

// ─── Get All Inquiries (Admin) ─────────────────────
const getAllInquiries = asyncHandler(async (req, res) => {
    const { is_read, page = 1, limit = 20 } = req.query

    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
        .from('inquiries')
        .select(`
            *,
            products (
                id,
                name,
                slug
            )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

    // Filter by read status
    if (is_read !== undefined) {
        query = query.eq('is_read', is_read === 'true')
    }

    const { data: inquiries, error, count } = await query

    if (error) {
        throw new ApiError(500, 'Failed to fetch inquiries')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {
            inquiries,
            total: count,
            page: parseInt(page),
            limit: parseInt(limit)
        }, 'Inquiries fetched successfully'))
})

// ─── Get Single Inquiry (Admin) ────────────────────
const getInquiryById = asyncHandler(async (req, res) => {
    const { id } = req.params

    const { data: inquiry, error } = await supabase
        .from('inquiries')
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

    if (error || !inquiry) {
        throw new ApiError(404, 'Inquiry not found')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, inquiry, 'Inquiry fetched successfully'))
})

// ─── Mark Inquiry as Read (Admin) ─────────────────
const markAsRead = asyncHandler(async (req, res) => {
    const { id } = req.params

    const { data: inquiry, error } = await supabase
        .from('inquiries')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        throw new ApiError(500, 'Failed to update inquiry')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, inquiry, 'Inquiry marked as read'))
})

// ─── Delete Inquiry (Admin) ────────────────────────
const deleteInquiry = asyncHandler(async (req, res) => {
    const { id } = req.params

    const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id)

    if (error) {
        throw new ApiError(500, 'Failed to delete inquiry')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Inquiry deleted successfully'))
})

// ─── Get Unread Count (Admin) ──────────────────────
const getUnreadCount = asyncHandler(async (req, res) => {
    const { count, error } = await supabase
        .from('inquiries')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)

    if (error) {
        throw new ApiError(500, 'Failed to fetch unread count')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { unread: count }, 'Unread count fetched'))
})

export {
    createInquiry,
    getAllInquiries,
    getInquiryById,
    markAsRead,
    deleteInquiry,
    getUnreadCount
}