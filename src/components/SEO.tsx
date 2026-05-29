import { Helmet } from "react-helmet-async";

const SITE_NAME = "Al Arabia Carpets";
const SITE_URL = "https://alarabiacarpets.com";
const DEFAULT_IMAGE = "/lovable-uploads/green-white-logo.webp";

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noindex?: boolean;
  product?: {
    name: string;
    description: string;
    image: string;
    category: string;
  };
}

const SEO = ({
  title,
  description = "Al Arabia Carpets - Qatar's leading provider of premium Barkia, PVC flooring, carpets, sofas, curtains & interior design services. Free installation & delivery across Doha.",
  path = "/",
  image = DEFAULT_IMAGE,
  noindex = false,
  product,
}: SEOProps) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Premium Home Furnishings & Interior Design in Qatar | Doha`;
  const canonicalUrl = `${SITE_URL}${path}`;
  const fullImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;
  const truncatedDesc = description.length > 155 ? description.slice(0, 152) + "..." : description;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={truncatedDesc} />
      <link rel="canonical" href={canonicalUrl} />

      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      {noindex && <meta name="prerender-status-code" content="404" />}

      <meta property="og:type" content={product ? "product" : "website"} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImage} />

      {product && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: product.image.startsWith("http") ? product.image : `${SITE_URL}${product.image}`,
            brand: {
              "@type": "Brand",
              name: SITE_NAME,
            },
            category: product.category,
            offers: {
              "@type": "Offer",
              availability: "https://schema.org/InStock",
              priceCurrency: "QAR",
              seller: {
                "@type": "Organization",
                name: SITE_NAME,
              },
            },
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
