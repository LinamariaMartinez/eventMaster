"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Image from "next/image";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  eventId: string;
  label?: string;
  description?: string;
  aspectRatio?: string;
}

export function ImageUploader({
  value,
  onChange,
  eventId,
  label = "Imagen",
  description,
  aspectRatio = "16/9",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Sync previewUrl with value prop changes
  useEffect(() => {
    setPreviewUrl(value);
  }, [value]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe superar los 5MB');
      return;
    }

    setUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${eventId}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('event-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('event-images')
        .getPublicUrl(data.path);

      setPreviewUrl(publicUrl);
      onChange(publicUrl);
      toast.success('Imagen subida exitosamente');

      // Reset file input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!previewUrl) return;

    try {
      // Extract path from URL
      const urlParts = previewUrl.split('/');
      const path = urlParts.slice(-2).join('/'); // eventId/filename

      // Delete from storage
      await supabase.storage
        .from('event-images')
        .remove([path]);

      setPreviewUrl(undefined);
      onChange('');
      toast.success('Imagen eliminada');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Error al eliminar la imagen');
    }
  };

  return (
    <div className="space-y-3">
      {label && <Label>{label}</Label>}
      {description && <p className="text-sm text-gray-500">{description}</p>}

      {previewUrl ? (
        <div className="relative group">
          <div
            className="relative w-full rounded-lg overflow-hidden border bg-gray-100"
            style={{ aspectRatio }}
          >
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
          >
            <X className="h-4 w-4 mr-1" />
            Eliminar
          </Button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          style={{ aspectRatio }}
        >
          <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            {uploading ? 'Subiendo...' : 'Haz clic para seleccionar una imagen'}
          </p>
          <p className="text-xs text-gray-400">
            PNG, JPG o WEBP (máx. 5MB)
          </p>
        </div>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
        disabled={uploading}
      />

      {!previewUrl && (
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Subiendo...' : 'Seleccionar Imagen'}
        </Button>
      )}
    </div>
  );
}
