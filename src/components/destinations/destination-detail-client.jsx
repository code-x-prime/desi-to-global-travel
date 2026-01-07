'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, MessageCircle, MapPin, Globe, Clock, CheckCircle, Calendar } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { DestinationBookingDialog } from '@/components/booking/destination-booking-dialog'

export function DestinationDetailClient({ destination, packages }) {
    const [dialogOpen, setDialogOpen] = useState(false)

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919650509356'
    const whatsappMessage = encodeURIComponent(`Hi! I'm interested in ${destination.name}.`)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

    return (
        <>
            <DestinationBookingDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                destinationSlug={destination.slug}
                destinationName={destination.name}
            />
            <div className="bg-white">
                {/* Hero Section */}
                {destination.imageUrl && (
                    <div className="relative h-[50vh] sm:h-[60vh] md:h-[500px]">
                        <Image
                            src={destination.imageUrl}
                            alt={destination.name}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="absolute inset-0 flex items-end">
                            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 md:pb-12">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-3 sm:mb-4">
                                    {destination.name}
                                </h1>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-white/90">
                                    {destination.country && (
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                                            <span className="text-sm sm:text-base font-sans">{destination.country}</span>
                                        </div>
                                    )}
                                    {destination.region && (
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                                            <span className="text-sm sm:text-base font-sans">{destination.region}</span>
                                        </div>
                                    )}
                                    {destination.category && (
                                        <span className="px-2 sm:px-3 py-1 bg-[#33baea]/20 text-white rounded-md text-xs sm:text-sm font-sans">
                                            {destination.category.name}
                                        </span>
                                    )}
                                    {destination.duration && (
                                        <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 bg-[#f9c701]/20 text-white rounded-md">
                                            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                            <span className="text-xs sm:text-sm font-sans font-medium">{destination.duration}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="py-8 sm:py-10 md:py-16 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                                {!destination.imageUrl && (
                                    <div className="mb-6 sm:mb-8">
                                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#0d3980] mb-3 sm:mb-4">
                                            {destination.name}
                                        </h1>
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-gray-600">
                                            {destination.country && (
                                                <div className="flex items-center gap-1.5 sm:gap-2">
                                                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                                                    <span className="text-sm sm:text-base font-sans">{destination.country}</span>
                                                </div>
                                            )}
                                            {destination.region && (
                                                <div className="flex items-center gap-1.5 sm:gap-2">
                                                    <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                                                    <span className="text-sm sm:text-base font-sans">{destination.region}</span>
                                                </div>
                                            )}
                                            {destination.category && (
                                                <span className="px-2 sm:px-3 py-1 bg-[#33baea]/10 text-[#33baea] rounded-md text-xs sm:text-sm font-sans">
                                                    {destination.category.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Trip Overview */}
                                {destination.tripOverview && (
                                    <div className="bg-gradient-to-r from-[#0d3980]/5 to-[#33baea]/5 rounded-xl p-5 sm:p-6 border border-[#33baea]/20">
                                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0d3980] mb-3 sm:mb-4 flex items-center gap-2">
                                            <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-[#33baea]" />
                                            Trip Overview
                                        </h2>
                                        <div
                                            className="text-sm sm:text-base text-gray-700 leading-relaxed font-sans prose prose-sm sm:prose-lg max-w-none"
                                            dangerouslySetInnerHTML={{ __html: destination.tripOverview }}
                                        />
                                    </div>
                                )}

                                {/* Description - fallback if no tripOverview */}
                                {!destination.tripOverview && destination.description && (
                                    <div className="bg-gradient-to-r from-[#0d3980]/5 to-[#33baea]/5 rounded-xl p-5 sm:p-6 border border-[#33baea]/20">
                                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0d3980] mb-3 sm:mb-4 flex items-center gap-2">
                                            <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-[#33baea]" />
                                            About {destination.name}
                                        </h2>
                                        <div
                                            className="text-sm sm:text-base text-gray-700 leading-relaxed font-sans prose prose-sm sm:prose-lg max-w-none"
                                            dangerouslySetInnerHTML={{ __html: destination.description }}
                                        />
                                    </div>
                                )}

                                {/* Trip Highlights */}
                                {destination.tripHighlights && destination.tripHighlights.length > 0 && (
                                    <div className="bg-white rounded-xl p-5 sm:p-6 border-2 border-[#f9c701]/30 shadow-md">
                                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0d3980] mb-4 sm:mb-5 flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-[#f9c701]" />
                                            Trip Highlights
                                        </h2>
                                        <div className="space-y-3">
                                            {destination.tripHighlights.map((highlight, index) => {
                                                // Check if it's HTML content
                                                if (highlight && highlight.includes('<')) {
                                                    return (
                                                        <div
                                                            key={index}
                                                            className="text-sm sm:text-base text-gray-700 leading-relaxed font-sans prose prose-sm sm:prose-lg max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2"
                                                            dangerouslySetInnerHTML={{ __html: highlight }}
                                                        />
                                                    )
                                                }
                                                // Plain text highlight
                                                return (
                                                    <div key={index} className="flex items-start gap-3">
                                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#f9c701]/20 flex items-center justify-center mt-0.5">
                                                            <CheckCircle className="h-4 w-4 text-[#f9c701]" />
                                                        </div>
                                                        <span className="text-sm sm:text-base text-gray-700 font-sans">{highlight}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Detailed Itinerary */}
                                {destination.detailedItinerary && (
                                    <div className="bg-white rounded-xl p-5 sm:p-6 border-2 border-[#0d3980]/20 shadow-md">
                                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0d3980] mb-4 sm:mb-5 flex items-center gap-2">
                                            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-[#0d3980]" />
                                            Detailed Itinerary
                                        </h2>
                                        <div
                                            className="text-sm sm:text-base text-gray-700 leading-relaxed font-sans prose prose-sm sm:prose-lg max-w-none 
                                            [&_h1]:text-lg [&_h1]:sm:text-xl [&_h1]:font-serif [&_h1]:font-bold [&_h1]:text-[#0d3980] [&_h1]:mt-4 [&_h1]:mb-2
                                            [&_h2]:text-base [&_h2]:sm:text-lg [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-[#0d3980] [&_h2]:mt-4 [&_h2]:mb-2
                                            [&_h3]:text-sm [&_h3]:sm:text-base [&_h3]:font-semibold [&_h3]:text-[#33baea] [&_h3]:mt-3 [&_h3]:mb-2
                                            [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2
                                            [&_ol]:list-decimal [&_ol]:pl-5
                                            [&_strong]:text-[#0d3980] [&_strong]:font-semibold"
                                            dangerouslySetInnerHTML={{ __html: destination.detailedItinerary }}
                                        />
                                    </div>
                                )}

                                {/* Additional Description - show below if tripOverview exists */}
                                {destination.tripOverview && destination.description && (
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0d3980] mb-3 sm:mb-4">About {destination.name}</h2>
                                        <div
                                            className="text-sm sm:text-base text-gray-700 leading-relaxed font-sans prose prose-sm sm:prose-lg max-w-none"
                                            dangerouslySetInnerHTML={{ __html: destination.description }}
                                        />
                                    </div>
                                )}

                                {/* Related Packages */}
                                {packages.length > 0 && (
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0d3980] mb-4 sm:mb-6">Tour Packages for {destination.name}</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                            {packages.map((pkg) => (
                                                <Link key={pkg.id} href={`/packages/${pkg.slug}`} className="block group">
                                                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg h-full flex flex-col cursor-pointer group-hover:scale-[1.02]">
                                                        {pkg.images?.[0] && (
                                                            <div className="relative h-40 sm:h-48 bg-gray-200 overflow-hidden">
                                                                <Image
                                                                    src={pkg.images[0].url}
                                                                    alt={pkg.name}
                                                                    fill
                                                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                                />
                                                            </div>
                                                        )}
                                                        <CardHeader className="p-4 sm:p-6">
                                                            <CardTitle className="text-[#0d3980] font-serif text-lg sm:text-xl group-hover:text-[#33baea] transition-colors">{pkg.name}</CardTitle>
                                                            <p className="text-xs sm:text-sm text-gray-600 font-sans">{pkg.duration}</p>
                                                            {pkg.showPrice !== false && pkg.price && (
                                                                <p className="text-xs sm:text-sm font-semibold text-[#33baea] font-sans mt-2">{pkg.price}</p>
                                                            )}
                                                        </CardHeader>
                                                        <CardContent className="flex-1 flex flex-col justify-end p-4 sm:p-6 pt-0">
                                                            <div className="flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 sm:px-4 bg-[#0d3980] group-hover:bg-[#0a2d66] text-white uppercase tracking-wide font-sans rounded-md transition-colors text-xs sm:text-sm">
                                                                <span>View Package</span>
                                                                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1">
                                <Card className="lg:sticky lg:top-24 border-2 border-[#33baea]">
                                    <CardHeader className="p-4 sm:p-6">
                                        <CardTitle className="text-lg sm:text-xl font-serif font-bold text-[#0d3980]">Plan Your Trip</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                                        <p className="text-xs sm:text-sm text-gray-600 font-sans">
                                            Get in touch with us to learn more about {destination.name} and customize your travel experience.
                                        </p>
                                        <div className="space-y-2 sm:space-y-3">
                                            <Button
                                                onClick={() => setDialogOpen(true)}
                                                className="w-full bg-[#f9c701] hover:bg-[#f9c701]/90 text-[#0d3980] font-sans text-sm sm:text-base h-10 sm:h-11"
                                            >
                                                <Mail className="mr-2 h-4 w-4" />
                                                Send Inquiry
                                            </Button>
                                            <Button asChild variant="outline" className="w-full border-[#33baea] text-[#0d3980] hover:bg-[#33baea]/10 font-sans text-sm sm:text-base h-10 sm:h-11">
                                                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                                    <MessageCircle className="mr-2 h-4 w-4" />
                                                    WhatsApp Us
                                                </a>
                                            </Button>
                                            <Button asChild variant="outline" className="w-full border-[#0d3980] text-[#0d3980] hover:bg-[#0d3980]/10 font-sans text-sm sm:text-base h-10 sm:h-11">
                                                <Link href={`/packages?destination=${destination.slug}`}>
                                                    View All Packages
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

