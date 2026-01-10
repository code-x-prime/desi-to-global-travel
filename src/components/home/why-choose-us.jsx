'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

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
            staggerChildren: 0.12,
            delayChildren: 0.2
        }
    }
}

const features = [
    {
        svg: '/curated-expertise.svg',
        title: 'Curated Expertise',
        description: 'Every hotel, route, and local eatery is vetted by our team to ensure it meets our high standards of quality and authenticity.',
        gradient: 'from-[#0d3980] to-[#33baea]'
    },
    {
        svg: '/responsible-travel.svg',
        title: 'Responsible Travel',
        description: 'We are committed to sustainable tourism, working with local communities to ensure your visit has a positive impact.',
        gradient: 'from-[#33baea] to-[#0d3980]'
    },
    {
        svg: '/concierge-support.svg',
        title: '24/7 Concierge Support',
        description: 'From the moment you land to your final flight home, our dedicated concierge team is just a message away.',
        gradient: 'from-[#f9c701] to-[#ff9500]'
    },
    {
        svg: '/global-network.svg',
        title: 'Global Network',
        description: 'Access to exclusive experiences and insider knowledge through our worldwide network of trusted partners.',
        gradient: 'from-[#0d3980] to-[#4a148c]'
    },
    {
        svg: '/best-price-guarantee.svg',
        title: 'Best Price Guarantee',
        description: 'Competitive pricing without compromising on quality. We promise value that exceeds your expectations.',
        gradient: 'from-[#33baea] to-[#00bcd4]'
    },
    {
        svg: '/personalized-journeys.svg',
        title: 'Personalized Journeys',
        description: 'Tailor-made itineraries crafted to match your unique preferences, interests, and travel style.',
        gradient: 'from-[#f9c701] to-[#33baea]'
    },
]

const aboutFeatures = [
    {
        svg: '/curated-expertise.svg',
        title: 'Curated Expertise',
        description: 'Every hotel, route, and local eatery is vetted by our team to ensure it meets our high standards of quality and authenticity.',
        gradient: 'from-[#0d3980] to-[#33baea]',
        image: '/curated-expertise.jpg'
    },
    {
        svg: '/responsible-travel.svg',
        title: 'Responsible Travel',
        description: 'We are committed to sustainable tourism, working with local communities to ensure your visit has a positive impact.',
        gradient: 'from-[#33baea] to-[#0d3980]',
        image: '/responsible-travel.jpg'
    },
    {
        svg: '/concierge-support.svg',
        title: '24/7 Support',
        description: 'From the moment you land to your final flight home, our dedicated concierge team is a message away.',
        gradient: 'from-[#f9c701] to-[#ff9500]',
        image: '/support.jpg'
    },
]

export function WhyChooseUs({ variant = 'home', title = null, subtitle = null }) {
    const items = variant === 'about' ? aboutFeatures : features
    const bgClass = variant === 'about' ? 'bg-gray-50' : 'bg-white'
    const showImages = variant === 'about'

    return (
        <section className={`py-8 sm:py-12 md:py-16 ${bgClass} relative overflow-hidden`}>
            {/* Background Decoration - Only for home variant */}
            {variant === 'home' && (
                <>
                    <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-[#33baea]/5 rounded-md blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-[#f9c701]/5 rounded-md blur-3xl translate-y-1/2 -translate-x-1/2" />
                </>
            )}

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20"
                >

                    <motion.h2
                        variants={fadeUp}
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-[#0d3980] mb-4 sm:mb-6 leading-tight"
                    >
                        {title || (variant === 'home' ? (
                            <>
                                Travel with Complete
                                <br />
                                <span className="text-[#33baea]">Peace of Mind</span>
                            </>
                        ) : 'Why Choose Us')}
                    </motion.h2>

                    {subtitle && (
                        <motion.p
                            variants={fadeUp}
                            className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4"
                        >
                            {subtitle}
                        </motion.p>
                    )}

                    {variant === 'home' && !subtitle && (
                        <motion.p
                            variants={fadeUp}
                            className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4"
                        >
                            At Desi To Global Travel, we believe every journey should be extraordinary.
                            Here&apos;s what makes us the preferred choice for discerning travelers.
                        </motion.p>
                    )}
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={staggerContainer}
                    className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 ${variant === 'about' ? 'lg:gap-10' : 'lg:gap-8'}`}
                >
                    {items.map((item, index) => {
                        return (
                            <motion.div
                                key={index}
                                variants={fadeUp}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                className="group"
                            >
                                <Card className={`relative border-0 bg-white h-full ${showImages ? 'overflow-hidden' : ''} ${showImages ? 'p-0' : 'p-4 sm:p-6 lg:p-8'} shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-[#0d3980]/10 transition-all duration-500`}>
                                    {/* Image - Only for about variant */}
                                    {showImages && item.image && (
                                        <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-20`} />
                                        </div>
                                    )}

                                    {/* Hover Gradient Background - Only for home variant */}
                                    {!showImages && (
                                        <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
                                    )}

                                    <CardHeader className={`${showImages ? 'p-4 sm:p-6 lg:p-8 pb-3 sm:pb-4' : 'p-0 pb-3 sm:pb-4'} relative`}>
                                        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#0d3980] to-[#33baea] mb-4 sm:mb-6 shadow-lg">
                                            <Image
                                                src={item.svg}
                                                alt={item.title}
                                                className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
                                                style={{ filter: 'brightness(0) invert(1)' }}
                                                width={56}
                                                height={56}
                                            />
                                        </div>
                                        <CardTitle className={`text-[#0d3980] ${showImages ? 'text-lg sm:text-xl md:text-2xl' : 'text-lg sm:text-xl'} font-bold font-serif`}>
                                            {item.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className={`${showImages ? 'p-4 sm:p-6 lg:p-8 pt-0' : 'p-0'} relative`}>
                                        <CardDescription className="text-sm sm:text-base text-gray-600 leading-relaxed font-sans">
                                            {item.description}
                                        </CardDescription>
                                    </CardContent>

                                    {/* Bottom Accent Line */}
                                    <div className={`absolute bottom-0 left-4 right-4 sm:left-8 sm:right-8 h-0.5 bg-gradient-to-r ${item.gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                                </Card>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>
        </section>
    )
}

