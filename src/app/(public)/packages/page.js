import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageBanner } from '@/components/layout/page-banner'
import { EarthLoader } from '@/components/ui/earth-loader'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import Image from 'next/image'
import { PackagesClient } from '@/components/packages/packages-client'

async function getPackages(categoryId = null, destinationSlug = null) {
    try {
        const where = {
            isActive: true,
        }

        if (categoryId) {
            where.categoryId = categoryId
        }

        if (destinationSlug) {
            // Find packages that have this destination in their name or description
            // This is a simple implementation - you might want to add a relation
            where.OR = [
                { name: { contains: destinationSlug, mode: 'insensitive' } },
                { description: { contains: destinationSlug, mode: 'insensitive' } },
            ]
        }

        return await prisma.tourPackage.findMany({
            where,
            include: {
                images: { take: 1 },
                category: true,
            },
            orderBy: { createdAt: 'desc' },
        })
    } catch (error) {
        console.error('Error fetching packages:', error)
        return []
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

export async function generateMetadata({ searchParams }) {
    const categoryId = searchParams?.category
    const destination = searchParams?.destination

    let title = 'Tour Packages - Desi To Global Travel'
    let description = 'Explore our curated collection of tour packages. Discover amazing destinations and create unforgettable travel experiences.'

    if (categoryId) {
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
        })
        if (category) {
            title = `${category.name} Packages - Desi To Global Travel`
            description = `Explore our ${category.name} tour packages. Discover amazing ${category.name} destinations and create unforgettable travel experiences.`
        }
    }

    if (destination) {
        title = `${destination} Tour Packages - Desi To Global Travel`
        description = `Find the best tour packages for ${destination}. Explore curated itineraries and book your dream vacation.`
    }

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
        },
    }
}

export default async function PackagesPage({ searchParams }) {
    const categoryId = searchParams?.category || null
    const destinationSlug = searchParams?.destination || null

    const [packages, categories] = await Promise.all([
        getPackages(categoryId, destinationSlug),
        getCategories(),
    ])

    return (
        <div className="bg-white">
            {/* Banner */}
            <PageBanner
                imageUrl="/packages.jpg"
                title="Tour Packages"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Packages' }
                ]}
            />

            {/* Content */}
            <div className="py-8 sm:py-12 md:py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    {/* Category Filters */}
                    {categories.length > 0 && (
                        <div className="mb-8 sm:mb-10 md:mb-12 flex justify-center">
                            <PackagesClient categories={categories} initialCategory={categoryId} />
                        </div>
                    )}

                    {/* Packages Grid */}
                    {packages.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                            {packages.map((pkg) => (
                                <Link
                                    key={pkg.id}
                                    href={`/packages/${pkg.slug}`}
                                    className="block group"
                                >
                                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg h-full flex flex-col cursor-pointer group-hover:scale-[1.02]">
                                        {pkg.images?.[0] && (
                                            <div className="relative h-48 sm:h-56 md:h-64 bg-gray-200 overflow-hidden">
                                                <Image
                                                    src={pkg.images[0].url}
                                                    alt={pkg.images[0].alt || pkg.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                        )}
                                        <CardHeader className="p-4 sm:p-6">
                                            <CardTitle className="text-[#0d3980] font-serif text-xl sm:text-2xl group-hover:text-[#33baea] transition-colors">
                                                {pkg.name}
                                            </CardTitle>
                                            <CardDescription className="font-sans text-sm">{pkg.duration}</CardDescription>
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                {pkg.category && (
                                                    <span className="inline-block px-2 sm:px-3 py-1 text-xs bg-[#33baea]/10 text-[#33baea] font-semibold uppercase tracking-wide">
                                                        {pkg.category.name}
                                                    </span>
                                                )}
                                                {pkg.price && (
                                                    <span className="inline-block px-2 sm:px-3 py-1 text-xs bg-[#f9c701]/20 text-[#0d3980] font-semibold">
                                                        {pkg.price}
                                                    </span>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-1 flex flex-col p-4 sm:p-6 pt-0">
                                            {pkg.description && (
                                                <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 mb-4 font-sans leading-relaxed flex-1">
                                                    {pkg.description.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                                </p>
                                            )}
                                            {pkg.highlights && pkg.highlights.length > 0 && (
                                                <ul className="text-xs text-gray-500 mb-4 space-y-1 font-sans">
                                                    {pkg.highlights.slice(0, 3).map((highlight, idx) => (
                                                        <li key={idx}>• {highlight}</li>
                                                    ))}
                                                </ul>
                                            )}
                                            <div className="flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 sm:px-4 bg-[#0d3980] group-hover:bg-[#0a2d66] text-white uppercase tracking-wide font-sans rounded-md transition-colors text-xs sm:text-sm">
                                                <span>View Details</span>
                                                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-600 text-lg font-sans">No packages available at the moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
