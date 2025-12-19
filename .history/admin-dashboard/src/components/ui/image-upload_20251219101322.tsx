'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { uploadImage } from '@/lib/upload'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string>(value)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync preview with value prop changes
  useEffect(() => {
    setPreview(value)
  }, [value])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Show preview immediately
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to server
    setIsUploading(true)
    try {
      const result = await uploadImage(file)
      console.log('Upload result:', result)
      // Save relative path to DB and update preview
      onChange(result.url)
      // Force update preview with full URL immediately
      const fullUrl = result.url.startsWith('http') 
        ? result.url 
        : `http://localhost:4000${result.url}`
      setPreview(fullUrl)
      console.log('Preview updated to:', fullUrl)
      toast.success('Upload ảnh thành công')
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.message || 'Lỗi khi upload ảnh')
      setPreview(value) // Revert to original
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview('')
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
        disabled={disabled || isUploading}
        className="hidden"
      />

      {/* Preview area */}
      {preview ? (
        <div className="relative border-2 border-dashed rounded-lg p-4 bg-gray-50">
          <div className="relative w-full aspect-square max-w-xs mx-auto bg-white rounded border overflow-hidden">
            <img
              src={preview.startsWith('http') ? preview : `http://localhost:4000${preview}`}
              alt="Preview"
              className="w-full h-full object-contain"
              onError={(e) => {
                console.error('Image load error:', e.currentTarget.src)
                e.currentTarget.src = '/placeholder.png'
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', preview)
              }}
            />
            {!disabled && !isUploading && (
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="text-center mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClick}
              disabled={disabled || isUploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Thay đổi ảnh
            </Button>
          </div>
        </div>
      ) : (
        /* Upload area */
        <div
          onClick={handleClick}
          className="border-2 border-dashed rounded-lg p-12 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600 mb-2">Đang upload...</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Kéo thả file hoặc click để upload</p>
              <p className="text-sm text-gray-500">Hỗ trợ: JPG, PNG, WebP (tối đa 5MB)</p>
              <Button type="button" variant="outline" className="mt-4" disabled={disabled}>
                <ImageIcon className="w-4 h-4 mr-2" />
                Chọn file
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
