import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import supabase from '../config/supabase.js'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : { emails: { send: async () => console.warn("Resend API key missing, skipping email notification") } }
const ADMIN_PHONE = process.env.ADMIN_PHONE || '9327841813'

// ─── Create Inquiry (Public) ───────────────────────
const createInquiry = asyncHandler(async (req, res) => {
    const { name, email, phone, company, message, product_id, source } = req.body

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
            source: source || 'contact_form',
            is_read: false
        })
        .select()
        .single()

    if (error) {
        throw new ApiError(500, 'Failed to save inquiry')
    }

    // Build WhatsApp follow-up URL for admin
    const customerPhone = phone ? phone.replace(/\D/g, '') : null
    const waFollowUpUrl = customerPhone
        ? `https://wa.me/${customerPhone}?text=${encodeURIComponent(`Hello ${name}, thank you for contacting Vertex Valve. We received your inquiry and our engineering team will assist you shortly.`)}`
        : null

    // Source label mapping
    const sourceLabels = {
        contact_form: '📋 Contact Form',
        whatsapp: '💬 WhatsApp',
        email: '📧 Email',
        phone: '📞 Phone Call',
        product_inquiry: '🔧 Product Inquiry',
    }
    const sourceLabel = sourceLabels[source] || sourceLabels.contact_form

    // Send email notification to admin via Resend
    try {
        await resend.emails.send({
            from: 'Vertex Valve <onboarding@resend.dev>',
            to: process.env.ADMIN_EMAIL,
            subject: `🔔 New Inquiry from ${name} — ${sourceLabel}`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">

                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #1E4356 0%, #0f2d3d 100%); padding: 28px 30px; border-radius: 12px 12px 0 0;">
                        <h1 style="margin: 0 0 6px 0; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">
                            🔔 New Customer Inquiry
                        </h1>
                        <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.7);">
                            Received via ${sourceLabel} • ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>

                    <!-- Customer Details -->
                    <div style="padding: 24px 30px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 12px 14px; font-weight: 600; color: #64748b; width: 120px; font-size: 13px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">👤 Name</td>
                                <td style="padding: 12px 14px; color: #1e293b; font-size: 14px; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 14px; font-weight: 600; color: #64748b; font-size: 13px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">✉️ Email</td>
                                <td style="padding: 12px 14px; border-bottom: 1px solid #f1f5f9;">
                                    <a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-size: 14px;">${email}</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 14px; font-weight: 600; color: #64748b; font-size: 13px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">📱 Phone</td>
                                <td style="padding: 12px 14px; color: #1e293b; font-size: 14px; border-bottom: 1px solid #f1f5f9;">
                                    ${phone
                    ? `<a href="tel:${phone}" style="color: #1e293b; text-decoration: none;">${phone}</a>`
                    : '<span style="color: #94a3b8;">Not provided</span>'
                }
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 14px; font-weight: 600; color: #64748b; font-size: 13px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">🏢 Company</td>
                                <td style="padding: 12px 14px; color: #1e293b; font-size: 14px; border-bottom: 1px solid #f1f5f9;">
                                    ${company || '<span style="color: #94a3b8;">Not provided</span>'}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 14px; font-weight: 600; color: #64748b; font-size: 13px; vertical-align: top;">📝 Source</td>
                                <td style="padding: 12px 14px;">
                                    <span style="display: inline-block; background: #eff6ff; color: #2563eb; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; border: 1px solid #bfdbfe;">
                                        ${sourceLabel}
                                    </span>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <!-- Message -->
                    <div style="margin: 0 30px; padding: 20px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;">
                        <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Customer Message</p>
                        <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.7; white-space: pre-wrap;">${message}</p>
                    </div>

                    <!-- Action Buttons -->
                    <div style="padding: 24px 30px; text-align: center;">
                        <table style="margin: 0 auto; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 0 6px;">
                                    <a href="mailto:${email}?subject=Re: Your inquiry to Vertex Valve&body=Dear ${name},%0A%0AThank you for contacting Vertex Valve.%0A%0A"
                                       style="display: inline-block; background: #1E4356; color: #ffffff; font-size: 13px; font-weight: 600; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
                                        ✉️ Reply via Email
                                    </a>
                                </td>
                                ${waFollowUpUrl ? `
                                <td style="padding: 0 6px;">
                                    <a href="${waFollowUpUrl}"
                                       target="_blank"
                                       style="display: inline-block; background: #22c55e; color: #ffffff; font-size: 13px; font-weight: 600; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
                                        💬 WhatsApp Reply
                                    </a>
                                </td>
                                ` : ''}
                                ${phone ? `
                                <td style="padding: 0 6px;">
                                    <a href="tel:${phone}"
                                       style="display: inline-block; background: #3b82f6; color: #ffffff; font-size: 13px; font-weight: 600; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
                                        📞 Call Now
                                    </a>
                                </td>
                                ` : ''}
                            </tr>
                        </table>
                    </div>

                    <!-- Footer -->
                    <div style="padding: 16px 30px; background: #f8fafc; border-radius: 0 0 12px 12px; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0; text-align: center; font-size: 12px; color: #94a3b8;">
                            Login to <a href="${process.env.CORS_ORIGIN || 'http://localhost:3000'}/backoffice-admin/inquiries" style="color: #2563eb; text-decoration: none;">Admin Panel</a> to view all inquiries
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
    const { is_read, source, page = 1, limit = 20 } = req.query

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

    // Filter by source
    if (source) {
        query = query.eq('source', source)
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

// ─── Get Inquiry Stats (Admin Dashboard) ───────────
const getInquiryStats = asyncHandler(async (req, res) => {
    // Get total count
    const { count: totalCount, error: totalErr } = await supabase
        .from('inquiries')
        .select('*', { count: 'exact', head: true })

    // Get unread count
    const { count: unreadCount, error: unreadErr } = await supabase
        .from('inquiries')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)

    // Get today's count
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count: todayCount, error: todayErr } = await supabase
        .from('inquiries')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString())

    // Get source-wise breakdown
    const { data: sourceData, error: sourceErr } = await supabase
        .from('inquiries')
        .select('source')

    const sourceCounts = {}
    if (sourceData) {
        sourceData.forEach(row => {
            const src = row.source || 'contact_form'
            sourceCounts[src] = (sourceCounts[src] || 0) + 1
        })
    }

    if (totalErr || unreadErr || todayErr) {
        throw new ApiError(500, 'Failed to fetch inquiry stats')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {
            total: totalCount || 0,
            unread: unreadCount || 0,
            today: todayCount || 0,
            by_source: sourceCounts,
        }, 'Inquiry stats fetched'))
})

export {
    createInquiry,
    getAllInquiries,
    getInquiryById,
    markAsRead,
    deleteInquiry,
    getUnreadCount,
    getInquiryStats
}