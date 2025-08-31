"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";

interface PhotoGalleryProps {
  images: string[];
  captions?: string[];
  className?: string;
}

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
  priority?: boolean;
}

// WebP optimized image component
const OptimizedImage = ({ src, alt, width = 400, height = 300, className, onClick, priority = false }: OptimizedImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Convert image to WebP if supported, fallback to original
  const getOptimizedImageUrl = useCallback((originalSrc: string) => {
    // If it's already WebP, return as is
    if (originalSrc.toLowerCase().includes('.webp')) {
      return originalSrc;
    }

    // For demo purposes, we'll use a WebP conversion service or fallback
    // In production, you'd integrate with your image processing service
    const isWebPSupported = typeof window !== 'undefined' && 
      (('chrome' in window) || 
      ('opera' in window) || 
      /firefox/i.test(navigator.userAgent));

    if (isWebPSupported) {
      // Convert common image formats to WebP
      const extension = originalSrc.split('.').pop()?.toLowerCase();
      if (['jpg', 'jpeg', 'png'].includes(extension || '')) {
        return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      }
    }

    return originalSrc;
  }, []);

  const optimizedSrc = getOptimizedImageUrl(src);

  if (imageError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ width, height }}
      >
        <Camera className="h-8 w-8 text-gray-400" />
        <span className="text-gray-500 text-sm ml-2">Imagen no disponible</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <Image
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onClick={onClick}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg animate-pulse"
          style={{ width, height }}
        >
          <Camera className="h-6 w-6 text-gray-400" />
        </div>
      )}
    </div>
  );
};

export function PhotoGallery({ images, captions = [], className = "" }: PhotoGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = useCallback(() => {
    if (selectedImage !== null && images.length > 0) {
      setSelectedImage(selectedImage > 0 ? selectedImage - 1 : images.length - 1);
    }
  }, [selectedImage, images.length]);

  const goToNext = useCallback(() => {
    if (selectedImage !== null && images.length > 0) {
      setSelectedImage(selectedImage < images.length - 1 ? selectedImage + 1 : 0);
    }
  }, [selectedImage, images.length]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedImage === null) return;
    
    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        goToPrevious();
        break;
      case 'ArrowRight':
        goToNext();
        break;
    }
  }, [selectedImage, goToPrevious, goToNext]);

  // Handle keyboard navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.slice(0, 6).map((image, index) => (
          <Card
            key={index}
            className="cursor-pointer overflow-hidden hover:scale-105 transition-transform duration-300"
            onClick={() => openLightbox(index)}
          >
            <OptimizedImage
              src={image}
              alt={captions[index] || `Foto ${index + 1}`}
              width={300}
              height={200}
              className="w-full h-40 object-cover rounded-lg"
              priority={index < 2} // Prioritize loading first 2 images
            />
            {captions[index] && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                <p className="text-xs truncate">{captions[index]}</p>
              </div>
            )}
          </Card>
        ))}
        
        {/* Show more indicator */}
        {images.length > 6 && (
          <Card
            className="cursor-pointer overflow-hidden hover:scale-105 transition-transform duration-300 flex items-center justify-center bg-gray-100"
            onClick={() => openLightbox(6)}
          >
            <div className="text-center">
              <Camera className="h-8 w-8 mx-auto mb-2 text-gray-600" />
              <p className="text-sm font-medium text-gray-600">
                +{images.length - 6} más
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white hover:bg-opacity-20"
              onClick={closeLightbox}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white hover:bg-opacity-20"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white hover:bg-opacity-20"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Main image */}
            <div className="flex flex-col items-center">
              <OptimizedImage
                src={images[selectedImage]}
                alt={captions[selectedImage] || `Foto ${selectedImage + 1}`}
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                priority={true}
              />
              
              {/* Caption */}
              {captions[selectedImage] && (
                <div className="mt-4 text-center">
                  <p className="text-white text-lg">{captions[selectedImage]}</p>
                </div>
              )}

              {/* Image counter */}
              <div className="mt-2 text-white text-sm opacity-75">
                {selectedImage + 1} / {images.length}
              </div>
            </div>
          </div>

          {/* Click outside to close */}
          <div 
            className="absolute inset-0 -z-10" 
            onClick={closeLightbox}
          />
        </div>
      )}
    </div>
  );
}