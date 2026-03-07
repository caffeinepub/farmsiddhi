import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  makhana,
  makhanaDetail,
  makhanaFlavored,
  makhanaPowder,
  makhanaRoasted,
  processedBesan,
  processedDetail,
  processedPoha,
  processedRiceFlour,
  processedRoastedChana,
  processedVermicelli,
  processedWheatFlour,
  pulsesChana,
  pulsesDetail,
  pulsesKabuli,
  pulsesMasoor,
  pulsesMoong,
  pulsesRajma,
  pulsesToor,
  pulsesUrad,
  riceBasmati,
  riceBroken,
  riceBrown,
  riceDetail,
  riceIr64,
  riceSonaMasoori,
  spicesBlackPepper,
  spicesCardamom,
  spicesCoriander,
  spicesCumin,
  spicesDetail,
  spicesFenugreek,
  spicesGinger,
  spicesRedChilli,
  spicesTurmeric,
  watermarkFallback,
  wheatDetail,
  wheatDurum,
  wheatSemolina,
  wheatWhole,
} from "../lib/imageRegistry";

const PRODUCT_CATEGORIES = [
  {
    slug: "rice",
    name: "Rice",
    description:
      "Premium quality rice varieties sourced directly from farmers across India.",
    imageUrl: riceDetail,
    variants: [
      { name: "Basmati Rice", imageUrl: riceBasmati },
      { name: "Sona Masoori", imageUrl: riceSonaMasoori },
      { name: "IR64 Rice", imageUrl: riceIr64 },
      { name: "Brown Rice", imageUrl: riceBrown },
      { name: "Broken Rice", imageUrl: riceBroken },
    ],
  },
  {
    slug: "wheat",
    name: "Wheat",
    description:
      "Premium wheat varieties from the fertile plains of India for milling and food processing.",
    imageUrl: wheatDetail,
    variants: [
      { name: "Durum Wheat", imageUrl: wheatDurum },
      { name: "Whole Wheat", imageUrl: wheatWhole },
      { name: "Semolina (Suji)", imageUrl: wheatSemolina },
    ],
  },
  {
    slug: "pulses",
    name: "Pulses",
    description:
      "High-protein pulses and lentils rich in nutrients, perfect for domestic and export markets.",
    imageUrl: pulsesDetail,
    variants: [
      { name: "Chana Dal", imageUrl: pulsesChana },
      { name: "Moong Dal", imageUrl: pulsesMoong },
      { name: "Masoor Dal", imageUrl: pulsesMasoor },
      { name: "Urad Dal", imageUrl: pulsesUrad },
      { name: "Toor Dal", imageUrl: pulsesToor },
      { name: "Rajma", imageUrl: pulsesRajma },
      { name: "Kabuli Chana", imageUrl: pulsesKabuli },
    ],
  },
  {
    slug: "spices",
    name: "Spices",
    description:
      "Aromatic spices from the finest growing regions of India in whole and ground forms.",
    imageUrl: spicesDetail,
    variants: [
      { name: "Turmeric Powder", imageUrl: spicesTurmeric },
      { name: "Red Chilli Powder", imageUrl: spicesRedChilli },
      { name: "Coriander Powder", imageUrl: spicesCoriander },
      { name: "Cumin Seeds", imageUrl: spicesCumin },
      { name: "Black Pepper", imageUrl: spicesBlackPepper },
      { name: "Cardamom", imageUrl: spicesCardamom },
      { name: "Ginger Powder", imageUrl: spicesGinger },
      { name: "Fenugreek Seeds", imageUrl: spicesFenugreek },
    ],
  },
  {
    slug: "processed-food-products",
    name: "Processed Food Products",
    description:
      "Value-added processed food products made from premium quality grains and pulses.",
    imageUrl: processedDetail,
    variants: [
      { name: "Rice Flour", imageUrl: processedRiceFlour },
      { name: "Wheat Flour (Atta)", imageUrl: processedWheatFlour },
      { name: "Besan (Gram Flour)", imageUrl: processedBesan },
      { name: "Poha (Flattened Rice)", imageUrl: processedPoha },
      { name: "Roasted Chana", imageUrl: processedRoastedChana },
      { name: "Vermicelli", imageUrl: processedVermicelli },
    ],
  },
  {
    slug: "makhana",
    name: "Makhana (Fox Nuts)",
    description:
      "Premium Makhana sourced from Bihar, India — rich in nutrients and perfect for snacking and export.",
    imageUrl: makhanaDetail,
    variants: [
      { name: "Regular Makhana", imageUrl: makhana },
      { name: "Premium Makhana", imageUrl: makhana },
      { name: "Roasted Makhana", imageUrl: makhanaRoasted },
      { name: "Flavored Makhana", imageUrl: makhanaFlavored },
      { name: "Makhana Powder", imageUrl: makhanaPowder },
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
                    (e.target as HTMLImageElement).src = watermarkFallback;
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
