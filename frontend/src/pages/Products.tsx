import React from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Leaf } from 'lucide-react';

// Category-level fallback images for subcategory items that don't have dedicated images
const SUBCATEGORY_IMAGE_FALLBACKS: Record<string, string> = {
  // Spices fallbacks using existing spice images
  'Cumin': '/assets/generated/spices-coriander.dim_400x400.png',
  'Black Pepper': '/assets/generated/spices-turmeric.dim_400x400.png',
  'Cardamom': '/assets/generated/spices-coriander.dim_400x400.png',
  'Ginger Powder': '/assets/generated/spices-turmeric.dim_400x400.png',
  'Fenugreek': '/assets/generated/spices-red-chilli.dim_400x400.png',
  // Processed food fallbacks using existing category images
  'Rice Flour': '/assets/generated/rice.dim_400x300.png',
  'Wheat Flour (Atta)': '/assets/generated/wheat.dim_400x300.png',
  'Besan': '/assets/generated/pulses.dim_400x300.png',
  'Poha': '/assets/generated/rice.dim_400x300.png',
  'Roasted Chana': '/assets/generated/pulses.dim_400x300.png',
  'Vermicelli': '/assets/generated/wheat.dim_400x300.png',
  // Makhana fallbacks using existing makhana images
  'Fox Nut Regular': '/assets/generated/makhana.dim_400x300.png',
  'Fox Nut Premium': '/assets/generated/makhana.dim_400x300.png',
  'Roasted Makhana': '/assets/generated/makhana-roasted.dim_400x300.png',
  'Makhana Powder': '/assets/generated/makhana.dim_400x300.png',
};

const PRODUCTS = [
  {
    id: 'rice',
    name: 'Rice',
    description: 'Premium Basmati and non-Basmati rice varieties sourced from the finest farms across India.',
    image: '/assets/generated/rice.dim_400x300.png',
    icon: '/assets/generated/icon-rice.dim_128x128.png',
    badge: 'Best Seller',
    subcategories: [
      { name: 'Basmati Rice', image: '/assets/generated/rice-basmati.dim_400x400.png' },
      { name: 'Sona Masoori', image: '/assets/generated/rice-sona-masoori.dim_400x400.png' },
      { name: 'IR-64 Parboiled', image: '/assets/generated/rice-ir64.dim_400x400.png' },
      { name: 'Brown Rice', image: '/assets/generated/rice-brown.dim_400x400.png' },
      { name: 'Broken Rice', image: '/assets/generated/rice-broken.dim_400x400.png' },
    ],
  },
  {
    id: 'wheat',
    name: 'Wheat',
    description: 'High-quality wheat including Durum Wheat, Whole Wheat, and Semolina for diverse applications.',
    image: '/assets/generated/wheat.dim_400x300.png',
    icon: '/assets/generated/icon-wheat.dim_128x128.png',
    badge: 'Premium',
    subcategories: [
      { name: 'Durum Wheat', image: '/assets/generated/wheat-durum.dim_400x400.png' },
      { name: 'Whole Wheat', image: '/assets/generated/wheat-whole.dim_400x400.png' },
      { name: 'Semolina', image: '/assets/generated/wheat-semolina.dim_400x400.png' },
    ],
  },
  {
    id: 'pulses',
    name: 'Pulses',
    description: 'A wide range of high-quality pulses including lentils, chickpeas, and various dals.',
    image: '/assets/generated/pulses.dim_400x300.png',
    icon: '/assets/generated/icon-pulses.dim_128x128.png',
    badge: 'Protein Rich',
    subcategories: [
      { name: 'Chana Dal', image: '/assets/generated/pulses-chana-dal.dim_400x400.png' },
      { name: 'Moong Dal', image: '/assets/generated/pulses-moong-dal.dim_400x400.png' },
      { name: 'Masoor Dal', image: '/assets/generated/pulses-masoor-dal.dim_400x400.png' },
      { name: 'Urad Dal', image: '/assets/generated/pulses-urad-dal.dim_400x400.png' },
      { name: 'Toor Dal', image: '/assets/generated/pulses-toor-dal.dim_400x400.png' },
      { name: 'Rajma', image: '/assets/generated/pulses-rajma.dim_400x400.png' },
      { name: 'Kabuli Chana', image: '/assets/generated/pulses-kabuli-chana.dim_400x400.png' },
    ],
  },
  {
    id: 'spices',
    name: 'Spices',
    description: 'Authentic Indian spices with rich aroma and flavor, sourced from the finest spice-growing regions.',
    image: '/assets/generated/spices.dim_400x300.png',
    icon: '/assets/generated/icon-spices.dim_128x128.png',
    badge: 'Aromatic',
    subcategories: [
      { name: 'Turmeric', image: '/assets/generated/spices-turmeric.dim_400x400.png' },
      { name: 'Red Chilli', image: '/assets/generated/spices-red-chilli.dim_400x400.png' },
      { name: 'Coriander', image: '/assets/generated/spices-coriander.dim_400x400.png' },
      { name: 'Cumin', image: '/assets/generated/spices-coriander.dim_400x400.png' },
      { name: 'Black Pepper', image: '/assets/generated/spices-turmeric.dim_400x400.png' },
      { name: 'Cardamom', image: '/assets/generated/spices-coriander.dim_400x400.png' },
      { name: 'Ginger Powder', image: '/assets/generated/spices-turmeric.dim_400x400.png' },
      { name: 'Fenugreek', image: '/assets/generated/spices-red-chilli.dim_400x400.png' },
    ],
  },
  {
    id: 'processed-food-products',
    name: 'Processed Food Products',
    description: 'Value-added processed food products including flours, ready mixes, and other processed agricultural goods.',
    image: '/assets/generated/processed-foods.dim_400x300.png',
    icon: '/assets/generated/icon-processed.dim_128x128.png',
    badge: 'Value Added',
    subcategories: [
      { name: 'Rice Flour', image: '/assets/generated/rice.dim_400x300.png' },
      { name: 'Wheat Flour (Atta)', image: '/assets/generated/wheat.dim_400x300.png' },
      { name: 'Besan', image: '/assets/generated/pulses.dim_400x300.png' },
      { name: 'Poha', image: '/assets/generated/rice.dim_400x300.png' },
      { name: 'Roasted Chana', image: '/assets/generated/pulses.dim_400x300.png' },
      { name: 'Vermicelli', image: '/assets/generated/wheat.dim_400x300.png' },
    ],
  },
  {
    id: 'makhana',
    name: 'Makhana',
    description: 'Premium quality Fox Nuts (Makhana) sourced from Bihar. Rich in nutrients and available in multiple varieties.',
    image: '/assets/generated/makhana.dim_400x300.png',
    icon: '/assets/generated/icon-wheat.dim_128x128.png',
    badge: 'Superfood',
    subcategories: [
      { name: 'Fox Nut Regular', image: '/assets/generated/makhana.dim_400x300.png' },
      { name: 'Fox Nut Premium', image: '/assets/generated/makhana.dim_400x300.png' },
      { name: 'Roasted Makhana', image: '/assets/generated/makhana-roasted.dim_400x300.png' },
      { name: 'Makhana Powder', image: '/assets/generated/makhana.dim_400x300.png' },
    ],
  },
];

export default function Products() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-b border-border py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">Our Products</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Premium Agricultural Products
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sourced directly from farmers across India. Quality assured, competitively priced, and ready for domestic and export markets.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.map((product) => (
              <Link
                key={product.id}
                to="/products/$category"
                params={{ category: product.id }}
                className="group block"
              >
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  {/* Product Image */}
                  <div className="relative aspect-video overflow-hidden bg-muted/20">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {product.badge && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                          {product.badge}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {product.description}
                    </p>

                    {/* Sub-categories grid */}
                    <div className="mb-5">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Available Varieties ({product.subcategories.length})
                      </p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {product.subcategories.map((sub) => (
                          <div
                            key={sub.name}
                            className="flex flex-col items-center gap-1 bg-muted/30 rounded-lg p-1.5 border border-border/40"
                          >
                            <div className="w-full aspect-square rounded overflow-hidden bg-muted/50 flex items-center justify-center">
                              <img
                                src={sub.image}
                                alt={sub.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  const fallback = SUBCATEGORY_IMAGE_FALLBACKS[sub.name];
                                  if (fallback && target.src !== window.location.origin + fallback) {
                                    target.src = fallback;
                                  } else {
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                      const existing = parent.querySelector('span');
                                      if (!existing) {
                                        const span = document.createElement('span');
                                        span.className = 'text-xs text-muted-foreground text-center px-1';
                                        span.textContent = sub.name.charAt(0);
                                        parent.appendChild(span);
                                      }
                                    }
                                  }
                                }}
                              />
                            </div>
                            <span className="text-[10px] text-muted-foreground text-center leading-tight line-clamp-2 w-full">
                              {sub.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-1.5 text-primary font-semibold text-sm group-hover:gap-2.5 transition-all mt-auto">
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 border-t border-border py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Looking for Bulk Orders or Custom Requirements?
          </h2>
          <p className="text-muted-foreground mb-8 text-base">
            We cater to large-scale buyers, exporters, and institutional clients. Get in touch for custom pricing and packaging.
          </p>
          <Link to="/contact">
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-sm">
              Contact Us for Bulk Orders
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
