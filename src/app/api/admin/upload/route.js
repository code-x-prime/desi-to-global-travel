import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { uploadToR2 } from '@/lib/r2'

export async function POST(request) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const formData = await request.formData()
        const file = formData.get('file')

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Upload to R2
        const publicUrl = await uploadToR2(
            buffer,
            file.name,
            file.type || 'application/octet-stream'
        )

        return NextResponse.json({
            url: publicUrl,
            success: true,
        })
    } catch (error) {
        console.error('Error uploading file:', error)
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}

