import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PackageDetailClient } from '@/components/packages/package-detail-client'

export async function generateMetadata({ params }) {
    const pkg = await prisma.tourPackage.findUnique({
        where: { slug: params.slug },
        include: {
            images: { take: 1 },
            category: true,
        },
    })

    if (!pkg) {
        return {
            title: 'Package Not Found - Desi To Global Travel',
        }
    }

    const description = pkg.description
        ? pkg.description.replace(/<[^>]*>/g, '').substring(0, 160)
        : `Explore ${pkg.name} with Desi To Global Travel. ${pkg.duration} tour package with amazing experiences.`

    const imageUrl = pkg.images?.[0]?.url || '/packages.jpg'

    return {
        title: `${pkg.name} - Desi To Global Travel`,
        description,
        keywords: [
            pkg.name,
            pkg.category?.name,
            'tour package',
            'travel',
            'vacation',
            pkg.duration,
        ].filter(Boolean).join(', '),
        openGraph: {
            title: `${pkg.name} - Desi To Global Travel`,
            description,
            images: [
                {
                    url: imageUrl,
                    alt: pkg.name,
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${pkg.name} - Desi To Global Travel`,
            description,
            images: [imageUrl],
        },
    }
}

async function getPackage(slug) {
    try {
        return await prisma.tourPackage.findUnique({
            where: { slug },
            include: {
                images: {
                    orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }],
                },
                category: true,
            },
        })
    } catch (error) {
        console.error('Error fetching package:', error)
        return null
    }
}

export default async function PackageDetailPage({ params }) {
    const pkg = await getPackage(params.slug)

    if (!pkg || !pkg.isActive) {
        notFound()
    }

    return <PackageDetailClient pkg={pkg} />
}

