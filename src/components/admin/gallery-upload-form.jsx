'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import imageCompression from 'browser-image-compression'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, X } from 'lucide-react'

export function GalleryUploadForm() {
    const router = useRouter()
    const [files, setFiles] = useState([])
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState({})

    const onDrop = async (acceptedFiles) => {
        // Limit to 5 images total
        const remainingSlots = 5 - files.length
        if (remainingSlots <= 0) {
            alert('Maximum 5 images allowed. Please remove some images first.')
            return
        }

        const filesToAdd = acceptedFiles.slice(0, remainingSlots)
        if (acceptedFiles.length > remainingSlots) {
            alert(`Only ${remainingSlots} image(s) can be added. Maximum 5 images allowed.`)
        }

        const compressedFiles = await Promise.all(
            filesToAdd.map(async (file) => {
                try {
                    const compressed = await imageCompression(file, {
                        maxSizeMB: 1,
                        maxWidthOrHeight: 1920,
                        useWebWorker: true,
                    })
                    return {
                        original: file,
                        compressed,
                        preview: URL.createObjectURL(compressed),
                    }
                } catch (error) {
                    console.error('Compression error:', error)
                    return {
                        original: file,
                        compressed: file,
                        preview: URL.createObjectURL(file),
                    }
                }
            })
        )
        setFiles((prev) => [...prev, ...compressedFiles])
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
        },
    })

    const removeFile = (index) => {
        setFiles((prev) => {
            const newFiles = [...prev]
            URL.revokeObjectURL(newFiles[index].preview)
            newFiles.splice(index, 1)
            return newFiles
        })
    }

    const handleUpload = async () => {
        if (files.length === 0) return

        setIsUploading(true)
        const uploadedUrls = []

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i].compressed
                const formData = new FormData()
                formData.append('file', file)

                setUploadProgress((prev) => ({ ...prev, [i]: 'uploading' }))

                const response = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: formData,
                })

                const data = await response.json()

                if (response.ok) {
                    uploadedUrls.push(data.url)
                    setUploadProgress((prev) => ({ ...prev, [i]: 'success' }))
                } else {
                    setUploadProgress((prev) => ({ ...prev, [i]: 'error' }))
                }
            }

            // Save to database
            for (const url of uploadedUrls) {
                await fetch('/api/admin/gallery', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        url,
                        isActive: true,
                        order: uploadedUrls.indexOf(url),
                    }),
                })
            }

            router.push('/admin/gallery')
            router.refresh()
        } catch (error) {
            console.error('Upload error:', error)
            alert('Error uploading images. Please try again.')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader>
                <CardTitle className="text-[#0d3980] font-serif font-bold text-2xl">Upload Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed p-12 text-center cursor-pointer transition-colors ${isDragActive
                        ? 'border-[#33baea] bg-[#33baea]/5'
                        : 'border-gray-300 hover:border-[#33baea]'
                        }`}
                >
                    <input {...getInputProps()} />
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">
                        {isDragActive
                            ? 'Drop the images here...'
                            : 'Drag & drop images here, or click to select'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Maximum 5 images per upload. Images will be automatically compressed.
                    </p>
                </div>

                {files.length > 0 && (
                    <div>
                        <h3 className="font-medium mb-4">Selected Images ({files.length})</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {files.map((file, index) => (
                                <div key={index} className="relative group">
                                    <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
                                        <img
                                            src={file.preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                        {uploadProgress[index] && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <span className="text-white text-sm">
                                                    {uploadProgress[index] === 'uploading' && 'Uploading...'}
                                                    {uploadProgress[index] === 'success' && '✓'}
                                                    {uploadProgress[index] === 'error' && '✗'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex gap-4">
                    <Button
                        onClick={handleUpload}
                        disabled={files.length === 0 || isUploading}
                        className="bg-[#0d3980] hover:bg-[#0d3980]/90 text-white font-sans"
                    >
                        {isUploading ? 'Uploading...' : `Upload ${files.length} Image${files.length !== 1 ? 's' : ''}`}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isUploading}
                        className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-sans"
                    >
                        Cancel
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

