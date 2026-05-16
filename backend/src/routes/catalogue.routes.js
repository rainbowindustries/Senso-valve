import { Router } from 'express'
import {
    getAllCatalogues,
    getCatalogueById,
    createCatalogue,
    updateCatalogue,
    deleteCatalogue
} from '../controllers/catalogue.controller.js'
import { verifyAdmin } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'

const router = Router()

// Public routes
router.get('/', getAllCatalogues)
router.get('/:id', getCatalogueById)

// Protected admin routes
router.post('/', verifyAdmin, upload.single('pdf'), createCatalogue)
router.put('/:id', verifyAdmin, upload.single('pdf'), updateCatalogue)
router.delete('/:id', verifyAdmin, deleteCatalogue)

export default router