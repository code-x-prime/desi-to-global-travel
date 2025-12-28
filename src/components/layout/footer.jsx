import Link from 'next/link'
import Image from 'next/image'
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

export function Footer() {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '1234567890'
    const whatsappUrl = `https://wa.me/${whatsappNumber}`

    return (
        <footer className="bg-gray-50 border-t border-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 xl:gap-16">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="inline-block mb-4 sm:mb-6">
                            <Image
                                src="/logo.png"
                                alt="Desi To Global Travel"
                                width={140}
                                height={53}
                                className="object-contain sm:w-[160px] sm:h-[60px]"
                            />
                        </Link>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6">
                            We Don&apos;t Just Book Trips. We Craft Your Next Great Story.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-base sm:text-lg font-semibold text-[#0d3980] mb-4 sm:mb-6 tracking-wide">Quick Links</h4>
                        <ul className="space-y-3 sm:space-y-4">
                            <li>
                                <Link href="/about" className="text-sm sm:text-base text-gray-600 hover:text-[#0d3980] transition-colors duration-200">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/destinations" className="text-sm sm:text-base text-gray-600 hover:text-[#0d3980] transition-colors duration-200">
                                    Destinations
                                </Link>
                            </li>
                            <li>
                                <Link href="/packages" className="text-sm sm:text-base text-gray-600 hover:text-[#0d3980] transition-colors duration-200">
                                    Tour Packages
                                </Link>
                            </li>
                            <li>
                                <Link href="/gallery" className="text-sm sm:text-base text-gray-600 hover:text-[#0d3980] transition-colors duration-200">
                                    Gallery
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm sm:text-base text-gray-600 hover:text-[#0d3980] transition-colors duration-200">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Destinations / Packages */}
                    <div>
                        <h4 className="text-base sm:text-lg font-semibold text-[#0d3980] mb-4 sm:mb-6 tracking-wide">Explore</h4>
                        <ul className="space-y-3 sm:space-y-4">
                            <li>
                                <Link href="/destinations" className="text-sm sm:text-base text-gray-600 hover:text-[#0d3980] transition-colors duration-200">
                                    All Destinations
                                </Link>
                            </li>
                            <li>
                                <Link href="/packages" className="text-sm sm:text-base text-gray-600 hover:text-[#0d3980] transition-colors duration-200">
                                    All Packages
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-base sm:text-lg font-semibold text-[#0d3980] mb-4 sm:mb-6 tracking-wide">Contact Us</h4>
                        <ul className="space-y-4 sm:space-y-5">
                            <li>
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-600 hover:text-[#25D366] transition-colors duration-200 group"
                                >
                                    <FaWhatsapp className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                                    <span className="break-all">WhatsApp</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:info@desitoglobaltravel.com"
                                    className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-600 hover:text-[#0d3980] transition-colors duration-200 group"
                                >
                                    <FaEnvelope className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                                    <span className="break-all">info@desitoglobaltravel.com</span>
                                </a>
                            </li>
                            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                                <FaMapMarkerAlt className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0" />
                                <span>Your Office Address<br />City, State, Country</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 mt-10 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 text-center">
                    <p className="text-xs sm:text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Desi To Global Travel. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
