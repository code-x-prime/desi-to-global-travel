import { prisma } from '@/lib/prisma'
import { Card, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Star } from 'lucide-react'
import { Suspense } from 'react'
import { HomeContentClient } from '@/components/admin/home-content-client'

async function getPackages() {
    try {
        return await prisma.tourPackage.findMany({
            where: { isActive: true },
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

async function getDestinations() {
    try {
        return await prisma.destination.findMany({
            where: { isActive: true },
            include: {
                category: true,
            },
            orderBy: { createdAt: 'desc' },
        })
    } catch (error) {
        console.error('Error fetching destinations:', error)
        return []
    }
}

function ContentSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="border-0 shadow-lg">
                        <Skeleton className="h-48 w-full" />
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2 mt-2" />
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    )
}

async function HomeContent() {
    const [packages, destinations] = await Promise.all([
        getPackages(),
        getDestinations(),
    ])

    return (
        <HomeContentClient packages={packages} destinations={destinations} />
    )
}

export default async function HomeContentPage() {
    return (
        <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-full">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-[#0d3980] to-[#33baea] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Star className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#0d3980]">
                            Home Page Content
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 font-sans mt-1">
                            Manage featured packages and popular destinations displayed on the home page
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <Suspense fallback={<ContentSkeleton />}>
                <HomeContent />
            </Suspense>
        </div>
    )
}

