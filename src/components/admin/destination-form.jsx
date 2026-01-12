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
import { X, Image as ImageIcon } from 'lucide-react'
import { COUNTRIES, REGIONS, COUNTRY_REGIONS } from '@/lib/countries-regions'
import Image from 'next/image'

export function DestinationForm({ destination: initialDestination, categories = [] }) {
    const router = useRouter()
    const isEditing = !!initialDestination

    const [formData, setFormData] = useState({
        name: initialDestination?.name || '',
        slug: initialDestination?.slug || '',
        description: initialDestination?.description || '',
        country: initialDestination?.country || '',
        region: initialDestination?.region || '',
        categoryId: initialDestination?.categoryId || '',
        duration: initialDestination?.duration || '',
        tripOverview: initialDestination?.tripOverview || '',
        tripHighlights: initialDestination?.tripHighlights || [],
        detailedItinerary: initialDestination?.detailedItinerary || '',
        isActive: initialDestination?.isActive !== undefined ? initialDestination.isActive : true,
    })


    const [tripHighlightsContent, setTripHighlightsContent] = useState(() => {
        if (!initialDestination?.tripHighlights || initialDestination.tripHighlights.length === 0) {
            return ''
        }
        // If first element looks like HTML, use it directly, otherwise join
        const first = initialDestination.tripHighlights[0]
        if (first && first.includes('<')) {
            return first
        }
        return initialDestination.tripHighlights.join('\n')
    })

    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(initialDestination?.imageUrl || null)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    // Image dropzone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: async (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0]
                try {
                    const compressed = await imageCompression(file, {
                        maxSizeMB: 5, // Increased from 1MB to preserve quality
                        maxWidthOrHeight: 2560, // Increased for better HD quality
                        useWebWorker: true,
                        initialQuality: 0.92, // High quality compression
                    })
                    setImageFile(compressed)
                    setImagePreview(URL.createObjectURL(compressed))
                } catch (error) {
                    console.error('Compression error:', error)
                    setImageFile(file)
                    setImagePreview(URL.createObjectURL(file))
                }
            }
        },
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
        multiple: false,
    })

    const removeImage = () => {
        setImageFile(null)
        setImagePreview(null)
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    // Get available regions based on selected country
    const availableRegions = formData.country && COUNTRY_REGIONS[formData.country]
        ? COUNTRY_REGIONS[formData.country]
        : REGIONS

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

    // Reset region when country changes
    useEffect(() => {
        if (formData.country && COUNTRY_REGIONS[formData.country]) {
            // If current region is not in available regions, reset it
            if (formData.region && !COUNTRY_REGIONS[formData.country].includes(formData.region)) {
                setFormData((prev) => ({ ...prev, region: '' }))
            }
        }
    }, [formData.country, formData.region])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsSubmitting(true)
        setUploadingImage(true)

        try {
            // Determine imageUrl based on current state
            let imageUrl = null

            // Upload image if new file selected
            if (imageFile) {
                const formData = new FormData()
                formData.append('file', imageFile)

                const uploadResponse = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: formData,
                })

                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload image')
                }

                const uploadData = await uploadResponse.json()
                imageUrl = uploadData.url
            } else if (imagePreview) {
                // No new file, but imagePreview exists - keep existing image
                // imagePreview could be the original URL or a blob URL (both are truthy)
                // If it's the original URL from initialDestination, use it
                // If user removed image (imagePreview is null), imageUrl stays null
                imageUrl = initialDestination?.imageUrl || null
            }
            // If imagePreview is null and no new file, imageUrl stays null (user removed image)

            setUploadingImage(false)

            // Convert tripHighlights content to array (store as HTML string for rich text)
            // For now, we'll store it as a single string in the array
            const tripHighlights = tripHighlightsContent.trim()
                ? [tripHighlightsContent] // Store as single HTML string
                : []

            const payload = {
                ...formData,
                imageUrl,
                tripHighlights,
                categoryId: formData.categoryId || null,
            }

            const url = isEditing
                ? `/api/admin/destinations/${initialDestination.id}`
                : '/api/admin/destinations'
            const method = isEditing ? 'PATCH' : 'POST'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            const data = await response.json()

            if (response.ok) {
                router.push('/admin/destinations')
                router.refresh()
            } else {
                setError(data.error || 'Failed to save destination')
            }
        } catch (error) {
            console.error('Error:', error)
            setError('Network error. Please try again.')
        } finally {
            setIsSubmitting(false)
            setUploadingImage(false)
        }
    }

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader>
                <CardTitle className="text-[#0d3980] font-serif font-bold text-2xl">
                    {isEditing ? 'Edit Destination' : 'Create Destination'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload - At the Top */}
                    <div>
                        <Label className="text-[#0d3980] font-semibold font-sans mb-2 block">Destination Image (Optional)</Label>
                        {imagePreview ? (
                            <div className="relative w-full max-w-md">
                                <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                                    <Image
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        width={800}
                                        height={450}
                                        priority
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 font-sans">Click the X button to remove and upload a new image</p>
                            </div>
                        ) : (
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                                    ? 'border-[#0d3980] bg-[#0d3980]/5'
                                    : 'border-gray-300 hover:border-[#0d3980] hover:bg-gray-50'
                                    }`}
                            >
                                <input {...getInputProps()} />
                                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-sm text-gray-600 font-sans font-medium">
                                    {isDragActive ? 'Drop image here' : 'Drag & drop image or click to select'}
                                </p>
                                <p className="text-xs text-gray-500 mt-2 font-sans">PNG, JPG, WEBP up to 10MB. Recommended: 1920x1080px</p>
                            </div>
                        )}
                    </div>

                    {/* Basic Information Section */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-serif font-bold text-[#0d3980] mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="name" className="text-[#0d3980] font-semibold font-sans">Destination Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 h-12 border-2 border-gray-200 focus:border-[#0d3980] font-sans"
                                    placeholder="Enter destination name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="slug" className="text-[#0d3980] font-semibold font-sans">Slug</Label>
                                <Input
                                    id="slug"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className="mt-1 h-12 border-2 border-gray-200 focus:border-[#0d3980] font-sans"
                                    placeholder="auto-generated"
                                />
                                <p className="text-xs text-gray-500 mt-1 font-sans">Auto-generated from name</p>
                            </div>
                        </div>
                    </div>

                    {/* Short Description */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-serif font-bold text-[#0d3980] mb-4">Short Description</h3>
                        <div>
                            <Label htmlFor="description" className="text-[#0d3980] font-semibold font-sans">Short Description (Optional)</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="mt-1 border-2 border-gray-200 focus:border-[#0d3980] font-sans min-h-[100px]"
                                placeholder="Enter a brief description of this destination (appears on destination cards)"
                            />
                            <p className="text-xs text-gray-500 mt-1 font-sans">This is a short summary shown on destination listings and social shares</p>
                        </div>
                    </div>

                    {/* Location Information */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-serif font-bold text-[#0d3980] mb-4">Location Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="country" className="text-[#0d3980] font-semibold font-sans">Country (Optional)</Label>
                                <Select
                                    value={formData.country || 'none'}
                                    onValueChange={(value) => {
                                        const countryValue = value === 'none' ? '' : value
                                        setFormData((prev) => ({
                                            ...prev,
                                            country: countryValue,
                                            // Reset region if country changes and region is not available for new country
                                            region: countryValue && COUNTRY_REGIONS[countryValue] && prev.region && !COUNTRY_REGIONS[countryValue].includes(prev.region) ? '' : prev.region
                                        }))
                                    }}
                                >
                                    <SelectTrigger className="mt-1 h-12 border-2 border-gray-200 focus:border-[#0d3980] font-sans">
                                        <SelectValue placeholder="Select a country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        {COUNTRIES.map((country) => (
                                            <SelectItem key={country} value={country}>
                                                {country}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="region" className="text-[#0d3980] font-semibold font-sans">
                                    Region (Optional)
                                    {formData.country && COUNTRY_REGIONS[formData.country] && (
                                        <span className="text-xs text-gray-500 ml-2 font-normal">(Filtered by {formData.country})</span>
                                    )}
                                </Label>
                                <Select
                                    value={formData.region || 'none'}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, region: value === 'none' ? '' : value }))}
                                    disabled={!formData.country}
                                >
                                    <SelectTrigger className="mt-1 h-12 border-2 border-gray-200 focus:border-[#0d3980] font-sans">
                                        <SelectValue placeholder={formData.country ? "Select a region" : "Select country first"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        {availableRegions.map((region) => (
                                            <SelectItem key={region} value={region}>
                                                {region}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {!formData.country && (
                                    <p className="text-xs text-gray-500 mt-1 font-sans">Please select a country first to see relevant regions</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Category and Duration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <div>
                            <Label htmlFor="duration" className="text-[#0d3980] font-semibold font-sans">Duration (Optional)</Label>
                            <div className="flex gap-2 mt-1">
                                <Select
                                    value={formData.duration || 'none'}
                                    onValueChange={(value) => {
                                        if (value === 'custom') {
                                            setFormData((prev) => ({ ...prev, duration: '' }))
                                        } else {
                                            setFormData((prev) => ({ ...prev, duration: value === 'none' ? '' : value }))
                                        }
                                    }}
                                >
                                    <SelectTrigger className="flex-1 h-12 border-2 border-gray-200 focus:border-[#0d3980] font-sans">
                                        <SelectValue placeholder="Select duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        <SelectItem value="1 Day">1 Day</SelectItem>
                                        <SelectItem value="2 Days / 1 Night">2 Days / 1 Night</SelectItem>
                                        <SelectItem value="3 Days / 2 Nights">3 Days / 2 Nights</SelectItem>
                                        <SelectItem value="4 Days / 3 Nights">4 Days / 3 Nights</SelectItem>
                                        <SelectItem value="5 Days / 4 Nights">5 Days / 4 Nights</SelectItem>
                                        <SelectItem value="6 Days / 5 Nights">6 Days / 5 Nights</SelectItem>
                                        <SelectItem value="7 Days / 6 Nights">7 Days / 6 Nights</SelectItem>
                                        <SelectItem value="8 Days / 7 Nights">8 Days / 7 Nights</SelectItem>
                                        <SelectItem value="9 Days / 8 Nights">9 Days / 8 Nights</SelectItem>
                                        <SelectItem value="10 Days / 9 Nights">10 Days / 9 Nights</SelectItem>
                                        <SelectItem value="12 Days / 11 Nights">12 Days / 11 Nights</SelectItem>
                                        <SelectItem value="14 Days / 13 Nights">14 Days / 13 Nights</SelectItem>
                                        <SelectItem value="15 Days / 14 Nights">15 Days / 14 Nights</SelectItem>
                                        <SelectItem value="custom">Custom Duration</SelectItem>
                                    </SelectContent>
                                </Select>
                                {(!formData.duration || !['1 Day', '2 Days / 1 Night', '3 Days / 2 Nights', '4 Days / 3 Nights', '5 Days / 4 Nights', '6 Days / 5 Nights', '7 Days / 6 Nights', '8 Days / 7 Nights', '9 Days / 8 Nights', '10 Days / 9 Nights', '12 Days / 11 Nights', '14 Days / 13 Nights', '15 Days / 14 Nights'].includes(formData.duration)) && (
                                    <Input
                                        id="duration"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        placeholder="Custom (e.g., 21 Days / 20 Nights)"
                                        className="flex-1 h-12 border-2 border-gray-200 focus:border-[#0d3980] font-sans"
                                    />
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1 font-sans">Select from common durations or enter custom</p>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-serif font-bold text-[#0d3980] mb-4">Content Details</h3>
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="tripOverview" className="text-[#0d3980] font-semibold font-sans mb-2 block">Trip Overview (Optional)</Label>
                                <RichTextEditor
                                    value={formData.tripOverview || ''}
                                    onChange={(content) => {
                                        setFormData((prev) => {
                                            if (prev.tripOverview !== content) {
                                                return { ...prev, tripOverview: content }
                                            }
                                            return prev
                                        })
                                    }}
                                    placeholder="Enter trip overview description..."
                                />
                            </div>

                            <div>
                                <Label htmlFor="tripHighlights" className="text-[#0d3980] font-semibold font-sans mb-2 block">Trip Highlights (Optional)</Label>
                                <RichTextEditor
                                    value={tripHighlightsContent}
                                    onChange={(content) => {
                                        setTripHighlightsContent(content)
                                    }}
                                    placeholder="Enter trip highlights with rich text formatting..."
                                />
                                <p className="text-xs text-gray-500 mt-2 font-sans">
                                    Use the editor to format your highlights with rich text, lists, and styling.
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="detailedItinerary" className="text-[#0d3980] font-semibold font-sans mb-2 block">Detailed Itinerary (Optional)</Label>
                                <RichTextEditor
                                    value={formData.detailedItinerary || ''}
                                    onChange={(content) => {
                                        setFormData((prev) => {
                                            if (prev.detailedItinerary !== content) {
                                                return { ...prev, detailedItinerary: content }
                                            }
                                            return prev
                                        })
                                    }}
                                    placeholder="Enter detailed itinerary..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="h-4 w-4 text-[#0d3980] border-gray-300 rounded focus:ring-[#0d3980]"
                        />
                        <Label htmlFor="isActive" className="text-[#0d3980] font-semibold font-sans cursor-pointer">
                            Active (Show on website)
                        </Label>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded font-sans">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting || uploadingImage}
                            className="bg-[#0d3980] hover:bg-[#0d3980]/90 text-white font-sans px-8 py-6 text-base"
                        >
                            <span>{isSubmitting || uploadingImage ? 'Saving...' : isEditing ? 'Update Destination' : 'Create Destination'}</span>
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push('/admin/destinations')}
                            className="font-sans px-8 py-6 text-base"
                        >
                            <span>Cancel</span>
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

