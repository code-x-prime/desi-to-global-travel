'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { useDropzone } from 'react-dropzone'
import imageCompression from 'browser-image-compression'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import Image from 'next/image'

export function PackageForm({ package: initialPackage, categories = [] }) {
    const router = useRouter()
    const isEditing = !!initialPackage

    const [formData, setFormData] = useState({
        name: initialPackage?.name || '',
        slug: initialPackage?.slug || '',
        duration: initialPackage?.duration || '',
        description: initialPackage?.description || '',
        categoryId: initialPackage?.categoryId || '',
        price: initialPackage?.price || '',
        showPrice: initialPackage?.showPrice !== undefined ? initialPackage.showPrice : true,
        whatsappNumber: initialPackage?.whatsappNumber || '',
        isActive: initialPackage?.isActive !== undefined ? initialPackage.isActive : true,
        highlights: initialPackage?.highlights || [],
        itinerary: initialPackage?.itinerary || {},
        includes: initialPackage?.includes || [],
        excludes: initialPackage?.excludes || [],
        costDetails: initialPackage?.costDetails || '',
        detailedItinerary: initialPackage?.detailedItinerary || '',
    })

    const [highlightsInput, setHighlightsInput] = useState(
        initialPackage?.highlights?.join('\n') || ''
    )
    const [itineraryInput, setItineraryInput] = useState(
        typeof initialPackage?.itinerary === 'object'
            ? Object.entries(initialPackage.itinerary).map(([day, content]) => `${day}\n${content}`).join('\n\n')
            : ''
    )
    const [includesInput, setIncludesInput] = useState(
        initialPackage?.includes?.join('\n') || ''
    )
    const [excludesInput, setExcludesInput] = useState(
        initialPackage?.excludes?.join('\n') || ''
    )

    // Image states
    const [coverImage, setCoverImage] = useState(null)
    const [coverImagePreview, setCoverImagePreview] = useState(initialPackage?.images?.find(img => img.isPrimary)?.url || null)
    const [galleryImages, setGalleryImages] = useState([])
    const [galleryPreviews, setGalleryPreviews] = useState(initialPackage?.images?.filter(img => !img.isPrimary) || [])
    const [uploadingImages, setUploadingImages] = useState(false)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    // Cover image dropzone
    const { getRootProps: getCoverRootProps, getInputProps: getCoverInputProps, isDragActive: isCoverDragActive } = useDropzone({
        onDrop: async (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0]
                try {
                    const compressed = await imageCompression(file, {
                        maxSizeMB: 1,
                        maxWidthOrHeight: 1920,
                        useWebWorker: true,
                    })
                    setCoverImage(compressed)
                    setCoverImagePreview(URL.createObjectURL(compressed))
                } catch (error) {
                    console.error('Compression error:', error)
                    setCoverImage(file)
                    setCoverImagePreview(URL.createObjectURL(file))
                }
            }
        },
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
        multiple: false,
    })

    // Gallery images dropzone - limit to 5 total
    const { getRootProps: getGalleryRootProps, getInputProps: getGalleryInputProps, isDragActive: isGalleryDragActive } = useDropzone({
        onDrop: async (acceptedFiles) => {
            const totalImages = galleryImages.length + galleryPreviews.length
            const remainingSlots = 5 - totalImages
            if (remainingSlots <= 0) {
                alert('Maximum 5 gallery images allowed. Please remove some images first.')
                return
            }

            const filesToAdd = acceptedFiles.slice(0, remainingSlots)
            if (acceptedFiles.length > remainingSlots) {
                alert(`Only ${remainingSlots} image(s) can be added. Maximum 5 gallery images allowed.`)
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
                            file: compressed,
                            preview: URL.createObjectURL(compressed),
                        }
                    } catch (error) {
                        console.error('Compression error:', error)
                        return {
                            file: file,
                            preview: URL.createObjectURL(file),
                        }
                    }
                })
            )
            setGalleryImages((prev) => [...prev, ...compressedFiles])
        },
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
        multiple: true,
    })

    const removeGalleryImage = (index) => {
        setGalleryImages((prev) => {
            const newImages = [...prev]
            URL.revokeObjectURL(newImages[index].preview)
            newImages.splice(index, 1)
            return newImages
        })
    }

    const removeGalleryPreview = (index) => {
        setGalleryPreviews((prev) => {
            const newPreviews = [...prev]
            newPreviews.splice(index, 1)
            return newPreviews
        })
    }

    const uploadImage = async (file) => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/admin/upload', {
            method: 'POST',
            body: formData,
        })

        if (!response.ok) {
            throw new Error('Failed to upload image')
        }

        const data = await response.json()
        return data.url
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsSubmitting(true)
        setUploadingImages(true)

        try {
            // Upload images
            const images = []

            // Upload cover image
            if (coverImage) {
                const coverUrl = await uploadImage(coverImage)
                images.push({ url: coverUrl, alt: formData.name, isPrimary: true, order: 0 })
            } else if (coverImagePreview && !coverImage) {
                // Keep existing cover image
                images.push({ url: coverImagePreview, alt: formData.name, isPrimary: true, order: 0 })
            }

            // Upload gallery images
            for (let i = 0; i < galleryImages.length; i++) {
                const galleryUrl = await uploadImage(galleryImages[i].file)
                images.push({ url: galleryUrl, alt: `${formData.name} - Gallery ${i + 1}`, isPrimary: false, order: i + 1 })
            }

            // Keep existing gallery previews
            galleryPreviews.forEach((preview, index) => {
                images.push({ url: preview.url, alt: preview.alt || `${formData.name} - Gallery ${index + 1}`, isPrimary: false, order: images.length })
            })

            // Parse highlights
            const highlights = highlightsInput
                .split('\n')
                .map((h) => h.trim())
                .filter((h) => h.length > 0)

            // Parse itinerary
            const itinerary = {}
            if (itineraryInput.trim()) {
                const sections = itineraryInput.split('\n\n')
                sections.forEach((section) => {
                    const lines = section.split('\n')
                    if (lines.length >= 2) {
                        const day = lines[0].trim()
                        const content = lines.slice(1).join('\n').trim()
                        if (day && content) {
                            itinerary[day] = content
                        }
                    }
                })
            }

            // Parse includes
            const includes = includesInput
                .split('\n')
                .map((i) => i.trim())
                .filter((i) => i.length > 0)

            // Parse excludes
            const excludes = excludesInput
                .split('\n')
                .map((e) => e.trim())
                .filter((e) => e.length > 0)

            const payload = {
                ...formData,
                highlights,
                itinerary,
                includes,
                excludes,
                costDetails: formData.costDetails || null,
                categoryId: formData.categoryId || null,
                price: formData.price || null,
                showPrice: formData.showPrice,
                whatsappNumber: formData.whatsappNumber || null,
                images: images.length > 0 ? images : undefined,
            }

            const url = isEditing
                ? `/api/admin/packages/${initialPackage.id}`
                : '/api/admin/packages'
            const method = isEditing ? 'PATCH' : 'POST'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            const data = await response.json()

            if (response.ok) {
                router.push('/admin/packages')
                router.refresh()
            } else {
                setError(data.error || 'Failed to save package')
            }
        } catch (error) {
            console.error('Error:', error)
            setError('Network error. Please try again.')
        } finally {
            setIsSubmitting(false)
            setUploadingImages(false)
        }
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    // Auto-generate slug from name
    useEffect(() => {
        if (!isEditing && formData.name) {
            const slug = formData.name
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
            setFormData((prev) => ({ ...prev, slug }))
        }
    }, [formData.name, isEditing])

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader>
                <CardTitle className="text-[#0d3980] font-serif font-bold text-2xl">{isEditing ? 'Edit Package' : 'Create Package'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="name" className="text-[#0d3980] font-semibold font-sans">Package Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 h-12 border-2 border-gray-200 focus:border-[#0d3980] font-sans"
                                placeholder="Enter package name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="slug" className="text-[#0d3980] font-semibold font-sans">Slug *</Label>
                            <Input
                                id="slug"
                                name="slug"
                                required
                                value={formData.slug}
                                onChange={handleChange}
                                className="mt-1 h-12 border-2 border-gray-200 focus:border-[#0d3980] font-sans"
                                placeholder="auto-generated-slug"
                            />
                            <p className="text-xs text-gray-500 mt-1 font-sans">Auto-generated from name</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="duration" className="text-[#0d3980] font-semibold font-sans">Duration *</Label>
                            <Input
                                id="duration"
                                name="duration"
                                required
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="e.g., 7 Days / 6 Nights"
                                className="mt-1 h-12 border-2 border-gray-200 focus:border-[#0d3980] font-sans"
                            />
                        </div>
                        <div>
                            <Label htmlFor="categoryId" className="text-[#0d3980] font-semibold font-sans">Category</Label>
                            <Select
                                value={formData.categoryId || 'none'}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value === 'none' ? '' : value }))}
                            >
                                <SelectTrigger className="mt-1 h-12 border-2 border-gray-200 focus:border-[#0d3980] font-sans">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                        <input
                            type="checkbox"
                            id="showPrice"
                            name="showPrice"
                            checked={formData.showPrice}
                            onChange={(e) => setFormData((prev) => ({ ...prev, showPrice: e.target.checked }))}
                            className="h-4 w-4 accent-[#0d3980]"
                        />
                        <Label htmlFor="showPrice" className="cursor-pointer font-sans text-gray-700">
                            Show Price on Website
                        </Label>
                    </div>

                    {formData.showPrice && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <Label htmlFor="price" className="text-[#0d3980] font-semibold font-sans">Price (Optional)</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="text"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="e.g., ₹25,000 or $500"
                                    className="mt-1 h-12 border-2 border-gray-200 focus:border-[#0d3980] font-sans"
                                />
                            </div>
                            <div>
                                <Label htmlFor="whatsappNumber" className="text-[#0d3980] font-semibold font-sans">WhatsApp Number (Optional)</Label>
                                <Input
                                    id="whatsappNumber"
                                    name="whatsappNumber"
                                    type="tel"
                                    value={formData.whatsappNumber}
                                    onChange={handleChange}
                                    placeholder="e.g., +91 1234567890"
                                    className="mt-1 h-12 border-2 border-gray-200 focus:border-[#0d3980] font-sans"
                                />
                            </div>
                        </div>
                    )}

                    {!formData.showPrice && (
                        <div className="mb-6">
                            <Label htmlFor="whatsappNumber" className="text-[#0d3980] font-semibold font-sans">WhatsApp Number (Optional)</Label>
                            <Input
                                id="whatsappNumber"
                                name="whatsappNumber"
                                type="tel"
                                value={formData.whatsappNumber}
                                onChange={handleChange}
                                placeholder="e.g., +91 1234567890"
                                className="mt-1 h-12 border-2 border-gray-200 focus:border-[#0d3980] font-sans"
                            />
                        </div>
                    )}

                    {/* Cover Image Upload */}
                    <div>
                        <Label className="text-[#0d3980] font-semibold font-sans mb-2 block">Cover Image *</Label>
                        {coverImagePreview ? (
                            <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
                                <Image
                                    src={coverImagePreview}
                                    alt="Cover preview"
                                    className="w-full h-full object-cover"
                                    width={1920}
                                    height={1080}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCoverImage(null)
                                        setCoverImagePreview(null)
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div
                                {...getCoverRootProps()}
                                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isCoverDragActive
                                    ? 'border-[#0d3980] bg-[#0d3980]/5'
                                    : 'border-gray-300 hover:border-[#0d3980]'
                                    }`}
                            >
                                <input {...getCoverInputProps()} />
                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-gray-600 font-sans">
                                    {isCoverDragActive ? 'Drop the image here...' : 'Drag & drop cover image, or click to select'}
                                </p>
                                <p className="text-sm text-gray-500 mt-2 font-sans">Recommended: 1920x1080px</p>
                            </div>
                        )}
                    </div>

                    {/* Gallery Images Upload */}
                    <div>
                        <Label className="text-[#0d3980] font-semibold font-sans mb-2 block">Gallery Images (Optional)</Label>
                        <div
                            {...getGalleryRootProps()}
                            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors mb-4 ${isGalleryDragActive
                                ? 'border-[#33baea] bg-[#33baea]/5'
                                : 'border-gray-300 hover:border-[#33baea]'
                                }`}
                        >
                            <input {...getGalleryInputProps()} />
                            <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                            <p className="text-gray-600 font-sans">
                                {isGalleryDragActive ? 'Drop images here...' : 'Drag & drop gallery images, or click to select'}
                            </p>
                            <p className="text-sm text-gray-500 mt-2 font-sans">Maximum 5 gallery images allowed. You can select multiple images.</p>
                        </div>

                        {(galleryImages.length > 0 || galleryPreviews.length > 0) && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {galleryPreviews.map((preview, index) => (
                                    <div key={`preview-${index}`} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                                        <Image
                                            src={preview.url}
                                            alt={preview.alt || `Gallery ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            width={1920}
                                            height={1080}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryPreview(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md hover:bg-red-600 transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                                {galleryImages.map((img, index) => (
                                    <div key={`new-${index}`} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                                        <Image
                                            src={img.preview}
                                            alt={`New gallery ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            width={1920}
                                            height={1080}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md hover:bg-red-600 transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Description with Rich Text Editor */}
                    <div>
                        <Label htmlFor="description" className="text-[#0d3980] font-semibold font-sans mb-2 block">Description</Label>
                        <RichTextEditor
                            value={formData.description || ''}
                            onChange={(content) => {
                                // Use functional update to prevent stale closures
                                setFormData((prev) => {
                                    if (prev.description !== content) {
                                        return { ...prev, description: content }
                                    }
                                    return prev
                                })
                            }}
                            placeholder="Enter detailed package description..."
                        />
                    </div>

                    <div>
                        <Label htmlFor="highlights" className="text-[#0d3980] font-semibold font-sans">Highlights (one per line) *</Label>
                        <Textarea
                            id="highlights"
                            rows={6}
                            value={highlightsInput}
                            onChange={(e) => setHighlightsInput(e.target.value)}
                            placeholder="Enter each highlight on a new line"
                            className="mt-1 border-2 border-gray-200 focus:border-[#0d3980] font-sans resize-none"
                        />
                    </div>

                    {/* Tabs for Itinerary, Package Cost, Includes, Excludes */}
                    <Tabs defaultValue="itinerary" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 bg-gray-100">
                            <TabsTrigger value="itinerary" className="font-sans">Itinerary</TabsTrigger>
                            <TabsTrigger value="cost" className="font-sans">Package Cost</TabsTrigger>
                            <TabsTrigger value="includes" className="font-sans">Includes</TabsTrigger>
                            <TabsTrigger value="excludes" className="font-sans">Does Not Include</TabsTrigger>
                        </TabsList>

                        <TabsContent value="itinerary" className="mt-4">
                            <div>
                                <Label htmlFor="detailedItinerary" className="text-[#0d3980] font-semibold font-sans mb-2 block">Detailed Itinerary</Label>
                                <RichTextEditor
                                    value={formData.detailedItinerary || ''}
                                    onChange={(content) => setFormData((prev) => ({ ...prev, detailedItinerary: content }))}
                                    placeholder="Enter detailed itinerary with day-by-day breakdown..."
                                />
                                <p className="text-xs text-gray-500 mt-2 font-sans">
                                    Use the editor to format your itinerary with rich text, lists, and styling.
                                </p>
                            </div>
                        </TabsContent>

                        <TabsContent value="cost" className="mt-4">
                            <div>
                                <Label htmlFor="costDetails" className="text-[#0d3980] font-semibold font-sans mb-2 block">Package Cost Details</Label>
                                <RichTextEditor
                                    value={formData.costDetails || ''}
                                    onChange={(content) => setFormData((prev) => ({ ...prev, costDetails: content }))}
                                    placeholder="Enter detailed cost breakdown, payment terms, cancellation policy, etc..."
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="includes" className="mt-4">
                            <div>
                                <Label htmlFor="includes" className="text-[#0d3980] font-semibold font-sans mb-2 block">What&apos;s Included (one per line)</Label>
                                <Textarea
                                    id="includes"
                                    rows={10}
                                    value={includesInput}
                                    onChange={(e) => setIncludesInput(e.target.value)}
                                    placeholder="Enter each included item on a new line&#10;e.g.,&#10;Accommodation&#10;Meals&#10;Transportation"
                                    className="border-2 border-gray-200 focus:border-[#0d3980] font-sans resize-none"
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="excludes" className="mt-4">
                            <div>
                                <Label htmlFor="excludes" className="text-[#0d3980] font-semibold font-sans mb-2 block">What&apos;s Not Included (one per line)</Label>
                                <Textarea
                                    id="excludes"
                                    rows={10}
                                    value={excludesInput}
                                    onChange={(e) => setExcludesInput(e.target.value)}
                                    placeholder="Enter each excluded item on a new line&#10;e.g.,&#10;International flights&#10;Travel insurance&#10;Personal expenses"
                                    className="border-2 border-gray-200 focus:border-[#0d3980] font-sans resize-none"
                                />
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="h-4 w-4 accent-[#0d3980]"
                        />
                        <Label htmlFor="isActive" className="cursor-pointer font-sans text-gray-700">
                            Active (visible on website)
                        </Label>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-800 border-2 border-red-200 text-sm font-sans">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting || uploadingImages}
                            className="bg-[#0d3980] hover:bg-[#0d3980]/90 text-white font-sans"
                        >
                            {isSubmitting || uploadingImages ? 'Saving...' : isEditing ? 'Update Package' : 'Create Package'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-sans"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
