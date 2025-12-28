import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const destinations = await prisma.destination.findMany({
            include: {
                category: true,
            },
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json(destinations)
    } catch (error) {
        console.error('Error fetching destinations:', error)
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
        const { name, slug, description, country, region, imageUrl, categoryId, isActive, duration, tripOverview, tripHighlights, detailedItinerary } = body

        // Generate slug if not provided
        const destinationSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

        const destination = await prisma.destination.create({
            data: {
                name,
                slug: destinationSlug,
                description: description || null,
                country: country || null,
                region: region || null,
                imageUrl: imageUrl || null,
                categoryId: categoryId || null,
                duration: duration || null,
                tripOverview: tripOverview || null,
                tripHighlights: tripHighlights || [],
                detailedItinerary: detailedItinerary || null,
                isActive: isActive !== undefined ? isActive : true,
            },
            include: {
                category: true,
            },
        })

        return NextResponse.json(destination, { status: 201 })
    } catch (error) {
        console.error('Error creating destination:', error)
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'A destination with this slug already exists' }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

