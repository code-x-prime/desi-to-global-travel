'use client'

import { useState } from 'react'
import { Share2, Facebook, Twitter, Linkedin, Copy, Check } from 'lucide-react'

export function ShareButtons({ packageName }) {
    const [copied, setCopied] = useState(false)

    const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
    const shareUrl = encodeURIComponent(currentUrl)
    const shareText = encodeURIComponent(packageName)

    const handleCopy = async () => {
        if (typeof window !== 'undefined') {
            try {
                await navigator.clipboard.writeText(currentUrl)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            } catch (error) {
                console.error('Failed to copy:', error)
            }
        }
    }

    return (
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 font-sans">
                <Share2 className="h-4 w-4" />
                <span>Share:</span>
            </div>
            <div className="flex items-center gap-3">
                <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 flex items-center justify-center rounded-md bg-[#1877F2] text-white hover:bg-[#1877F2]/90 transition-colors"
                    aria-label="Share on Facebook"
                >
                    <Facebook className="h-5 w-5" />
                </a>
                <a
                    href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 flex items-center justify-center rounded-md bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90 transition-colors"
                    aria-label="Share on Twitter"
                >
                    <Twitter className="h-5 w-5" />
                </a>
                <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 flex items-center justify-center rounded-md bg-[#0077B5] text-white hover:bg-[#0077B5]/90 transition-colors"
                    aria-label="Share on LinkedIn"
                >
                    <Linkedin className="h-5 w-5" />
                </a>
                <button
                    onClick={handleCopy}
                    className="h-10 w-10 flex items-center justify-center rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                    aria-label="Copy link"
                >
                    {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </button>
            </div>
        </div>
    )
}

