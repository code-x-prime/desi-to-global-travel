'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'

export function InquiryActions({ inquiryId, isRead }) {
    const router = useRouter()
    const [isUpdating, setIsUpdating] = useState(false)

    const handleToggleRead = async () => {
        setIsUpdating(true)
        try {
            const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isRead: !isRead }),
            })

            if (response.ok) {
                router.refresh()
            } else {
                alert('Failed to update inquiry')
            }
        } catch (error) {
            alert('Error updating inquiry')
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <Button
            variant={isRead ? 'outline' : 'default'}
            size="sm"
            onClick={handleToggleRead}
            disabled={isUpdating}
            className={`font-sans ${isRead ? 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-[#0d3980] hover:bg-[#0d3980]/90 text-white'}`}
        >
            {isRead ? (
                <>
                    <X className="mr-2 h-4 w-4" />
                    Mark Unread
                </>
            ) : (
                <>
                    <Check className="mr-2 h-4 w-4" />
                    Mark Read
                </>
            )}
        </Button>
    )
}

