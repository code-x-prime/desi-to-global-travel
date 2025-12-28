'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useState } from 'react'

export function DestinationsClient({ categories, initialCategory }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all')

    useEffect(() => {
        const category = searchParams.get('category')
        if (category) {
            setSelectedCategory(category)
        } else {
            setSelectedCategory('all')
        }
    }, [searchParams])

    const handleCategoryChange = (value) => {
        setSelectedCategory(value)
        const params = new URLSearchParams()

        if (value !== 'all') {
            params.set('category', value)
        }

        router.push(`/destinations?${params.toString()}`, { scroll: false })
    }

    return (
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full max-w-xs h-12 border-2 border-gray-200 focus:border-[#0d3980] font-sans">
                <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Destinations</SelectItem>
                {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                        {category.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

