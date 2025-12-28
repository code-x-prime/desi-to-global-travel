import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Disable caching for this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
    try {
        // Get popular destinations (limit 7 for home page), ordered by creation date (first added first)
        const destinations = await prisma.destination.findMany({
            where: {
                isActive: true,
                isPopular: true, // Only get popular destinations
            },
            include: {
                category: true,
            },
            take: 7, // Limit to 7 popular destinations for home page
            orderBy: [
                { createdAt: 'asc' },  // First added first (oldest first)
            ],
        })

        return NextResponse.json(destinations, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        })
    } catch (error) {
        console.error('Error fetching destinations:', error)
        return NextResponse.json([], {
            status: 500,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            },
        })
    }
}

