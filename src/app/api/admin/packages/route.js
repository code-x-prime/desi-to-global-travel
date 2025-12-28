import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const packages = await prisma.tourPackage.findMany({
            include: {
                images: true,
                category: true,
            },
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json(packages)
    } catch (error) {
        console.error('Error fetching packages:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { name, slug, duration, highlights, itinerary, description, categoryId, isActive, images, price, whatsappNumber, showPrice, includes, excludes, costDetails, detailedItinerary } = body

        // Generate slug if not provided
        const packageSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

        const tourPackage = await prisma.tourPackage.create({
            data: {
                name,
                slug: packageSlug,
                duration,
                highlights: highlights || [],
                itinerary: itinerary || {},
                includes: includes || [],
                excludes: excludes || [],
                costDetails: costDetails || null,
                detailedItinerary: detailedItinerary || null,
                description,
                price: price || null,
                showPrice: showPrice !== undefined ? showPrice : true,
                whatsappNumber: whatsappNumber || null,
                categoryId: categoryId || null,
                isActive: isActive !== undefined ? isActive : true,
                images: images ? {
                    create: images.map((img, idx) => ({
                        url: img.url,
                        alt: img.alt || name,
                        isPrimary: idx === 0,
                        order: idx,
                    })),
                } : undefined,
            },
            include: {
                images: true,
                category: true,
            },
        })

        return NextResponse.json(tourPackage, { status: 201 })
    } catch (error) {
        console.error('Error creating package:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

