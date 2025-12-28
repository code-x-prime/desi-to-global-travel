import { PackageForm } from '@/components/admin/package-form'
import { prisma } from '@/lib/prisma'

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

export default async function NewPackagePage() {
    const categories = await getCategories()

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#0d3980] mb-2">Create New Package</h1>
                <p className="text-gray-600 font-sans">Add a new tour package</p>
            </div>
            <PackageForm categories={categories} />
        </div>
    )
}

