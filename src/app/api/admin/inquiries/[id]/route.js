import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PATCH(request, { params }) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = await params
        const body = await request.json()
        const { isRead } = body

        const inquiry = await prisma.inquiry.update({
            where: { id },
            data: {
                isRead: isRead !== undefined ? isRead : true,
            },
        })

        return NextResponse.json(inquiry)
    } catch (error) {
        console.error('Error updating inquiry:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

