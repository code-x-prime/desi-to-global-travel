"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { FaQuoteLeft, FaStar, FaHeart } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"



const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
}

export function TestimonialsCarousel({ testimonials = [] }) {
    const [api, setApi] = useState()
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        if (!api) {
            return
        }

        setCurrent(api.selectedScrollSnap())

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap())
        })
    }, [api])

    // Safety check: if no testimonials, don't render the section
    if (!testimonials || !Array.isArray(testimonials) || testimonials.length === 0) {
        return null
    }

    return (
        <section className="py-10 md:py-16 bg-gradient-to-br from-[#0d3980] via-[#0a2d66] to-[#0d3980] relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-20 right-20 w-72 h-72 bg-[#33baea]/20 rounded-md blur-3xl" />
            <div className="absolute bottom-20 left-20 w-72 h-72 bg-[#f9c701]/10 rounded-md blur-3xl" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="text-center mb-16"
                >
                    <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-[#f9c701] px-4 py-2 mb-6">
                        <FaHeart className="w-3.5 h-3.5 text-white" />
                        <span className="text-white text-sm font-semibold tracking-wide uppercase font-sans">Testimonials</span>
                    </motion.div>

                    <motion.h2
                        variants={fadeUp}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight"
                    >
                        What Our Travelers
                        <br />
                        <span className="text-[#f9c701]">Say About Us</span>
                    </motion.h2>
                </motion.div>

                {/* Carousel */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="relative"
                >
                    <Carousel
                        setApi={setApi}
                        className="w-full relative"
                        plugins={[
                            Autoplay({
                                delay: 5000,
                                stopOnInteraction: false,
                            }),
                        ]}
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                    >
                        <CarouselContent className="-ml-2 md:-ml-4">
                            {testimonials.map((testimonial) => (
                                <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 basis-1/2 lg:basis-1/3">
                                    <a
                                        href={testimonial.youtubeUrl || "#"}
                                        target={testimonial.youtubeUrl ? "_blank" : undefined}
                                        rel={testimonial.youtubeUrl ? "noopener noreferrer" : undefined}
                                        className="block group cursor-pointer h-full"
                                    >
                                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 lg:p-8 h-full transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/30">
                                            {/* Quote Icon */}
                                            <div className="mb-4">
                                                <FaQuoteLeft className="h-8 w-8 lg:h-10 lg:w-10 text-[#f9c701]" />
                                            </div>

                                            {/* Testimonial Text */}
                                            <p className="text-base lg:text-lg text-white/90 leading-relaxed mb-6 font-sans line-clamp-4">
                                                &quot;{testimonial.text}&quot;
                                            </p>

                                            {/* Author Info */}
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-12 h-12 lg:w-14 lg:h-14 flex-shrink-0">
                                                    <Image
                                                        src={testimonial.image || "/placeholder.svg"}
                                                        alt={testimonial.name}
                                                        fill
                                                        className="object-cover border-2 border-[#f9c701]"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="text-white font-semibold text-sm lg:text-base font-sans truncate">
                                                            {testimonial.name}
                                                        </h4>
                                                        <FcGoogle className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                                                    </div>
                                                    <p className="text-white/60 text-xs lg:text-sm font-sans truncate">
                                                        🇮🇳 {testimonial.location}
                                                    </p>
                                                </div>
                                                <div className="flex gap-0.5 flex-shrink-0">
                                                    {[...Array(testimonial.rating)].map((_, i) => (
                                                        <FaStar key={i} className="h-3 w-3 lg:h-4 lg:w-4 text-[#f9c701]" />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="!absolute -left-5  top-1/2 -translate-y-1/2 border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white hover:text-white z-10 !rounded-none h-12 w-12" />
                        <CarouselNext className="!absolute -right-5 top-1/2 -translate-y-1/2 border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white hover:text-white z-10 !rounded-none h-12 w-12" />
                    </Carousel>

                    {/* Indicators */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => api?.scrollTo(index)}
                                className={`h-1.5 transition-all duration-500 ${index === current ? "w-10 bg-[#f9c701]" : "w-1.5 bg-white/40 hover:bg-white/60"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
