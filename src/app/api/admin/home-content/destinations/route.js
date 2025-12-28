import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Get all destinations for admin (no limit)
        const destinations = await prisma.destination.findMany({
            where: { isActive: true },
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

