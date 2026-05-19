import { Router } from 'express'
import {
    getAllCertificates,
    createCertificate,
    deleteCertificate
} from '../controllers/certificate.controller.js'
import { verifyAdmin } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'

const router = Router()

// Public
router.get('/', getAllCertificates)

// Admin only
router.post('/', verifyAdmin, upload.single('pdf'), createCertificate)
router.delete('/:id', verifyAdmin, deleteCertificate)

export default router