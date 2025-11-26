/**
 * Script to validate all product images
 */

import { checkImageExists, normalizeImagePath } from '@/lib/image-utils';

// Product data from the application
const allProducts = [
  {
    id: "premium-barkia",
    name: "Premium Barkia",
    imageSrc: "/barkia&pvc/barkia.webp",
  },
  {
    id: "pvc-barkia",
    name: "PVC Barkia",
    imageSrc: "/pvc-barkia.webp",
  },
  {
    id: "al-wakra-white-spc",
    name: "Al Wakra White SPC",
    imageSrc: "/barkia&pvc/Al Wakra White – Ultra-Modern Waterproof SPC Flooring.webp",
  },
  {
    id: "arabian-night-espresso-spc",
    name: "Arabian Night Espresso SPC",
    imageSrc: "/barkia&pvc/Arabian Night Espresso – High-End Waterproof SPC.webp",
  },
  {
    id: "desert-walnut-classic-spc",
    name: "Desert Walnut Classic SPC",
    imageSrc: "/barkia&pvc/Desert Walnut Classic – Luxury SPC Flooring Doha.webp",
  },
  {
    id: "doha-coastal-grey-spc",
    name: "Doha Coastal Grey SPC",
    imageSrc: "/barkia&pvc/Doha Coastal Grey – Premium Rigid Core SPC Vinyl.webp",
  },
  {
    id: "pearl-grey-herringbone-spc",
    name: "Pearl Grey Herringbone SPC",
    imageSrc: "/barkia&pvc/Pearl Grey Herringbone – 100  Waterproof SPC Qatar.webp",
  },
  {
    id: "qatar-breeze-oak-spc",
    name: "Qatar Breeze Oak SPC",
    imageSrc: "/barkia&pvc/Qatar Breeze Oak – Bright & Waterproof SPC Flooring.webp",
  },
  {
    id: "qatar-sand-oak-spc",
    name: "Qatar Sand Oak SPC",
    imageSrc: "/barkia&pvc/Qatar Sand Oak – Luxury Waterproof SPC Flooring.webp",
  },
  {
    id: "royal-mahogany-spc",
    name: "Royal Mahogany SPC",
    imageSrc: "/barkia&pvc/Royal Mahogany – Luxury Waterproof Vinyl SPC.webp",
  },
  {
    id: "scandinavian-white-oak-spc",
    name: "Scandinavian White Oak SPC",
    imageSrc: "/barkia&pvc/Scandinavian White Oak – Modern Waterproof SPC Doha.webp",
  },
  {
    id: "sunset-teak-gold-spc",
    name: "Sunset Teak Gold SPC",
    imageSrc: "/barkia&pvc/Sunset Teak Gold – Elegant SPC Vinyl Flooring Qatar.webp",
  },
  {
    id: "luxury-carpets",
    name: "Luxury Carpets",
    imageSrc: "/carpet.webp",
  },
  {
    id: "grass-carpet",
    name: "Grass Carpet",
    imageSrc: "/grass-carpet.webp",
  },
  {
    id: "roller-blinds",
    name: "Roller Blinds",
    imageSrc: "/roller.webp",
  },
  {
    id: "elegant-curtains",
    name: "Elegant Curtains",
    imageSrc: "/curtain.webp",
  },
  {
    id: "modern-sofas",
    name: "Modern Sofas",
    imageSrc: "/sofa.webp",
  },
  {
    id: "majlis-sets",
    name: "Majlis Sets",
    imageSrc: "/majlis-sofa.webp",
  },
  {
    id: "luxury-interior-design",
    name: "Luxury Interior Design",
    imageSrc: "/interior.webp",
  }
];

/**
 * Validate all product images
 */
export const validateAllImages = async (): Promise<{
  valid: Array<{ id: string; name: string; imageSrc: string }>;
  invalid: Array<{ id: string; name: string; imageSrc: string; error: string }>;
}> => {
  const results = {
    valid: [] as Array<{ id: string; name: string; imageSrc: string }>,
    invalid: [] as Array<{ id: string; name: string; imageSrc: string; error: string }>
  };

  console.log('🔍 Validating product images...');

  for (const product of allProducts) {
    const normalizedPath = normalizeImagePath(product.imageSrc);
    console.log(`Checking: ${product.name} -> ${normalizedPath}`);
    
    try {
      const exists = await checkImageExists(normalizedPath);
      
      if (exists) {
        results.valid.push(product);
        console.log(`✅ ${product.name}: Image loaded successfully`);
      } else {
        results.invalid.push({
          ...product,
          error: 'Image failed to load or does not exist'
        });
        console.log(`❌ ${product.name}: Image failed to load`);
      }
    } catch (error) {
      results.invalid.push({
        ...product,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log(`❌ ${product.name}: Error - ${error}`);
    }
  }

  console.log('\n📊 Validation Summary:');
  console.log(`✅ Valid images: ${results.valid.length}`);
  console.log(`❌ Invalid images: ${results.invalid.length}`);

  if (results.invalid.length > 0) {
    console.log('\n🚨 Issues found:');
    results.invalid.forEach(item => {
      console.log(`- ${item.name} (${item.imageSrc}): ${item.error}`);
    });
  }

  return results;
};

/**
 * Run validation if this file is executed directly
 */
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Only run in browser development environment
  validateAllImages().then(results => {
    if (results.invalid.length === 0) {
      console.log('🎉 All product images are valid!');
    } else {
      console.log('⚠️ Some product images have issues. Check the console for details.');
    }
  });
}