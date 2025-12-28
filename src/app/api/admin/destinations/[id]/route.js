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
        const destination = await prisma.destination.findUnique({
            where: { id: params.id },
            include: {
                category: true,
            },
        })

        if (!destination) {
            return NextResponse.json({ error: 'Destination not found' }, { status: 404 })
        }

        return NextResponse.json(destination)
    } catch (error) {
        console.error('Error fetching destination:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PATCH(request, { params }) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { name, slug, description, country, region, imageUrl, categoryId, isActive, isPopular, duration, tripOverview, tripHighlights, detailedItinerary } = body

        // Get existing destination to check old image
        const existingDestination = await prisma.destination.findUnique({
            where: { id: params.id },
        })

        // Delete old image from R2 if new image is provided
        if (imageUrl !== undefined && existingDestination?.imageUrl && existingDestination.imageUrl !== imageUrl) {
            if (existingDestination.imageUrl.includes('r2.dev') || existingDestination.imageUrl.includes('cloudflare')) {
                await deleteFromR2(existingDestination.imageUrl)
            }
        }

        const updateData = {}
        if (name !== undefined) updateData.name = name
        if (slug !== undefined) updateData.slug = slug
        if (description !== undefined) updateData.description = description
        if (country !== undefined) updateData.country = country
        if (region !== undefined) updateData.region = region
        if (imageUrl !== undefined) updateData.imageUrl = imageUrl
        if (categoryId !== undefined) updateData.categoryId = categoryId || null
        if (duration !== undefined) updateData.duration = duration || null
        if (tripOverview !== undefined) updateData.tripOverview = tripOverview || null
        if (tripHighlights !== undefined) updateData.tripHighlights = tripHighlights || []
        if (detailedItinerary !== undefined) updateData.detailedItinerary = detailedItinerary || null
        if (isActive !== undefined) updateData.isActive = isActive
        if (isPopular !== undefined) updateData.isPopular = isPopular

        const destination = await prisma.destination.update({
            where: { id: params.id },
            data: updateData,
            include: {
                category: true,
            },
        })

        return NextResponse.json(destination)
    } catch (error) {
        console.error('Error updating destination:', error)
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'A destination with this slug already exists' }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Get destination to check image before deleting
        const destination = await prisma.destination.findUnique({
            where: { id: params.id },
        })

        // Delete destination
        await prisma.destination.delete({
            where: { id: params.id },
        })

        // Delete image from R2 if exists
        if (destination?.imageUrl && (destination.imageUrl.includes('r2.dev') || destination.imageUrl.includes('cloudflare'))) {
            await deleteFromR2(destination.imageUrl)
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting destination:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

