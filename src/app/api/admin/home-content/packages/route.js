import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Get all packages for admin (no limit)
        const packages = await prisma.tourPackage.findMany({
            where: { isActive: true },
            include: {
                images: { take: 1 },
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

