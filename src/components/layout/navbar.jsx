'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { HiMenu, HiX } from 'react-icons/hi'
import { FaPhone } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { BookingDialog } from '@/components/booking/booking-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [bookingOpen, setBookingOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navItems = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/destinations', label: 'Destinations' },
        { href: '/packages', label: 'Packages' },
        { href: '/gallery', label: 'Gallery' },
        { href: '/contact', label: 'Contact' },
    ]

    return (
        <motion.nav
            initial={{ y: 0 }}
            animate={{
                backgroundColor: scrolled ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)',
                boxShadow: scrolled ? '0 1px 3px rgba(0, 0, 0, 0.05)' : 'none',
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed top-0 left-0 right-0 z-50 w-full"
        >
            <div className="mx-auto px-4 sm:px-6 lg:px-20">
                <div className="flex h-20 md:h-24 items-center justify-between">
                    {/* Logo - Left */}
                    <Link href="/" className="flex items-center">
                        <motion.div
                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                            className="relative"
                        >
                            <Image
                                src="/logo.png"
                                alt="Desi To Global Travel"
                                width={200}
                                height={200}
                                className="object-contain w-auto h-[80px]"
                                priority
                            />
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation - Right */}
                    <div className="hidden lg:flex items-center space-x-12">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative group"
                            >
                                <motion.span
                                    animate={{
                                        color: scrolled ? '#0d3980' : '#ffffff',
                                    }}
                                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                                    className="text-base font-sans font-medium tracking-wide transition-colors duration-300 group-hover:text-[#33baea]"
                                >
                                    {item.label}
                                </motion.span>
                            </Link>
                        ))}
                        <Button
                            onClick={() => setBookingOpen(true)}
                            className="bg-[#f9c701] text-[#0d3980] hover:bg-[#f9c701]/90 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 font-sans font-medium tracking-wide text-xs sm:text-sm uppercase transition-all duration-300"
                        >
                            <FaPhone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Book Now</span>
                            <span className="sm:hidden">Book</span>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        <motion.div
                            animate={{
                                color: scrolled ? '#0d3980' : '#ffffff',
                            }}
                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                        >
                            {isOpen ? (
                                <HiX className="h-7 w-7" />
                            ) : (
                                <HiMenu className="h-7 w-7" />
                            )}
                        </motion.div>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation - Full Width Slide Down */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <motion.div
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                            exit={{ y: -20 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="px-4 sm:px-6 py-6 sm:py-8 space-y-1"
                        >
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.3 }}
                                >
                                    <Link
                                        href={item.href}
                                        className="block px-4 py-3 sm:py-4 text-base sm:text-lg font-sans font-medium text-[#0d3980] hover:text-[#33baea] transition-colors duration-300 tracking-wide"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: navItems.length * 0.05, duration: 0.3 }}
                                className="pt-4"
                            >
                                <Button
                                    onClick={() => {
                                        setBookingOpen(true)
                                        setIsOpen(false)
                                    }}
                                    className="w-full bg-[#f9c701] text-[#0d3980] hover:bg-[#f9c701]/90 px-6 sm:px-8 py-3 sm:py-4 font-sans font-medium tracking-wide text-sm uppercase transition-all duration-300 mx-4 sm:mx-0"
                                >
                                    <FaPhone className="h-4 w-4 mr-2" />
                                    Book Now
                                </Button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} />
        </motion.nav>
    )
}
