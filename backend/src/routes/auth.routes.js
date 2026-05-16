import { Router } from 'express'
import {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    getCurrentAdmin,
    changePassword
} from '../controllers/auth.controller.js'
import { verifyAdmin } from '../middlewares/auth.middleware.js'

const router = Router()

// Public routes
router.post('/register', registerAdmin)
router.post('/login', loginAdmin)

// Protected routes
router.post('/logout', verifyAdmin, logoutAdmin)
router.get('/me', verifyAdmin, getCurrentAdmin)
router.post('/change-password', verifyAdmin, changePassword)

export default router