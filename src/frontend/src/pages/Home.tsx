import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, CheckCircle, Factory, Box, Truck } from 'lucide-react';

export default function Home() {
  const services = [
    {
      icon: Package,
      title: 'Aggregation',
      description: 'Consolidating produce from multiple farmers to meet bulk demand requirements.',
    },
    {
      icon: CheckCircle,
      title: 'Quality Control',
      description: 'Rigorous quality checks ensuring international standards and compliance.',
    },
    {
      icon: Factory,
      title: 'Processing',
      description: 'State-of-the-art processing facilities for value-added products.',
    },
    {
      icon: Box,
      title: 'Packaging',
      description: 'Export-grade packaging solutions meeting global market requirements.',
    },
    {
      icon: Truck,
      title: 'Logistics',
      description: 'End-to-end logistics management for domestic and international distribution.',
    },
  ];

  const products = [
    { name: 'Rice', icon: '/assets/generated/icon-rice.dim_128x128.png', link: '/products/rice' },
    { name: 'Wheat', icon: '/assets/generated/icon-wheat.dim_128x128.png', link: '/products/wheat' },
    { name: 'Pulses', icon: '/assets/generated/icon-pulses.dim_128x128.png', link: '/products/pulses' },
    { name: 'Spices', icon: '/assets/generated/icon-spices.dim_128x128.png', link: '/products/spices' },
    { name: 'Processed Foods', icon: '/assets/generated/icon-processed.dim_128x128.png', link: '/products/processed-foods' },
    { name: 'Makhana', icon: '/assets/generated/makhana-home.dim_800x600.png', link: '/products/makhana' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x800.png)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/70" />
        <div className="relative section-container py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Empowering Farmers.
              <br />
              <span className="text-primary">Enabling Global Markets.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              FarmSiddhi is a digital farm-to-market platform connecting farmers directly with bulk
              buyers, retailers, and international importers through transparent aggregation, quality
              assurance, and comprehensive supply chain management.
            </p>
            <Link to="/contact">
              <Button size="lg" className="text-base px-8">
                Partner With Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="section-container section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Bridging the Gap Between Farm and Market
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            FarmSiddhi operates as a comprehensive digital platform that transforms traditional
            agricultural supply chains. We aggregate produce from farmers, perform rigorous quality
            checks, manage processing and packaging, and coordinate logistics for both domestic and
            global distribution. Our mission is to create a transparent ecosystem where farmers
            receive fair pricing and international buyers access premium Indian agricultural products.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-muted/30 section-padding">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive supply chain solutions from farm to global market
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="border-border hover:shadow-soft transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="section-container section-padding">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Product Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Premium agricultural products sourced directly from Indian farmers
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {products.map((product, index) => (
            <Link key={index} to={product.link}>
              <Card className="border-border hover:shadow-soft transition-shadow text-center cursor-pointer h-full">
                <CardContent className="pt-6 pb-6">
                  <img
                    src={product.icon}
                    alt={product.name}
                    className="w-20 h-20 mx-auto mb-4 object-contain"
                  />
                  <h3 className="font-semibold text-foreground">{product.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Supply Chain Model */}
      <section className="bg-muted/30 section-padding">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Farm to Export Supply Chain Model
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A transparent, efficient pathway from Indian farms to global markets
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <img
              src="/assets/generated/supply-chain-diagram.dim_800x400.png"
              alt="Supply Chain Model"
              className="w-full h-auto rounded-lg shadow-medium"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-container section-padding">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Partner With Us?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Whether you're a farmer looking for fair pricing, a buyer seeking quality produce, or a
            distributor expanding your network, FarmSiddhi is your trusted partner.
          </p>
          <Link to="/contact">
            <Button size="lg" variant="secondary" className="text-base px-8">
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
