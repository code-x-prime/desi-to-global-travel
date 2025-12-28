'use client'

import { PageBanner } from '@/components/layout/page-banner'
import { EarthLoader } from '@/components/ui/earth-loader'
import { ImageLightbox } from '@/components/gallery/image-lightbox'
import Image from 'next/image'
import { useState, useEffect, useCallback, useRef } from 'react'

const IMAGES_PER_PAGE = 12

export default function GalleryPage() {
    const [images, setImages] = useState([])
    const [displayedImages, setDisplayedImages] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [lightboxIndex, setLightboxIndex] = useState(0)
    const observerTarget = useRef(null)

    useEffect(() => {
        async function fetchImages() {
            try {
                const response = await fetch('/api/gallery', {
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                })
                if (response.ok) {
                    const data = await response.json()
                    const activeImages = data.filter(img => img.isActive)
                    setImages(activeImages)
                    // Load first page
                    setDisplayedImages(activeImages.slice(0, IMAGES_PER_PAGE))
                }
            } catch (error) {
                console.error('Error fetching gallery images:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchImages()
    }, [])

    const loadMoreImages = useCallback(() => {
        if (loadingMore || displayedImages.length >= images.length) return

        setLoadingMore(true)
        setTimeout(() => {
            const nextPage = displayedImages.length + IMAGES_PER_PAGE
            setDisplayedImages(images.slice(0, nextPage))
            setLoadingMore(false)
        }, 300)
    }, [displayedImages.length, images, loadingMore])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && displayedImages.length < images.length) {
                    loadMoreImages()
                }
            },
            { threshold: 0.1 }
        )

        const currentTarget = observerTarget.current
        if (currentTarget) {
            observer.observe(currentTarget)
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget)
            }
        }
    }, [loadMoreImages, displayedImages.length, images.length])

    const openLightbox = (index) => {
        setLightboxIndex(index)
        setLightboxOpen(true)
    }

    const closeLightbox = () => {
        setLightboxOpen(false)
    }

    const handleNavigate = (newIndex) => {
        setLightboxIndex(newIndex)
    }

    return (
        <div className="bg-white">
            {/* Banner */}
            <PageBanner
                imageUrl="/gallery.jpg"
                title="Gallery"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Gallery' }
                ]}
            />

            {/* Content */}
            <div className="py-8 sm:py-12 md:py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    {loading ? (
                        <EarthLoader />
                    ) : displayedImages.length > 0 ? (
                        <>
                            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0d3980]">
                                    Our Gallery
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-600 font-sans">
                                    Showing {displayedImages.length} of {images.length} images
                                </p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                                {displayedImages.map((image, index) => (
                                    <div
                                        key={image.id}
                                        onClick={() => openLightbox(index)}
                                        className="relative aspect-square overflow-hidden cursor-pointer group hover:shadow-2xl transition-all duration-300 rounded-lg bg-gray-100"
                                    >
                                        <Image
                                            src={image.url}
                                            alt={image.alt || 'Gallery image'}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            loading="lazy"
                                            width={500}
                                            height={500}
                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="text-white text-sm font-semibold font-sans bg-black/50 px-4 py-2 rounded-md">
                                                Click to view
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Loading More Indicator */}
                            {loadingMore && (
                                <div className="flex justify-center py-8">
                                    <div className="flex items-center gap-2 text-gray-600 font-sans">
                                        <div className="h-5 w-5 border-2 border-[#0d3980] border-t-transparent rounded-md animate-spin" />
                                        <span>Loading more images...</span>
                                    </div>
                                </div>
                            )}

                            {/* Observer Target for Infinite Scroll */}
                            {displayedImages.length < images.length && !loadingMore && (
                                <div ref={observerTarget} className="h-20 flex items-center justify-center">
                                    <div className="text-gray-500 text-sm font-sans">
                                        Scroll down to load more
                                    </div>
                                </div>
                            )}

                            {/* End of Gallery Message */}
                            {displayedImages.length >= images.length && images.length > IMAGES_PER_PAGE && (
                                <div className="text-center py-8">
                                    <p className="text-gray-600 font-sans">
                                        You&apos;ve reached the end of the gallery
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-600 text-lg font-sans">No gallery images available at the moment.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <ImageLightbox
                    images={displayedImages}
                    currentIndex={lightboxIndex}
                    onClose={closeLightbox}
                    onNavigate={handleNavigate}
                />
            )}
        </div>
    )
}
