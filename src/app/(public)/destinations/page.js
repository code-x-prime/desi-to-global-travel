import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageBanner } from '@/components/layout/page-banner'
import { EarthLoader } from '@/components/ui/earth-loader'
import Link from 'next/link'
import Image from 'next/image'
import { DestinationsClient } from '@/components/destinations/destinations-client'

async function getDestinations(categoryId = null) {
    try {
        const where = {
            isActive: true,
        }

        if (categoryId) {
            where.categoryId = categoryId
        }

        return await prisma.destination.findMany({
            where,
            include: {
                category: true,
            },
            orderBy: { name: 'asc' },
        })
    } catch (error) {
        console.error('Error fetching destinations:', error)
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

    let title = 'Destinations - Desi To Global Travel'
    let description = 'Explore our amazing travel destinations. Discover beautiful places around the world and plan your next adventure.'

    if (categoryId) {
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
        })
        if (category) {
            title = `${category.name} Destinations - Desi To Global Travel`
            description = `Explore our ${category.name} destinations. Discover beautiful places and plan your next adventure.`
        }
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

export default async function DestinationsPage({ searchParams }) {
    const categoryId = searchParams?.category || null

    const [destinations, categories] = await Promise.all([
        getDestinations(categoryId),
        getCategories(),
    ])

    return (
        <div className="bg-white">
            {/* Banner */}
            <PageBanner
                imageUrl="/destinations.jpg"
                title="Destinations"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Destinations' }
                ]}
            />

            {/* Content */}
            <div className="py-8 sm:py-12 md:py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    {/* Category Filters */}
                    {categories.length > 0 && (
                        <div className="mb-8 sm:mb-10 md:mb-12 flex justify-center">
                            <DestinationsClient categories={categories} initialCategory={categoryId} />
                        </div>
                    )}

                    {/* Destinations Grid */}
                    {destinations.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                            {destinations.map((destination) => (
                                <Link
                                    key={destination.id}
                                    href={`/destinations/${destination.slug}`}
                                    className="block group"
                                >
                                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg h-full flex flex-col cursor-pointer group-hover:scale-[1.02]">
                                        {destination.imageUrl && (
                                            <div className="relative h-48 sm:h-56 md:h-64 bg-gray-200 overflow-hidden">
                                                <Image
                                                    src={destination.imageUrl}
                                                    alt={destination.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                        )}
                                        <CardHeader className="p-4 sm:p-6">
                                            <CardTitle className="text-[#0d3980] font-serif text-xl sm:text-2xl group-hover:text-[#33baea] transition-colors">
                                                {destination.name}
                                            </CardTitle>
                                            {destination.country && (
                                                <CardDescription className="font-sans text-sm">{destination.country}</CardDescription>
                                            )}
                                            {destination.category && (
                                                <span className="inline-block mt-2 px-2 sm:px-3 py-1 text-xs bg-[#33baea]/10 text-[#33baea] font-semibold uppercase tracking-wide">
                                                    {destination.category.name}
                                                </span>
                                            )}
                                        </CardHeader>
                                        <CardContent className="flex-1 flex flex-col p-4 sm:p-6 pt-0">
                                            {destination.description && (
                                                <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 mb-4 font-sans leading-relaxed flex-1">
                                                    {destination.description}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-2 text-[#0d3980] group-hover:text-[#33baea] font-semibold text-xs sm:text-sm uppercase tracking-wide font-sans transition-colors">
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
                            <p className="text-gray-600 text-lg font-sans">No destinations available in this category.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
