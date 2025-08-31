"use client";

import { useState, useEffect, useRef, Suspense, lazy } from "react";

interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

// Hook for intersection observer
const useIntersectionObserver = (
  elementRef: React.RefObject<HTMLDivElement | null>,
  options: IntersectionObserverInit
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      options
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options, hasIntersected]);

  return { isIntersecting, hasIntersected };
};

// Component wrapper for lazy loading based on viewport intersection
export function LazyComponent({
  children,
  fallback = <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />,
  rootMargin = "50px",
  threshold = 0.1,
  className = ""
}: LazyComponentProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const { hasIntersected } = useIntersectionObserver(elementRef, {
    rootMargin,
    threshold,
  });

  return (
    <div ref={elementRef} className={className}>
      {hasIntersected ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}

// Higher-order component for lazy loading React components
export function withLazyLoading<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function LazyLoadedComponent(props: P) {
    return (
      <LazyComponent fallback={fallback}>
        <Component {...props} />
      </LazyComponent>
    );
  };
}

// Lazy load specific heavy components
export const LazyPhotoGallery = lazy(() => 
  import("../invitations/photo-gallery").then(module => ({ 
    default: module.PhotoGallery 
  }))
);

export const LazyInteractiveMap = lazy(() => 
  import("../invitations/interactive-map").then(module => ({ 
    default: module.InteractiveMap 
  }))
);

export const LazyEventDetailsSections = lazy(() => 
  import("../invitations/event-details-sections").then(module => ({ 
    default: module.EventDetailsSections 
  }))
);

// Loading skeletons for specific components
export const PhotoGallerySkeleton = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-40 bg-gray-100 animate-pulse rounded-lg" />
      ))}
    </div>
  </div>
);

export const MapSkeleton = () => (
  <div className="space-y-4">
    <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
    <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />
    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-8 bg-gray-100 animate-pulse rounded" />
      ))}
    </div>
  </div>
);

export const EventDetailsSkeleton = () => (
  <div className="space-y-6">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <div className="h-6 w-40 bg-gray-200 animate-pulse rounded" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 animate-pulse rounded" />
          <div className="h-4 w-3/4 bg-gray-100 animate-pulse rounded" />
        </div>
      </div>
    ))}
  </div>
);

// Performance monitoring hook
export const useComponentPerformance = (componentName: string) => {
  const startTime = useRef<number>(0);

  useEffect(() => {
    startTime.current = performance.now();

    return () => {
      if (startTime.current) {
        const endTime = performance.now();
        const loadTime = endTime - startTime.current;
        
        // Log performance metrics
        console.log(`${componentName} loaded in ${loadTime.toFixed(2)}ms`);
        
        // You could send this to analytics service
        if (typeof window !== 'undefined' && 'gtag' in window) {
          const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag;
          if (typeof gtag === 'function') {
            gtag('event', 'component_load_time', {
              component_name: componentName,
              load_time: loadTime,
            });
          }
        }
      }
    };
  }, [componentName]);
};