import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Link from 'next/link'
import { Plus, Edit, Package as PackageIcon, Info } from 'lucide-react'
import { PackageActions } from '@/components/admin/package-actions'
import Image from 'next/image'
import { Suspense } from 'react'

async function getPackages() {
    try {
        return await prisma.tourPackage.findMany({
            include: {
                images: { take: 1 },
                category: true,
            },
            orderBy: { createdAt: 'desc' },
        })
    } catch (error) {
        console.error('Error fetching packages:', error)
        return []
    }
}

function PackageCardSkeleton() {
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

function PackagesList() {
    return (
        <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <PackageCardSkeleton key={i} />
                ))}
            </div>
        }>
            <PackagesContent />
        </Suspense>
    )
}

async function PackagesContent() {
    const packages = await getPackages()

    if (packages.length === 0) {
        return (
            <Card className="border-0 shadow-lg">
                <CardContent className="py-12 text-center">
                    <PackageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4 font-sans text-lg">No packages yet.</p>
                    <Button asChild className="bg-[#0d3980] hover:bg-[#0d3980]/90 text-white font-sans">
                        <Link href="/admin/packages/new">Create Your First Package</Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {packages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white group">
                    {pkg.images[0] && (
                        <div className="relative h-40 sm:h-48 bg-gray-200 overflow-hidden">
                            <Image
                                src={pkg.images[0].url}
                                alt={pkg.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {!pkg.isActive && (
                                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 sm:px-3 py-1 text-xs font-sans font-semibold rounded-md shadow-lg">
                                    Inactive
                                </div>
                            )}
                            {pkg.category && (
                                <div className="absolute top-2 left-2 bg-[#0d3980]/90 text-white px-2 sm:px-3 py-1 text-xs font-sans font-semibold rounded-md">
                                    {pkg.category.name}
                                </div>
                            )}
                        </div>
                    )}
                    <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="text-[#0d3980] font-serif font-bold text-lg sm:text-xl line-clamp-2">{pkg.name}</CardTitle>
                        <p className="text-xs sm:text-sm text-gray-600 font-sans">{pkg.duration}</p>
                        {pkg.price && (
                            <p className="text-xs sm:text-sm font-semibold text-[#33baea] font-sans mt-1">{pkg.price}</p>
                        )}
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                        <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm" className="flex-1 border-2 border-[#0d3980] text-[#0d3980] hover:bg-[#0d3980]/10 font-sans text-xs sm:text-sm">
                                <Link href={`/admin/packages/edit/${pkg.id}`} className="flex items-center justify-center">
                                    <Edit className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                    Edit
                                </Link>
                            </Button>
                            <PackageActions packageId={pkg.id} />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default async function AdminPackagesPage() {
    return (
        <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#0d3980] mb-1 sm:mb-2">Tour Packages</h1>
                        <p className="text-sm sm:text-base text-gray-600 font-sans">Manage your tour packages and itineraries</p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 border-2 border-[#0d3980] text-[#0d3980] hover:bg-[#0d3980]/10 font-sans flex-shrink-0">
                                <Info className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-serif font-bold text-[#0d3980]">About Tour Packages Management</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 font-sans text-gray-700">
                                <div>
                                    <h3 className="font-bold text-lg text-[#0d3980] mb-2">What is this page?</h3>
                                    <p className="text-base leading-relaxed">
                                        This page allows you to manage tour packages that you offer to travelers. Tour packages are complete travel experiences that include itineraries, pricing, inclusions, exclusions, and detailed information about the trip.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg text-[#0d3980] mb-2">What can you do here?</h3>
                                    <ul className="list-disc list-inside space-y-2 text-base leading-relaxed">
                                        <li><strong>Create Packages:</strong> Add new tour packages with details like name, duration, price, description, itinerary, and images.</li>
                                        <li><strong>Edit Packages:</strong> Update existing package information, pricing, itinerary, or images.</li>
                                        <li><strong>Manage Visibility:</strong> Activate or deactivate packages to control what appears on your website.</li>
                                        <li><strong>Set Pricing:</strong> Add package prices and control whether prices are displayed on the public website.</li>
                                        <li><strong>Add Content:</strong> Use rich text editors to add detailed descriptions, itineraries, cost details, and inclusions/exclusions.</li>
                                        <li><strong>Upload Images:</strong> Add cover images and gallery images (up to 5) to showcase the package.</li>
                                        <li><strong>Mark as Featured:</strong> Highlight featured packages that will appear on your home page.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg text-[#0d3980] mb-2">Where do packages appear?</h3>
                                    <ul className="list-disc list-inside space-y-2 text-base leading-relaxed">
                                        <li><strong>Home Page:</strong> Packages marked as &quot;Featured&quot; appear in the &quot;Featured Packages&quot; section on your home page.</li>
                                        <li><strong>Packages Page:</strong> All active packages are displayed on the public <code className="bg-gray-100 px-2 py-1 rounded text-sm">/packages</code> page with filtering options.</li>
                                        <li><strong>Package Detail Pages:</strong> Each package has its own page at <code className="bg-gray-100 px-2 py-1 rounded text-sm">/packages/[slug]</code> showing full details, images, itinerary, pricing, and inquiry form.</li>
                                        <li><strong>Destination Pages:</strong> Related packages appear on destination detail pages.</li>
                                        <li><strong>Contact Form:</strong> Packages can be selected when customers submit inquiries.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg text-[#0d3980] mb-2">How does it work?</h3>
                                    <ol className="list-decimal list-inside space-y-2 text-base leading-relaxed">
                                        <li><strong>Create a Package:</strong> Click &quot;Add Package&quot; and fill in basic details like name, duration, category, and description.</li>
                                        <li><strong>Add Images:</strong> Upload a cover image and up to 5 gallery images. The cover image appears as a hero on the package detail page.</li>
                                        <li><strong>Set Pricing:</strong> Add package price and choose whether to display it on the website. You can also add a WhatsApp number for direct inquiries.</li>
                                        <li><strong>Add Itinerary:</strong> Use the rich text editor to create day-by-day itinerary with detailed activities.</li>
                                        <li><strong>Add Details:</strong> Fill in Package Cost, Includes, and Excludes sections using tabs for better organization.</li>
                                        <li><strong>Activate:</strong> Make sure the package is marked as &quot;Active&quot; to show it on your website.</li>
                                        <li><strong>Mark as Featured:</strong> Use the &quot;Home Content&quot; page to mark packages as featured for home page display.</li>
                                    </ol>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg text-[#0d3980] mb-2">Package Features:</h3>
                                    <ul className="list-disc list-inside space-y-2 text-base leading-relaxed">
                                        <li><strong>Rich Text Editor:</strong> Use Jodit editor for formatting descriptions, itineraries, and cost details.</li>
                                        <li><strong>Image Management:</strong> Upload images with automatic compression. Images are stored in Cloudflare R2.</li>
                                        <li><strong>Slug Auto-generation:</strong> Package slugs are automatically generated from the package name for SEO-friendly URLs.</li>
                                        <li><strong>Category Organization:</strong> Assign packages to categories for better organization and filtering.</li>
                                        <li><strong>Price Display Control:</strong> Toggle whether prices are shown on public pages.</li>
                                        <li><strong>WhatsApp Integration:</strong> Add package-specific WhatsApp numbers for direct customer contact.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg text-[#0d3980] mb-2">Example:</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#0d3980]">
                                        <p className="text-base leading-relaxed mb-2">
                                            <strong>Scenario:</strong> You want to create a &quot;Dubai Luxury Getaway - 5 Days&quot; package.
                                        </p>
                                        <ol className="list-decimal list-inside space-y-1 text-sm">
                                            <li>Click &quot;Add Package&quot;</li>
                                            <li>Enter name: &quot;Dubai Luxury Getaway - 5 Days&quot; (slug auto-generated)</li>
                                            <li>Select category: &quot;Luxury Travel&quot;</li>
                                            <li>Enter duration: &quot;5 Days / 4 Nights&quot;</li>
                                            <li>Upload cover image and 3-4 gallery images</li>
                                            <li>Add description using rich text editor</li>
                                            <li>Set price: &quot;₹1,25,000 per person&quot; and enable price display</li>
                                            <li>Add WhatsApp number for inquiries</li>
                                            <li>Create day-by-day itinerary in the Itinerary tab</li>
                                            <li>Add cost details, includes, and excludes in respective tabs</li>
                                            <li>Mark as Active and Featured</li>
                                            <li>Save - Now the package appears on your website!</li>
                                        </ol>
                                    </div>
                                </div>

                                <div className="bg-[#0d3980]/5 p-4 rounded-lg border border-[#0d3980]/20">
                                    <p className="text-sm text-[#0d3980] font-semibold">
                                        💡 Tip: Use high-quality images, detailed itineraries, and clear pricing to make your packages more attractive to travelers. Don&apos;t forget to mark popular packages as &quot;Featured&quot; for home page visibility!
                                    </p>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <Button asChild className="bg-[#0d3980] hover:bg-[#0d3980]/90 text-white font-sans shadow-lg w-full sm:w-auto text-sm sm:text-base">
                    <Link href="/admin/packages/new" className="flex items-center justify-center">
                        <Plus className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Add Package</span>
                        <span className="sm:hidden">Add</span>
                    </Link>
                </Button>
            </div>

            <PackagesList />
        </div>
    )
}
