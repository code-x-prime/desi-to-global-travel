import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
    port: parseInt(process.env.SMTP_PORT || process.env.BREVO_SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER || process.env.BREVO_SMTP_USER,
        pass: process.env.SMTP_PASSWORD || process.env.BREVO_SMTP_PASSWORD,
    },
})

export async function sendEmail({ to, subject, html, text }) {
    if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASSWORD) {
        console.error('Email configuration missing. Email not sent.')
        return { success: false, error: 'Email not configured' }
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.FROM_EMAIL || 'noreply@desitoglobaltravel.com',
            to,
            subject,
            html,
            text,
        })
        return { success: true, messageId: info.messageId }
    } catch (error) {
        console.error('Email send error:', error)
        return { success: false, error: error.message }
    }
}

export async function sendInquiryNotification(inquiry) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@desitoglobaltravel.com'

    // Fetch package and destination names if IDs exist
    let packageName = null
    let destinationName = null

    if (inquiry.packageId) {
        const pkg = await prisma.tourPackage.findUnique({
            where: { id: inquiry.packageId },
            select: { name: true },
        })
        packageName = pkg?.name
    }

    if (inquiry.destinationId) {
        const dest = await prisma.destination.findUnique({
            where: { id: inquiry.destinationId },
            select: { name: true },
        })
        destinationName = dest?.name
    }

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #0d3980; margin-bottom: 20px; font-size: 24px;">New Inquiry Received</h2>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                <h3 style="color: #0d3980; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Contact Information</h3>
                <p style="margin: 8px 0;"><strong>Name:</strong> ${inquiry.name}</p>
                <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${inquiry.email}" style="color: #33baea;">${inquiry.email}</a></p>
                ${inquiry.phone ? `<p style="margin: 8px 0;"><strong>Phone:</strong> <a href="tel:${inquiry.phone}" style="color: #33baea;">${inquiry.phone}</a></p>` : ''}
            </div>

            ${packageName || inquiry.destination || inquiry.destinationId ? `
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #f9c701;">
                <h3 style="color: #0d3980; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Travel Interest</h3>
                ${packageName ? `<p style="margin: 8px 0;"><strong>Package:</strong> ${packageName}</p>` : ''}
                ${destinationName || inquiry.destination ? `<p style="margin: 8px 0;"><strong>Destination:</strong> ${destinationName || inquiry.destination}</p>` : ''}
            </div>
            ` : ''}

            ${inquiry.travelers || inquiry.adults || inquiry.children || inquiry.travelDate ? `
            <div style="background-color: #dbeafe; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #33baea;">
                <h3 style="color: #0d3980; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Travel Details</h3>
                ${inquiry.travelers ? `<p style="margin: 8px 0;"><strong>Total Travelers:</strong> ${inquiry.travelers}</p>` : ''}
                ${inquiry.adults ? `<p style="margin: 8px 0;"><strong>Adults:</strong> ${inquiry.adults}</p>` : ''}
                ${inquiry.children ? `<p style="margin: 8px 0;"><strong>Children:</strong> ${inquiry.children}</p>` : ''}
                ${inquiry.travelDate ? `<p style="margin: 8px 0;"><strong>Preferred Travel Date:</strong> ${inquiry.travelDate}</p>` : ''}
            </div>
            ` : ''}

            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px;">
                <h3 style="color: #0d3980; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Message</h3>
                <p style="white-space: pre-wrap; line-height: 1.6; color: #374151;">${inquiry.message}</p>
            </div>

            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="color: #6b7280; font-size: 12px;">
                    This inquiry was submitted from: <strong>${inquiry.source === 'package' ? 'Package Page' : inquiry.source === 'destination' ? 'Destination Page' : 'Contact Page'}</strong>
                </p>
            </div>
        </div>
    </div>
    `

    const text = `New Inquiry from ${inquiry.name}

Contact Information:
Email: ${inquiry.email}
${inquiry.phone ? `Phone: ${inquiry.phone}` : ''}

${packageName || inquiry.destination || inquiry.destinationId ? `Travel Interest:
${packageName ? `Package: ${packageName}` : ''}
${destinationName || inquiry.destination ? `Destination: ${destinationName || inquiry.destination}` : ''}

` : ''}${inquiry.travelers || inquiry.adults || inquiry.children || inquiry.travelDate ? `Travel Details:
${inquiry.travelers ? `Total Travelers: ${inquiry.travelers}` : ''}
${inquiry.adults ? `Adults: ${inquiry.adults}` : ''}
${inquiry.children ? `Children: ${inquiry.children}` : ''}
${inquiry.travelDate ? `Preferred Travel Date: ${inquiry.travelDate}` : ''}

` : ''}Message:
${inquiry.message}

---
Source: ${inquiry.source === 'package' ? 'Package Page' : inquiry.source === 'destination' ? 'Destination Page' : 'Contact Page'}`

    return sendEmail({
        to: adminEmail,
        subject: `New Inquiry from ${inquiry.name}${packageName ? ` - ${packageName}` : destinationName ? ` - ${destinationName}` : ''}`,
        html,
        text,
    })
}

