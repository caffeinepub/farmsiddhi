import React from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Leaf } from 'lucide-react';

const PRODUCTS = [
  {
    id: 'rice',
    name: 'Rice',
    description: 'Premium Basmati and non-Basmati rice varieties sourced from the finest farms across India.',
    image: '/assets/generated/rice.dim_400x300.png',
    icon: '/assets/generated/icon-rice.dim_128x128.png',
    highlights: ['Basmati', 'Non-Basmati', 'Parboiled', 'Organic'],
    badge: 'Best Seller',
  },
  {
    id: 'wheat',
    name: 'Wheat',
    description: 'High-quality wheat including Durum Wheat, Whole Wheat, and Semolina for diverse applications.',
    image: '/assets/generated/wheat.dim_400x300.png',
    icon: '/assets/generated/icon-wheat.dim_128x128.png',
    highlights: ['Durum Wheat', 'Whole Wheat', 'Semolina', 'Refined Flour'],
    badge: 'Premium',
  },
  {
    id: 'pulses',
    name: 'Pulses',
    description: 'A wide range of high-quality pulses including lentils, chickpeas, and various dals.',
    image: '/assets/generated/pulses.dim_400x300.png',
    icon: '/assets/generated/icon-pulses.dim_128x128.png',
    highlights: ['Moong Dal', 'Chana Dal', 'Masoor Dal', 'Urad Dal'],
    badge: 'Protein Rich',
  },
  {
    id: 'spices',
    name: 'Spices',
    description: 'Authentic Indian spices with rich aroma and flavor, sourced from the finest spice-growing regions.',
    image: '/assets/generated/spices.dim_400x300.png',
    icon: '/assets/generated/icon-spices.dim_128x128.png',
    highlights: ['Turmeric', 'Chili', 'Cumin', 'Coriander'],
    badge: 'Aromatic',
  },
  {
    id: 'processed-food-products',
    name: 'Processed Food Products',
    description: 'Value-added processed food products including flours, ready mixes, and other processed agricultural goods.',
    image: '/assets/generated/processed-foods.dim_400x300.png',
    icon: '/assets/generated/icon-processed.dim_128x128.png',
    highlights: ['Wheat Flour', 'Rice Flour', 'Besan', 'Suji'],
    badge: 'Value Added',
  },
  {
    id: 'makhana',
    name: 'Makhana',
    description: 'Premium quality Fox Nuts (Makhana) sourced from Bihar. Rich in nutrients and available in multiple varieties.',
    image: '/assets/generated/makhana.dim_400x300.png',
    icon: '/assets/generated/icon-wheat.dim_128x128.png',
    highlights: ['Plain', 'Roasted', 'Flavored', 'Organic'],
    badge: 'Superfood',
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
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
                      {product.description}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {product.highlights.map((h) => (
                        <span
                          key={h}
                          className="text-xs bg-muted/50 text-muted-foreground px-2.5 py-1 rounded-full border border-border/50"
                        >
                          {h}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-1.5 text-primary font-semibold text-sm group-hover:gap-2.5 transition-all">
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
