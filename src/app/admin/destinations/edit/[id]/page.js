import { prisma } from '@/lib/prisma'
import { DestinationForm } from '@/components/admin/destination-form'
import { notFound } from 'next/navigation'

async function getDestination(id) {
    try {
        return await prisma.destination.findUnique({
            where: { id },
            include: {
                category: true,
            },
        })
    } catch (error) {
        console.error('Error fetching destination:', error)
        return null
    }
}

async function getCategories() {
    try {
        return await prisma.category.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        })
    } catch (error) {
        console.error('Error fetching categories:', error)
        return []
    }
}

export default async function EditDestinationPage({ params }) {
    const [destination, categories] = await Promise.all([
        getDestination(params.id),
        getCategories(),
    ])

    if (!destination) {
        notFound()
    }

    return (
        <div className="p-6 md:p-8 bg-gray-50 min-h-full">
            <DestinationForm destination={destination} categories={categories} />
        </div>
    )
}

