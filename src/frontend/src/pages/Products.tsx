import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@tanstack/react-router';

export default function Products() {
  const products = [
    {
      id: 'Rice',
      name: 'Rice',
      icon: '/assets/generated/icon-rice.dim_128x128.png',
      image: '/assets/generated/rice.dim_400x300.png',
      description:
        'Premium basmati and non-basmati rice varieties sourced from leading agricultural regions. Export-grade quality with international certifications.',
      varieties: ['Basmati Rice', 'Non-Basmati Rice', 'Organic Rice', 'Parboiled Rice'],
    },
    {
      id: 'Wheat',
      name: 'Wheat',
      icon: '/assets/generated/icon-wheat.dim_128x128.png',
      image: '/assets/generated/wheat.dim_400x300.png',
      description:
        'High-quality wheat grains and flour products meeting global food safety standards. Suitable for diverse culinary and industrial applications.',
      varieties: ['Durum Wheat', 'Whole Wheat', 'Wheat Flour', 'Semolina'],
    },
    {
      id: 'Pulses',
      name: 'Pulses',
      icon: '/assets/generated/icon-pulses.dim_128x128.png',
      image: '/assets/generated/pulses.dim_400x300.png',
      description:
        'Diverse range of pulses including lentils, chickpeas, and beans. Rich in protein and essential nutrients, processed to international standards.',
      varieties: ['Chickpeas', 'Lentils', 'Black Gram', 'Green Gram', 'Kidney Beans'],
    },
    {
      id: 'Spices',
      name: 'Spices',
      icon: '/assets/generated/icon-spices.dim_128x128.png',
      image: '/assets/generated/spices.dim_400x300.png',
      description:
        'Authentic Indian spices with rich aroma and flavor. Carefully processed and packaged to preserve quality and meet export requirements.',
      varieties: ['Turmeric', 'Cumin', 'Coriander', 'Black Pepper', 'Cardamom', 'Chili'],
    },
    {
      id: 'Processed Food Products',
      name: 'Processed Food Products',
      icon: '/assets/generated/icon-processed.dim_128x128.png',
      image: '/assets/generated/processed-foods.dim_400x300.png',
      description:
        'Value-added processed food products including ready-to-eat meals, snacks, and packaged foods. Manufactured in certified facilities with strict quality control.',
      varieties: ['Ready-to-Eat Meals', 'Snacks', 'Pickles', 'Sauces', 'Instant Mixes'],
    },
    {
      id: 'Makhana',
      name: 'Makhana (Fox Nuts)',
      icon: '/assets/generated/icon-processed.dim_128x128.png',
      image: '/assets/generated/makhana.dim_400x300.png',
      description:
        'Premium quality makhana (fox nuts) sourced from the finest farms. A nutritious superfood rich in protein, fiber, and antioxidants, perfect for healthy snacking and export markets.',
      varieties: ['Premium Grade', 'Standard Grade', 'Roasted Makhana', 'Flavored Varieties'],
    },
  ];

  return (
    <div>
      {/* Header Section */}
      <section className="bg-muted/30 py-16">
        <div className="section-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Products</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Premium agricultural products and processed foods meeting international quality standards
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <Link
              key={index}
              to={`/products/${product.id}`}
              className="block group"
            >
              <Card className="border-border hover:shadow-soft transition-all cursor-pointer h-full hover:border-primary/30">
                <CardHeader>
                  <div className="mb-4 overflow-hidden rounded-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex items-start gap-4">
                    <img
                      src={product.icon}
                      alt={`${product.name} icon`}
                      className="w-12 h-12 object-contain flex-shrink-0"
                    />
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="text-base">{product.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Available Varieties:</h4>
                    <ul className="space-y-1">
                      {product.varieties.map((variety, vIndex) => (
                        <li key={vIndex} className="text-sm text-muted-foreground flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>
                          {variety}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
