import { useEffect } from 'react';
import { preloadImages } from '@/lib/image-utils';

interface ImagePreloaderProps {
  images?: string[];
}

/**
 * Component to preload critical images
 */
const ImagePreloader = ({ images = [] }: ImagePreloaderProps) => {
  useEffect(() => {
    // Critical images that should load immediately (logo + homepage above-fold)
    const eager = [
      '/lovable-uploads/green-white-logo.webp',
      // ProductsSection showcase images (homepage)
      '/Products/Carpets/carpet.webp',
      '/Products/Furniture/majlis-sofa.webp',
      '/Products/barkia&pvc/barkia.webp',
      // About page
      '/About Al Arabia Carpets.webp',
      ...images
    ];
    const uniqueEager = [...new Set(eager)];

    // Start preload for critical images immediately
    preloadImages(uniqueEager).catch(() => {});

    // Defer background preloads for secondary images
    const deferred = [
      // Additional product images
      '/Products/Curtain/curtain.webp',
      '/Products/Curtain/roller.webp',
      '/Products/Carpets/grass-carpet.webp',
      '/Products/Furniture/sofa.webp',
      // TrustedBy partner logos
      '/logos/logo1.webp',
      '/logos/logo2.webp',
      '/logos/logo3.webp',
      '/logos/logo4.webp',
      '/logos/logo5.webp',
      '/logos/logo6.webp',
      '/logos/logo7.webp',
      '/logos/logo8.webp',
      '/logos/logo9.webp',
      '/logos/logo10.webp',
      '/logos/logo11.webp',
      '/logos/logo12.webp',
      '/logos/logo13.webp',
      '/logos/logo14.webp'
    ].filter(p => !uniqueEager.includes(p));

  let idleId: number | null = null;
    const runDeferred = () => {
      preloadImages(deferred).catch(() => {});
    };

    if ('requestIdleCallback' in window) {
      // @ts-ignore - requestIdleCallback types vary by environment
      idleId = (window as any).requestIdleCallback(runDeferred, { timeout: 3000 });
    } else {
      // Fallback to timeout - cast to number for TypeScript
      idleId = (window as unknown as any).setTimeout(runDeferred, 3000) as number;
    }

    return () => {
      if (idleId) {
        if ('cancelIdleCallback' in window) {
          // @ts-ignore
          (window as any).cancelIdleCallback(idleId);
        } else {
          clearTimeout(idleId as number);
        }
      }
    };
  }, [images]);

  // This component doesn't render anything
  return null;
};

export default ImagePreloader;