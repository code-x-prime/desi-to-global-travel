'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export function BookingDialog({ open, onOpenChange }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        destination: '',
        travelers: '',
        travelDate: null,
        additionalDetails: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState(null)
    const [datePickerOpen, setDatePickerOpen] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus(null)

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    travelDate: formData.travelDate ? format(formData.travelDate, 'dd-MM-yyyy') : null,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                setSubmitStatus({ type: 'success', message: 'Thank you! We\'ll get back to you soon.' })
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    destination: '',
                    travelers: '',
                    travelDate: null,
                    additionalDetails: '',
                })
                setTimeout(() => {
                    onOpenChange(false)
                    setSubmitStatus(null)
                }, 2000)
            } else {
                setSubmitStatus({ type: 'error', message: data.error || 'Something went wrong. Please try again.' })
            }
        } catch (error) {
            setSubmitStatus({ type: 'error', message: 'Network error. Please try again.' })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-6">
                    <DialogTitle className="text-[#0d3980] font-serif text-3xl mb-2">
                        Book Your Journey
                    </DialogTitle>
                    <p className="text-gray-600 font-sans text-base">
                        Fill in the details below and we&apos;ll get back to you with a customized travel plan.
                    </p>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Two Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Full Name */}
                            <div>
                                <Label htmlFor="name" className="text-[#0d3980] font-semibold font-sans mb-2 block">
                                    Full Name *
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className="h-12 border-2 border-gray-200 focus:border-[#0d3980] font-sans"
                                />
                            </div>

                            {/* Phone Number */}
                            <div>
                                <Label htmlFor="phone" className="text-[#0d3980] font-semibold font-sans mb-2 block">
                                    Phone Number *
                                </Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                    className="h-12 border-2 border-gray-200 focus:border-[#0d3980] font-sans"
                                />
                            </div>

                            {/* Destination */}
                            <div>
                                <Label htmlFor="destination" className="text-[#0d3980] font-semibold font-sans mb-2 block">
                                    Destination
                                </Label>
                                <Input
                                    id="destination"
                                    name="destination"
                                    type="text"
                                    value={formData.destination}
                                    onChange={handleChange}
                                    placeholder="e.g., Rajasthan, Bali"
                                    className="h-12 border-2 border-gray-200 focus:border-[#0d3980] font-sans"
                                />
                            </div>

                            {/* Additional Details */}
                            <div>
                                <Label htmlFor="additionalDetails" className="text-[#0d3980] font-semibold font-sans mb-2 block">
                                    Additional Details
                                </Label>
                                <Textarea
                                    id="additionalDetails"
                                    name="additionalDetails"
                                    rows={4}
                                    value={formData.additionalDetails}
                                    onChange={handleChange}
                                    placeholder="Tell us about your travel preferences, special requirements, etc."
                                    className="border-2 border-gray-200 focus:border-[#0d3980] font-sans resize-none"
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Email */}
                            <div>
                                <Label htmlFor="email" className="text-[#0d3980] font-semibold font-sans mb-2 block">
                                    Email *
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email address"
                                    className="h-12 border-2 border-gray-200 focus:border-[#0d3980] font-sans"
                                />
                            </div>

                            {/* Number of Travelers */}
                            <div>
                                <Label htmlFor="travelers" className="text-[#0d3980] font-semibold font-sans mb-2 block">
                                    Number of Travelers *
                                </Label>
                                <Input
                                    id="travelers"
                                    name="travelers"
                                    type="number"
                                    required
                                    min="1"
                                    value={formData.travelers}
                                    onChange={handleChange}
                                    placeholder="Enter number of travelers"
                                    className="h-12 border-2 border-gray-200 focus:border-[#0d3980] font-sans"
                                />
                            </div>

                            {/* Preferred Travel Date */}
                            <div>
                                <Label className="text-[#0d3980] font-semibold font-sans mb-2 block">
                                    Preferred Travel Date
                                </Label>
                                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full h-12 justify-start text-left font-sans border-2 border-gray-200 focus:border-[#0d3980]",
                                                !formData.travelDate && "text-gray-500"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formData.travelDate ? (
                                                format(formData.travelDate, 'dd-MM-yyyy')
                                            ) : (
                                                <span>dd-mm-yyyy</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={formData.travelDate}
                                            onSelect={(date) => {
                                                setFormData((prev) => ({ ...prev, travelDate: date }))
                                                setDatePickerOpen(false)
                                            }}
                                            disabled={(date) => date < new Date()}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>

                    {/* Status Message */}
                    {submitStatus && (
                        <div
                            className={cn(
                                "p-4 font-sans",
                                submitStatus.type === 'success'
                                    ? 'bg-green-50 text-green-800 border-2 border-green-200'
                                    : 'bg-red-50 text-red-800 border-2 border-red-200'
                            )}
                        >
                            {submitStatus.message}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-[#f9c701] hover:bg-[#e5b700] text-[#0d3980] font-semibold uppercase tracking-wide h-12 text-base font-sans"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold uppercase tracking-wide h-12 text-base font-sans"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
