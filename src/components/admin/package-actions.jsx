'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'

export function PackageActions({ packageId }) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDialog, setShowDialog] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const response = await fetch(`/api/admin/packages/${packageId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                setShowDialog(false)
                router.refresh()
            } else {
                alert('Failed to delete package')
            }
        } catch (error) {
            alert('Error deleting package')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDialog(true)}
                disabled={isDeleting}
                className="font-sans"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
            <DeleteConfirmDialog
                open={showDialog}
                onOpenChange={setShowDialog}
                onConfirm={handleDelete}
                title="Delete Package"
                description="Are you sure you want to delete this package? This action cannot be undone."
                isLoading={isDeleting}
            />
        </>
    )
}

