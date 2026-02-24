import React from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { CheckCircle, Package, ArrowRight, Loader2 } from 'lucide-react';
import { useGetOrderById } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { OrderStatus } from '../backend';

const statusLabels: Record<string, string> = {
  [OrderStatus.pending]: 'Pending',
  [OrderStatus.confirmed]: 'Confirmed',
  [OrderStatus.processing]: 'Processing',
  [OrderStatus.shipped]: 'Shipped',
  [OrderStatus.delivered]: 'Delivered',
  [OrderStatus.cancelled]: 'Cancelled',
};

const statusColors: Record<string, string> = {
  [OrderStatus.pending]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.confirmed]: 'bg-blue-100 text-blue-800',
  [OrderStatus.processing]: 'bg-purple-100 text-purple-800',
  [OrderStatus.shipped]: 'bg-indigo-100 text-indigo-800',
  [OrderStatus.delivered]: 'bg-green-100 text-green-800',
  [OrderStatus.cancelled]: 'bg-red-100 text-red-800',
};

export default function OrderConfirmation() {
  const { orderId } = useParams({ from: '/order-confirmation/$orderId' });
  const { data: order, isLoading, isError } = useGetOrderById(orderId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Order not found</h2>
        <p className="text-gray-500 mb-6">We couldn't find the order details. Please contact support.</p>
        <Link to="/contact">
          <Button variant="outline">Contact Support</Button>
        </Link>
      </div>
    );
  }

  const statusKey = typeof order.status === 'object'
    ? Object.keys(order.status as object)[0]
    : String(order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Thank You Banner */}
      <div className="text-center mb-10">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You for Your Order!</h1>
        <p className="text-gray-600 text-lg">Your order has been placed successfully. We'll be in touch soon.</p>
      </div>

      {/* Order Details Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="bg-primary/5 px-6 py-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-bold text-gray-900 text-lg">#{order.orderId.toString()}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[statusKey] || 'bg-gray-100 text-gray-800'}`}>
              {statusLabels[statusKey] || statusKey}
            </span>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Buyer Information</h3>
            <p className="font-semibold text-gray-900">{order.buyerName}</p>
            <p className="text-gray-600 text-sm">{order.buyerEmail}</p>
            <p className="text-gray-600 text-sm">{order.buyerPhone}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Shipping Address</h3>
            <p className="text-gray-700 text-sm">{order.shippingAddress}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="px-6 pb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{item.productName}</p>
                  {item.variantName && <p className="text-sm text-gray-500">{item.variantName}</p>}
                  <p className="text-sm text-gray-500">Qty: {item.quantity.toString()}</p>
                </div>
                <p className="font-semibold text-gray-900">
                  ₹{(Number(item.unitPrice) * Number(item.quantity)).toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-lg mt-4 pt-4 border-t border-gray-200">
            <span>Total Amount</span>
            <span>₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-primary/5 rounded-xl p-6 mb-8">
        <h3 className="font-bold text-gray-900 mb-3">What's Next?</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">1.</span>
            Our team will review your order and confirm it within 24 hours.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">2.</span>
            You'll receive an email confirmation with order details.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">3.</span>
            We'll arrange delivery and keep you updated on the status.
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/products">
          <Button variant="outline" className="w-full sm:w-auto">
            Continue Shopping
          </Button>
        </Link>
        <Link to="/contact">
          <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
            Contact Support <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
