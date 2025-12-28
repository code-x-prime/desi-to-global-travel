'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    }
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
}

export function PageBanner({
    imageUrl,
    title,
    breadcrumbs
}) {
    return (
        <section className="relative h-[50vh] min-h-[500px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                />
                {/* Dark Blue Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0d3980]/20 via-[#0d3980]/20 to-[#0d3980]/30" />
            </div>

            {/* Content - Centered */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 text-center"
            >
                {/* Breadcrumbs */}
                {breadcrumbs && (
                    <motion.div variants={fadeUp} className="mb-6">
                        <nav className="flex items-center justify-center gap-2 text-white/80 text-sm font-sans">
                            {breadcrumbs.map((crumb, index) => (
                                <span key={index}>
                                    {index > 0 && <span className="text-white/50 mx-2">/</span>}
                                    {crumb.href ? (
                                        <Link href={crumb.href} className="hover:text-white transition-colors">
                                            {crumb.label}
                                        </Link>
                                    ) : (
                                        <span className="text-white">{crumb.label}</span>
                                    )}
                                </span>
                            ))}
                        </nav>
                    </motion.div>
                )}

                {/* Main Heading */}
                <motion.h1
                    variants={fadeUp}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-tight"
                >
                    {title}
                </motion.h1>
            </motion.div>
        </section>
    )
}
