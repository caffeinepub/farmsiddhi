import React, { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, ShoppingCart, Plus, Minus, Star, Package, Leaf } from 'lucide-react';
import { useGetProductsByCategory } from '../hooks/useQueries';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { category } = useParams({ from: '/products/$category' });
  const { data: products, isLoading, error } = useGetProductsByCategory(category);
  const { addToCart } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Derive product - only after loading is complete
  const product = products && products.length > 0 ? products[0] : null;

  // Set default variant when product loads
  React.useEffect(() => {
    if (product && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0].name);
    }
  }, [product, selectedVariant]);

  const handleAddToCart = () => {
    if (!product) return;
    const variantName = selectedVariant || (product.variants.length > 0 ? product.variants[0].name : 'Standard');
    addToCart({
      productId: product.productId,
      productName: product.productName,
      variantName,
      quantity,
      unitPrice: product.price,
    });
    toast.success(`${product.productName} added to cart!`);
  };

  const getProductImage = (cat: string) => {
    const imageMap: Record<string, string> = {
      rice: '/assets/generated/rice-detail.dim_800x600.png',
      wheat: '/assets/generated/wheat-detail.dim_800x600.png',
      pulses: '/assets/generated/pulses-detail.dim_800x600.png',
      spices: '/assets/generated/spices-detail.dim_800x600.png',
      'processed-food-products': '/assets/generated/processed-detail.dim_800x600.png',
      makhana: '/assets/generated/makhana-detail.dim_800x600.png',
    };
    return imageMap[cat] || '/assets/generated/rice-detail.dim_800x600.png';
  };

  const getVariantImage = (variantName: string, cat: string) => {
    const variantImageMap: Record<string, string> = {
      'Long Grain': '/assets/generated/basmati-premium.dim_400x300.png',
      'Short Grain': '/assets/generated/basmati-regular.dim_400x300.png',
      'Whole Grain': '/assets/generated/wheat-whole.dim_400x300.png',
      'Cracked Wheat': '/assets/generated/wheat-detail.dim_800x600.png',
      'Red Lentils': '/assets/generated/moong-red.dim_400x300.png',
      'Chickpeas': '/assets/generated/moong-yellow.dim_400x300.png',
      'Turmeric': '/assets/generated/turmeric-powder.dim_400x300.png',
      'Cumin': '/assets/generated/chili-powder.dim_400x300.png',
      'Pasta': '/assets/generated/processed-detail.dim_800x600.png',
      'Noodles': '/assets/generated/processed-foods.dim_400x300.png',
      'Peri Peri': '/assets/generated/makhana-flavored.dim_400x300.png',
      'Cheese': '/assets/generated/makhana-roasted.dim_400x300.png',
    };
    return variantImageMap[variantName] || getProductImage(cat);
  };

  // Loading state
  if (isLoading || products === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-32 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="h-96 bg-muted rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-10 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="h-24 bg-muted rounded"></div>
                <div className="h-12 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error or not found state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product category "{category}" could not be found. Products may not be seeded yet — please visit the Admin page to seed the product catalog.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-lg font-medium hover:bg-muted transition-colors"
            >
              Admin Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isWheat = category === 'wheat';

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-lg bg-muted aspect-[4/3]">
              <img
                src={getProductImage(category)}
                alt={product.productName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full mb-3 capitalize">
                {category.replace(/-/g, ' ')}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                {product.productName}
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">
                ₹{Number(product.price)}
              </span>
              <span className="text-muted-foreground text-sm">per unit</span>
            </div>

            {/* Variant Selector */}
            {product.variants.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">Select Variant</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.name}
                      onClick={() => setSelectedVariant(variant.name)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all ${
                        selectedVariant === variant.name
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border text-foreground hover:border-primary hover:text-primary'
                      }`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg w-full md:w-auto"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                Premium Quality
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Leaf className="w-4 h-4 text-green-600" />
                Farm Fresh
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="w-4 h-4 text-primary" />
                Bulk Orders Available
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Table */}
        {product.specifications.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Product Specifications</h2>
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
              <table className="w-full">
                <tbody>
                  {product.specifications.map((spec, index) => (
                    <tr
                      key={spec.key}
                      className={index % 2 === 0 ? 'bg-muted/30' : 'bg-card'}
                    >
                      <td className="px-6 py-4 font-semibold text-foreground w-1/3 border-r border-border">
                        {spec.key}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Nutritional Information */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Nutritional Information</h2>
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <p className="text-sm text-muted-foreground mb-4">Per 100g serving</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { label: 'Calories', value: `${product.nutritionData.calories} kcal` },
                { label: 'Protein', value: `${product.nutritionData.protein}g` },
                { label: 'Carbohydrates', value: `${product.nutritionData.carbohydrates}g` },
                { label: 'Fat', value: `${product.nutritionData.fat}g` },
                { label: 'Fiber', value: `${product.nutritionData.fiber}g` },
                { label: 'Iron', value: `${product.nutritionData.iron}mg` },
                { label: 'Zinc', value: `${product.nutritionData.zinc}mg` },
                { label: 'Vitamins', value: product.nutritionData.vitamins },
                { label: 'Minerals', value: product.nutritionData.minerals },
              ].map((item) => (
                <div key={item.label} className="bg-muted/40 rounded-lg p-3 text-center">
                  <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
                  <div className="font-semibold text-foreground text-sm">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Variants Display */}
        {product.variants.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Available Variants</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {product.variants.map((variant) => (
                <div
                  key={variant.name}
                  className={`bg-card border-2 rounded-xl overflow-hidden shadow-sm cursor-pointer transition-all hover:shadow-md ${
                    selectedVariant === variant.name
                      ? 'border-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedVariant(variant.name)}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={getVariantImage(variant.name, category)}
                      alt={variant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground">{variant.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">₹{Number(product.price)} per unit</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wheat-specific: Available Varieties */}
        {isWheat && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Available Varieties</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Durum Wheat',
                  image: '/assets/generated/wheat-durum.dim_400x400.png',
                  nutrition: { calories: 339, protein: 13.7, carbs: 71.1, fat: 2.5, fiber: 10.7 },
                },
                {
                  name: 'Whole Wheat',
                  image: '/assets/generated/wheat-whole.dim_400x400.png',
                  nutrition: { calories: 340, protein: 13.2, carbs: 72.6, fat: 2.5, fiber: 12.2 },
                },
                {
                  name: 'Semolina',
                  image: '/assets/generated/wheat-semolina.dim_400x400.png',
                  nutrition: { calories: 360, protein: 12.7, carbs: 72.8, fat: 1.1, fiber: 3.9 },
                },
              ].map((variety) => (
                <div key={variety.name} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={variety.image}
                      alt={variety.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-foreground text-lg mb-3">{variety.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">Per 100g</p>
                    <div className="space-y-2">
                      {[
                        { label: 'Calories', value: `${variety.nutrition.calories} kcal` },
                        { label: 'Protein', value: `${variety.nutrition.protein}g` },
                        { label: 'Carbs', value: `${variety.nutrition.carbs}g` },
                        { label: 'Fat', value: `${variety.nutrition.fat}g` },
                        { label: 'Fiber', value: `${variety.nutrition.fiber}g` },
                      ].map((n) => (
                        <div key={n.label} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{n.label}</span>
                          <span className="font-medium text-foreground">{n.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
