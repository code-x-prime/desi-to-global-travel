import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DestinationDetailClient } from '@/components/destinations/destination-detail-client'

export async function generateMetadata({ params }) {
    const destination = await prisma.destination.findUnique({
        where: { slug: params.slug },
        include: {
            category: true,
        },
    })

    if (!destination) {
        return {
            title: 'Destination Not Found - Desi To Global Travel',
        }
    }

    const description = destination.description
        ? destination.description.substring(0, 160)
        : `Explore ${destination.name} with Desi To Global Travel. Discover amazing travel experiences and tour packages.`

    const imageUrl = destination.imageUrl || '/destinations.jpg'

    return {
        title: `${destination.name} - Desi To Global Travel`,
        description,
        keywords: [
            destination.name,
            destination.country,
            destination.region,
            destination.category?.name,
            'travel destination',
            'tour packages',
        ].filter(Boolean).join(', '),
        openGraph: {
            title: `${destination.name} - Desi To Global Travel`,
            description,
            images: [
                {
                    url: imageUrl,
                    alt: destination.name,
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${destination.name} - Desi To Global Travel`,
            description,
            images: [imageUrl],
        },
    }
}

async function getDestination(slug) {
    try {
        return await prisma.destination.findUnique({
            where: { slug },
            include: {
                category: true,
            },
        })
    } catch (error) {
        console.error('Error fetching destination:', error)
        return null
    }
}

async function getPackagesForDestination(destinationName) {
    try {
        return await prisma.tourPackage.findMany({
            where: {
                isActive: true,
                OR: [
                    { name: { contains: destinationName, mode: 'insensitive' } },
                    { description: { contains: destinationName, mode: 'insensitive' } },
                ],
            },
            include: {
                images: { take: 1 },
                category: true,
            },
            take: 6,
            orderBy: { createdAt: 'desc' },
        })
    } catch (error) {
        console.error('Error fetching packages:', error)
        return []
    }
}

export default async function DestinationDetailPage({ params }) {
    const destination = await getDestination(params.slug)

    if (!destination || !destination.isActive) {
        notFound()
    }

    const packages = await getPackagesForDestination(destination.name)

    return <DestinationDetailClient destination={destination} packages={packages} />
}

