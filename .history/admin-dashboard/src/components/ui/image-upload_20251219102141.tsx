'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ImageUploadProps {
  value: string
  onChange: (url: string | File) => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(value)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync preview with value prop changes
  useEffect(() => {
    if (typeof value === 'string') {
      setPreview(value)
    }
  }, [value])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File ảnh không được vượt quá 5MB')
      return
    }

    // Show preview immediately from local file
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Store file object - will upload when form is submitted
    setSelectedFile(file)
    onChange(file) // Pass file object to form
    toast.success('Đã chọn ảnh, nhấn "Lưu" để upload')
  }

  const handleRemove = () => {
    setPreview('')
    setSelectedFile(null)
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        disabled={disabled}
        className="hidden"
      />

      {/* Preview area */}
      {preview ? (
        <div className="relative border-2 border-dashed rounded-lg p-4 bg-gray-50">
          <div className="relative w-full aspect-square max-w-xs mx-auto bg-white rounded border overflow-hidden">
            <img
              src={
                preview.startsWith('http')
                  ? preview
                  : preview.startsWith('data:')
                    ? preview
                    : `http://localhost:4000${preview}`
              }
              alt="Preview"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.png'
              }}
            />
            {!disabled && (
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="text-center mt-4 space-y-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClick}
              disabled={disabled}
            >
              <Upload className="w-4 h-4 mr-2" />
              Thay đổi ảnh
            </Button>
            {selectedFile && (
              <p className="text-xs text-blue-600">
                ⚠️ Ảnh mới chưa được lưu. Nhấn "Lưu thay đổi" để upload.
              </p>
            )}
          </div>
        </div>
      ) : (
        /* Upload area */
        <div
          onClick={handleClick}
          className="border-2 border-dashed rounded-lg p-12 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Kéo thả file hoặc click để chọn ảnh</p>
          <p className="text-sm text-gray-500">Hỗ trợ: JPG, PNG, WebP (tối đa 5MB)</p>
          <Button type="button" variant="outline" className="mt-4" disabled={disabled}>
            <ImageIcon className="w-4 h-4 mr-2" />
            Chọn file
          </Button>
        </div>
      )}
    </div>
  )
}
