// JSON-LD Structured Data untuk SEO

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Sahara Mart',
  description: 'Minimarket online terpercaya dengan produk berkualitas dan harga terjangkau',
  url: 'https://saharamart.com',
  logo: 'https://saharamart.com/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+62-822-6756-7946',
    contactType: 'Customer Service',
    areaServed: 'ID',
    availableLanguage: 'Indonesian',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Hapesong Baru',
    addressLocality: 'Batang Toru',
    addressRegion: 'Tapanuli Selatan',
    postalCode: '22738',
    addressCountry: 'ID',
  },
  sameAs: [
    'https://facebook.com/saharamart',
    'https://instagram.com/saharamart',
    'https://twitter.com/saharamart',
  ],
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Sahara Mart',
  url: 'https://saharamart.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://saharamart.com/katalog?search={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'Sahara Mart',
  image: 'https://saharamart.com/og-image.jpg',
  '@id': 'https://saharamart.com',
  url: 'https://saharamart.com',
  telephone: '+62-822-6756-7946',
  priceRange: 'Rp 1.000 - Rp 100.000',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Hapesong Baru',
    addressLocality: 'Batang Toru',
    addressRegion: 'Tapanuli Selatan',
    postalCode: '22738',
    addressCountry: 'ID',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '07:00',
    closes: '22:00',
  },
};

export function generateProductSchema(product: {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
  sku: string;
  stock: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image_url || 'https://saharamart.com/default-product.jpg',
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      url: `https://saharamart.com/produk/${product.id}`,
      priceCurrency: 'IDR',
      price: product.price,
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Sahara Mart',
      },
    },
    category: product.category,
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
