'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
    FaArrowRight, FaPaperPlane,
    FaWhatsapp,
    FaPhone, FaEnvelope,
    FaMapMarkerAlt,
} from 'react-icons/fa'
import { useEffect, useState, useRef } from 'react'
import { TestimonialsCarousel } from '@/components/testimonials/testimonials-carousel'
import { FeaturedPackages } from '@/components/home/featured-packages'
import { PopularDestinations } from '@/components/home/popular-destinations'
import { WhyChooseUs } from '@/components/home/why-choose-us'

// Premium Animation Variants
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

// Hero background images - carousel
const heroImages = [
    '/h1.jpg',
    '/h2.jpg',
    '/h3.jpg',
]


export default function HomePage() {
    const [packages, setPackages] = useState([])
    const [destinations, setDestinations] = useState([])
    const [loading, setLoading] = useState(true)
    const [destinationsLoading, setDestinationsLoading] = useState(true)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const heroRef = useRef(null)

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    })

    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    // Rotate hero images
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
        }, 6000)
        return () => clearInterval(interval)
    }, [])


    useEffect(() => {
        async function fetchPackages() {
            try {
                const response = await fetch('/api/packages/featured', {
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                })
                if (response.ok) {
                    const data = await response.json()
                    // API returns all featured packages, ordered by creation date
                    setPackages(data) // Show all featured packages
                }
            } catch (error) {
                console.error('Error fetching packages:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchPackages()
    }, [])

    useEffect(() => {
        async function fetchDestinations() {
            try {
                const response = await fetch('/api/destinations/popular', {
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                })
                if (response.ok) {
                    const data = await response.json()
                    // API returns all popular destinations, ordered by creation date
                    setDestinations(data) // Show all popular destinations
                }
            } catch (error) {
                console.error('Error fetching destinations:', error)
            } finally {
                setDestinationsLoading(false)
            }
        }
        fetchDestinations()
    }, [])

    const whatsappNumber = '919650509356'
    const whatsappMessage = encodeURIComponent('Hello! I would like to know more about your travel packages.')
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

    return (
        <div className="flex flex-col bg-white overflow-x-hidden">
            {/* ==================== HERO SECTION (CINEMATIC & PREMIUM) ==================== */}
            <section ref={heroRef} className="relative h-[85vh] sm:h-[90vh] md:h-[95dvh] flex items-center overflow-hidden">
                {/* Background Images Carousel with Subtle Slow Zoom */}
                <motion.div
                    style={{ y: heroY }}
                    className="absolute inset-0 z-0"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentImageIndex}
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${heroImages[currentImageIndex]})` }}
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 20, ease: "easeOut" }}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Soft Dark-Blue Gradient Overlay (Top to Bottom) */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0d3980]/20 via-[#0d3980]/20 to-[#0d3980]/30" />
                </motion.div>

                {/* Hero Content - Left-Center Aligned */}
                <motion.div
                    style={{ opacity: heroOpacity }}
                    className="relative z-10 px-4 sm:px-6 lg:px-12 xl:px-16 max-w-4xl"
                >
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="space-y-4 sm:space-y-6 md:space-y-8"
                    >
                        {/* Small Uppercase Label */}
                        <motion.div
                            variants={fadeUp}
                            className="text-white/90 text-xs sm:text-sm font-sans font-medium tracking-widest uppercase"
                        >
                            DESI TO GLOBAL TRAVEL
                        </motion.div>

                        {/* Main Heading - Libre Baskerville */}
                        <motion.h1
                            variants={fadeUp}
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-white leading-tight tracking-tight"
                        >
                            We Don&apos;t Just Book Trips.
                            <br />
                            <span className="text-[#f9c701]">We Craft Your Next Great Story.</span>
                        </motion.h1>

                        {/* Subheading - Source Sans 3 */}
                        <motion.p
                            variants={fadeUp}
                            className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 font-sans font-normal leading-relaxed max-w-2xl"
                        >
                            Curated, responsible, and soul-stirring journeys across India and the world.
                            Transform your travel dreams into unforgettable memories.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            variants={fadeUp}
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4"
                        >
                            <Button
                                asChild
                                size="lg"
                                className="bg-[#f9c701] hover:bg-[#e5b700] text-[#0d3980] px-5 sm:px-7 py-3 sm:py-4 h-auto rounded-md font-sans font-semibold text-sm sm:text-base uppercase tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <Link href="/packages">
                                    Explore Journeys
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="border-2 border-white text-white bg-transparent hover:bg-white/10 px-5 sm:px-7 py-3 sm:py-4 h-auto rounded-md font-sans font-semibold text-sm sm:text-base uppercase tracking-wide transition-all duration-300"
                            >
                                <Link href="/contact">
                                    Plan With Us
                                </Link>
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Image Indicators */}
                <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 z-10 flex gap-2">
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`h-1.5 transition-all duration-500 ${index === currentImageIndex
                                ? 'w-10 bg-[#f9c701]'
                                : 'w-1.5 bg-white/40 hover:bg-white/60'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </section>



            {/* ==================== POPULAR DESTINATIONS SECTION ==================== */}
            <PopularDestinations destinations={destinations} loading={destinationsLoading} />

            {/* ==================== DISCOVER INDIA BANNER SECTION ==================== */}
            <section className="relative py-6 sm:py-8 md:py-12 lg:py-16 overflow-hidden">
                <Link href="/destinations" className="block group">
                    <div className="relative h-[400px] sm:h-[450px] overflow-hidden rounded-md mx-2 sm:mx-4 md:mx-6 lg:mx-8 shadow-2xl hover:shadow-3xl transition-all duration-500">
                        {/* Background Image - Mobile */}
                        <div className="absolute inset-0 md:hidden">
                            <Image
                                src="/discover-sm.jpg"
                                alt="Discover India"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                sizes="100vw"
                                priority
                            />
                        </div>

                        {/* Background Image - Desktop */}
                        <div className="absolute inset-0 hidden md:block">
                            <Image
                                src="/discover.jpg"
                                alt="Discover India"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                sizes="(max-width: 1200px) 90vw, 1400px"
                                priority
                            />
                        </div>

                        {/* Gradient Overlay - Darker on mobile for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0d3980]/70 via-[#0d3980]/60 to-[#0d3980]/70 sm:from-[#0d3980]/60 sm:via-[#0d3980]/50 sm:to-[#0d3980]/60 md:from-[#0d3980]/50 md:via-[#0d3980]/40 md:to-[#0d3980]/50 group-hover:from-[#0d3980]/55 group-hover:via-[#0d3980]/45 group-hover:to-[#0d3980]/55 transition-all duration-500" />

                        {/* Content */}
                        <div className="absolute inset-0 flex items-center justify-center sm:justify-start px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={staggerContainer}
                                className="max-w-3xl w-full text-center sm:text-left"
                            >
                                <motion.div
                                    variants={fadeUp}
                                    className="inline-flex items-center gap-2 bg-[#f9c701] text-[#0d3980] px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-md mb-3 sm:mb-4 md:mb-6 font-sans"
                                >
                                    <FaMapMarkerAlt className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#0d3980]" />
                                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Discover India</span>
                                </motion.div>

                                <motion.h2
                                    variants={fadeUp}
                                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-white leading-tight mb-3 sm:mb-4 md:mb-6"
                                >
                                    Explore the Land of
                                    <br />
                                    <span className="text-[#f9c701]">Diversity & Culture</span>
                                </motion.h2>

                                <motion.p
                                    variants={fadeUp}
                                    className="text-sm sm:text-base md:text-lg text-white/95 sm:text-white/90 mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto sm:mx-0 font-sans leading-relaxed px-2 sm:px-0"
                                >
                                    From the snow-capped Himalayas to the golden beaches of Goa, discover the incredible diversity of India&apos;s landscapes, cultures, and experiences.
                                </motion.p>

                                <motion.div
                                    variants={fadeUp}
                                    className="inline-flex items-center gap-2 sm:gap-3 bg-white/20 backdrop-blur-sm border-2 border-white/40 hover:border-white/60 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-md text-white font-semibold text-xs sm:text-sm md:text-base group-hover:bg-white/30 transition-all duration-300 font-sans"
                                >
                                    <span>Explore Indian Destinations</span>
                                    <FaArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 group-hover:translate-x-2 transition-transform duration-300" />
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </Link>
            </section>

            {/* ==================== FEATURED PACKAGES SECTION ==================== */}
            <FeaturedPackages packages={packages} loading={loading} />


            {/* ==================== WHY CHOOSE US SECTION ==================== */}
            <WhyChooseUs variant="home" />

            {/* ==================== TESTIMONIALS SECTION ==================== */}
            <TestimonialsCarousel testimonials={[
                {
                    id: '1',
                    name: 'Rajesh Kumar',
                    location: 'Mumbai, Maharashtra',
                    text: 'Amazing experience with Desi To Global Travel! The Dubai trip was perfectly planned. Every detail was taken care of, from hotels to local experiences. Highly recommended for anyone looking for a hassle-free travel experience.',
                    rating: 5,
                    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80',
                    youtubeUrl: 'https://www.youtube.com/watch?v=example1'
                },
                {
                    id: '2',
                    name: 'Priya Sharma',
                    location: 'Delhi, NCR',
                    text: 'Best travel agency I have ever used! The Thailand package exceeded all expectations. The team was responsive, professional, and made our honeymoon truly memorable. Thank you for making our dreams come true!',
                    rating: 5,
                    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80',
                    youtubeUrl: 'https://www.youtube.com/watch?v=example2'
                },
                {
                    id: '3',
                    name: 'Amit Patel',
                    location: 'Ahmedabad, Gujarat',
                    text: 'Outstanding service! The Singapore tour was fantastic. Great hotels, amazing food recommendations, and excellent customer support throughout. Will definitely book with them again for our next international trip.',
                    rating: 5,
                    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80',
                    youtubeUrl: 'https://www.youtube.com/watch?v=example3'
                },
                {
                    id: '4',
                    name: 'Sneha Reddy',
                    location: 'Bangalore, Karnataka',
                    text: 'Exceptional travel planning! Our Europe trip was seamless and well-organized. The team helped us with visas, flights, and everything in between. Truly a premium travel experience worth every rupee.',
                    rating: 5,
                    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80',
                    youtubeUrl: 'https://www.youtube.com/watch?v=example4'
                },
                {
                    id: '5',
                    name: 'Vikram Singh',
                    location: 'Pune, Maharashtra',
                    text: 'Professional, reliable, and customer-focused! The Bali package was incredible. From airport transfers to local guides, everything was top-notch. Highly recommend Desi To Global Travel for international trips.',
                    rating: 5,
                    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80',
                    youtubeUrl: 'https://www.youtube.com/watch?v=example5'
                },
                {
                    id: '6',
                    name: 'Anjali Mehta',
                    location: 'Chandigarh, Punjab',
                    text: 'Wonderful experience! The Maldives honeymoon package was perfect. Beautiful resorts, great food, and excellent service. The team made sure every moment was special. Thank you for the memories!',
                    rating: 5,
                    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80',
                    youtubeUrl: 'https://www.youtube.com/watch?v=example6'
                }
            ]} />

            {/* ==================== CTA SECTION ==================== */}
            <section className="py-10 sm:py-12 md:py-16 bg-white relative overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80"
                        alt="Travel Background"
                        className="w-full h-full object-cover"
                        width={500}
                        height={500}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0d3980]/95 via-[#0d3980]/90 to-[#0d3980]/95" />
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative"
                >
                    <div className="text-center">
                        <motion.div variants={fadeUp} className="mb-6 sm:mb-8">
                            <span className="inline-flex items-center gap-2 bg-[#f9c701] text-[#0d3980] px-4 sm:px-6 py-2 sm:py-3 rounded-md text-xs sm:text-sm font-bold uppercase tracking-wide">
                                <FaPaperPlane className="h-3 w-3 sm:h-4 sm:w-4" />
                                Start Your Journey Today
                            </span>
                        </motion.div>

                        <motion.h2
                            variants={fadeUp}
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-white mb-6 sm:mb-8 leading-tight px-4"
                        >
                            Ready to Create Your
                            <br />
                            <span className="text-[#f9c701]">Next Adventure?</span>
                        </motion.h2>

                        <motion.p
                            variants={fadeUp}
                            className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed px-4"
                        >
                            Let our travel experts craft a personalized journey just for you.
                            Get in touch today and take the first step towards an unforgettable experience.
                        </motion.p>

                        <motion.div
                            variants={fadeUp}
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-10 sm:mb-12 md:mb-16"
                        >
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2 sm:gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 rounded-md font-semibold text-sm sm:text-base md:text-lg shadow-lg shadow-[#25D366]/25 hover:shadow-xl transition-all duration-300"
                            >
                                <FaWhatsapp className="h-5 w-5 sm:h-6 sm:w-6" />
                                <span className="hidden sm:inline">WhatsApp Us</span>
                                <span className="sm:hidden">WhatsApp</span>
                                <FaArrowRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="border-2 border-white/30 text-white bg-white/5 hover:bg-white/15 hover:border-white/50 px-5 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 h-auto rounded-md font-semibold text-sm sm:text-base md:text-lg backdrop-blur-sm transition-all duration-300"
                            >
                                <Link href="/contact">Get In Touch</Link>
                            </Button>
                        </motion.div>

                        {/* Contact Info Cards */}
                        <motion.div
                            variants={fadeUp}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto"
                        >
                            <a
                                href="tel:+919650509356"
                                className="group flex items-center justify-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 hover:bg-white/20 transition-all duration-300"
                            >
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0">
                                    <FaPhone className="h-3 w-3 sm:h-4 sm:w-4 text-[#33baea]" />
                                </div>
                                <span className="text-white font-medium text-xs sm:text-sm md:text-base">+91 9650509356</span>
                            </a>
                            <a
                                href="mailto:contact@desitoglobaltravel.com"
                                className="group flex items-center justify-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 hover:bg-white/20 transition-all duration-300"
                            >
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0">
                                    <FaEnvelope className="h-3 w-3 sm:h-4 sm:w-4 text-[#f9c701]" />
                                </div>
                                <span className="text-white font-medium text-xs sm:text-sm md:text-base break-all">contact@desitoglobaltravel.com</span>
                            </a>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

        </div>
    )
}