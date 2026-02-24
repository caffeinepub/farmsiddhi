import React, { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { useGetProductsByCategory } from '../hooks/useQueries';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { Loader2, ShoppingCart, Plus, Minus, ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categoryImageMap: Record<string, string> = {
  rice: '/assets/generated/rice-detail.dim_800x600.png',
  wheat: '/assets/generated/wheat-detail.dim_800x600.png',
  pulses: '/assets/generated/pulses-detail.dim_800x600.png',
  spices: '/assets/generated/spices-detail.dim_800x600.png',
  'processed-food-products': '/assets/generated/processed-detail.dim_800x600.png',
  makhana: '/assets/generated/makhana-detail.dim_800x600.png',
};

const categoryDisplayNames: Record<string, string> = {
  rice: 'Rice',
  wheat: 'Wheat',
  pulses: 'Pulses',
  spices: 'Spices',
  'processed-food-products': 'Processed Food Products',
  makhana: 'Makhana',
};

export default function ProductDetail() {
  const { category } = useParams({ from: '/products/$category' });
  const { data: products, isLoading, isError } = useGetProductsByCategory(category);
  const { addToCart } = useCart();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = products && products.length > 0 ? products[0] : null;
  const categoryImage = categoryImageMap[category] || '/assets/generated/rice-detail.dim_800x600.png';
  const categoryName = categoryDisplayNames[category] || category;

  const handleAddToCart = () => {
    if (!product) return;
    const variant = product.variants[selectedVariantIndex];
    addToCart({
      productId: Number(product.productId),
      productName: product.productName,
      variantName: variant ? variant.name : '',
      quantity,
      unitPrice: Number(product.price),
    });
    toast.success(`${product.productName} added to cart!`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Product not found</h2>
        <p className="text-gray-500 mb-6">We couldn't find details for this product category.</p>
        <Link to="/products">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  const selectedVariant = product.variants[selectedVariantIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{categoryName}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden bg-gray-50 aspect-[4/3]">
            <img
              src={categoryImage}
              alt={product.productName}
              className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).src = '/assets/generated/rice-detail.dim_800x600.png'; }}
            />
          </div>

          {/* Variant Gallery */}
          {product.variants.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {product.variants.map((variant, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`rounded-xl overflow-hidden border-2 transition-all ${
                    selectedVariantIndex === idx ? 'border-primary shadow-md' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={variant.imageUrl}
                    alt={variant.name}
                    className="w-20 h-16 object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = categoryImage; }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
              {categoryName}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.productName}</h1>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">₹{Number(product.price).toLocaleString('en-IN')}</span>
            <span className="text-gray-500 text-sm">per unit</span>
          </div>

          {/* Variant Selector */}
          {product.variants.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Variant</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      selectedVariantIndex === idx
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
              {selectedVariant && (
                <p className="text-sm text-gray-500 mt-2">Selected: <span className="font-medium text-gray-700">{selectedVariant.name}</span></p>
              )}
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-bold text-gray-900 text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <Button
            onClick={handleAddToCart}
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 text-base"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Specifications */}
      {product.specifications.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Specifications</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full">
              <tbody>
                {product.specifications.map((spec, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-3 text-sm font-semibold text-gray-700 w-1/3">{spec.key}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Nutritional Information */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Nutritional Information</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-primary/5">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nutrient</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Calories', value: `${product.nutritionData.calories} kcal` },
                { label: 'Protein', value: `${product.nutritionData.protein}g` },
                { label: 'Carbohydrates', value: `${product.nutritionData.carbohydrates}g` },
                { label: 'Fat', value: `${product.nutritionData.fat}g` },
                { label: 'Fiber', value: `${product.nutritionData.fiber}g` },
                { label: 'Vitamins', value: product.nutritionData.vitamins },
                { label: 'Minerals', value: product.nutritionData.minerals },
              ].map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-6 py-3 text-sm font-semibold text-gray-700">{row.label}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
