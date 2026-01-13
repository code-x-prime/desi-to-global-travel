'use client'

import { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { CalendarIcon } from 'lucide-react'
import { BookingDialog } from '@/components/booking/booking-dialog'

export function WhatsAppButton() {
    const [bookingOpen, setBookingOpen] = useState(false)
    const whatsappNumber = '919650509356'
    const message = encodeURIComponent('Hello! I would like to know more about your travel packages.')
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

    return (
        <>
            {/* Mobile: Full Width Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
                <div className="flex  bg-white shadow-2xl border-t border-gray-200">
                    {/* WhatsApp Button */}
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-4 py-3.5  font-semibold text-sm sm:text-base transition-all duration-300 shadow-lg"
                    >
                        <FaWhatsapp className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0" />
                        <span className="font-sans">WhatsApp</span>
                    </a>

                    {/* Book Now Button */}
                    <button
                        onClick={() => setBookingOpen(true)}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#f9c701] hover:bg-[#e5b700] text-[#0d3980] px-4 py-3.5  font-semibold text-sm sm:text-base transition-all duration-300 shadow-lg"
                    >
                        <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                        <span className="font-sans">Book Now</span>
                    </button>
                </div>
            </div>

            {/* Desktop: Fixed Bottom Right - Circular Buttons Stacked */}
            <div className="hidden lg:flex flex-col fixed bottom-8 right-8 z-50 gap-4">
                {/* WhatsApp Button - Circle */}
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-16 h-16 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110"
                >
                    <FaWhatsapp className="h-8 w-8" />
                </a>

                {/* Book Now Button - Circle */}
                <button
                    onClick={() => setBookingOpen(true)}
                    className="w-16 h-16 rounded-full bg-[#f9c701] hover:bg-[#e5b700] text-[#0d3980] flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110"
                >
                    <CalendarIcon className="h-8 w-8" />
                </button>
            </div>

            {/* Booking Dialog */}
            <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} />
        </>
    )
}
