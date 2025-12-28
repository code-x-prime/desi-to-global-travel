"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { FaMapMarkerAlt, FaStar, FaArrowRight } from "react-icons/fa"

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



export function PopularDestinations({ destinations, loading = false }) {
    const popularDests = destinations?.filter((dest) => dest.isPopular) || []

    if (!popularDests.length && !loading) {
        return null
    }

    return (
        <section className="md:py-16 py-8 bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
                {/* Header Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 lg:mb-20 gap-8"
                >
                    <div className="max-w-3xl">
                        <motion.div
                            variants={fadeUp}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-md px-4 sm:px-5 py-2 sm:py-2.5 mb-4 sm:mb-6 border border-cyan-200"
                        >
                            <FaMapMarkerAlt className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-600" />
                            <span className="text-blue-900 text-xs sm:text-sm font-semibold tracking-wider uppercase font-sans">Popular Destinations</span>
                        </motion.div>

                        <motion.h2
                            variants={fadeUp}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-blue-900 leading-tight mb-3 sm:mb-4 text-balance"
                        >
                            Explore the World&apos;s
                            <br />
                            <span className="bg-gradient-to-r from-cyan-500 to-blue-700 bg-clip-text text-transparent">
                                Most Beautiful Places
                            </span>
                        </motion.h2>

                        <motion.p variants={fadeUp} className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl font-sans">
                            Discover handpicked destinations that promise unforgettable experiences and breathtaking beauty.
                        </motion.p>
                    </div>

                    <motion.div variants={fadeUp}>
                        <Link
                            href="/destinations"
                            className="group inline-flex items-center gap-3 bg-blue-900 hover:bg-blue-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-md font-semibold shadow-lg hover:shadow-xl transition-all duration-300 font-sans"
                        >
                            View All Destinations
                            <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-white/20 group-hover:bg-white/30 transition-colors">
                                <FaArrowRight className="h-3.5 w-3.5 text-white" />
                            </span>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Destinations Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin" />
                    </div>
                ) : (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6"
                    >
                        {popularDests.map((destination, index) => {
                            const isFirst = index === 0
                            const gridClass = isFirst
                                ? "col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2 row-span-1 sm:row-span-2"
                                : "col-span-1 row-span-1"

                            return (
                                <motion.div
                                    key={destination.id}
                                    variants={scaleUp}
                                    whileHover={{ scale: 1.02, y: -8 }}
                                    transition={{ duration: 0.3 }}
                                    className={`${gridClass} group`}
                                >
                                    <Link href={`/destinations/${destination.slug}`} className="block h-full">
                                        <div className="relative h-full min-h-[240px] sm:min-h-[280px] md:min-h-[300px] lg:min-h-[320px] rounded-md overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-cyan-300">
                                            {destination.imageUrl ? (
                                                <motion.div
                                                    className="absolute inset-0"
                                                    whileHover={{ scale: 1.1 }}
                                                    transition={{ duration: 0.7, ease: "easeOut" }}
                                                >
                                                    <Image
                                                        src={destination.imageUrl || "/placeholder.svg"}
                                                        alt={destination.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                                    />
                                                </motion.div>
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-cyan-500 to-blue-900" />
                                            )}

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />

                                            {/* Popular Badge */}
                                            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-cyan-500 to-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md shadow-lg z-10 backdrop-blur-sm border border-white/20">
                                                <FaStar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white fill-white" />
                                                <span className="text-white text-xs font-bold uppercase tracking-wider font-sans">Popular</span>
                                            </div>

                                            {/* Content */}
                                            <div className="absolute inset-0 p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col justify-end">
                                                {destination.country && (
                                                    <span className="text-white/90 text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3 inline-block bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-md w-fit font-sans">
                                                        {destination.country}
                                                    </span>
                                                )}
                                                <h3
                                                    className={`text-white font-serif font-bold leading-tight mb-2 sm:mb-3 ${isFirst ? "text-2xl sm:text-3xl md:text-4xl lg:text-4xl" : "text-lg sm:text-xl md:text-2xl lg:text-2xl"}`}
                                                >
                                                    {destination.name}
                                                </h3>

                                                {/* Hover Arrow */}
                                                <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm group-hover:opacity-100 transform translate-y-3 transition-all duration-300 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-md w-fit font-sans">
                                                    <span>Explore</span>
                                                    <FaArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                )}
            </div>
        </section>
    )
}
