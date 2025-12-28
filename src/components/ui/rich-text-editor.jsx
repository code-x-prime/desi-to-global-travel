'use client'

import { useRef, useMemo, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Jodit to avoid SSR issues
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false })

export function RichTextEditor({ value, onChange, placeholder = 'Enter description...' }) {
    const editorRef = useRef(null)
    const isTypingRef = useRef(false)
    const lastExternalValueRef = useRef(value || '')
    const internalValueRef = useRef(value || '')

    // Update internal value only when external value changes (not during typing)
    useEffect(() => {
        if (!isTypingRef.current && value !== undefined && value !== lastExternalValueRef.current) {
            lastExternalValueRef.current = value || ''
            internalValueRef.current = value || ''
            // Force update editor if it exists
            if (editorRef.current?.instance) {
                editorRef.current.instance.value = value || ''
            }
        }
    }, [value])

    // Handle change from editor
    const handleChange = useCallback((newContent) => {
        isTypingRef.current = true
        internalValueRef.current = newContent

        // Call parent onChange
        if (onChange) {
            onChange(newContent)
        }

        // Reset typing flag after a brief moment
        requestAnimationFrame(() => {
            setTimeout(() => {
                isTypingRef.current = false
            }, 50)
        })
    }, [onChange])

    const config = useMemo(() => ({
        readonly: false,
        placeholder,
        height: 400,
        toolbar: true,
        spellcheck: true,
        language: 'en',
        toolbarButtonSize: 'medium',
        toolbarAdaptive: false,
        showCharsCounter: true,
        showWordsCounter: true,
        showXPathInStatusbar: false,
        askBeforePasteHTML: true,
        askBeforePasteFromWord: true,
        defaultActionOnPaste: 'insert_as_html',
        buttons: [
            'source', '|',
            'bold', 'italic', 'underline', '|',
            'ul', 'ol', '|',
            'outdent', 'indent', '|',
            'font', 'fontsize', 'brush', 'paragraph', '|',
            'image', 'link', '|',
            'align', 'undo', 'redo', '|',
            'hr', 'eraser', 'fullsize'
        ],
        uploader: {
            insertImageAsBase64URI: true
        },
        removeButtons: ['brush', 'file'],
        showPlaceholder: true,
    }), [placeholder])

    return (
        <div className="border-2 border-gray-200 focus-within:border-[#0d3980] rounded-md overflow-hidden">
            <JoditEditor
                ref={editorRef}
                value={internalValueRef.current}
                config={config}
                onChange={handleChange}
                tabIndex={0}
            />
        </div>
    )
}

