import { Router } from 'express'
import {
    getAllCategories,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/category.controller.js'
import { verifyAdmin } from '../middlewares/auth.middleware.js'

const router = Router()

// Public routes
router.get('/', getAllCategories)
router.get('/:slug', getCategoryBySlug)

// Protected admin routes
router.post('/', verifyAdmin, createCategory)
router.put('/:id', verifyAdmin, updateCategory)
router.delete('/:id', verifyAdmin, deleteCategory)

export default router