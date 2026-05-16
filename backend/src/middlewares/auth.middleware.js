import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import supabase from '../config/supabase.js'

export const verifyAdmin = asyncHandler(async (req, _, next) => {
    try {
        // Get token from cookie or Authorization header
        const token = req.cookies?.accessToken ||
            req.header('Authorization')?.replace('Bearer ', '')

        if (!token) {
            throw new ApiError(401, 'Unauthorized request')
        }

        // Verify token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        // Find admin in Supabase
        const { data: admin, error } = await supabase
            .from('admins')
            .select('id, email')
            .eq('id', decodedToken?.id)
            .single()

        if (error || !admin) {
            throw new ApiError(401, 'Invalid access token')
        }

        // Attach admin to request
        req.admin = admin
        next()

    } catch (error) {
        throw new ApiError(401, error?.message || 'Invalid access token')
    }
})