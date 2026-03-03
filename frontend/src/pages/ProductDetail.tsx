import React, { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { ShoppingCart, Plus, Minus, ArrowLeft, Package, Leaf, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useGetProductByCategory } from '../hooks/useQueries';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Map variant names to their image files
const VARIANT_IMAGE_MAP: Record<string, string> = {
  // Rice variants
  'Basmati Rice': '/assets/generated/rice-basmati.dim_400x300.png',
  'Sona Masoori': '/assets/generated/rice-sona-masoori.dim_400x300.png',
  'IR64 Rice': '/assets/generated/rice-ir64.dim_400x300.png',
  'Brown Rice': '/assets/generated/rice-brown.dim_400x300.png',
  'Broken Rice': '/assets/generated/rice-broken.dim_400x300.png',
  // Wheat variants
  'Durum Wheat': '/assets/generated/wheat-durum.dim_400x300.png',
  'Whole Wheat': '/assets/generated/wheat-whole.dim_400x300.png',
  'Semolina (Suji)': '/assets/generated/wheat-semolina.dim_400x300.png',
  'Semolina': '/assets/generated/wheat-semolina.dim_400x300.png',
  // Pulses variants
  'Chana Dal': '/assets/generated/pulses-chana-dal.dim_400x300.png',
  'Moong Dal': '/assets/generated/pulses-moong-dal.dim_400x300.png',
  'Masoor Dal': '/assets/generated/pulses-masoor-dal.dim_400x300.png',
  'Urad Dal': '/assets/generated/pulses-urad-dal.dim_400x300.png',
  'Toor Dal': '/assets/generated/pulses-toor-dal.dim_400x300.png',
  'Rajma': '/assets/generated/pulses-rajma.dim_400x300.png',
  'Kabuli Chana': '/assets/generated/pulses-kabuli-chana.dim_400x300.png',
  // Spices variants
  'Turmeric Powder': '/assets/generated/spices-turmeric.dim_400x400.png',
  'Red Chilli Powder': '/assets/generated/spices-red-chilli.dim_400x400.png',
  'Coriander Powder': '/assets/generated/spices-coriander.dim_400x400.png',
  'Cumin Seeds': '/assets/generated/spices.dim_400x300.png',
  'Black Pepper': '/assets/generated/spices.dim_400x300.png',
  'Cardamom': '/assets/generated/spices.dim_400x300.png',
  'Ginger Powder': '/assets/generated/spices.dim_400x300.png',
  'Fenugreek Seeds': '/assets/generated/spices.dim_400x300.png',
  // Processed food variants
  'Rice Flour': '/assets/generated/processed-foods.dim_400x300.png',
  'Wheat Flour (Atta)': '/assets/generated/processed-foods.dim_400x300.png',
  'Besan (Gram Flour)': '/assets/generated/processed-foods.dim_400x300.png',
  'Poha (Flattened Rice)': '/assets/generated/processed-foods.dim_400x300.png',
  'Roasted Chana': '/assets/generated/processed-foods.dim_400x300.png',
  'Vermicelli': '/assets/generated/processed-foods.dim_400x300.png',
  // Makhana variants
  'Fox Nut Regular': '/assets/generated/makhana.dim_400x300.png',
  'Fox Nut Premium': '/assets/generated/makhana.dim_400x300.png',
  'Roasted Makhana': '/assets/generated/makhana-roasted.dim_400x300.png',
  'Makhana Powder': '/assets/generated/makhana.dim_400x300.png',
  // Legacy/fallback
  'Variant A': '/assets/generated/rice.dim_400x300.png',
  'Variant B': '/assets/generated/rice.dim_400x300.png',
  'Soft Wheat': '/assets/generated/wheat.dim_400x300.png',
  'Hard Wheat': '/assets/generated/wheat.dim_400x300.png',
  'Red Lentils': '/assets/generated/pulses.dim_400x300.png',
  'Chickpeas': '/assets/generated/pulses.dim_400x300.png',
  'Whole Spices': '/assets/generated/spices.dim_400x300.png',
  'Ground Spices': '/assets/generated/spices.dim_400x300.png',
  'Classic': '/assets/generated/makhana.dim_400x300.png',
  'Masala': '/assets/generated/makhana-flavored.dim_400x300.png',
};

// Category-level fallback images
const CATEGORY_IMAGE_MAP: Record<string, string> = {
  rice: '/assets/generated/rice-detail.dim_800x600.png',
  wheat: '/assets/generated/wheat-detail.dim_800x600.png',
  pulses: '/assets/generated/pulses-detail.dim_800x600.png',
  spices: '/assets/generated/spices-detail.dim_800x600.png',
  'processed-food-products': '/assets/generated/processed-detail.dim_800x600.png',
  makhana: '/assets/generated/makhana-detail.dim_800x600.png',
};

// Hardcoded variant data for each category (used when backend has old/incomplete data)
const CATEGORY_VARIANTS: Record<string, Array<{ name: string; imageUrl: string }>> = {
  rice: [
    { name: 'Basmati Rice', imageUrl: 'rice-basmati.png' },
    { name: 'Sona Masoori', imageUrl: 'rice-sona-masoori.png' },
    { name: 'IR64 Rice', imageUrl: 'rice-ir64.png' },
    { name: 'Brown Rice', imageUrl: 'rice-brown.png' },
    { name: 'Broken Rice', imageUrl: 'rice-broken.png' },
  ],
  wheat: [
    { name: 'Durum Wheat', imageUrl: 'wheat-durum.png' },
    { name: 'Whole Wheat', imageUrl: 'wheat-whole.png' },
    { name: 'Semolina (Suji)', imageUrl: 'wheat-semolina.png' },
  ],
  pulses: [
    { name: 'Chana Dal', imageUrl: 'pulses-chana-dal.png' },
    { name: 'Moong Dal', imageUrl: 'pulses-moong-dal.png' },
    { name: 'Masoor Dal', imageUrl: 'pulses-masoor-dal.png' },
    { name: 'Urad Dal', imageUrl: 'pulses-urad-dal.png' },
    { name: 'Toor Dal', imageUrl: 'pulses-toor-dal.png' },
    { name: 'Rajma', imageUrl: 'pulses-rajma.png' },
    { name: 'Kabuli Chana', imageUrl: 'pulses-kabuli-chana.png' },
  ],
  spices: [
    { name: 'Turmeric Powder', imageUrl: 'spices-turmeric.png' },
    { name: 'Red Chilli Powder', imageUrl: 'spices-red-chilli.png' },
    { name: 'Coriander Powder', imageUrl: 'spices-coriander.png' },
    { name: 'Cumin Seeds', imageUrl: 'spices-cumin.png' },
    { name: 'Black Pepper', imageUrl: 'spices-black-pepper.png' },
    { name: 'Cardamom', imageUrl: 'spices-cardamom.png' },
    { name: 'Ginger Powder', imageUrl: 'spices-ginger-powder.png' },
    { name: 'Fenugreek Seeds', imageUrl: 'spices-fenugreek.png' },
  ],
  'processed-food-products': [
    { name: 'Rice Flour', imageUrl: 'processed-rice-flour.png' },
    { name: 'Wheat Flour (Atta)', imageUrl: 'processed-wheat-flour.png' },
    { name: 'Besan (Gram Flour)', imageUrl: 'processed-besan.png' },
    { name: 'Poha (Flattened Rice)', imageUrl: 'processed-poha.png' },
    { name: 'Roasted Chana', imageUrl: 'processed-roasted-chana.png' },
    { name: 'Vermicelli', imageUrl: 'processed-vermicelli.png' },
  ],
  makhana: [
    { name: 'Fox Nut Regular', imageUrl: 'makhana-regular.png' },
    { name: 'Fox Nut Premium', imageUrl: 'makhana-premium.png' },
    { name: 'Roasted Makhana', imageUrl: 'makhana-roasted.png' },
    { name: 'Makhana Powder', imageUrl: 'makhana-powder.png' },
  ],
};

// Hardcoded nutritional data for each category (fallback)
const CATEGORY_NUTRITION: Record<string, {
  calories: number; protein: number; carbohydrates: number; fat: number;
  fiber: number; iron: number; zinc: number; vitamins: string; minerals: string;
}> = {
  rice: {
    calories: 130, protein: 2.7, carbohydrates: 28.2, fat: 0.3,
    fiber: 0.4, iron: 0.2, zinc: 0.5,
    vitamins: 'Thiamine (B1), Niacin (B3)',
    minerals: 'Iron, Zinc, Magnesium',
  },
  wheat: {
    calories: 340, protein: 13.2, carbohydrates: 72.0, fat: 2.5,
    fiber: 10.7, iron: 3.6, zinc: 2.8,
    vitamins: 'Vitamin B1, B2, B3, B6, Folate',
    minerals: 'Calcium, Magnesium, Potassium, Phosphorus',
  },
  pulses: {
    calories: 116, protein: 9.0, carbohydrates: 20.1, fat: 0.4,
    fiber: 7.9, iron: 3.3, zinc: 1.3,
    vitamins: 'Folate, Vitamin B1, B6',
    minerals: 'Iron, Potassium, Magnesium, Phosphorus',
  },
  spices: {
    calories: 354, protein: 12.7, carbohydrates: 65.0, fat: 4.4,
    fiber: 21.1, iron: 29.6, zinc: 4.7,
    vitamins: 'Vitamin C, Vitamin A, Vitamin K',
    minerals: 'Iron, Calcium, Manganese, Potassium',
  },
  'processed-food-products': {
    calories: 364, protein: 10.3, carbohydrates: 76.3, fat: 1.0,
    fiber: 2.7, iron: 1.2, zinc: 0.8,
    vitamins: 'Vitamin B1, B2, B3',
    minerals: 'Iron, Calcium, Potassium',
  },
  makhana: {
    calories: 347, protein: 9.7, carbohydrates: 76.9, fat: 0.1,
    fiber: 14.5, iron: 1.4, zinc: 0.5,
    vitamins: 'Vitamin B1, B2, Vitamin E',
    minerals: 'Calcium, Magnesium, Potassium, Phosphorus',
  },
};

function getVariantImage(variantName: string, category: string): string {
  if (VARIANT_IMAGE_MAP[variantName]) {
    return VARIANT_IMAGE_MAP[variantName];
  }
  // Try to construct from category
  return CATEGORY_IMAGE_MAP[category] || '/assets/generated/rice.dim_400x300.png';
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="h-96 w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { category } = useParams({ from: '/products/$category' });
  const { data: product, isLoading, isNotFound } = useGetProductByCategory(category);
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>('');

  // Determine effective variants: use backend data if it has real variants, else use hardcoded
  const backendVariants = product?.variants ?? [];
  const hasRealVariants = backendVariants.length > 0 &&
    !['Variant A', 'Variant B', 'Soft Wheat', 'Hard Wheat', 'Red Lentils', 'Chickpeas',
      'Whole Spices', 'Ground Spices', 'Classic', 'Masala'].includes(backendVariants[0]?.name ?? '');

  const effectiveVariants = hasRealVariants
    ? backendVariants
    : (CATEGORY_VARIANTS[category] ?? backendVariants);

  // Determine effective nutrition
  const backendNutrition = product?.nutritionData;
  const effectiveNutrition = backendNutrition ?? CATEGORY_NUTRITION[category];

  // Set default variant when variants load
  React.useEffect(() => {
    if (effectiveVariants.length > 0 && !selectedVariant) {
      setSelectedVariant(effectiveVariants[0].name);
    }
  }, [effectiveVariants, selectedVariant]);

  const categoryLabel = category
    ? category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : '';

  const handleAddToCart = () => {
    if (!product) return;
    if (effectiveVariants.length > 0 && !selectedVariant) {
      toast.error('Please select a variant');
      return;
    }
    addToCart({
      productId: product.productId,
      productName: product.productName,
      variantName: selectedVariant || 'Standard',
      quantity,
      unitPrice: product.price,
    });
    toast.success(`${product.productName} added to cart!`);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isNotFound || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Package className="h-16 w-16 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Product Not Found</h2>
          <p className="text-muted-foreground">
            The product you're looking for doesn't exist or hasn't been added yet.
          </p>
          <Button asChild variant="outline">
            <a href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </a>
          </Button>
        </div>
      </div>
    );
  }

  const heroImage = CATEGORY_IMAGE_MAP[category] || '/assets/generated/rice-detail.dim_800x600.png';

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <span>/</span>
            <a href="/products" className="hover:text-primary transition-colors">Products</a>
            <span>/</span>
            <span className="text-foreground font-medium">{categoryLabel}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Product Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-border">
              <img
                src={heroImage}
                alt={product.productName}
                className="w-full h-80 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/generated/rice.dim_400x300.png';
                }}
              />
            </div>
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
              {categoryLabel}
            </Badge>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.productName}</h1>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-primary">
                  ₹{Number(product.price)}<span className="text-base font-normal text-muted-foreground">/kg</span>
                </span>
                <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                  <Leaf className="h-3 w-3 mr-1" />
                  Farm Fresh
                </Badge>
              </div>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <Separator />

            {/* Variant Selector */}
            {effectiveVariants.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Select Variety</label>
                <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a variety..." />
                  </SelectTrigger>
                  <SelectContent>
                    {effectiveVariants.map((variant) => (
                      <SelectItem key={variant.name} value={variant.name}>
                        {variant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Quantity (kg)</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-muted-foreground text-sm ml-2">
                  Total: ₹{Number(product.price) * quantity}
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>

            {/* Quick specs */}
            {product.specifications.length > 0 && (
              <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  Key Specifications
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.specifications.slice(0, 4).map((spec) => (
                    <div key={spec.key} className="text-xs">
                      <span className="text-muted-foreground">{spec.key}: </span>
                      <span className="font-medium text-foreground">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Available Varieties Grid */}
        {effectiveVariants.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Available Varieties</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {effectiveVariants.map((variant) => {
                const imgSrc = getVariantImage(variant.name, category);
                const isSelected = selectedVariant === variant.name;
                return (
                  <button
                    key={variant.name}
                    onClick={() => setSelectedVariant(variant.name)}
                    className={`group rounded-xl overflow-hidden border-2 transition-all duration-200 text-left ${
                      isSelected
                        ? 'border-primary shadow-md scale-105'
                        : 'border-border hover:border-primary/50 hover:shadow-sm'
                    }`}
                  >
                    <div className="aspect-square overflow-hidden bg-muted">
                      <img
                        src={imgSrc}
                        alt={variant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = CATEGORY_IMAGE_MAP[category] || '/assets/generated/rice.dim_400x300.png';
                        }}
                      />
                    </div>
                    <div className={`p-2 ${isSelected ? 'bg-primary/10' : 'bg-card'}`}>
                      <p className={`text-xs font-medium text-center leading-tight ${
                        isSelected ? 'text-primary' : 'text-foreground'
                      }`}>
                        {variant.name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Nutritional Information */}
        {effectiveNutrition && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Nutritional Information</h2>
            <p className="text-sm text-muted-foreground mb-4">Per 100g serving</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {[
                { label: 'Calories', value: `${effectiveNutrition.calories}`, unit: 'kcal', color: 'bg-orange-50 border-orange-200 text-orange-700' },
                { label: 'Protein', value: `${effectiveNutrition.protein}g`, unit: '', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                { label: 'Carbohydrates', value: `${effectiveNutrition.carbohydrates}g`, unit: '', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
                { label: 'Fat', value: `${effectiveNutrition.fat}g`, unit: '', color: 'bg-red-50 border-red-200 text-red-700' },
                { label: 'Fiber', value: `${effectiveNutrition.fiber}g`, unit: '', color: 'bg-green-50 border-green-200 text-green-700' },
                { label: 'Iron', value: `${effectiveNutrition.iron}mg`, unit: '', color: 'bg-purple-50 border-purple-200 text-purple-700' },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-xl border-2 p-4 text-center ${item.color}`}
                >
                  <div className="text-2xl font-bold">{item.value}</div>
                  <div className="text-xs font-medium mt-1 opacity-80">{item.label}</div>
                  {item.unit && <div className="text-xs opacity-60">{item.unit}</div>}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-xl p-4 border border-border">
                <h4 className="text-sm font-semibold text-foreground mb-2">Vitamins</h4>
                <p className="text-sm text-muted-foreground">{effectiveNutrition.vitamins}</p>
              </div>
              <div className="bg-muted/30 rounded-xl p-4 border border-border">
                <h4 className="text-sm font-semibold text-foreground mb-2">Minerals</h4>
                <p className="text-sm text-muted-foreground">{effectiveNutrition.minerals}</p>
              </div>
            </div>
          </section>
        )}

        {/* Full Specifications */}
        {product.specifications.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Product Specifications</h2>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <tbody>
                  {product.specifications.map((spec, index) => (
                    <tr
                      key={spec.key}
                      className={index % 2 === 0 ? 'bg-muted/20' : 'bg-card'}
                    >
                      <td className="px-6 py-3 text-sm font-semibold text-foreground w-1/3 border-r border-border">
                        {spec.key}
                      </td>
                      <td className="px-6 py-3 text-sm text-muted-foreground">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">Need Bulk Orders?</h3>
          <p className="text-muted-foreground mb-4">
            Contact us for wholesale pricing and custom packaging options.
          </p>
          <Button asChild variant="outline">
            <a href="/contact-us">Get in Touch</a>
          </Button>
        </section>
      </div>
    </div>
  );
}
