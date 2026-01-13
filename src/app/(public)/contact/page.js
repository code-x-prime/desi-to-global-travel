'use client'

import { ContactForm } from '@/components/contact/contact-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageBanner } from '@/components/layout/page-banner'
import { Mail, Phone, MapPin, FileText } from 'lucide-react'

export default function ContactPage() {

    return (
        <div className="bg-white">
            {/* Banner */}
            <PageBanner
                imageUrl="/contact.jpg"
                title="Contact Us"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Contact' }
                ]}
            />

            {/* Content */}
            <div className="py-10 sm:py-16 lg:py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <ContactForm />
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4 sm:space-y-6">
                            <Card className="border-0 shadow-lg">
                                <CardHeader className="p-4 sm:p-6">
                                    <CardTitle className="text-[#0d3980] font-serif text-xl sm:text-2xl">Get in Touch</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className="h-9 w-9 sm:h-10 sm:w-10 bg-[#33baea]/10 flex items-center justify-center flex-shrink-0">
                                            <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-[#33baea]" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-sm sm:text-base text-gray-900 font-sans">Email</p>
                                            <a
                                                href="mailto:contact@desitoglobaltravel.com"
                                                className="text-xs sm:text-sm text-gray-600 hover:text-[#0d3980] transition-colors font-sans break-all"
                                            >
                                                contact@desitoglobaltravel.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className="h-9 w-9 sm:h-10 sm:w-10 bg-[#f9c701]/10 flex items-center justify-center flex-shrink-0">
                                            <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-[#f9c701]" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-sm sm:text-base text-gray-900 font-sans">Phone / WhatsApp</p>
                                            <a
                                                href="https://wa.me/919650509356"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs sm:text-sm text-gray-600 hover:text-[#0d3980] transition-colors font-sans block"
                                            >
                                                +91 9650509356
                                            </a>
                                            <a
                                                href="tel:+919650435208"
                                                className="text-xs sm:text-sm text-gray-600 hover:text-[#0d3980] transition-colors font-sans block"
                                            >
                                                +91 9650435208
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className="h-9 w-9 sm:h-10 sm:w-10 bg-[#33baea]/10 flex items-center justify-center flex-shrink-0">
                                            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-[#33baea]" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-sm sm:text-base text-gray-900 font-sans">Address</p>
                                            <p className="text-xs sm:text-sm text-gray-600 font-sans">
                                                J-044, Gulshan Vivante,
                                                <br />
                                                Sector-137, Noida, U.P.
                                                <br />
                                                Pin Code: 201305
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className="h-9 w-9 sm:h-10 sm:w-10 bg-[#f9c701]/10 flex items-center justify-center flex-shrink-0">
                                            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-[#f9c701]" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-sm sm:text-base text-gray-900 font-sans">GSTIN</p>
                                            <p className="text-xs sm:text-sm text-gray-600 font-sans">
                                                09AUJPV4373N1ZN
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#0d3980] text-white border-0 shadow-lg">
                                <CardHeader className="p-4 sm:p-6">
                                    <CardTitle className="font-serif text-xl sm:text-2xl">Why Contact Us?</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 sm:p-6 pt-0">
                                    <ul className="space-y-2 text-xs sm:text-sm font-sans">
                                        <li>• Customized travel packages</li>
                                        <li>• Expert travel consultation</li>
                                        <li>• 24/7 customer support</li>
                                        <li>• Best price guarantee</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Google Maps Section */}
                    <div className="mt-8 sm:mt-12">
                        <Card className="border-0 shadow-lg overflow-hidden">
                            <CardHeader className="p-4 sm:p-6 bg-[#0d3980]">
                                <CardTitle className="font-serif text-xl sm:text-2xl text-white">Find Us Here</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[450px]">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.0449236272707!2d77.4075222!3d28.508296100000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce9be9f14844d%3A0x282840d72bd6f619!2sDesi%20to%20Global%20Travel!5e0!3m2!1sen!2sin!4v1768283843151!5m2!1sen!2sin"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen={true}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Desi to Global Travel Location"
                                    />
                                </div>
                                <div className="p-4 sm:p-6 bg-gray-50 text-center">
                                    <a
                                        href="https://maps.app.goo.gl/jKb9b6B1i81TqWvA7"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-[#0d3980] hover:text-[#33baea] font-semibold text-sm sm:text-base transition-colors"
                                    >
                                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                                        Open in Google Maps
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
