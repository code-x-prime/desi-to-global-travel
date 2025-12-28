'use client'

import { useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export function ImageLightbox({ images, currentIndex, onClose, onNavigate }) {
    const [currentIdx, setCurrentIdx] = useState(currentIndex)

    useEffect(() => {
        setCurrentIdx(currentIndex)
    }, [currentIndex])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose()
            } else if (e.key === 'ArrowLeft') {
                handlePrevious()
            } else if (e.key === 'ArrowRight') {
                handleNext()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'unset'
        }
    }, [currentIdx])

    const handlePrevious = () => {
        const newIndex = currentIdx > 0 ? currentIdx - 1 : images.length - 1
        setCurrentIdx(newIndex)
        if (onNavigate) onNavigate(newIndex)
    }

    const handleNext = () => {
        const newIndex = currentIdx < images.length - 1 ? currentIdx + 1 : 0
        setCurrentIdx(newIndex)
        if (onNavigate) onNavigate(newIndex)
    }

    const currentImage = images[currentIdx]

    if (!currentImage) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                onClick={onClose}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors p-2"
                    aria-label="Close"
                >
                    <X className="h-8 w-8" />
                </button>

                {/* Previous Button */}
                {images.length > 1 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            handlePrevious()
                        }}
                        className="absolute left-4 z-10 text-white hover:text-gray-300 transition-colors p-3 bg-black/50 rounded-md"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </button>
                )}

                {/* Next Button */}
                {images.length > 1 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            handleNext()
                        }}
                        className="absolute right-4 z-10 text-white hover:text-gray-300 transition-colors p-3 bg-black/50 rounded-md"
                        aria-label="Next image"
                    >
                        <ChevronRight className="h-8 w-8" />
                    </button>
                )}

                {/* Image Container */}
                <div
                    className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <motion.div
                        key={currentIdx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full h-full flex items-center justify-center"
                    >
                        <Image
                            src={currentImage.url}
                            alt={currentImage.alt || 'Gallery image'}
                            fill
                            className="object-contain"
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                        />
                    </motion.div>
                </div>

                {/* Image Counter */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm font-sans bg-black/50 px-4 py-2 rounded-md">
                        {currentIdx + 1} / {images.length}
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    )
}

