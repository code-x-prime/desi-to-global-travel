"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FaPaperPlane, FaClock, FaArrowRight, FaMapMarkerAlt } from "react-icons/fa"

// Helper function to strip HTML tags and get plain text
function stripHtml(html) {
    if (!html) return ''
    if (typeof window === 'undefined') {
        // Server-side: simple regex approach
        return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim()
    }
    // Client-side: use DOM
    const tmp = document.createElement('DIV')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
}

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
}

const scaleUp = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
}


export function FeaturedPackages({ packages, loading = false }) {
    const featuredPkgs = packages?.filter((pkg) => pkg.isFeatured) || []

    if (!featuredPkgs.length && !loading) {
        return null
    }

    return (
        <section className="md:py-16 py-8 bg-gradient-to-br from-white via-amber-50 to-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-900/5 rounded-md blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-300/10 rounded-md blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
                {/* Header Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="text-center mb-20 lg:mb-24"
                >
                    <motion.div
                        variants={fadeUp}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-blue-100 rounded-md px-5 py-2.5 mb-6 border border-amber-200"
                    >
                        <FaPaperPlane className="w-4 h-4 text-amber-600" />
                        <span className="text-blue-900 text-sm font-semibold tracking-wider uppercase">Featured Packages</span>
                    </motion.div>

                    <motion.h2
                        variants={fadeUp}
                        className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-900 mb-6 leading-tight text-balance"
                    >
                        Curated Travel
                        <br />
                        <span className="bg-gradient-to-r from-amber-500 to-blue-900 bg-clip-text text-transparent">
                            Experiences
                        </span>
                    </motion.h2>

                    <motion.p variants={fadeUp} className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Handpicked journeys designed to create lasting memories. Each package is thoughtfully crafted to deliver
                        authentic, transformative travel experiences.
                    </motion.p>
                </motion.div>

                {/* Packages Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-900 rounded-md animate-spin" />
                    </div>
                ) : (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12"
                    >
                        {featuredPkgs.map((pkg) => (
                            <motion.div
                                key={pkg.id}
                                variants={scaleUp}
                                whileHover={{ y: -10, scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                                className="group"
                            >
                                <Link href={`/packages/${pkg.slug}`} className="block h-full">
                                    <Card className="overflow-hidden border-2 border-transparent hover:border-amber-300 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white h-full rounded-md relative">
                                        {/* Image Container */}
                                        <div className="relative h-72 lg:h-80 overflow-hidden rounded-t-md bg-gradient-to-br from-blue-900 via-cyan-500 to-blue-900">
                                            {pkg.images?.[0]?.url ? (
                                                <motion.div
                                                    className="absolute inset-0"
                                                    whileHover={{ scale: 1.12 }}
                                                    transition={{ duration: 0.7 }}
                                                >
                                                    <Image
                                                        src={pkg.images[0].url || "/placeholder.svg"}
                                                        alt={pkg.images[0].alt || pkg.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    />
                                                </motion.div>
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-cyan-500 to-blue-900" />
                                            )}

                                            {/* Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />



                                            {/* Category Badge - Below Featured */}
                                            {pkg.category && (
                                                <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-lg z-10 border border-white/50">
                                                    <FaMapMarkerAlt className="h-3.5 w-3.5 text-cyan-600" />
                                                    <span className="text-gray-700 text-xs font-semibold font-sans">{pkg.category.name}</span>
                                                </div>
                                            )}

                                            {/* Duration Badge - Top Right */}
                                            {pkg.duration && (
                                                <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-lg z-10 border border-white/50">
                                                    <FaClock className="h-3.5 w-3.5 text-blue-900" />
                                                    <span className="text-blue-900 text-xs font-semibold font-sans">{pkg.duration}</span>
                                                </div>
                                            )}

                                            {/* Content Overlay */}
                                            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 flex flex-col justify-end">
                                                {/* Title */}
                                                <h3 className="text-2xl lg:text-3xl font-serif font-bold text-white leading-tight mb-4 line-clamp-2">
                                                    {pkg.name}
                                                </h3>




                                                {/* Hover Arrow */}
                                                <div className="flex items-center gap-2 text-white font-semibold text-sm  transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-md w-fit">
                                                    <span className="font-sans">Explore Package</span>
                                                    <FaArrowRight className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Body - Description */}
                                        <div className="p-6 lg:p-8">
                                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 font-sans">
                                                {pkg.description ? stripHtml(pkg.description) : "Explore this amazing travel destination and create unforgettable memories."}
                                            </p>
                                        </div>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                >
                    <Button
                        asChild
                        className="group bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 h-auto rounded-md shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-base"
                    >
                        <Link href="/packages" className="flex items-center gap-2">
                            View All Packages
                            <FaArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}
