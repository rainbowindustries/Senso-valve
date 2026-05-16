import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
        // Add timestamp to avoid duplicate filenames
        const uniqueName = Date.now() + '-' + file.originalname
        cb(null, uniqueName)
    }
})

// File filter — only allow images and PDFs
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'application/pdf'
    ]

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Only images and PDF files are allowed'), false)
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max
    }
})