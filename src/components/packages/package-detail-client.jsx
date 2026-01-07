'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mail, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { ShareButtons } from '@/components/packages/share-buttons'
import { PackageBookingDialog } from '@/components/booking/package-booking-dialog'

export function PackageDetailClient({ pkg }) {
    const [dialogOpen, setDialogOpen] = useState(false)

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919650509356'
    const whatsappMessage = encodeURIComponent(`Hi! I'm interested in the ${pkg.name} package.`)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

    const itinerary = typeof pkg.itinerary === 'object' ? pkg.itinerary : {}
    const coverImage = pkg.images?.find(img => img.isPrimary) || pkg.images?.[0]
    const hasItinerary = itinerary && Object.keys(itinerary).length > 0
    const hasCostDetails = pkg.costDetails && pkg.costDetails.trim().length > 0
    const hasIncludes = pkg.includes && pkg.includes.length > 0
    const hasExcludes = pkg.excludes && pkg.excludes.length > 0
    const hasTabs = hasItinerary || hasCostDetails || hasIncludes || hasExcludes

    return (
        <>
            <PackageBookingDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                packageSlug={pkg.slug}
                packageName={pkg.name}
            />
            <div className="bg-white">
                {/* Cover Image - Full Width Hero */}
                {coverImage && (
                    <div className="relative h-[50vh] sm:h-[60vh] md:h-[500px] w-full">
                        <Image
                            src={coverImage.url}
                            alt={coverImage.alt || pkg.name}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="absolute inset-0 flex items-end">
                            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 md:pb-12">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-3 sm:mb-4">
                                    {pkg.name}
                                </h1>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-white/90 font-sans">
                                    <span className="text-sm sm:text-base font-medium">{pkg.duration}</span>
                                    {pkg.category && (
                                        <span className="px-2 sm:px-3 py-1 bg-[#33baea]/20 text-white rounded-md text-xs sm:text-sm font-semibold">
                                            {pkg.category.name}
                                        </span>
                                    )}
                                    {pkg.showPrice !== false && pkg.price && (
                                        <span className="px-2 sm:px-3 py-1 bg-[#f9c701]/20 text-white rounded-md text-xs sm:text-sm font-semibold">
                                            {pkg.price}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="py-8 sm:py-10 md:py-16 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        {/* Social Share Icons */}
                        <ShareButtons packageName={pkg.name} />

                        {/* Header - Only if no cover image */}
                        {!coverImage && (
                            <div className="mb-8 sm:mb-10 md:mb-12">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#0d3980] mb-3 sm:mb-4">
                                    {pkg.name}
                                </h1>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-gray-600 font-sans">
                                    <span className="text-sm sm:text-base font-medium">{pkg.duration}</span>
                                    {pkg.category && (
                                        <span className="px-2 sm:px-3 py-1 bg-[#33baea]/10 text-[#33baea] rounded-md text-xs sm:text-sm font-semibold">
                                            {pkg.category.name}
                                        </span>
                                    )}
                                    {pkg.showPrice !== false && pkg.price && (
                                        <span className="px-2 sm:px-3 py-1 bg-[#f9c701]/20 text-[#0d3980] rounded-md text-xs sm:text-sm font-semibold">
                                            {pkg.price}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Additional Gallery Images */}
                        {pkg.images && pkg.images.length > 1 && (
                            <div className="mb-8 sm:mb-10 md:mb-12">
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                                    {pkg.images.filter(img => img.id !== coverImage?.id).slice(0, 4).map((image) => (
                                        <div key={image.id} className="relative h-32 sm:h-40 md:h-48 bg-gray-200 rounded-lg overflow-hidden">
                                            <Image
                                                src={image.url}
                                                alt={image.alt || pkg.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                                {/* Description */}
                                {pkg.description && (
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0d3980] mb-3 sm:mb-4">Overview</h2>
                                        <div
                                            className="text-sm sm:text-base text-gray-700 leading-relaxed font-sans prose prose-sm sm:prose-lg max-w-none"
                                            dangerouslySetInnerHTML={{ __html: pkg.description }}
                                        />
                                    </div>
                                )}

                                {/* Highlights */}
                                {pkg.highlights && pkg.highlights.length > 0 && (
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0d3980] mb-3 sm:mb-4">Highlights</h2>
                                        <ul className="space-y-2 sm:space-y-3 font-sans">
                                            {pkg.highlights.map((highlight, idx) => (
                                                <li key={idx} className="flex items-start gap-2 sm:gap-3">
                                                    <span className="text-[#f9c701] mt-0.5 sm:mt-1 font-bold text-sm sm:text-base">✓</span>
                                                    <span className="text-sm sm:text-base text-gray-700">{highlight}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Tabs */}
                                {hasTabs && (
                                    <Tabs defaultValue={hasItinerary ? "itinerary" : hasCostDetails ? "cost" : hasIncludes ? "includes" : "excludes"} className="w-full">
                                        <TabsList className={`grid w-full bg-gray-100 ${hasItinerary && hasCostDetails && hasIncludes && hasExcludes ? 'grid-cols-2 sm:grid-cols-4' : hasItinerary && hasCostDetails && hasIncludes ? 'grid-cols-2 sm:grid-cols-3' : hasItinerary && hasCostDetails ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                            {hasItinerary && <TabsTrigger value="itinerary" className="font-sans text-xs sm:text-sm">Itinerary</TabsTrigger>}
                                            {hasCostDetails && <TabsTrigger value="cost" className="font-sans text-xs sm:text-sm">Package Cost</TabsTrigger>}
                                            {hasIncludes && <TabsTrigger value="includes" className="font-sans text-xs sm:text-sm">Includes</TabsTrigger>}
                                            {hasExcludes && <TabsTrigger value="excludes" className="font-sans text-xs sm:text-sm">Does Not Include</TabsTrigger>}
                                        </TabsList>

                                        <TabsContent value="itinerary" className="mt-4 sm:mt-6">
                                            {itinerary && Object.keys(itinerary).length > 0 ? (
                                                <div className="space-y-4 sm:space-y-6">
                                                    {Object.entries(itinerary).map(([day, content]) => (
                                                        <Card key={day} className="border-l-4 border-l-[#33baea]">
                                                            <CardHeader className="p-4 sm:p-6">
                                                                <CardTitle className="text-base sm:text-lg font-serif text-[#0d3980]">{day}</CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="p-4 sm:p-6 pt-0">
                                                                <div
                                                                    className="text-sm sm:text-base text-gray-700 font-sans prose prose-sm sm:prose max-w-none"
                                                                    dangerouslySetInnerHTML={{ __html: typeof content === 'string' ? content : String(content) }}
                                                                />
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm sm:text-base text-gray-500 font-sans">No itinerary available.</p>
                                            )}
                                        </TabsContent>

                                        <TabsContent value="cost" className="mt-4 sm:mt-6">
                                            {pkg.costDetails ? (
                                                <div
                                                    className="text-sm sm:text-base text-gray-700 font-sans prose prose-sm sm:prose-lg max-w-none"
                                                    dangerouslySetInnerHTML={{ __html: pkg.costDetails }}
                                                />
                                            ) : (
                                                <p className="text-sm sm:text-base text-gray-500 font-sans">Cost details not available. Please contact us for pricing information.</p>
                                            )}
                                        </TabsContent>

                                        <TabsContent value="includes" className="mt-4 sm:mt-6">
                                            {pkg.includes && pkg.includes.length > 0 ? (
                                                <ul className="space-y-2 sm:space-y-3 font-sans">
                                                    {pkg.includes.map((item, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 sm:gap-3">
                                                            <span className="text-green-600 mt-0.5 sm:mt-1 font-bold text-base sm:text-xl flex-shrink-0">✓</span>
                                                            <span className="text-sm sm:text-base md:text-lg text-gray-700">{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-sm sm:text-base text-gray-500 font-sans">No information available.</p>
                                            )}
                                        </TabsContent>

                                        <TabsContent value="excludes" className="mt-4 sm:mt-6">
                                            {pkg.excludes && pkg.excludes.length > 0 ? (
                                                <ul className="space-y-2 sm:space-y-3 font-sans">
                                                    {pkg.excludes.map((item, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 sm:gap-3">
                                                            <span className="text-red-600 mt-0.5 sm:mt-1 font-bold text-base sm:text-xl flex-shrink-0">✗</span>
                                                            <span className="text-sm sm:text-base md:text-lg text-gray-700">{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-sm sm:text-base text-gray-500 font-sans">No information available.</p>
                                            )}
                                        </TabsContent>
                                    </Tabs>
                                )}
                            </div>

                            {/* Sidebar - Inquiry Card */}
                            <div className="lg:col-span-1">
                                <Card className="lg:sticky lg:top-24 border-2 border-[#33baea]">
                                    <CardHeader className="p-4 sm:p-6">
                                        <CardTitle className="text-lg sm:text-xl font-serif font-bold text-[#0d3980]">Interested in this package?</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                                        <p className="text-xs sm:text-sm text-gray-600 font-sans">
                                            Get in touch with us to learn more about this package and customize it to your preferences.
                                        </p>
                                        {pkg.showPrice !== false && pkg.price && (
                                            <div className="p-3 sm:p-4 bg-[#0d3980]/5 rounded-lg">
                                                <p className="text-xs sm:text-sm text-gray-600 font-sans mb-1">Starting from</p>
                                                <p className="text-xl sm:text-2xl font-serif font-bold text-[#0d3980]">{pkg.price}</p>
                                            </div>
                                        )}
                                        <div className="space-y-2 sm:space-y-3">
                                            <Button
                                                onClick={() => setDialogOpen(true)}
                                                className="w-full bg-[#f9c701] hover:bg-[#f9c701]/90 text-[#0d3980] font-sans text-sm sm:text-base h-10 sm:h-11"
                                            >
                                                <Mail className="mr-2 h-4 w-4" />
                                                Send Inquiry
                                            </Button>
                                            {pkg.whatsappNumber && (
                                                <Button asChild variant="outline" className="w-full border-[#33baea] text-[#0d3980] hover:bg-[#33baea]/10 font-sans text-sm sm:text-base h-10 sm:h-11">
                                                    <a href={`https://wa.me/${pkg.whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer">
                                                        <MessageCircle className="mr-2 h-4 w-4" />
                                                        WhatsApp Us
                                                    </a>
                                                </Button>
                                            )}
                                            {!pkg.whatsappNumber && (
                                                <Button asChild variant="outline" className="w-full border-[#33baea] text-[#0d3980] hover:bg-[#33baea]/10 font-sans text-sm sm:text-base h-10 sm:h-11">
                                                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                                        <MessageCircle className="mr-2 h-4 w-4" />
                                                        WhatsApp Us
                                                    </a>
                                                </Button>
                                            )}
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

