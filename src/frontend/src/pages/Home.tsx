import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  Box,
  CheckCircle,
  Factory,
  Package,
  ShoppingCart,
  TrendingUp,
  Truck,
} from "lucide-react";
import {
  iconMakhana,
  iconProcessed,
  iconPulses,
  iconRice,
  iconSpices,
  iconWheat,
  mandiBanner,
  supplyChain,
  watermarkFallback,
} from "../lib/imageRegistry";

export default function Home() {
  const services = [
    {
      icon: Package,
      title: "Aggregation",
      description:
        "Consolidating produce from multiple farmers to meet bulk demand requirements.",
    },
    {
      icon: CheckCircle,
      title: "Quality Control",
      description:
        "Rigorous quality checks ensuring international standards and compliance.",
    },
    {
      icon: Factory,
      title: "Processing",
      description:
        "State-of-the-art processing facilities for value-added products.",
    },
    {
      icon: Box,
      title: "Packaging",
      description:
        "Export-grade packaging solutions meeting global market requirements.",
    },
    {
      icon: Truck,
      title: "Logistics",
      description:
        "End-to-end logistics management for domestic and international distribution.",
    },
  ];

  const products = [
    {
      name: "Rice",
      icon: iconRice,
      link: "/products/rice",
    },
    {
      name: "Wheat",
      icon: iconWheat,
      link: "/products/wheat",
    },
    {
      name: "Pulses",
      icon: iconPulses,
      link: "/products/pulses",
    },
    {
      name: "Spices",
      icon: iconSpices,
      link: "/products/spices",
    },
    {
      name: "Processed Foods",
      icon: iconProcessed,
      link: "/products/processed-food-products",
    },
    {
      name: "Makhana",
      icon: iconMakhana,
      link: "/products/makhana",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-cover bg-center hero-bg-image">
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/70" />
        <div className="relative section-container py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Empowering Farmers.
              <br />
              <span className="text-primary">Enabling Global Markets.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              FarmSiddhi is a digital farm-to-market platform connecting farmers
              directly with bulk buyers, retailers, and international importers
              through transparent aggregation, quality assurance, and
              comprehensive supply chain management.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg" className="text-base px-8 gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Shop Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="text-base px-8">
                  Partner With Us
                </Button>
              </Link>
            </div>
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
            FarmSiddhi operates as a comprehensive digital platform that
            transforms traditional agricultural supply chains. We aggregate
            produce from farmers, perform rigorous quality checks, manage
            processing and packaging, and coordinate logistics for both domestic
            and global distribution. Our mission is to create a transparent
            ecosystem where farmers receive fair pricing and international
            buyers access premium Indian agricultural products.
          </p>
        </div>
      </section>

      {/* Live Mandi Prices CTA */}
      <section className="section-container pb-0">
        <div className="rounded-xl overflow-hidden border border-border shadow-soft">
          <div className="relative">
            <img
              src={mandiBanner}
              alt="Live Mandi Prices"
              className="w-full h-40 md:h-52 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.opacity = "0";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-transparent flex items-center">
              <div className="px-6 md:px-10 py-6 max-w-xl">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                    New Feature
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Live Mandi Prices
                </h2>
                <p className="text-muted-foreground text-sm md:text-base mb-4">
                  Track live commodity prices from major Indian mandis — Rice,
                  Wheat, Pulses, Spices, Makhana and more.
                </p>
                <Link to="/mandi-tracking">
                  <Button className="gap-2">
                    <TrendingUp className="h-4 w-4" />
                    View Mandi Prices
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-muted/30 section-padding mt-12">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive supply chain solutions from farm to global market
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card
                key={service.title}
                className="border-border hover:shadow-soft transition-shadow"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
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
          {products.map((product) => (
            <Link key={product.name} to={product.link}>
              <Card className="border-border hover:shadow-soft transition-shadow text-center cursor-pointer h-full">
                <CardContent className="pt-6 pb-6">
                  <img
                    src={product.icon}
                    alt={product.name}
                    className="w-20 h-20 mx-auto mb-4 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.opacity = "0.3";
                    }}
                  />
                  <h3 className="font-semibold text-foreground">
                    {product.name}
                  </h3>
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
              A transparent, efficient pathway from Indian farms to global
              markets
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <img
              src={supplyChain}
              alt="Supply Chain Model"
              className="w-full h-auto rounded-lg shadow-medium"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
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
            Whether you're a farmer looking for fair pricing, a buyer seeking
            quality produce, or a distributor expanding your network, FarmSiddhi
            is your trusted partner.
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
