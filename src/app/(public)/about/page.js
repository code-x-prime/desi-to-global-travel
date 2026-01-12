'use client'

import { motion } from 'framer-motion'
import { PageBanner } from '@/components/layout/page-banner'
import { WhyChooseUs } from '@/components/home/why-choose-us'
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
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
}

export default function AboutPage() {
    return (
        <div className="bg-white">
            {/* ==================== HERO SECTION ==================== */}
            <PageBanner
                imageUrl="/about.jpg"
                title="About Us"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'About Us' }
                ]}
            />

            {/* ==================== CONTENT SECTION ==================== */}
            <section className="py-10 md:py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start"
                    >
                        {/* Text Content */}
                        <motion.div variants={fadeUp} className="space-y-8">
                            <div>
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#0d3980] mb-6 leading-tight">
                                    We Don&apos;t Just Book Trips.
                                    <br />
                                    <span className="text-[#33baea]">We Craft Your Next Great Story.</span>
                                </h2>
                            </div>

                            <div className="prose prose-lg max-w-none space-y-6">
                                <p className="text-lg text-gray-700 leading-relaxed font-sans">
                                    When it comes to travel, come travel with Desi To Global Travel, we will make it memorable for you so that you can enjoy the tour and take the wonderful memories with you. We know what you want and need to know, it&apos;s not just all the cultural and historical places, but getting the insider knowledge on great Monuments and history of all over world.
                                </p>

                                <p className="text-lg text-gray-700 leading-relaxed font-sans">
                                    Any ordinary vacation, holiday or retreat becomes perfect when sufficient convenience, information, comfort and safety are in place. That&apos;s what Desi To Global Travel strictly believes in and provides to its clients. Whether Leisure, honeymoon packages, family vacations, short tour or long vacations.
                                </p>
                            </div>
                        </motion.div>

                        {/* Image */}
                        <motion.div variants={fadeUp} className="relative h-[500px] lg:h-[600px]">
                            <Image
                                src="/about-1.jpg"
                                alt="Luxury Travel Experience"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ==================== MISSION SECTION ==================== */}
            <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeUp} className="text-center mb-6 sm:mb-8">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-[#0d3980] mb-4 sm:mb-6 leading-tight">
                                Our Mission
                            </h2>
                        </motion.div>
                        <motion.div variants={fadeUp} className="prose prose-lg max-w-none text-center">
                            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed font-sans max-w-4xl mx-auto px-4">
                                In <strong className="text-[#0d3980]">Desi To Global Travel</strong>, we believe travel is more than an itinerary or stamps-in-a-passport exercise. Our mission is to bridge the gap between &quot;tourist&quot; and &quot;traveler&quot; by providing immersive, responsible, and soul-stirring journeys domestic & across the globe.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ==================== OUR STORY SECTION ==================== */}
            <section className="py-8 sm:py-12 md:py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center"
                    >
                        <motion.div variants={fadeUp} className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] order-2 lg:order-1">
                            <Image
                                src="/about-2.jpg"
                                alt="Abhimanu Varma - Travel Story"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                        <motion.div variants={fadeUp} className="space-y-4 sm:space-y-6 order-1 lg:order-2">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-[#0d3980] mb-4 sm:mb-6 leading-tight">
                                Our Story
                            </h2>
                            <div className="prose prose-lg max-w-none space-y-4 sm:space-y-6">
                                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed font-sans">
                                    <strong className="text-[#0d3980]">Abhimanu Varma</strong> (Founder and Director of Desi to Global Travel)<br />
                                    B.Tech | MBA | 6+ Years of experience in the Travel and Tourism Industry.
                                </p>
                                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed font-sans">
                                    Driven by a passion for exploring through various destinations across India and the world.
                                </p>
                                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed font-sans">
                                    Today, we are a team of expert local guides and travel designers dedicated to showing you the world through an insider&apos;s lens.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ==================== WHY CHOOSE US SECTION ==================== */}
            <WhyChooseUs variant="about" />
        </div>
    )
}