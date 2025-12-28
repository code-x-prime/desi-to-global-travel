import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Link from 'next/link'
import { Plus, Edit, Globe, Info } from 'lucide-react'
import { DestinationActions } from '@/components/admin/destination-actions'
import Image from 'next/image'
import { Suspense } from 'react'

async function getDestinations() {
    try {
        return await prisma.destination.findMany({
            include: {
                category: true,
            },
            orderBy: { createdAt: 'desc' },
        })
    } catch (error) {
        console.error('Error fetching destinations:', error)
        return []
    }
}

function DestinationCardSkeleton() {
    return (
        <Card className="overflow-hidden border-0 shadow-lg bg-white">
            <Skeleton className="h-48 w-full" />
            <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
                <div className="flex gap-2">
                    <Skeleton className="h-9 flex-1" />
                    <Skeleton className="h-9 w-20" />
                </div>
            </CardContent>
        </Card>
    )
}

function DestinationsList() {
    return (
        <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <DestinationCardSkeleton key={i} />
                ))}
            </div>
        }>
            <DestinationsContent />
        </Suspense>
    )
}

async function DestinationsContent() {
    const destinations = await getDestinations()

    if (destinations.length === 0) {
        return (
            <Card className="border-0 shadow-lg">
                <CardContent className="py-12 text-center">
                    <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4 font-sans text-lg">No destinations yet.</p>
                    <Button asChild className="bg-[#0d3980] hover:bg-[#0d3980]/90 text-white font-sans">
                        <Link href="/admin/destinations/new">Create Your First Destination</Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {destinations.map((destination) => (
                <Card key={destination.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white group">
                    {destination.imageUrl && (
                        <div className="relative h-40 sm:h-48 bg-gray-200 overflow-hidden">
                            <Image
                                src={destination.imageUrl}
                                alt={destination.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {!destination.isActive && (
                                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 sm:px-3 py-1 text-xs font-sans font-semibold rounded-md shadow-lg">
                                    Inactive
                                </div>
                            )}
                            {destination.category && (
                                <div className="absolute top-2 left-2 bg-[#0d3980]/90 text-white px-2 sm:px-3 py-1 text-xs font-sans font-semibold rounded-md">
                                    {destination.category.name}
                                </div>
                            )}
                        </div>
                    )}
                    <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="text-[#0d3980] font-serif font-bold text-lg sm:text-xl">{destination.name}</CardTitle>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {destination.country && (
                                <Badge variant="outline" className="font-sans text-xs">
                                    {destination.country}
                                </Badge>
                            )}
                            {destination.region && (
                                <Badge variant="secondary" className="font-sans text-xs">
                                    {destination.region}
                                </Badge>
                            )}
                        </div>
                        {destination.description && (
                            <p className="text-xs sm:text-sm text-gray-600 font-sans mt-2 line-clamp-2">{destination.description}</p>
                        )}
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                        <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm" className="flex-1 border-2 border-[#0d3980] text-[#0d3980] hover:bg-[#0d3980]/10 font-sans text-xs sm:text-sm">
                                <Link href={`/admin/destinations/edit/${destination.id}`} className="flex items-center justify-center">
                                    <Edit className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                    Edit
                                </Link>
                            </Button>
                            <DestinationActions destinationId={destination.id} />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default async function AdminDestinationsPage() {
    return (
        <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#0d3980] mb-1 sm:mb-2">Destinations</h1>
                        <p className="text-sm sm:text-base text-gray-600 font-sans">Manage travel destinations and locations</p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 border-2 border-[#0d3980] text-[#0d3980] hover:bg-[#0d3980]/10 font-sans flex-shrink-0">
                                <Info className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-serif font-bold text-[#0d3980]">About Destinations Management</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 font-sans text-gray-700">
                                <div>
                                    <h3 className="font-bold text-lg text-[#0d3980] mb-2">What is this page?</h3>
                                    <p className="text-base leading-relaxed">
                                        This page allows you to manage travel destinations that you offer. Destinations are places or locations where travelers can visit, such as cities, countries, or regions.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg text-[#0d3980] mb-2">What can you do here?</h3>
                                    <ul className="list-disc list-inside space-y-2 text-base leading-relaxed">
                                        <li><strong>Create Destinations:</strong> Add new travel destinations with details like name, country, region, images, and descriptions.</li>
                                        <li><strong>Edit Destinations:</strong> Update existing destination information, images, or content.</li>
                                        <li><strong>Manage Visibility:</strong> Activate or deactivate destinations to control what appears on your website.</li>
                                        <li><strong>Organize by Category:</strong> Assign destinations to categories for better organization.</li>
                                        <li><strong>Mark as Popular:</strong> Highlight popular destinations that will be featured on your home page.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg text-[#0d3980] mb-2">Where do destinations appear?</h3>
                                    <ul className="list-disc list-inside space-y-2 text-base leading-relaxed">
                                        <li><strong>Home Page:</strong> Destinations marked as &quot;Popular&quot; appear in the &quot;Popular Destinations&quot; section on your home page.</li>
                                        <li><strong>Destinations Page:</strong> All active destinations are displayed on the public <code className="bg-gray-100 px-2 py-1 rounded text-sm">/destinations</code> page.</li>
                                        <li><strong>Destination Detail Pages:</strong> Each destination has its own page at <code className="bg-gray-100 px-2 py-1 rounded text-sm">/destinations/[slug]</code> showing full details, images, and related packages.</li>
                                        <li><strong>Package Pages:</strong> Destinations can be linked to tour packages, and related packages appear on destination detail pages.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg text-[#0d3980] mb-2">How does it work?</h3>
                                    <ol className="list-decimal list-inside space-y-2 text-base leading-relaxed">
                                        <li><strong>Create a Destination:</strong> Click &quot;Add Destination&quot; and fill in the details like name, country, region, upload an image, and add descriptions.</li>
                                        <li><strong>Add Content:</strong> Use the rich text editor to add trip overview, highlights, and detailed itinerary.</li>
                                        <li><strong>Set Location:</strong> Select country and region. Regions are automatically filtered based on the selected country.</li>
                                        <li><strong>Activate:</strong> Make sure the destination is marked as &quot;Active&quot; to show it on your website.</li>
                                        <li><strong>Mark as Popular:</strong> Use the &quot;Home Content&quot; page to mark destinations as popular for home page display.</li>
                                    </ol>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg text-[#0d3980] mb-2">Example:</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#0d3980]">
                                        <p className="text-base leading-relaxed mb-2">
                                            <strong>Scenario:</strong> You want to add &quot;Dubai&quot; as a destination.
                                        </p>
                                        <ol className="list-decimal list-inside space-y-1 text-sm">
                                            <li>Click &quot;Add Destination&quot;</li>
                                            <li>Enter name: &quot;Dubai&quot;</li>
                                            <li>Select Country: &quot;UAE&quot;</li>
                                            <li>Select Region: &quot;Middle East&quot; (automatically filtered)</li>
                                            <li>Upload a beautiful image of Dubai</li>
                                            <li>Add trip overview, highlights, and itinerary</li>
                                            <li>Mark as Active</li>
                                            <li>Save - Now Dubai appears on your destinations page!</li>
                                        </ol>
                                    </div>
                                </div>

                                <div className="bg-[#0d3980]/5 p-4 rounded-lg border border-[#0d3980]/20">
                                    <p className="text-sm text-[#0d3980] font-semibold">
                                        💡 Tip: Use high-quality images and detailed descriptions to make your destinations more appealing to travelers!
                                    </p>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <Button asChild className="bg-[#0d3980] hover:bg-[#0d3980]/90 text-white font-sans shadow-lg w-full sm:w-auto text-sm sm:text-base">
                    <Link href="/admin/destinations/new" className="flex items-center justify-center">
                        <Plus className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Add Destination</span>
                        <span className="sm:hidden">Add</span>
                    </Link>
                </Button>
            </div>

            <DestinationsList />
        </div>
    )
}

