'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Trash2, Eye, EyeOff } from 'lucide-react'
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'

export function GalleryImageActions({ imageId, isActive }) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [isToggling, setIsToggling] = useState(false)
    const [showDialog, setShowDialog] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const response = await fetch(`/api/admin/gallery/${imageId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                setShowDialog(false)
                router.refresh()
            } else {
                alert('Failed to delete image')
            }
        } catch (error) {
            alert('Error deleting image')
        } finally {
            setIsDeleting(false)
        }
    }

    const handleToggleActive = async () => {
        setIsToggling(true)
        try {
            const response = await fetch(`/api/admin/gallery/${imageId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !isActive }),
            })

            if (response.ok) {
                router.refresh()
            } else {
                alert('Failed to update image')
            }
        } catch (error) {
            alert('Error updating image')
        } finally {
            setIsToggling(false)
        }
    }

    return (
        <>
            <div className="flex gap-2">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleToggleActive}
                    disabled={isToggling}
                    className="font-sans bg-white/90 hover:bg-white"
                >
                    {isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDialog(true)}
                    disabled={isDeleting}
                    className="font-sans"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
            <DeleteConfirmDialog
                open={showDialog}
                onOpenChange={setShowDialog}
                onConfirm={handleDelete}
                title="Delete Image"
                description="Are you sure you want to delete this image? This action cannot be undone."
                isLoading={isDeleting}
            />
        </>
    )
}

