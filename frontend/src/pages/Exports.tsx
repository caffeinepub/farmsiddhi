import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Package, Truck, Globe, FileCheck } from 'lucide-react';

export default function Exports() {
  const services = [
    {
      icon: ShieldCheck,
      title: 'Quality Assurance',
      description:
        'Comprehensive quality control processes ensuring all products meet international food safety standards. Our certified laboratories conduct rigorous testing for contaminants, pesticides, and quality parameters. Every shipment is accompanied by detailed quality certificates and compliance documentation.',
    },
    {
      icon: Package,
      title: 'Packaging Standards',
      description:
        'Export-grade packaging solutions designed to preserve product quality during international transit. We utilize food-safe materials, proper labeling in multiple languages, and packaging that meets destination country requirements. Our packaging ensures product integrity from origin to final destination.',
    },
    {
      icon: Truck,
      title: 'Logistics Management',
      description:
        'End-to-end logistics coordination including warehousing, transportation, and customs clearance. Our experienced logistics team manages the entire supply chain, ensuring timely delivery and proper handling. We work with trusted shipping partners to provide reliable and cost-effective solutions.',
    },
    {
      icon: Globe,
      title: 'Global Trade Support',
      description:
        'Expert guidance on international trade regulations, documentation, and market entry strategies. We assist with export licenses, certificates of origin, phytosanitary certificates, and other required documentation. Our team stays updated on changing regulations across different markets.',
    },
    {
      icon: FileCheck,
      title: 'Compliance Ready Operations',
      description:
        'Full compliance with international food safety standards including HACCP, ISO, and destination-specific requirements. Our facilities are certified and regularly audited to maintain the highest standards. We ensure complete traceability and documentation for every shipment.',
    },
  ];

  return (
    <div>
      {/* Header Section */}
      <section className="bg-muted/30 py-16">
        <div className="section-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Export Services</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive export solutions ensuring quality, compliance, and reliable delivery to
            global markets
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="border-border hover:shadow-soft transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <service.icon className="h-7 w-7 text-secondary" />
                </div>
                <CardTitle className="text-2xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Certifications Section */}
      <section className="bg-muted/30 section-padding">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              International Certifications & Standards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-lg border border-border text-center">
                <h3 className="font-semibold text-foreground mb-2 text-lg">HACCP Certified</h3>
                <p className="text-sm text-muted-foreground">
                  Hazard Analysis and Critical Control Points compliance
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border text-center">
                <h3 className="font-semibold text-foreground mb-2 text-lg">ISO Certified</h3>
                <p className="text-sm text-muted-foreground">
                  International quality management standards
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border text-center">
                <h3 className="font-semibold text-foreground mb-2 text-lg">Export Ready</h3>
                <p className="text-sm text-muted-foreground">
                  Full compliance with global trade regulations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Markets Section */}
      <section className="section-container section-padding">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
            Global Market Reach
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-8 leading-relaxed">
            FarmSiddhi exports premium Indian agricultural products to markets across the globe. Our
            established relationships with international buyers and deep understanding of regional
            requirements enable smooth market entry and sustained business growth.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Middle East', 'Europe', 'North America', 'Southeast Asia', 'Africa', 'Australia', 'East Asia', 'South America'].map(
              (region, index) => (
                <div
                  key={index}
                  className="bg-primary/5 p-4 rounded-lg border border-primary/20 text-center"
                >
                  <p className="font-medium text-foreground">{region}</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 section-padding">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Export with FarmSiddhi?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Partner with us for reliable, compliant, and efficient export solutions. Our team is
              ready to help you access global markets with confidence.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
