import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendInquiryNotification } from '@/lib/email'

export async function POST(request) {
    try {
        const body = await request.json()
        const { name, email, phone, packageId, destinationId, destination, travelers, adults, children, travelDate, message, source } = body

        // Validation
        if (!name || !email) {
            return NextResponse.json(
                { error: 'Name and email are required' },
                { status: 400 }
            )
        }

        // Get package ID if slug is provided
        let packageIdToSave = null
        if (packageId) {
            // Try to find by slug first, then by ID
            let pkg = await prisma.tourPackage.findUnique({
                where: { slug: packageId },
                select: { id: true, name: true },
            })
            if (!pkg) {
                pkg = await prisma.tourPackage.findUnique({
                    where: { id: packageId },
                    select: { id: true, name: true },
                })
            }
            if (pkg) {
                packageIdToSave = pkg.id
            }
        }

        // Get destination ID if slug is provided
        let destinationIdToSave = null
        if (destinationId) {
            let dest = await prisma.destination.findUnique({
                where: { slug: destinationId },
                select: { id: true, name: true },
            })
            if (!dest) {
                dest = await prisma.destination.findUnique({
                    where: { id: destinationId },
                    select: { id: true, name: true },
                })
            }
            if (dest) {
                destinationIdToSave = dest.id
            }
        }

        // Build message with all details
        let fullMessage = message || 'No additional details provided.'
        if (packageId) {
            const pkg = await prisma.tourPackage.findUnique({
                where: { slug: packageId },
                select: { name: true },
            })
            if (pkg) {
                fullMessage = `Interested in Package: ${pkg.name}\n\n${fullMessage}`
            }
        }
        if (destinationId || destination) {
            const destName = destinationId
                ? (await prisma.destination.findUnique({ where: { slug: destinationId }, select: { name: true } }))?.name || destination
                : destination
            fullMessage = `Interested in Destination: ${destName}\n\n${fullMessage}`
        }
        if (travelers) {
            fullMessage = `Total Travelers: ${travelers}\n${fullMessage}`
        }
        if (adults || children) {
            fullMessage = `Adults: ${adults || 0}, Children: ${children || 0}\n${fullMessage}`
        }
        if (travelDate) {
            fullMessage = `Preferred Travel Date: ${travelDate}\n${fullMessage}`
        }

        // Save inquiry to database
        const inquiry = await prisma.inquiry.create({
            data: {
                name,
                email,
                phone: phone || null,
                message: fullMessage,
                packageId: packageIdToSave,
                destinationId: destinationIdToSave,
                destination: destination || null,
                travelers: travelers || null,
                adults: adults || null,
                children: children || null,
                travelDate: travelDate || null,
                source: source || 'contact', // Track source: 'package', 'destination', or 'contact'
            },
        })

        // Send email notification
        await sendInquiryNotification(inquiry)

        return NextResponse.json(
            { success: true, message: 'Inquiry submitted successfully' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error creating inquiry:', error)
        return NextResponse.json(
            { error: 'Failed to submit inquiry. Please try again.' },
            { status: 500 }
        )
    }
}

