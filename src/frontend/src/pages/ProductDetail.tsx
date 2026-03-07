import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Minus, Package, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { useActor } from "../hooks/useActor";
import { useGetProductByCategory } from "../hooks/useQueries";
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
  wheatDetail,
  wheatDurum,
  wheatSemolina,
  wheatWhole,
} from "../lib/imageRegistry";

// Fallback data for when backend doesn't have seeded data yet
const FALLBACK_DATA: Record<
  string,
  {
    productName: string;
    category: string;
    description: string;
    price: number;
    imageUrl: string;
    variants: Array<{ name: string; imageUrl: string }>;
    specifications: Array<{ key: string; value: string }>;
    nutritionData: {
      calories: number;
      protein: number;
      carbohydrates: number;
      fat: number;
      fiber: number;
      iron: number;
      zinc: number;
      vitamins: string;
      minerals: string;
    };
  }
> = {
  rice: {
    productName: "Premium Rice",
    category: "Rice",
    description:
      "High-quality rice sourced directly from farmers across India. Available in multiple varieties to suit every culinary need.",
    price: 4500,
    imageUrl: riceDetail,
    variants: [
      { name: "Basmati Rice", imageUrl: riceBasmati },
      { name: "Sona Masoori", imageUrl: riceSonaMasoori },
      { name: "IR64 Rice", imageUrl: riceIr64 },
      { name: "Brown Rice", imageUrl: riceBrown },
      { name: "Broken Rice", imageUrl: riceBroken },
    ],
    specifications: [
      { key: "Moisture Content", value: "≤14%" },
      { key: "Broken Grains", value: "≤5%" },
      { key: "Foreign Matter", value: "≤0.1%" },
      { key: "Packaging", value: "25kg, 50kg bags" },
      { key: "Origin", value: "India" },
    ],
    nutritionData: {
      calories: 130,
      protein: 2.7,
      carbohydrates: 28.2,
      fat: 0.3,
      fiber: 0.4,
      iron: 0.2,
      zinc: 0.5,
      vitamins: "B1, B3, B6",
      minerals: "Magnesium, Phosphorus",
    },
  },
  wheat: {
    productName: "Premium Wheat",
    category: "Wheat",
    description:
      "Premium quality wheat sourced from the fertile plains of India. Ideal for flour milling, bread making, and various food processing applications.",
    price: 2800,
    imageUrl: wheatDetail,
    variants: [
      { name: "Durum Wheat", imageUrl: wheatDurum },
      { name: "Whole Wheat", imageUrl: wheatWhole },
      { name: "Semolina (Suji)", imageUrl: wheatSemolina },
    ],
    specifications: [
      { key: "Moisture Content", value: "≤12%" },
      { key: "Protein Content", value: "11-13%" },
      { key: "Test Weight", value: "76-80 kg/hl" },
      { key: "Packaging", value: "25kg, 50kg bags" },
      { key: "Origin", value: "India" },
    ],
    nutritionData: {
      calories: 340,
      protein: 13.2,
      carbohydrates: 72.0,
      fat: 2.5,
      fiber: 10.7,
      iron: 3.6,
      zinc: 2.8,
      vitamins: "B1, B2, B3, E",
      minerals: "Iron, Zinc, Magnesium",
    },
  },
  pulses: {
    productName: "Premium Pulses",
    category: "Pulses",
    description:
      "High-protein pulses and lentils sourced from across India. Rich in nutrients and perfect for domestic consumption and export markets.",
    price: 6500,
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
    specifications: [
      { key: "Moisture Content", value: "≤12%" },
      { key: "Admixture", value: "≤1%" },
      { key: "Protein Content", value: "20-25%" },
      { key: "Packaging", value: "25kg, 50kg bags" },
      { key: "Origin", value: "India" },
    ],
    nutritionData: {
      calories: 350,
      protein: 24.0,
      carbohydrates: 60.0,
      fat: 1.2,
      fiber: 15.0,
      iron: 6.5,
      zinc: 3.2,
      vitamins: "B1, B6, Folate",
      minerals: "Iron, Potassium, Magnesium",
    },
  },
  spices: {
    productName: "Premium Spices",
    category: "Spices",
    description:
      "Aromatic and flavorful spices sourced from the finest growing regions of India. Available in whole and ground forms for culinary and industrial use.",
    price: 12000,
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
    specifications: [
      { key: "Moisture Content", value: "≤10%" },
      { key: "Ash Content", value: "≤7%" },
      { key: "Volatile Oil", value: "≥2%" },
      { key: "Packaging", value: "1kg, 5kg, 25kg bags" },
      { key: "Origin", value: "India" },
    ],
    nutritionData: {
      calories: 354,
      protein: 12.7,
      carbohydrates: 65.0,
      fat: 9.9,
      fiber: 21.1,
      iron: 55.0,
      zinc: 4.4,
      vitamins: "C, B6, K",
      minerals: "Iron, Manganese, Potassium",
    },
  },
  "processed-food-products": {
    productName: "Processed Food Products",
    category: "Processed Food Products",
    description:
      "Value-added processed food products made from premium quality grains and pulses. Ideal for retail, food service, and export markets.",
    price: 5500,
    imageUrl: processedDetail,
    variants: [
      { name: "Rice Flour", imageUrl: processedRiceFlour },
      { name: "Wheat Flour (Atta)", imageUrl: processedWheatFlour },
      { name: "Besan (Gram Flour)", imageUrl: processedBesan },
      { name: "Poha (Flattened Rice)", imageUrl: processedPoha },
      { name: "Roasted Chana", imageUrl: processedRoastedChana },
      { name: "Vermicelli", imageUrl: processedVermicelli },
    ],
    specifications: [
      { key: "Moisture Content", value: "≤12%" },
      { key: "Ash Content", value: "≤1.5%" },
      { key: "Protein Content", value: "8-12%" },
      { key: "Packaging", value: "1kg, 5kg, 25kg bags" },
      { key: "Origin", value: "India" },
    ],
    nutritionData: {
      calories: 360,
      protein: 10.0,
      carbohydrates: 75.0,
      fat: 1.5,
      fiber: 3.0,
      iron: 2.5,
      zinc: 1.8,
      vitamins: "B1, B2, B3",
      minerals: "Iron, Calcium, Phosphorus",
    },
  },
  makhana: {
    productName: "Premium Makhana",
    category: "Makhana",
    description:
      "Premium quality Makhana (Fox Nuts) sourced from Bihar, India. Rich in nutrients and perfect for snacking, cooking, and export markets.",
    price: 18000,
    imageUrl: makhanaDetail,
    variants: [
      { name: "Regular Makhana", imageUrl: makhana },
      { name: "Premium Makhana", imageUrl: makhana },
      { name: "Roasted Makhana", imageUrl: makhanaRoasted },
      { name: "Flavored Makhana", imageUrl: makhanaFlavored },
      { name: "Makhana Powder", imageUrl: makhanaPowder },
    ],
    specifications: [
      { key: "Moisture Content", value: "≤12%" },
      { key: "Size", value: "4-6 Suta (Grade A)" },
      { key: "Purity", value: "≥98%" },
      { key: "Packaging", value: "5kg, 10kg, 25kg bags" },
      { key: "Origin", value: "Bihar, India" },
    ],
    nutritionData: {
      calories: 347,
      protein: 9.7,
      carbohydrates: 76.9,
      fat: 0.1,
      fiber: 14.5,
      iron: 1.4,
      zinc: 0.5,
      vitamins: "B1, B2",
      minerals: "Calcium, Magnesium, Potassium",
    },
  },
};

export default function ProductDetail() {
  const { productId } = useParams({ from: "/products/$productId" });
  const { actor, isFetching: actorLoading } = useActor();
  const { data: product, isLoading: queryLoading } =
    useGetProductByCategory(productId);
  const { addToCart } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  // Always use fallback data — it's comprehensive and guaranteed to have all categories
  const fallback = FALLBACK_DATA[productId];
  const fallbackProduct = fallback
    ? {
        productId: BigInt(0),
        productName: fallback.productName,
        category: fallback.category,
        description: fallback.description,
        price: BigInt(fallback.price),
        imageUrl: fallback.imageUrl,
        variants: fallback.variants,
        specifications: fallback.specifications,
        nutritionData: fallback.nutritionData,
      }
    : null;

  // Use backend data only if it has actual content (non-null with a productId),
  // otherwise always use the built-in fallback — this guarantees categories
  // never show "Product Not Found" just because the backend hasn't been seeded.
  const isLoading = actorLoading || (!actor ? false : queryLoading);
  const backendHasData =
    product !== undefined &&
    product !== null &&
    product.productId !== undefined;
  const displayProduct = backendHasData ? product : fallbackProduct;

  const variants = displayProduct?.variants || [];
  const currentVariant =
    selectedVariant || (variants.length > 0 ? variants[0].name : "");
  const currentVariantData =
    variants.find((v) => v.name === currentVariant) || variants[0];

  const handleAddToCart = () => {
    if (!displayProduct) return;
    if (!currentVariant) {
      toast.error("Please select a variant");
      return;
    }
    addToCart({
      productId: Number(displayProduct.productId),
      productName: displayProduct.productName,
      variantName: currentVariant,
      quantity,
      unitPrice: Number(displayProduct.price),
    });
    toast.success(
      `${displayProduct.productName} (${currentVariant}) added to cart!`,
    );
  };

  if (isLoading && !fallbackProduct) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        data-ocid="product.loading_state"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="h-96 w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!displayProduct) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center"
        data-ocid="product.error_state"
      >
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Product Not Found
        </h2>
        <p className="text-muted-foreground mb-6">
          The product category "{productId}" could not be found. Please browse
          our available products.
        </p>
        <Link to="/products">
          <Button variant="default" data-ocid="product.primary_button">
            Browse All Products
          </Button>
        </Link>
      </div>
    );
  }

  const priceNum = Number(displayProduct.price);
  const nutrition = displayProduct.nutritionData;

  return (
    <div className="bg-background min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              to="/products"
              className="hover:text-primary transition-colors"
            >
              Products
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">
              {displayProduct.productName}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Button */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden bg-muted aspect-[4/3]">
              <img
                src={currentVariantData?.imageUrl || displayProduct.imageUrl}
                alt={currentVariant || displayProduct.productName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = displayProduct.imageUrl;
                }}
              />
            </div>
            {/* Variant Image Grid */}
            {variants.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {variants.slice(0, 8).map((variant) => (
                  <button
                    type="button"
                    key={variant.name}
                    onClick={() => setSelectedVariant(variant.name)}
                    className={`rounded-lg overflow-hidden border-2 transition-all aspect-square ${
                      currentVariant === variant.name
                        ? "border-primary shadow-md"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={variant.imageUrl}
                      alt={variant.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          displayProduct.imageUrl;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {displayProduct.category}
              </Badge>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {displayProduct.productName}
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                {displayProduct.description}
              </p>
            </div>

            <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
              <p className="text-sm text-muted-foreground">
                Starting Price (per quintal)
              </p>
              <p className="text-3xl font-bold text-primary">
                ₹{priceNum.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                *Prices may vary based on quantity and variant
              </p>
            </div>

            {/* Variant Selector */}
            {variants.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Select Variety
                </p>
                <Select
                  value={currentVariant}
                  onValueChange={setSelectedVariant}
                >
                  <SelectTrigger className="w-full" data-ocid="product.select">
                    <SelectValue placeholder="Choose a variety" />
                  </SelectTrigger>
                  <SelectContent>
                    {variants.map((variant) => (
                      <SelectItem key={variant.name} value={variant.name}>
                        {variant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Quantity (Quintals)
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  data-ocid="product.secondary_button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-10 w-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-xl font-semibold w-12 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  data-ocid="product.primary_button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="h-10 w-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Total Price */}
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Estimated Total
                </span>
                <span className="text-lg font-bold text-foreground">
                  ₹{(priceNum * quantity).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="w-full gap-2"
              data-ocid="product.submit_button"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Product Variants Grid */}
        {variants.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Available Varieties
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {variants.map((variant) => (
                <button
                  type="button"
                  key={variant.name}
                  onClick={() => setSelectedVariant(variant.name)}
                  className={`group rounded-xl overflow-hidden border-2 transition-all text-left ${
                    currentVariant === variant.name
                      ? "border-primary shadow-lg"
                      : "border-border hover:border-primary/50 hover:shadow-md"
                  }`}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={variant.imageUrl}
                      alt={variant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          displayProduct.imageUrl;
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-foreground leading-tight">
                      {variant.name}
                    </p>
                    {currentVariant === variant.name && (
                      <p className="text-xs text-primary mt-1">Selected</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Specifications */}
        {displayProduct.specifications &&
          displayProduct.specifications.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Specifications
              </h2>
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {displayProduct.specifications.map((spec, index) => (
                      <tr
                        key={spec.key}
                        className={
                          index % 2 === 0 ? "bg-muted/30" : "bg-background"
                        }
                      >
                        <td className="px-6 py-4 text-sm font-medium text-foreground w-1/3">
                          {spec.key}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

        {/* Nutritional Information */}
        {nutrition && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Nutritional Information
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Per 100g serving
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[
                { label: "Calories", value: `${nutrition.calories} kcal` },
                { label: "Protein", value: `${nutrition.protein}g` },
                {
                  label: "Carbohydrates",
                  value: `${nutrition.carbohydrates}g`,
                },
                { label: "Fat", value: `${nutrition.fat}g` },
                { label: "Fiber", value: `${nutrition.fiber}g` },
                { label: "Iron", value: `${nutrition.iron}mg` },
                { label: "Zinc", value: `${nutrition.zinc}mg` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-card rounded-xl border border-border p-4 text-center"
                >
                  <p className="text-2xl font-bold text-primary">
                    {item.value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
            {(nutrition.vitamins || nutrition.minerals) && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {nutrition.vitamins && (
                  <div className="bg-card rounded-xl border border-border p-4">
                    <p className="text-sm font-medium text-foreground mb-1">
                      Vitamins
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {nutrition.vitamins}
                    </p>
                  </div>
                )}
                {nutrition.minerals && (
                  <div className="bg-card rounded-xl border border-border p-4">
                    <p className="text-sm font-medium text-foreground mb-1">
                      Minerals
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {nutrition.minerals}
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
