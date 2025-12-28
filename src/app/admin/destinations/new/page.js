import { prisma } from '@/lib/prisma'
import { DestinationForm } from '@/components/admin/destination-form'

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

export default async function NewDestinationPage() {
    const categories = await getCategories()

    return (
        <div className="p-6 md:p-8 bg-gray-50 min-h-full">
            <DestinationForm categories={categories} />
        </div>
    )
}

