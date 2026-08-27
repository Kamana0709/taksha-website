/**
 * SEO — Per-route <head> management
 * Wraps React Helmet Async for consistent title, meta, OG, canonical
 * PRD §21.3
 */
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Taksha';
const SITE_URL = 'https://www.taksha.studio';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og/default.png`;

export default function SEO({
  title,
  description,
  canonical,
  ogImage,
  noindex = false,
  type = 'website',
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME} — Digital Craft Studio` : `${SITE_NAME} — Digital Craft Studio | Branding, Design & Engineering`;
  const fullCanonical = canonical ? `${SITE_URL}${canonical}` : undefined;
  const image = ogImage || DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, follow" />}
    </Helmet>
  );
}
