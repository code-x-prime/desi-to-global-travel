import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { deleteFromR2 } from '@/lib/r2'

// Disable caching for this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function PATCH(request, { params }) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = await params
        const body = await request.json()
        const { isActive, order, alt } = body

        const image = await prisma.galleryImage.update({
            where: { id },
            data: {
                ...(isActive !== undefined && { isActive }),
                ...(order !== undefined && { order }),
                ...(alt !== undefined && { alt }),
            },
        })

        return NextResponse.json(image, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            },
        })
    } catch (error) {
        console.error('Error updating gallery image:', error)
        return NextResponse.json({ error: 'Internal server error' }, {
            status: 500,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            },
        })
    }
}

export async function DELETE(request, { params }) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = await params

        // Get image URL before deleting
        const image = await prisma.galleryImage.findUnique({
            where: { id },
        })

        if (!image) {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 })
        }

        // Delete from database
        await prisma.galleryImage.delete({
            where: { id },
        })

        // Delete from R2 if URL exists and is from R2
        if (image.url && (image.url.includes('r2.dev') || image.url.includes('cloudflare'))) {
            await deleteFromR2(image.url)
        }

        return NextResponse.json({ success: true }, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            },
        })
    } catch (error) {
        console.error('Error deleting gallery image:', error)
        return NextResponse.json({ error: 'Internal server error' }, {
            status: 500,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            },
        })
    }
}

