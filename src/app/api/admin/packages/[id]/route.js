import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { deleteFromR2 } from '@/lib/r2'

export async function GET(request, { params }) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = await params
        const tourPackage = await prisma.tourPackage.findUnique({
            where: { id },
            include: {
                images: true,
                category: true,
            },
        })

        if (!tourPackage) {
            return NextResponse.json({ error: 'Package not found' }, { status: 404 })
        }

        return NextResponse.json(tourPackage)
    } catch (error) {
        console.error('Error fetching package:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PATCH(request, { params }) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = await params
        const body = await request.json()
        const { name, slug, duration, highlights, itinerary, description, categoryId, isActive, images, price, whatsappNumber, showPrice, isFeatured, includes, excludes, costDetails, detailedItinerary } = body

        // Update package
        const tourPackage = await prisma.tourPackage.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(slug && { slug }),
                ...(duration && { duration }),
                ...(highlights !== undefined && { highlights }),
                ...(itinerary !== undefined && { itinerary }),
                ...(includes !== undefined && { includes }),
                ...(excludes !== undefined && { excludes }),
                ...(costDetails !== undefined && { costDetails }),
                ...(detailedItinerary !== undefined && { detailedItinerary }),
                ...(description !== undefined && { description }),
                ...(price !== undefined && { price }),
                ...(showPrice !== undefined && { showPrice }),
                ...(whatsappNumber !== undefined && { whatsappNumber }),
                ...(categoryId !== undefined && { categoryId }),
                ...(isActive !== undefined && { isActive }),
                ...(isFeatured !== undefined && { isFeatured }),
            },
            include: {
                images: true,
                category: true,
            },
        })

        // Update images if provided
        if (images) {
            // Get existing images to delete from R2
            const existingImages = await prisma.packageImage.findMany({
                where: { packageId: id },
            })

            // Delete old images from R2
            for (const img of existingImages) {
                if (img.url && (img.url.includes('r2.dev') || img.url.includes('cloudflare'))) {
                    try {
                        await deleteFromR2(img.url)
                    } catch (error) {
                        console.warn('Failed to delete image from R2:', img.url, error)
                    }
                }
            }

            // Delete existing images from database
            await prisma.packageImage.deleteMany({
                where: { packageId: id },
            })

            // Create new images
            if (images.length > 0) {
                await prisma.packageImage.createMany({
                    data: images.map((img, idx) => ({
                        packageId: id,
                        url: img.url,
                        alt: img.alt || name,
                        isPrimary: idx === 0,
                        order: idx,
                    })),
                })
            }
        }

        const updatedPackage = await prisma.tourPackage.findUnique({
            where: { id },
            include: {
                images: true,
                category: true,
            },
        })

        return NextResponse.json(updatedPackage)
    } catch (error) {
        console.error('Error updating package:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = await params

        // Get all images before deleting
        const packageImages = await prisma.packageImage.findMany({
            where: { packageId: id },
        })

        // Delete package (cascade will delete images from DB)
        await prisma.tourPackage.delete({
            where: { id },
        })

        // Delete images from R2
        for (const img of packageImages) {
            if (img.url && (img.url.includes('r2.dev') || img.url.includes('cloudflare'))) {
                await deleteFromR2(img.url)
            }
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting package:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

