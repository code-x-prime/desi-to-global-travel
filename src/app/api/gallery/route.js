import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Disable caching for this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
    try {
        const images = await prisma.galleryImage.findMany({
            where: { isActive: true },
            orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        })
        return NextResponse.json(images, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        })
    } catch (error) {
        console.error('Error fetching gallery images:', error)
        return NextResponse.json({ error: 'Failed to fetch gallery images' }, {
            status: 500,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            },
        })
    }
}

