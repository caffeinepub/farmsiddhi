import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-20 w-20 text-gray-300 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any products yet.</p>
        <Link to="/products">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div
              key={`${item.productId}-${item.variantName}`}
              className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-base">{item.productName}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{item.variantName}</p>
                <p className="text-primary font-bold mt-1">₹{item.unitPrice.toLocaleString('en-IN')}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.productId, item.variantName, item.quantity - 1)}
                  className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-8 text-center font-semibold text-gray-800">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.variantName, item.quantity + 1)}
                  className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              {/* Line Total */}
              <div className="text-right min-w-[80px]">
                <p className="font-bold text-gray-900">₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}</p>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item.productId, item.variantName)}
                className="text-red-400 hover:text-red-600 transition-colors p-1"
                aria-label="Remove item"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-28">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={`${item.productId}-${item.variantName}`} className="flex justify-between text-sm text-gray-600">
                  <span className="truncate mr-2">{item.productName} × {item.quantity}</span>
                  <span className="font-medium whitespace-nowrap">₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between font-bold text-gray-900 text-lg">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
              onClick={() => navigate({ to: '/checkout' })}
            >
              Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Link to="/products" className="block text-center mt-3 text-sm text-primary hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
