import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const images = await prisma.galleryImage.findMany({
            orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        })
        return NextResponse.json(images)
    } catch (error) {
        console.error('Error fetching gallery images:', error)
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
        const { url, alt, isActive, order } = body

        const image = await prisma.galleryImage.create({
            data: {
                url,
                alt: alt || null,
                isActive: isActive !== undefined ? isActive : true,
                order: order || 0,
            },
        })

        return NextResponse.json(image, { status: 201 })
    } catch (error) {
        console.error('Error creating gallery image:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

