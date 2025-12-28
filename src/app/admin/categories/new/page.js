import { CategoryForm } from '@/components/admin/category-form'

export default async function NewCategoryPage() {
    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#0d3980] mb-2">Create New Category</h1>
                <p className="text-gray-600 font-sans">Add a new tour package category</p>
            </div>
            <CategoryForm />
        </div>
    )
}

