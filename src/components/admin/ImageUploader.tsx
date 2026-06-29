"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { convertToWebP } from "@/lib/imageUtils";
import { useToast } from "@/context/ToastContext";

function UploadIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
    </svg>
  );
}

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  onRemove: () => void;
  currentUrl: string;
  bucket?: string;
  quality?: number;
  maxWidth?: number;
}

export default function ImageUploader({
  onUpload,
  onRemove,
  currentUrl,
  bucket = "product-images",
  quality = 0.8,
  maxWidth = 1200,
}: ImageUploaderProps) {
  const supabase = createClient();
  const { addToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const webpBlob = await convertToWebP(file, quality, maxWidth);
      const filePath = `${crypto.randomUUID()}.webp`;
      const { error } = await supabase.storage.from(bucket).upload(filePath, webpBlob, {
        contentType: "image/webp",
      });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
      onUpload(publicUrl);
      addToast("Imagen subida correctamente");
    } catch {
      addToast("Error al subir imagen", "error");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full px-4 py-3 min-h-[44px] rounded-xl text-sm font-medium bg-[var(--primary-light)]/20 text-[var(--accent)] hover:bg-[var(--primary-light)]/40 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 border-2 border-dashed border-[var(--primary-light)]/40"
      >
        <UploadIcon />
        {uploading ? "Comprimiendo y subiendo..." : currentUrl ? "Cambiar imagen" : "Seleccionar imagen"}
      </button>
      {currentUrl && (
        <button
          onClick={onRemove}
          className="mt-1.5 text-xs text-red-500 hover:underline"
        >
          Quitar imagen
        </button>
      )}
    </div>
  );
}
