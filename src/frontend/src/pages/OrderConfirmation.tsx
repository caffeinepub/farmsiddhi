import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

interface StoredOrderItem {
  productId: string;
  productName: string;
  variantName: string;
  quantity: string;
  unitPrice: string;
}

interface StoredOrder {
  orderId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: StoredOrderItem[];
  totalAmount: string;
  status: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function getStatusLabel(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function OrderConfirmation() {
  const { orderId } = useParams({ from: "/order-confirmation/$orderId" });
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("lastOrder");
      if (stored) {
        const parsed = JSON.parse(stored) as StoredOrder;
        if (parsed.orderId === orderId) {
          setOrder(parsed);
        }
      }
    } catch {
      // ignore parse errors
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Order Not Found
        </h2>
        <p className="text-muted-foreground mb-6">
          We couldn't find order #{orderId}. It may have expired from session
          storage.
        </p>
        <Link to="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  // Handle both string enum ("pending") and Motoko variant object ({ pending: null })
  // forms of status that may come through JSON serialization
  const statusKey: string = (() => {
    const s = order.status as unknown;
    if (typeof s === "string") {
      // Could be "pending" or JSON-stringified object like '{"pending":null}'
      if (s.startsWith("{")) {
        try {
          const parsed = JSON.parse(s) as Record<string, unknown>;
          return Object.keys(parsed)[0] ?? "pending";
        } catch {
          return s;
        }
      }
      return s;
    }
    if (typeof s === "object" && s !== null) {
      return Object.keys(s as Record<string, unknown>)[0] ?? "pending";
    }
    return "pending";
  })();

  const totalAmount = Number(order.totalAmount);
  const orderDate = new Date(Number(order.createdAt) / 1_000_000);

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Thank You Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Thank You for Your Order!
          </h1>
          <p className="text-muted-foreground text-lg">
            Your order has been placed successfully. Our team will contact you
            shortly.
          </p>
        </div>

        {/* Order ID & Status */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="text-xl font-bold text-foreground">
                #{order.orderId}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[statusKey] || "bg-gray-100 text-gray-800"}`}
              >
                {getStatusLabel(statusKey)}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium text-foreground">
                {Number.isNaN(orderDate.getTime())
                  ? "N/A"
                  : orderDate.toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Buyer Info */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Buyer Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground">{order.buyerName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground">{order.buyerEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground">{order.buyerPhone}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Shipping Address
            </h2>
            <div className="text-sm text-foreground space-y-1">
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </p>
              <p>{order.shippingAddress.pincode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Order Items
          </h2>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div
                key={`${item.productName}-${item.variantName}-${index}`}
                className="flex justify-between items-center py-2"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {item.productName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.variantName} × {item.quantity} quintal(s)
                  </p>
                </div>
                <p className="font-semibold text-foreground">
                  ₹
                  {(
                    Number(item.unitPrice) * Number(item.quantity)
                  ).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-foreground">
              Total Amount
            </span>
            <span className="text-2xl font-bold text-primary">
              ₹{totalAmount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-primary/5 rounded-xl border border-primary/20 p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            What Happens Next?
          </h2>
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>
              Our team will review your order and contact you within 24 hours.
            </li>
            <li>
              You'll receive a confirmation call to verify order details and
              pricing.
            </li>
            <li>
              Payment terms and logistics will be discussed during the call.
            </li>
            <li>
              Your order will be processed and dispatched as per agreed
              timelines.
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/products">
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              data-ocid="order.secondary_button"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button
              size="lg"
              className="gap-2"
              data-ocid="order.primary_button"
            >
              Contact Our Team
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
