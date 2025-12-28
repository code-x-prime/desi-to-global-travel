import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { InquiryActions } from '@/components/admin/inquiry-actions'
import { Mail } from 'lucide-react'
import { Suspense } from 'react'
import Link from 'next/link'

async function getInquiries() {
    try {
        const inquiries = await prisma.inquiry.findMany({
            orderBy: { createdAt: 'desc' },
        })

        // Fetch package names for inquiries that have packageId
        const packageIds = inquiries.filter(i => i.packageId).map(i => i.packageId)
        const packages = packageIds.length > 0
            ? await prisma.tourPackage.findMany({
                where: { id: { in: packageIds } },
                select: { id: true, name: true, slug: true },
            })
            : []

        const packageMap = new Map(packages.map(p => [p.id, p]))

        return inquiries.map(inquiry => ({
            ...inquiry,
            package: inquiry.packageId ? packageMap.get(inquiry.packageId) : null,
        }))
    } catch (error) {
        console.error('Error fetching inquiries:', error)
        return []
    }
}

function InquiryCardSkeleton() {
    return (
        <Card className="border-0 shadow-lg">
            <CardHeader>
                <Skeleton className="h-6 w-1/3 mb-2" />
                <div className="flex gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-24" />
                </div>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-20 w-full mb-2" />
                <Skeleton className="h-3 w-1/2" />
            </CardContent>
        </Card>
    )
}

function InquiriesList() {
    return (
        <Suspense fallback={
            <div className=" grid grid-cols-1 md:grid-cols-2  gap-4">
                {[...Array(5)].map((_, i) => (
                    <InquiryCardSkeleton key={i} />
                ))}
            </div>
        }>
            <InquiriesContent />
        </Suspense>
    )
}

async function InquiriesContent() {
    const inquiries = await getInquiries()

    if (inquiries.length === 0) {
        return (
            <Card className="border-0 shadow-lg">
                <CardContent className="py-12 text-center">
                    <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 font-sans text-lg">No inquiries yet.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {inquiries.map((inquiry) => (
                <Card key={inquiry.id} className={`border-0 shadow-lg transition-all duration-200 hover:shadow-xl ${!inquiry.isRead ? 'border-l-4 border-l-[#f9c701] bg-yellow-50/30' : 'bg-white'}`}>
                    <CardHeader className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                            <div className="flex-1 min-w-0">
                                <CardTitle className="text-[#0d3980] font-serif font-bold text-lg sm:text-xl mb-2">{inquiry.name}</CardTitle>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant={inquiry.isRead ? 'secondary' : 'default'} className="font-sans text-xs">
                                        {inquiry.isRead ? 'Read' : 'New'}
                                    </Badge>
                                    {inquiry.source && (
                                        <Badge variant={inquiry.source === 'package' ? 'default' : inquiry.source === 'destination' ? 'secondary' : 'outline'} className="font-sans text-xs">
                                            <span className="hidden sm:inline">From: </span>{inquiry.source === 'package' ? 'Package' : inquiry.source === 'destination' ? 'Destination' : 'Contact'}
                                        </Badge>
                                    )}
                                    {inquiry.package && (
                                        <Badge variant="outline" className="font-sans text-xs truncate max-w-[150px] sm:max-w-none">
                                            {inquiry.package.name}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <InquiryActions inquiryId={inquiry.id} isRead={inquiry.isRead} />
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                        <div className="space-y-3 sm:space-y-4">
                            {/* Contact Information */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-[#0d3980]/5 rounded-lg border border-[#0d3980]/10">
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-sans block mb-1">Email</span>
                                    <a href={`mailto:${inquiry.email}`} className="text-[#33baea] hover:underline font-sans font-medium">
                                        {inquiry.email}
                                    </a>
                                </div>
                                {inquiry.phone && (
                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-sans block mb-1">Phone</span>
                                        <a href={`tel:${inquiry.phone}`} className="text-[#33baea] hover:underline font-sans font-medium">
                                            {inquiry.phone}
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Travel Interest */}
                            {(inquiry.package || inquiry.destinationObj || inquiry.destination) && (
                                <div className="p-4 bg-[#f9c701]/10 rounded-lg border border-[#f9c701]/20">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-sans block mb-2">Travel Interest</span>
                                    {inquiry.package && (
                                        <div className="mb-2">
                                            <span className="font-medium font-sans text-gray-700">Package: </span>
                                            <Link href={`/packages/${inquiry.package.slug}`} className="text-[#0d3980] hover:underline font-sans font-semibold">
                                                {inquiry.package.name}
                                            </Link>
                                        </div>
                                    )}
                                    {inquiry.destinationObj && (
                                        <div className="mb-2">
                                            <span className="font-medium font-sans text-gray-700">Destination: </span>
                                            <Link href={`/destinations/${inquiry.destinationObj.slug}`} className="text-[#0d3980] hover:underline font-sans font-semibold">
                                                {inquiry.destinationObj.name}
                                            </Link>
                                        </div>
                                    )}
                                    {inquiry.destination && !inquiry.destinationObj && (
                                        <div>
                                            <span className="font-medium font-sans text-gray-700">Custom Destination: </span>
                                            <span className="text-[#0d3980] font-sans font-semibold">{inquiry.destination}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Travel Details */}
                            {(inquiry.travelers || inquiry.adults || inquiry.children || inquiry.travelDate) && (
                                <div className="p-3 sm:p-4 bg-[#33baea]/10 rounded-lg border border-[#33baea]/20">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-sans block mb-2">Travel Details</span>
                                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                        {inquiry.travelers && (
                                            <div>
                                                <span className="text-sm font-medium text-gray-600 font-sans">Total Travelers: </span>
                                                <span className="text-sm font-semibold text-[#0d3980] font-sans">{inquiry.travelers}</span>
                                            </div>
                                        )}
                                        {inquiry.adults && (
                                            <div>
                                                <span className="text-sm font-medium text-gray-600 font-sans">Adults: </span>
                                                <span className="text-sm font-semibold text-[#0d3980] font-sans">{inquiry.adults}</span>
                                            </div>
                                        )}
                                        {inquiry.children && (
                                            <div>
                                                <span className="text-sm font-medium text-gray-600 font-sans">Children: </span>
                                                <span className="text-sm font-semibold text-[#0d3980] font-sans">{inquiry.children}</span>
                                            </div>
                                        )}
                                        {inquiry.travelDate && (
                                            <div>
                                                <span className="text-sm font-medium text-gray-600 font-sans">Travel Date: </span>
                                                <span className="text-sm font-semibold text-[#0d3980] font-sans">{inquiry.travelDate}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Message */}
                            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-sans block mb-2">Message</span>
                                <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed break-words">{inquiry.message}</p>
                            </div>

                            {/* Timestamp */}
                            <div className="text-xs text-gray-500 font-sans pt-2 border-t border-gray-200">
                                Received: {new Date(inquiry.createdAt).toLocaleString('en-IN', {
                                    dateStyle: 'long',
                                    timeStyle: 'short'
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default async function AdminInquiriesPage() {
    return (
        <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-full">
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#0d3980] mb-1 sm:mb-2">Inquiries</h1>
                <p className="text-sm sm:text-base text-gray-600 font-sans">Manage customer inquiries and booking requests</p>
            </div>

            <InquiriesList />
        </div>
    )
}
