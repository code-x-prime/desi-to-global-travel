import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

// Cloudflare R2 configuration
export const R2_CONFIG = {
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucketName: process.env.R2_BUCKET_NAME,
    publicUrl: process.env.R2_PUBLIC_URL,
    uploadFolder: process.env.UPLOAD_FOLDER || 'uploads',
}

// Initialize S3 client for R2 (R2 is S3-compatible)
const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_CONFIG.accountId}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_CONFIG.accessKeyId,
        secretAccessKey: R2_CONFIG.secretAccessKey,
    },
})

export function getR2PublicUrl(key) {
    if (!R2_CONFIG.publicUrl) {
        throw new Error('R2_PUBLIC_URL not configured')
    }
    // Remove leading slash if present
    const cleanKey = key.startsWith('/') ? key.slice(1) : key
    return `${R2_CONFIG.publicUrl}/${cleanKey}`
}

/**
 * Upload a file to Cloudflare R2
 * @param {Buffer|Uint8Array} fileBuffer - File buffer
 * @param {string} originalFileName - Original file name
 * @param {string} mimeType - File MIME type
 * @returns {Promise<string>} Public URL of the uploaded file
 */
export async function uploadToR2(fileBuffer, originalFileName, mimeType) {
    if (!R2_CONFIG.accountId || !R2_CONFIG.accessKeyId || !R2_CONFIG.secretAccessKey) {
        throw new Error('R2 credentials not configured')
    }

    // Generate unique file name
    const fileExtension = originalFileName.split('.').pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    const key = `${R2_CONFIG.uploadFolder}/${fileName}`

    try {
        // Upload to R2
        const command = new PutObjectCommand({
            Bucket: R2_CONFIG.bucketName,
            Key: key,
            Body: fileBuffer,
            ContentType: mimeType,
        })

        await s3Client.send(command)

        // Return public URL
        const cleanKey = key.startsWith('/') ? key.slice(1) : key
        const publicUrl = `${R2_CONFIG.publicUrl}/${cleanKey}`
        return publicUrl
    } catch (error) {
        console.error('R2 upload error:', error)
        throw new Error(`Failed to upload to R2: ${error.message}`)
    }
}

/**
 * Delete a file from Cloudflare R2
 * @param {string} url - Public URL of the file to delete
 * @returns {Promise<void>}
 */
export async function deleteFromR2(url) {
    if (!R2_CONFIG.accountId || !R2_CONFIG.accessKeyId || !R2_CONFIG.secretAccessKey) {
        console.warn('R2 credentials not configured, skipping delete')
        return
    }

    try {
        // Extract key from URL
        // URL format: https://pub-xxx.r2.dev/uploads/filename.jpg
        // or: https://pub-xxx.r2.dev/uploads/filename.jpg
        const urlObj = new URL(url)
        let key = urlObj.pathname

        // Remove leading slash if present
        if (key.startsWith('/')) {
            key = key.slice(1)
        }

        // Only delete if it's from our R2 bucket (check if URL contains our public URL)
        if (R2_CONFIG.publicUrl && !url.includes(R2_CONFIG.publicUrl)) {
            console.log('URL is not from our R2 bucket, skipping delete:', url)
            return
        }

        // Delete from R2
        const command = new DeleteObjectCommand({
            Bucket: R2_CONFIG.bucketName,
            Key: key,
        })

        await s3Client.send(command)
        console.log('Successfully deleted from R2:', key)
    } catch (error) {
        // Don't throw error, just log it (file might not exist or already deleted)
        console.warn('Error deleting from R2 (non-critical):', error.message)
    }
}

