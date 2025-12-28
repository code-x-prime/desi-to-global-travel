import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        // Get featured packages (limit 6 for home page), ordered by creation date (first added first)
        const packages = await prisma.tourPackage.findMany({
            where: {
                isActive: true,
                isFeatured: true, // Only get featured packages
            },
            include: {
                images: {
                    where: { isPrimary: true },
                    take: 1,
                },
                category: true,
            },
            take: 6, // Limit to 6 featured packages for home page
            orderBy: [
                { createdAt: 'asc' },  // First added first (oldest first)
            ],
        })

        return NextResponse.json(packages)
    } catch (error) {
        console.error('Error fetching packages:', error)
        return NextResponse.json([], { status: 500 })
    }
}

