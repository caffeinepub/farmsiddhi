import React from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { CheckCircle, Package, MapPin, User, Mail, Phone, ArrowRight, Home } from 'lucide-react';
import type { Order, OrderStatus } from '../backend';

function getStatusColor(status: OrderStatus | string): string {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'processing': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
    case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-muted text-muted-foreground border-border';
  }
}

function getStatusLabel(status: OrderStatus | string): string {
  if (typeof status === 'string') {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
  return String(status);
}

function parseOrderFromStorage(raw: string): Order | null {
  try {
    const parsed = JSON.parse(raw);
    // Convert string bigints back
    return {
      ...parsed,
      orderId: BigInt(parsed.orderId),
      totalAmount: BigInt(parsed.totalAmount),
      createdAt: BigInt(parsed.createdAt),
      items: parsed.items.map((item: any) => ({
        ...item,
        productId: BigInt(item.productId),
        quantity: BigInt(item.quantity),
        unitPrice: BigInt(item.unitPrice),
      })),
    } as Order;
  } catch {
    return null;
  }
}

export default function OrderConfirmation() {
  const { orderId } = useParams({ from: '/order-confirmation/$orderId' });

  // Try to load from sessionStorage first
  const storedRaw = sessionStorage.getItem('lastOrder');
  const storedOrder = storedRaw ? parseOrderFromStorage(storedRaw) : null;

  // Use stored order if orderId matches
  const order: Order | null =
    storedOrder && storedOrder.orderId.toString() === orderId ? storedOrder : null;

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find the order details. The session may have expired.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const statusStr = typeof order.status === 'object'
    ? Object.keys(order.status as object)[0]
    : String(order.status);

  const createdDate = new Date(Number(order.createdAt) / 1_000_000).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Placed Successfully!</h1>
          <p className="text-muted-foreground text-lg">
            Thank you for your order. We'll get in touch with you shortly.
          </p>
        </div>

        {/* Order ID & Status */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="text-xl font-bold text-foreground">#{order.orderId.toString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(statusStr)}`}>
                {getStatusLabel(statusStr)}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">Placed on {createdDate}</p>
        </div>

        {/* Buyer Info */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Buyer Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium text-foreground">{order.buyerName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium text-foreground break-all">{order.buyerEmail}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="font-medium text-foreground">{order.buyerPhone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Shipping Address
          </h2>
          <div className="text-foreground">
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Order Items</h2>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-start py-3 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-foreground">{item.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.variantName} × {Number(item.quantity)}
                  </p>
                  <p className="text-sm text-muted-foreground">₹{Number(item.unitPrice)} per unit</p>
                </div>
                <p className="font-bold text-foreground">
                  ₹{Number(item.quantity) * Number(item.unitPrice)}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4 mt-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-foreground text-lg">Total Amount</span>
              <span className="text-2xl font-bold text-primary">₹{Number(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-foreground mb-3">What's Next?</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              Our team will review your order and confirm it within 24 hours.
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              You'll receive an email confirmation at {order.buyerEmail}.
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              For bulk orders, our sales team may contact you for further details.
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go to Home
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-6 py-3 rounded-lg font-medium hover:bg-muted transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
