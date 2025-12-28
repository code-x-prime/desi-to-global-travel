import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Plus, Image as ImageIcon } from 'lucide-react'
import { GalleryImageActions } from '@/components/admin/gallery-image-actions'
import Image from 'next/image'
import { Suspense } from 'react'

async function getGalleryImages() {
    try {
        return await prisma.galleryImage.findMany({
            orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        })
    } catch (error) {
        console.error('Error fetching gallery images:', error)
        return []
    }
}

function GalleryImageSkeleton() {
    return (
        <Card className="overflow-hidden border-0 shadow-lg bg-white">
            <Skeleton className="aspect-square w-full" />
        </Card>
    )
}

function GalleryList() {
    return (
        <Suspense fallback={
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                    <GalleryImageSkeleton key={i} />
                ))}
            </div>
        }>
            <GalleryContent />
        </Suspense>
    )
}

async function GalleryContent() {
    const images = await getGalleryImages()

    if (images.length === 0) {
        return (
            <Card className="border-0 shadow-lg">
                <CardContent className="py-12 text-center">
                    <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4 font-sans text-lg">No gallery images yet.</p>
                    <Button asChild className="bg-[#0d3980] hover:bg-[#0d3980]/90 text-white font-sans">
                        <Link href="/admin/gallery/upload">Upload Your First Image</Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {images.map((image) => (
                <Card key={image.id} className="overflow-hidden group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                    <div className="relative aspect-square bg-gray-200">
                        <Image
                            src={image.url}
                            alt={image.alt || 'Gallery image'}
                            className="w-full h-full object-cover"
                            width={500}
                            height={500}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <GalleryImageActions imageId={image.id} isActive={image.isActive} />
                            </div>
                        </div>
                        {!image.isActive && (
                            <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-sans font-semibold rounded-md shadow-lg">
                                Inactive
                            </div>
                        )}
                    </div>
                </Card>
            ))}
        </div>
    )
}

export default async function AdminGalleryPage() {
    return (
        <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#0d3980] mb-1 sm:mb-2">Gallery</h1>
                    <p className="text-sm sm:text-base text-gray-600 font-sans">Manage your gallery images and showcase your travel experiences</p>
                </div>
                <Button asChild className="bg-[#0d3980] hover:bg-[#0d3980]/90 text-white font-sans shadow-lg w-full sm:w-auto text-sm sm:text-base">
                    <Link href="/admin/gallery/upload" className="flex items-center justify-center">
                        <Plus className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Upload Images</span>
                        <span className="sm:hidden">Upload</span>
                    </Link>
                </Button>
            </div>

            <GalleryList />
        </div>
    )
}
