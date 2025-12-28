import { GalleryUploadForm } from '@/components/admin/gallery-upload-form'

export default function GalleryUploadPage() {
    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#0d3980] mb-2">Upload Gallery Images</h1>
                <p className="text-gray-600 font-sans">Add new images to your gallery</p>
            </div>
            <GalleryUploadForm />
        </div>
    )
}

