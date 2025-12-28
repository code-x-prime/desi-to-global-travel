import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Plus, Edit, FolderTree } from 'lucide-react'
import { CategoryActions } from '@/components/admin/category-actions'
import { Suspense } from 'react'

async function getCategories() {
    try {
        return await prisma.category.findMany({
            include: {
                _count: {
                    select: {
                        packages: true,
                        destinations: true,
                    },
                },
            },
            orderBy: { name: 'asc' },
        })
    } catch (error) {
        console.error('Error fetching categories:', error)
        return []
    }
}

function CategoryCardSkeleton() {
    return (
        <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <div className="flex gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2">
                    <Skeleton className="h-9 flex-1" />
                    <Skeleton className="h-9 w-20" />
                </div>
            </CardContent>
        </Card>
    )
}

function CategoriesList() {
    return (
        <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <CategoryCardSkeleton key={i} />
                ))}
            </div>
        }>
            <CategoriesContent />
        </Suspense>
    )
}

async function CategoriesContent() {
    const categories = await getCategories()

    if (categories.length === 0) {
        return (
            <Card className="border-0 shadow-lg">
                <CardContent className="py-12 text-center">
                    <FolderTree className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4 font-sans text-lg">No categories yet.</p>
                    <Button asChild className="bg-[#0d3980] hover:bg-[#0d3980]/90 text-white font-sans">
                        <Link href="/admin/categories/new">Create Your First Category</Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categories.map((category) => (
                <Card key={category.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                    <CardHeader className="p-4 sm:p-6">
                        <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <CardTitle className="text-[#0d3980] font-serif font-bold text-lg sm:text-xl">
                                        {category.name}
                                    </CardTitle>
                                    {!category.isActive && (
                                        <Badge variant="destructive" className="text-xs font-sans">Inactive</Badge>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mb-2 font-mono bg-gray-50 px-2 py-1 rounded truncate">
                                    {category.slug}
                                </p>
                                {category.description && (
                                    <p className="text-xs sm:text-sm text-gray-600 font-sans mb-3 line-clamp-2">{category.description}</p>
                                )}
                                <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm font-sans">
                                    <div className="flex items-center gap-1">
                                        <span className="text-gray-600">Packages:</span>
                                        <Badge variant="secondary" className="font-semibold text-[#0d3980]">
                                            {category._count.packages}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-gray-600">Destinations:</span>
                                        <Badge variant="secondary" className="font-semibold text-[#33baea]">
                                            {category._count.destinations}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                        <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm" className="flex-1 border-2 border-[#0d3980] text-[#0d3980] hover:bg-[#0d3980]/10 font-sans text-xs sm:text-sm">
                                <Link href={`/admin/categories/edit/${category.id}`} className="flex items-center justify-center">
                                    <Edit className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                    Edit
                                </Link>
                            </Button>
                            <CategoryActions categoryId={category.id} />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default async function AdminCategoriesPage() {
    return (
        <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#0d3980] mb-1 sm:mb-2">Categories</h1>
                    <p className="text-sm sm:text-base text-gray-600 font-sans">Organize your packages and destinations by category</p>
                </div>
                <Button asChild className="bg-[#0d3980] hover:bg-[#0d3980]/90 text-white font-sans shadow-lg w-full sm:w-auto text-sm sm:text-base">
                    <Link href="/admin/categories/new" className="flex items-center justify-center">
                        <Plus className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Add Category</span>
                        <span className="sm:hidden">Add</span>
                    </Link>
                </Button>
            </div>

            <CategoriesList />
        </div>
    )
}
