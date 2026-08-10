import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

// Routes imports
import authRoutes from './src/routes/auth.routes.js'
import productRoutes from './src/routes/product.routes.js'
import categoryRoutes from './src/routes/category.routes.js'
import inquiryRoutes from './src/routes/inquiry.routes.js'
import catalogueRoutes from './src/routes/catalogue.routes.js'
import certificateRoutes from './src/routes/certificate.routes.js'
import galleryRoutes from './src/routes/gallery.routes.js'

const app = express()

// ─── Middlewares ───────────────────────────────────
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : ['http://localhost:3000']

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or SSR) or if origin is allowed
        if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(null, true)
        }
    },
    credentials: true
}))

app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static('public'))
app.use(cookieParser())

// ─── Routes ────────────────────────────────────────
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v1/inquiries', inquiryRoutes)
app.use('/api/v1/catalogues', catalogueRoutes)
app.use('/api/v1/certificates', certificateRoutes)
app.use('/api/v1/gallery', galleryRoutes)

// ─── Health check ──────────────────────────────────
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Hammer Valve API is running'
    })
})

// ─── 404 Handler ───────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    })
})

// ─── Global Error Handler ──────────────────────────
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal server error'

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: err.errors || []
    })
})

export default app