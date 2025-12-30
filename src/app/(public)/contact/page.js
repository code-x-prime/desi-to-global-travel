'use client'

import { ContactForm } from '@/components/contact/contact-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageBanner } from '@/components/layout/page-banner'
import { Mail, Phone, MapPin } from 'lucide-react'

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
                                            <p className="font-semibold text-sm sm:text-base text-gray-900 font-sans">Phone</p>
                                            <a
                                                href="tel:+919650509356"
                                                className="text-xs sm:text-sm text-gray-600 hover:text-[#0d3980] transition-colors font-sans"
                                            >
                                                +91 9650509356
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
                </div>
            </div>
        </div>
    )
}
