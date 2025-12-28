import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const packages = await prisma.tourPackage.findMany({
            where: { isActive: true },
            include: {
                images: {
                    where: { isPrimary: true },
                    take: 1,
                },
                category: true,
            },
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json(packages)
    } catch (error) {
        console.error('Error fetching packages:', error)
        return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 })
    }
}

