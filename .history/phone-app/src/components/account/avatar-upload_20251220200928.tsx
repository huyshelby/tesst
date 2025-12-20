"use client";

import * as React from "react";
import { Camera, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  user: {
    name?: string;
    email: string;
    avatar?: string;
  };
  onUpload?: (file: File) => Promise<void>;
  className?: string;
}

export function AvatarUpload({ user, onUpload, className }: AvatarUploadProps) {
  const [uploading, setUploading] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(user.avatar || null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    if (onUpload) {
      setUploading(true);
      try {
        await onUpload(file);
      } catch (error) {
        console.error("Upload failed:", error);
        setPreview(user.avatar || null);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  // Generate initials
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || user.email[0].toUpperCase();

  return (
    <div className={cn("relative inline-block", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
      
      <div className="relative group">
        {/* Avatar Circle */}
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-lg ring-4 ring-gray-100">
          {preview ? (
            <img 
              src={preview} 
              alt={user.name || "Avatar"} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl font-semibold text-white">
              {initials}
            </span>
          )}
        </div>

        {/* Upload Button Overlay */}
        <button
          onClick={handleClick}
          disabled={uploading}
          className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center"
        >
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {uploading ? (
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Camera className="w-6 h-6 text-white drop-shadow-lg" />
                <span className="text-xs text-white font-medium drop-shadow-lg">
                  Thay đổi
                </span>
              </div>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
