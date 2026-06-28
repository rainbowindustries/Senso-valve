import { Router } from 'express'
import {
    getGalleryImages,
    uploadGalleryImage,
    renameGalleryImage,
    deleteGalleryImage
} from '../controllers/gallery.controller.js'
import { verifyAdmin } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'

const router = Router()

// Public
router.get('/', getGalleryImages)

// Admin
router.post('/', verifyAdmin, upload.single('image'), uploadGalleryImage)
router.patch('/:id', verifyAdmin, renameGalleryImage)
router.delete('/:id', verifyAdmin, deleteGalleryImage)

export default router