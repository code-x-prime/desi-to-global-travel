'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function CategoryForm({ category: initialCategory }) {
    const router = useRouter()
    const isEditing = !!initialCategory

    const [formData, setFormData] = useState({
        name: initialCategory?.name || '',
        slug: initialCategory?.slug || '',
        description: initialCategory?.description || '',
        isActive: initialCategory?.isActive !== undefined ? initialCategory.isActive : true,
    })
    const [slugManuallyChanged, setSlugManuallyChanged] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsSubmitting(true)

        try {
            const url = isEditing
                ? `/api/admin/categories/${initialCategory.id}`
                : '/api/admin/categories'
            const method = isEditing ? 'PATCH' : 'POST'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                router.push('/admin/categories')
                router.refresh()
            } else {
                setError(data.error || 'Failed to save category')
            }
        } catch (error) {
            setError('Network error. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))

        // Track if slug is manually changed
        if (name === 'slug') {
            setSlugManuallyChanged(true)
        }
    }

    // Auto-generate slug from name
    useEffect(() => {
        if (formData.name && !slugManuallyChanged) {
            const generatedSlug = formData.name
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
            setFormData((prev) => ({ ...prev, slug: generatedSlug }))
        }
    }, [formData.name, slugManuallyChanged])

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader>
                <CardTitle className="text-[#0d3980] font-serif font-bold text-2xl">
                    {isEditing ? 'Edit Category' : 'Create Category'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="name" className="text-[#0d3980] font-semibold font-sans">
                                Category Name *
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 h-12 border-2 border-gray-200 focus:border-[#0d3980] font-sans"
                            />
                        </div>
                        <div>
                            <Label htmlFor="slug" className="text-[#0d3980] font-semibold font-sans">
                                Slug *
                            </Label>
                            <Input
                                id="slug"
                                name="slug"
                                required
                                value={formData.slug}
                                onChange={handleChange}
                                className="mt-1 h-12 border-2 border-gray-200 focus:border-[#0d3980] font-sans"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description" className="text-[#0d3980] font-semibold font-sans">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 border-2 border-gray-200 focus:border-[#0d3980] font-sans resize-none"
                        />
                    </div>

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
                            disabled={isSubmitting}
                            className="bg-[#0d3980] hover:bg-[#0d3980]/90 text-white font-sans"
                        >
                            {isSubmitting ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
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

