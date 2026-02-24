import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetProductsByCategory } from '@/hooks/useQueries';
import { useEffect } from 'react';

export default function ProductDetail() {
  const { productId } = useParams({ strict: false });
  const { data: products, isLoading, error, isError, isSuccess } = useGetProductsByCategory(productId || '');

  // Debug logging
  useEffect(() => {
    console.log('ProductDetail Debug Info:');
    console.log('- productId from URL:', productId);
    console.log('- Query Status:', { isLoading, isError, isSuccess });
    console.log('- Products data:', products);
    console.log('- Error:', error);
    
    if (products && products.length === 0) {
      console.warn('No products found for category:', productId);
    }
  }, [productId, products, isLoading, isError, isSuccess, error]);

  if (isLoading) {
    return (
      <div className="section-container section-padding">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !products || products.length === 0) {
    return (
      <div className="section-container section-padding">
        <div className="text-center py-16">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">
            {!productId 
              ? 'No product category specified in the URL.'
              : isError 
              ? 'There was an error loading the product. Please try again.'
              : `No products found for category "${productId}". The product may not have been added to the backend yet.`
            }
          </p>
          <Link to="/products">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Display the first product from the category
  const product = products[0];

  return (
    <div>
      {/* Header Section */}
      <section className="bg-muted/30 py-12">
        <div className="section-container">
          <Link to="/products">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </section>

      {/* Product Details */}
      <section className="section-container section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card className="border-border overflow-hidden">
              <CardContent className="p-0">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.productName}
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center">
                    <Package className="h-24 w-24 text-muted-foreground" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">{product.productName}</CardTitle>
                    <p className="text-lg text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Price</p>
                    <p className="text-3xl font-bold text-primary">₹{Number(product.price).toLocaleString('en-IN')}</p>
                    <p className="text-xs text-muted-foreground mt-1">per unit</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </div>

                {/* Product Variants */}
                {product.variants && product.variants.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Product Variants</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {product.variants.map((variant, index) => (
                        <Card key={index} className="border-border overflow-hidden hover:shadow-md transition-shadow">
                          <CardContent className="p-0">
                            {variant.imageUrl ? (
                              <img
                                src={variant.imageUrl}
                                alt={variant.name}
                                className="w-full h-48 object-cover"
                              />
                            ) : (
                              <div className="w-full h-48 bg-muted flex items-center justify-center">
                                <Package className="h-12 w-12 text-muted-foreground" />
                              </div>
                            )}
                            <div className="p-4">
                              <h4 className="font-semibold text-foreground text-center">{variant.name}</h4>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specifications */}
                {product.specifications && product.specifications.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Specifications</h3>
                    <div className="border border-border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-1/3 font-semibold">Specification</TableHead>
                            <TableHead className="font-semibold">Details</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {product.specifications.map((spec, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{spec.key}</TableCell>
                              <TableCell className="text-muted-foreground">{spec.value}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {/* Nutritional Information */}
                {product.nutritionData && (
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Nutritional Information</h3>
                    <div className="border border-border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-1/2 font-semibold">Nutrient</TableHead>
                            <TableHead className="font-semibold">Per 100g</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {product.nutritionData.calories > 0 && (
                            <TableRow>
                              <TableCell className="font-medium">Calories</TableCell>
                              <TableCell className="text-muted-foreground">{product.nutritionData.calories} kcal</TableCell>
                            </TableRow>
                          )}
                          {product.nutritionData.protein > 0 && (
                            <TableRow>
                              <TableCell className="font-medium">Protein</TableCell>
                              <TableCell className="text-muted-foreground">{product.nutritionData.protein} g</TableCell>
                            </TableRow>
                          )}
                          {product.nutritionData.carbohydrates > 0 && (
                            <TableRow>
                              <TableCell className="font-medium">Carbohydrates</TableCell>
                              <TableCell className="text-muted-foreground">{product.nutritionData.carbohydrates} g</TableCell>
                            </TableRow>
                          )}
                          {product.nutritionData.fat > 0 && (
                            <TableRow>
                              <TableCell className="font-medium">Fat</TableCell>
                              <TableCell className="text-muted-foreground">{product.nutritionData.fat} g</TableCell>
                            </TableRow>
                          )}
                          {product.nutritionData.fiber > 0 && (
                            <TableRow>
                              <TableCell className="font-medium">Fiber</TableCell>
                              <TableCell className="text-muted-foreground">{product.nutritionData.fiber} g</TableCell>
                            </TableRow>
                          )}
                          {product.nutritionData.vitamins && product.nutritionData.vitamins.trim() !== '' && (
                            <TableRow>
                              <TableCell className="font-medium">Vitamins</TableCell>
                              <TableCell className="text-muted-foreground">{product.nutritionData.vitamins}</TableCell>
                            </TableRow>
                          )}
                          {product.nutritionData.minerals && product.nutritionData.minerals.trim() !== '' && (
                            <TableRow>
                              <TableCell className="font-medium">Minerals</TableCell>
                              <TableCell className="text-muted-foreground">{product.nutritionData.minerals}</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {/* Call to Action */}
                <div className="bg-muted/30 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Interested in this product?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Contact us for bulk orders, custom specifications, or export inquiries.
                  </p>
                  <Link to="/contact">
                    <Button size="lg">Get in Touch</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
