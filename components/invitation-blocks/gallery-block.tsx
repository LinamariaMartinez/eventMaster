"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { GalleryBlockData, ColorScheme } from "@/types/invitation-blocks";
import { Button } from "@/components/ui/button";

interface GalleryBlockProps {
  data: GalleryBlockData;
  colorScheme: ColorScheme;
}

export function GalleryBlock({ data, colorScheme }: GalleryBlockProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const images = data.images || [];
  const layout = data.layout || 'grid';
  const autoplayInterval = 4000; // 4 segundos

  // Autoplay effect for carousel mode
  useEffect(() => {
    if (layout !== 'carousel' || isAutoplayPaused || images.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentCarouselIndex((prev) => (prev + 1) % images.length);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [layout, isAutoplayPaused, images.length, autoplayInterval]);

  if (images.length === 0) {
    return (
      <div
        className="py-16 px-4 text-center"
        style={{ backgroundColor: colorScheme.background }}
      >
        <p style={{ color: colorScheme.textLight }}>
          No hay imágenes en la galería
        </p>
      </div>
    );
  }

  const openLightbox = (index: number) => setSelectedImage(index);
  const closeLightbox = () => setSelectedImage(null);
  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };
  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + images.length) % images.length);
    }
  };

  const nextCarousel = () => {
    setCurrentCarouselIndex((prev) => (prev + 1) % images.length);
  };

  const prevCarousel = () => {
    setCurrentCarouselIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div
        className="py-16 px-4"
        style={{ backgroundColor: colorScheme.background }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <h2
            className="text-4xl font-serif font-bold text-center mb-12"
            style={{ color: colorScheme.text }}
          >
            Galería
          </h2>

          {/* Grid Layout */}
          {layout === 'grid' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square cursor-pointer overflow-hidden rounded-lg group"
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={image.url}
                    alt={image.caption || `Imagen ${index + 1}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      {image.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Masonry Layout */}
          {layout === 'masonry' && (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative mb-4 cursor-pointer overflow-hidden rounded-lg group break-inside-avoid"
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={image.url}
                    alt={image.caption || `Imagen ${index + 1}`}
                    width={400}
                    height={400}
                    className="w-full h-auto transition-transform group-hover:scale-105"
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      {image.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Carousel Layout */}
          {layout === 'carousel' && (
            <div
              className="relative max-w-4xl mx-auto"
              onMouseEnter={() => setIsAutoplayPaused(true)}
              onMouseLeave={() => setIsAutoplayPaused(false)}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src={images[currentCarouselIndex].url}
                  alt={images[currentCarouselIndex].caption || 'Imagen'}
                  fill
                  className="object-cover transition-opacity duration-500"
                />
              </div>
              {images[currentCarouselIndex].caption && (
                <p className="text-center mt-4 text-gray-600">
                  {images[currentCarouselIndex].caption}
                </p>
              )}
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevCarousel}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsAutoplayPaused(!isAutoplayPaused)}
                >
                  {isAutoplayPaused ? (
                    <Play className="h-4 w-4" />
                  ) : (
                    <Pause className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextCarousel}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-center gap-2 mt-4">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentCarouselIndex(index);
                      setIsAutoplayPaused(true);
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentCarouselIndex
                        ? 'bg-gray-800'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && layout !== 'carousel' && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <div className="max-w-5xl max-h-[90vh] relative">
            <Image
              src={images[selectedImage].url}
              alt={images[selectedImage].caption || 'Imagen'}
              width={1200}
              height={800}
              className="max-h-[90vh] w-auto h-auto object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {images[selectedImage].caption && (
              <p className="text-white text-center mt-4 text-lg">
                {images[selectedImage].caption}
              </p>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {selectedImage + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
