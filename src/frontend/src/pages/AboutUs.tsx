import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Lightbulb, Building2 } from 'lucide-react';

export default function AboutUs() {
  return (
    <div>
      {/* Header Section */}
      <section className="bg-muted/30 py-16">
        <div className="section-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">About FarmSiddhi</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Transforming agricultural supply chains through digital innovation and transparent
            partnerships
          </p>
        </div>
      </section>

      {/* Vision, Mission, Business Model */}
      <section className="section-container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Vision */}
          <Card className="border-border hover:shadow-soft transition-shadow">
            <CardHeader>
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-2xl">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Building a transparent farm-to-global-market ecosystem that empowers farmers with
                fair pricing, connects buyers with quality produce, and establishes India as a
                trusted source for premium agricultural products worldwide.
              </p>
            </CardContent>
          </Card>

          {/* Mission */}
          <Card className="border-border hover:shadow-soft transition-shadow">
            <CardHeader>
              <div className="w-14 h-14 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <Lightbulb className="h-7 w-7 text-secondary" />
              </div>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Enable farmers to access fair pricing and global demand by eliminating intermediaries,
                ensuring quality standards, and providing comprehensive supply chain support from
                aggregation to international distribution.
              </p>
            </CardContent>
          </Card>

          {/* Business Model */}
          <Card className="border-border hover:shadow-soft transition-shadow">
            <CardHeader>
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Building2 className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-2xl">Business Model</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Digital aggregation and supply chain enablement platform that connects farmers
                directly with bulk buyers and international importers, managing quality control,
                processing, packaging, and logistics for seamless farm-to-market operations.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Additional Content */}
      <section className="bg-muted/30 section-padding">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              Why Choose FarmSiddhi
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p className="text-lg">
                FarmSiddhi represents a new paradigm in agricultural commerce. We leverage digital
                technology to create direct connections between farmers and markets, eliminating
                inefficiencies and ensuring fair value distribution across the supply chain.
              </p>
              <p className="text-lg">
                Our platform provides farmers with access to larger markets and better pricing, while
                offering buyers and international importers reliable access to high-quality Indian
                agricultural products. Through rigorous quality control, professional packaging, and
                efficient logistics, we ensure that every transaction meets international standards.
              </p>
              <p className="text-lg">
                With FarmSiddhi, stakeholders across the agricultural value chain benefit from
                transparency, efficiency, and trust. We are committed to building long-term
                partnerships that drive sustainable growth for farmers, buyers, and the broader
                agricultural ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
