'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState(null)

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
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: formData.message,
                    source: 'contact',
                }),
            })

            const data = await response.json()

            if (response.ok) {
                setSubmitStatus({ type: 'success', message: 'Thank you! We\'ll get back to you soon.' })
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    message: '',
                })
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
        <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4 sm:pb-6 p-4 sm:p-6">
                <CardTitle className="text-[#0d3980] font-serif text-2xl sm:text-3xl mb-2">Contact Us</CardTitle>
                <p className="text-sm sm:text-base text-gray-600 font-sans">
                    Have a question? Get in touch with us and we&apos;ll get back to you soon.
                </p>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    {/* Simple Form - Name, Email, Phone, Message */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Full Name */}
                        <div>
                            <Label htmlFor="name" className="text-[#0d3980] font-semibold font-sans mb-2 block text-sm sm:text-base">
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
                                className="h-11 sm:h-12 border-2 border-gray-200 focus:border-[#0d3980] font-sans text-sm sm:text-base"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <Label htmlFor="email" className="text-[#0d3980] font-semibold font-sans mb-2 block text-sm sm:text-base">
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
                                className="h-11 sm:h-12 border-2 border-gray-200 focus:border-[#0d3980] font-sans text-sm sm:text-base"
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <Label htmlFor="phone" className="text-[#0d3980] font-semibold font-sans mb-2 block text-sm sm:text-base">
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
                                className="h-11 sm:h-12 border-2 border-gray-200 focus:border-[#0d3980] font-sans text-sm sm:text-base"
                            />
                        </div>

                        {/* Message */}
                        <div>
                            <Label htmlFor="message" className="text-[#0d3980] font-semibold font-sans mb-2 block text-sm sm:text-base">
                                Message *
                            </Label>
                            <Textarea
                                id="message"
                                name="message"
                                rows={5}
                                required
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tell us how we can help you..."
                                className="border-2 border-gray-200 focus:border-[#0d3980] font-sans resize-none text-sm sm:text-base"
                            />
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
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-[#f9c701] hover:bg-[#e5b700] text-[#0d3980] font-semibold uppercase tracking-wide h-11 sm:h-12 text-sm sm:text-base font-sans"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setFormData({
                                    name: '',
                                    email: '',
                                    phone: '',
                                    message: '',
                                })
                                setSubmitStatus(null)
                            }}
                            className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold uppercase tracking-wide h-11 sm:h-12 text-sm sm:text-base font-sans"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
