import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Award,
  DollarSign,
  Handshake,
  Network,
  Smartphone,
} from "lucide-react";

export default function FarmerNetwork() {
  const services = [
    {
      icon: Handshake,
      title: "Direct Procurement",
      description:
        "We establish direct relationships with farmers, eliminating intermediaries and ensuring transparent transactions. Our procurement team works closely with farming communities to understand their needs and provide consistent demand for their produce.",
    },
    {
      icon: DollarSign,
      title: "Fair Pricing",
      description:
        "Farmers receive competitive market rates based on real-time demand and quality assessments. Our transparent pricing model ensures farmers get fair value for their hard work, with timely payments and no hidden deductions.",
    },
    {
      icon: Network,
      title: "Aggregation Platform",
      description:
        "Our digital platform aggregates produce from multiple farmers to meet bulk order requirements. This enables small and medium farmers to access larger markets and fulfill international orders that would be impossible individually.",
    },
    {
      icon: Award,
      title: "Quality Standardization",
      description:
        "We provide training and support to help farmers meet international quality standards. Our quality control experts work with farmers to implement best practices in cultivation, harvesting, and post-harvest handling.",
    },
    {
      icon: Smartphone,
      title: "Supply Chain Digitization",
      description:
        "Farmers gain access to our digital platform for real-time market information, order tracking, and payment status. Our technology simplifies the supply chain process and provides farmers with greater visibility and control.",
    },
  ];

  return (
    <div>
      {/* Header Section */}
      <section className="bg-muted/30 py-16">
        <div className="section-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Farmer Network
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Empowering farmers through direct market access, fair pricing, and
            digital enablement
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <Card
              key={service.title}
              className="border-border hover:shadow-soft transition-shadow"
            >
              <CardHeader>
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <service.icon className="h-7 w-7 text-primary" />
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

      {/* Benefits Section */}
      <section className="bg-muted/30 section-padding">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              Benefits for Farmers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-3 text-lg">
                  Market Access
                </h3>
                <p className="text-muted-foreground">
                  Connect with bulk buyers, retailers, and international
                  importers without intermediaries
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-3 text-lg">
                  Better Returns
                </h3>
                <p className="text-muted-foreground">
                  Receive fair market prices with transparent pricing and timely
                  payments
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-3 text-lg">
                  Quality Support
                </h3>
                <p className="text-muted-foreground">
                  Access training and resources to meet international quality
                  standards
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-3 text-lg">
                  Digital Tools
                </h3>
                <p className="text-muted-foreground">
                  Use our platform for market insights, order management, and
                  payment tracking
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-container section-padding">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Join Our Farmer Network
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Become part of a growing community of farmers accessing global
            markets and receiving fair value for their produce. Contact us to
            learn more about partnership opportunities.
          </p>
        </div>
      </section>
    </div>
  );
}
