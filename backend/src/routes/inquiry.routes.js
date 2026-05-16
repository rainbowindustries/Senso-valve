import { Router } from 'express'
import {
    createInquiry,
    getAllInquiries,
    getInquiryById,
    markAsRead,
    deleteInquiry,
    getUnreadCount
} from '../controllers/inquiry.controller.js'
import { verifyAdmin } from '../middlewares/auth.middleware.js'

const router = Router()

// Public routes
router.post('/', createInquiry)

// Protected admin routes
router.get('/', verifyAdmin, getAllInquiries)
router.get('/unread-count', verifyAdmin, getUnreadCount)
router.get('/:id', verifyAdmin, getInquiryById)
router.patch('/:id/read', verifyAdmin, markAsRead)
router.delete('/:id', verifyAdmin, deleteInquiry)

export default router