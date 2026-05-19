import { Router } from 'express'
import {
    getAllProducts,
    getProductBySlug,
    getProductById,        // ← add this
    createProduct,
    updateProduct,
    deleteProduct,
    deleteProductImage
} from '../controllers/product.controller.js'
import { verifyAdmin } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'

const router = Router()

// Public routes
router.get('/', getAllProducts)
router.get('/id/:id', getProductById)    // ← add this BEFORE /:slug
router.get('/:slug', getProductBySlug)

// Protected admin routes
router.post('/',
    verifyAdmin,
    upload.fields([
        { name: 'images', maxCount: 10 },
        { name: 'pdf', maxCount: 1 }
    ]),
    createProduct
)
router.put('/:id',
    verifyAdmin,
    upload.fields([
        { name: 'images', maxCount: 10 },
        { name: 'pdf', maxCount: 1 }
    ]),
    updateProduct
)
router.delete('/:id', verifyAdmin, deleteProduct)
router.delete('/:id/image', verifyAdmin, deleteProductImage)

export default router