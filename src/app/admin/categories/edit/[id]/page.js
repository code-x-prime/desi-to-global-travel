import { CategoryForm } from '@/components/admin/category-form'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

async function getCategory(id) {
    try {
        return await prisma.category.findUnique({
            where: { id },
        })
    } catch (error) {
        console.error('Error fetching category:', error)
        return null
    }
}

export default async function EditCategoryPage({ params }) {
    const { id } = await params
    const category = await getCategory(id)

    if (!category) {
        notFound()
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#0d3980] mb-2">Edit Category</h1>
                <p className="text-gray-600 font-sans">Update category details</p>
            </div>
            <CategoryForm category={category} />
        </div>
    )
}

