import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

const PRODUCT_CATEGORIES = [
  {
    slug: "rice",
    name: "Rice",
    description:
      "Premium quality rice varieties sourced directly from farmers across India.",
    imageUrl: "/assets/generated/rice-detail.dim_800x600.png",
    variants: [
      {
        name: "Basmati Rice",
        imageUrl: "/assets/generated/rice-basmati.dim_400x300.png",
      },
      {
        name: "Sona Masoori",
        imageUrl: "/assets/generated/rice-sona-masoori.dim_400x300.png",
      },
      {
        name: "IR64 Rice",
        imageUrl: "/assets/generated/rice-ir64.dim_400x300.png",
      },
      {
        name: "Brown Rice",
        imageUrl: "/assets/generated/rice-brown.dim_400x300.png",
      },
      {
        name: "Broken Rice",
        imageUrl: "/assets/generated/rice-broken.dim_400x300.png",
      },
    ],
  },
  {
    slug: "wheat",
    name: "Wheat",
    description:
      "Premium wheat varieties from the fertile plains of India for milling and food processing.",
    imageUrl: "/assets/generated/wheat-detail.dim_800x600.png",
    variants: [
      {
        name: "Durum Wheat",
        imageUrl: "/assets/generated/wheat-durum.dim_400x300.png",
      },
      {
        name: "Whole Wheat",
        imageUrl: "/assets/generated/wheat-whole.dim_400x300.png",
      },
      {
        name: "Semolina (Suji)",
        imageUrl: "/assets/generated/wheat-semolina.dim_400x300.png",
      },
    ],
  },
  {
    slug: "pulses",
    name: "Pulses",
    description:
      "High-protein pulses and lentils rich in nutrients, perfect for domestic and export markets.",
    imageUrl: "/assets/generated/pulses-detail.dim_800x600.png",
    variants: [
      {
        name: "Chana Dal",
        imageUrl: "/assets/generated/pulses-chana-dal.dim_400x300.png",
      },
      {
        name: "Moong Dal",
        imageUrl: "/assets/generated/pulses-moong-dal.dim_400x300.png",
      },
      {
        name: "Masoor Dal",
        imageUrl: "/assets/generated/pulses-masoor-dal.dim_400x300.png",
      },
      {
        name: "Urad Dal",
        imageUrl: "/assets/generated/pulses-urad-dal.dim_400x300.png",
      },
      {
        name: "Toor Dal",
        imageUrl: "/assets/generated/pulses-toor-dal.dim_400x300.png",
      },
      {
        name: "Rajma",
        imageUrl: "/assets/generated/pulses-rajma.dim_400x300.png",
      },
      {
        name: "Kabuli Chana",
        imageUrl: "/assets/generated/pulses-kabuli-chana.dim_400x300.png",
      },
    ],
  },
  {
    slug: "spices",
    name: "Spices",
    description:
      "Aromatic spices from the finest growing regions of India in whole and ground forms.",
    imageUrl: "/assets/generated/spices-detail.dim_800x600.png",
    variants: [
      {
        name: "Turmeric Powder",
        imageUrl: "/assets/generated/spices-turmeric.dim_400x400.png",
      },
      {
        name: "Red Chilli Powder",
        imageUrl: "/assets/generated/spices-red-chilli.dim_400x400.png",
      },
      {
        name: "Coriander Powder",
        imageUrl: "/assets/generated/spices-coriander.dim_400x400.png",
      },
      {
        name: "Cumin Seeds",
        imageUrl: "/assets/generated/spices-cumin.dim_400x300.png",
      },
      {
        name: "Black Pepper",
        imageUrl: "/assets/generated/spices-black-pepper.dim_400x300.png",
      },
      {
        name: "Cardamom",
        imageUrl: "/assets/generated/spices-cardamom.dim_400x300.png",
      },
      {
        name: "Ginger Powder",
        imageUrl: "/assets/generated/spices-ginger.dim_400x300.png",
      },
      {
        name: "Fenugreek Seeds",
        imageUrl: "/assets/generated/spices-fenugreek.dim_400x300.png",
      },
    ],
  },
  {
    slug: "processed-food-products",
    name: "Processed Food Products",
    description:
      "Value-added processed food products made from premium quality grains and pulses.",
    imageUrl: "/assets/generated/processed-detail.dim_800x600.png",
    variants: [
      {
        name: "Rice Flour",
        imageUrl: "/assets/generated/processed-rice-flour.dim_400x300.png",
      },
      {
        name: "Wheat Flour (Atta)",
        imageUrl: "/assets/generated/processed-wheat-flour.dim_400x300.png",
      },
      {
        name: "Besan (Gram Flour)",
        imageUrl: "/assets/generated/processed-besan.dim_400x300.png",
      },
      {
        name: "Poha (Flattened Rice)",
        imageUrl: "/assets/generated/processed-poha.dim_400x300.png",
      },
      {
        name: "Roasted Chana",
        imageUrl: "/assets/generated/processed-roasted-chana.dim_400x300.png",
      },
      {
        name: "Vermicelli",
        imageUrl: "/assets/generated/processed-vermicelli.dim_400x300.png",
      },
    ],
  },
  {
    slug: "makhana",
    name: "Makhana (Fox Nuts)",
    description:
      "Premium Makhana sourced from Bihar, India — rich in nutrients and perfect for snacking and export.",
    imageUrl: "/assets/generated/makhana-detail.dim_800x600.png",
    variants: [
      {
        name: "Regular Makhana",
        imageUrl: "/assets/generated/makhana.dim_400x300.png",
      },
      {
        name: "Premium Makhana",
        imageUrl: "/assets/generated/makhana.dim_400x300.png",
      },
      {
        name: "Roasted Makhana",
        imageUrl: "/assets/generated/makhana-roasted.dim_400x300.png",
      },
      {
        name: "Makhana Powder",
        imageUrl: "/assets/generated/makhana-powder.dim_400x300.png",
      },
    ],
  },
];

export default function Products() {
  const navigate = useNavigate();

  const handleViewDetails = (slug: string) => {
    navigate({ to: "/products/$productId", params: { productId: slug } });
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary/5 border-b border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Our Products
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Premium quality agricultural commodities sourced directly from
            farmers across India. Available for domestic supply and
            international export.
          </p>
        </div>
      </section>

      {/* Product Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCT_CATEGORIES.map((category) => (
            <div
              key={category.slug}
              className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col"
            >
              {/* Category Image */}
              <div className="aspect-[16/9] overflow-hidden bg-muted">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/assets/generated/farmsiddhi-watermark.dim_1200x600.png";
                  }}
                />
              </div>

              {/* Category Info */}
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-xl font-bold text-foreground mb-2">
                  {category.name}
                </h2>
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  {category.description}
                </p>

                {/* Variants Grid */}
                <div className="mb-5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Available Varieties ({category.variants.length})
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {category.variants.slice(0, 6).map((variant) => (
                      <div
                        key={variant.name}
                        className="group/variant text-center"
                      >
                        <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-1">
                          <img
                            src={variant.imageUrl}
                            alt={variant.name}
                            className="w-full h-full object-cover group-hover/variant:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                category.imageUrl;
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground leading-tight line-clamp-2">
                          {variant.name}
                        </p>
                      </div>
                    ))}
                  </div>
                  {category.variants.length > 6 && (
                    <p className="text-xs text-primary mt-2 text-center">
                      +{category.variants.length - 6} more varieties
                    </p>
                  )}
                </div>

                {/* View Details Button */}
                <button
                  type="button"
                  onClick={() => handleViewDetails(category.slug)}
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Place a Bulk Order?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Contact our team for custom pricing, bulk discounts, and export
            documentation support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={() => navigate({ to: "/contact" })}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/exports" })}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
            >
              Export Services
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
