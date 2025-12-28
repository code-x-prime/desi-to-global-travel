'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, Globe, Star, Check } from 'lucide-react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

export function HomeContentClient({ packages: initialPackages, destinations: initialDestinations }) {
    const router = useRouter()
    const [packages, setPackages] = useState(initialPackages)
    const [destinations, setDestinations] = useState(initialDestinations)
    const [updating, setUpdating] = useState(null)

    const toggleFeatured = async (packageId, currentValue) => {
        setUpdating(packageId)
        try {
            const response = await fetch(`/api/admin/packages/${packageId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isFeatured: !currentValue }),
            })

            if (response.ok) {
                setPackages((prev) =>
                    prev.map((pkg) =>
                        pkg.id === packageId ? { ...pkg, isFeatured: !currentValue } : pkg
                    )
                )
                router.refresh()
            } else {
                alert('Failed to update package')
            }
        } catch (error) {
            console.error('Error updating package:', error)
            alert('Error updating package')
        } finally {
            setUpdating(null)
        }
    }

    const togglePopular = async (destinationId, currentValue) => {
        setUpdating(destinationId)
        try {
            const response = await fetch(`/api/admin/destinations/${destinationId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPopular: !currentValue }),
            })

            if (response.ok) {
                setDestinations((prev) =>
                    prev.map((dest) =>
                        dest.id === destinationId ? { ...dest, isPopular: !currentValue } : dest
                    )
                )
                router.refresh()
            } else {
                alert('Failed to update destination')
            }
        } catch (error) {
            console.error('Error updating destination:', error)
            alert('Error updating destination')
        } finally {
            setUpdating(null)
        }
    }

    const featuredPackages = packages.filter((pkg) => pkg.isFeatured)
    const popularDestinations = destinations.filter((dest) => dest.isPopular)

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Info Alert */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <Star className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700 font-sans">
                            <strong className="font-semibold">Note:</strong> You can see and manage all items here. However, on the <strong>public home page</strong>, only the first <strong>6 Featured Packages</strong> and first <strong>7 Popular Destinations</strong> (oldest first) will be displayed. You can mark unlimited items as featured/popular, but only the first 6/7 will appear on the public site.
                        </p>
                    </div>
                </div>
            </div>

            {/* Featured Packages Section */}
            <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="border-b border-gray-100 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-[#f9c701]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-[#f9c701]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <CardTitle className="text-lg sm:text-xl font-serif font-bold text-[#0d3980]">
                                    Featured Packages
                                </CardTitle>
                                <p className="text-xs sm:text-sm text-gray-600 font-sans mt-1">
                                    {featuredPackages.length} package(s) marked as featured. Only first 6 will appear on home page.
                                </p>
                            </div>
                        </div>
                        <Badge className="bg-[#f9c701] text-[#0d3980] font-sans text-xs sm:text-sm">
                            {featuredPackages.length} Featured
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                    {packages.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {packages.map((pkg) => (
                                <Card
                                    key={pkg.id}
                                    className={`overflow-hidden border-2 transition-all ${pkg.isFeatured
                                        ? 'border-[#f9c701] shadow-lg'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    {pkg.images?.[0] && (
                                        <div className="relative h-32 sm:h-40 bg-gray-200">
                                            <Image
                                                src={pkg.images[0].url}
                                                alt={pkg.name}
                                                fill
                                                className="object-cover"
                                            />
                                            {pkg.isFeatured && (
                                                <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-[#f9c701] text-[#0d3980] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-semibold font-sans flex items-center gap-1">
                                                    <Star className="h-3 w-3 fill-current" />
                                                    <span className="hidden sm:inline">Featured</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <CardHeader className="pb-2 sm:pb-3 p-4 sm:p-6">
                                        <CardTitle className="text-sm sm:text-base font-serif text-[#0d3980] line-clamp-1">
                                            {pkg.name}
                                        </CardTitle>
                                        <p className="text-xs text-gray-500 font-sans">{pkg.duration}</p>
                                    </CardHeader>
                                    <CardContent className="p-4 sm:p-6 pt-0">
                                        <Button
                                            onClick={() => toggleFeatured(pkg.id, pkg.isFeatured)}
                                            disabled={updating === pkg.id}
                                            variant={pkg.isFeatured ? 'default' : 'outline'}
                                            className={`w-full font-sans text-xs sm:text-sm ${pkg.isFeatured
                                                ? 'bg-[#f9c701] hover:bg-[#e5b700] text-[#0d3980]'
                                                : 'border-[#0d3980] text-[#0d3980] hover:bg-[#0d3980]/10'
                                                }`}
                                        >
                                            {updating === pkg.id ? (
                                                'Updating...'
                                            ) : pkg.isFeatured ? (
                                                <>
                                                    <Check className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                                    <span className="hidden sm:inline">Featured</span>
                                                    <span className="sm:hidden">✓</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Star className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                                    <span className="hidden sm:inline">Mark as Featured</span>
                                                    <span className="sm:hidden">Feature</span>
                                                </>
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 font-sans">No packages available</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Popular Destinations Section */}
            <Card className="border-0 shadow-lg bg-white">
                <CardHeader className="border-b border-gray-100 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-[#33baea]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-[#33baea]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <CardTitle className="text-lg sm:text-xl font-serif font-bold text-[#0d3980]">
                                    Popular Destinations
                                </CardTitle>
                                <p className="text-xs sm:text-sm text-gray-600 font-sans mt-1">
                                    {popularDestinations.length} destination(s) marked as popular. Only first 7 will appear on home page.
                                </p>
                            </div>
                        </div>
                        <Badge className="bg-[#33baea] text-white font-sans text-xs sm:text-sm">
                            {popularDestinations.length} Popular
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                    {destinations.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {destinations.map((dest) => (
                                <Card
                                    key={dest.id}
                                    className={`overflow-hidden border-2 transition-all ${dest.isPopular
                                        ? 'border-[#33baea] shadow-lg'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    {dest.imageUrl && (
                                        <div className="relative h-32 sm:h-40 bg-gray-200">
                                            <Image
                                                src={dest.imageUrl}
                                                alt={dest.name}
                                                fill
                                                className="object-cover"
                                            />
                                            {dest.isPopular && (
                                                <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-[#33baea] text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-semibold font-sans flex items-center gap-1">
                                                    <Star className="h-3 w-3 fill-current" />
                                                    <span className="hidden sm:inline">Popular</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <CardHeader className="pb-2 sm:pb-3 p-4 sm:p-6">
                                        <CardTitle className="text-sm sm:text-base font-serif text-[#0d3980]">
                                            {dest.name}
                                        </CardTitle>
                                        {dest.country && (
                                            <p className="text-xs text-gray-500 font-sans">{dest.country}</p>
                                        )}
                                    </CardHeader>
                                    <CardContent className="p-4 sm:p-6 pt-0">
                                        <Button
                                            onClick={() => togglePopular(dest.id, dest.isPopular)}
                                            disabled={updating === dest.id}
                                            variant={dest.isPopular ? 'default' : 'outline'}
                                            className={`w-full font-sans text-xs sm:text-sm ${dest.isPopular
                                                ? 'bg-[#33baea] hover:bg-[#2aa8d0] text-white'
                                                : 'border-[#33baea] text-[#33baea] hover:bg-[#33baea]/10'
                                                }`}
                                        >
                                            {updating === dest.id ? (
                                                'Updating...'
                                            ) : dest.isPopular ? (
                                                <>
                                                    <Check className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                                    <span className="hidden sm:inline">Popular</span>
                                                    <span className="sm:hidden">✓</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Star className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                                    <span className="hidden sm:inline">Mark as Popular</span>
                                                    <span className="sm:hidden">Popular</span>
                                                </>
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Globe className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 font-sans">No destinations available</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

