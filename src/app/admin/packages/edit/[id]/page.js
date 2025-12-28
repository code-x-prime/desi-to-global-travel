import { PackageForm } from '@/components/admin/package-form'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

async function getPackage(id) {
    try {
        return await prisma.tourPackage.findUnique({
            where: { id },
            include: {
                images: true,
                category: true,
            },
        })
    } catch (error) {
        console.error('Error fetching package:', error)
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

export default async function EditPackagePage({ params }) {
    const { id } = await params
    const [pkg, categories] = await Promise.all([
        getPackage(id),
        getCategories(),
    ])

    if (!pkg) {
        notFound()
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#0d3980] mb-2">Edit Package</h1>
                <p className="text-gray-600 font-sans">Update package details</p>
            </div>
            <PackageForm package={pkg} categories={categories} />
        </div>
    )
}

