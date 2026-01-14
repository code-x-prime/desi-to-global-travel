import { prisma } from '@/lib/prisma'

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://desitoglobaltravel.com'

    // Static pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/destinations`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/packages`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/gallery`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ]

    // Fetch active packages
    const packages = await prisma.tourPackage.findMany({
        where: { isActive: true },
        select: {
            slug: true,
            updatedAt: true,
        },
    })

    const packagePages = packages.map((pkg) => ({
        url: `${baseUrl}/packages/${pkg.slug}`,
        lastModified: pkg.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
    }))

    // Fetch active destinations
    const destinations = await prisma.destination.findMany({
        where: { isActive: true },
        select: {
            slug: true,
            updatedAt: true,
        },
    })

    const destinationPages = destinations.map((destination) => ({
        url: `${baseUrl}/destinations/${destination.slug}`,
        lastModified: destination.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
    }))

    return [...staticPages, ...packagePages, ...destinationPages]
}

