import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Upload file to cloudinary
const uploadOnCloudinary = async (localFilePath, folder = 'hammer-valve/products') => {
    try {
        if (!localFilePath) return null

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
            folder: folder
        })

        console.log('File uploaded on Cloudinary:', response.url)

        // Delete temp file after upload
        fs.unlinkSync(localFilePath)

        return response

    } catch (error) {
        // Delete temp file if upload fails
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }
        console.error('Cloudinary upload error:', error)
        return null
    }
}

// Delete file from cloudinary
const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null

        const response = await cloudinary.uploader.destroy(publicId)
        console.log('File deleted from Cloudinary:', publicId)
        return response

    } catch (error) {
        console.error('Cloudinary delete error:', error)
        return null
    }
}

export { uploadOnCloudinary, deleteFromCloudinary }