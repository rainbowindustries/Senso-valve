import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import supabase from '../config/supabase.js'

// Generate JWT token
const generateToken = (adminId) => {
    return jwt.sign(
        { id: adminId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY }
    )
}

// ─── Register Admin ───────────────────────────────
// Only use this once to create admin account
const registerAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new ApiError(400, 'Email and password are required')
    }

    // Check if admin already exists
    const { data: existingAdmin } = await supabase
        .from('admins')
        .select('id')
        .eq('email', email)
        .single()

    if (existingAdmin) {
        throw new ApiError(409, 'Admin already exists')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Save admin to Supabase
    const { data: admin, error } = await supabase
        .from('admins')
        .insert({ email, password: hashedPassword })
        .select('id, email')
        .single()

    if (error) {
        throw new ApiError(500, 'Failed to create admin')
    }

    return res
        .status(201)
        .json(new ApiResponse(201, { email: admin.email }, 'Admin registered successfully'))
})

// ─── Login Admin ───────────────────────────────────
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new ApiError(400, 'Email and password are required')
    }

    // Find admin
    const { data: admin, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .single()

    if (error || !admin) {
        throw new ApiError(404, 'Admin not found')
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password)

    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid credentials')
    }

    // Generate token
    const token = generateToken(admin.id)

    // Cookie options
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }

    return res
        .status(200)
        .cookie('accessToken', token, options)
        .json(new ApiResponse(200, {
            admin: { id: admin.id, email: admin.email },
            token
        }, 'Login successful'))
})

// ─── Logout Admin ──────────────────────────────────
const logoutAdmin = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    }

    return res
        .status(200)
        .clearCookie('accessToken', options)
        .json(new ApiResponse(200, {}, 'Logout successful'))
})

// ─── Get Current Admin ─────────────────────────────
const getCurrentAdmin = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.admin, 'Admin fetched successfully'))
})

// ─── Change Password ───────────────────────────────
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
        throw new ApiError(400, 'Current and new password are required')
    }

    // Get admin with password
    const { data: admin } = await supabase
        .from('admins')
        .select('*')
        .eq('id', req.admin.id)
        .single()

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password)

    if (!isPasswordValid) {
        throw new ApiError(401, 'Current password is incorrect')
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    const { error } = await supabase
        .from('admins')
        .update({ password: hashedPassword })
        .eq('id', req.admin.id)

    if (error) {
        throw new ApiError(500, 'Failed to update password')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Password changed successfully'))
})

export {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    getCurrentAdmin,
    changePassword
}