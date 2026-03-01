import React, { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { ArrowLeft, Loader2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { usePlaceOrder } from '../hooks/useQueries';
import type { NewOrderInput } from '../backend';

interface FormData {
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

const initialForm: FormData = {
  buyerName: '',
  buyerEmail: '',
  buyerPhone: '',
  street: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
};

export default function Checkout() {
  const navigate = useNavigate();
  const { items, cartTotal, clearCart } = useCart();
  const placeOrder = usePlaceOrder();
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.buyerName.trim()) newErrors.buyerName = 'Name is required';
    if (!form.buyerEmail.trim()) newErrors.buyerEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.buyerEmail)) newErrors.buyerEmail = 'Invalid email';
    if (!form.buyerPhone.trim()) newErrors.buyerPhone = 'Phone number is required';
    if (!form.street.trim()) newErrors.street = 'Street is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (!form.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (!form.country.trim()) newErrors.country = 'Country is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) return;

    const input: NewOrderInput = {
      buyerName: form.buyerName,
      buyerEmail: form.buyerEmail,
      buyerPhone: form.buyerPhone,
      shippingAddress: {
        street: form.street,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        country: form.country,
      },
      items: items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        variantName: item.variantName,
        quantity: BigInt(item.quantity),
        unitPrice: item.unitPrice,
      })),
    };

    try {
      const order = await placeOrder.mutateAsync(input);
      sessionStorage.setItem('lastOrder', JSON.stringify(order, (_, v) =>
        typeof v === 'bigint' ? v.toString() : v
      ));
      clearCart();
      navigate({ to: `/order-confirmation/${order.orderId.toString()}` });
    } catch (err) {
      console.error('Order placement failed:', err);
    }
  };

  const inputClass = (field: keyof FormData) =>
    `w-full px-4 py-3 rounded-lg border ${
      errors[field] ? 'border-destructive' : 'border-border'
    } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors`;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Buyer Details */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-5">Buyer Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      name="buyerName"
                      value={form.buyerName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={inputClass('buyerName')}
                    />
                    {errors.buyerName && (
                      <p className="text-destructive text-xs mt-1">{errors.buyerName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="email"
                      name="buyerEmail"
                      value={form.buyerEmail}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={inputClass('buyerEmail')}
                    />
                    {errors.buyerEmail && (
                      <p className="text-destructive text-xs mt-1">{errors.buyerEmail}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Phone Number <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="tel"
                      name="buyerPhone"
                      value={form.buyerPhone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className={inputClass('buyerPhone')}
                    />
                    {errors.buyerPhone && (
                      <p className="text-destructive text-xs mt-1">{errors.buyerPhone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-5">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Street Address <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={form.street}
                      onChange={handleChange}
                      placeholder="123 Main Street, Apt 4B"
                      className={inputClass('street')}
                    />
                    {errors.street && (
                      <p className="text-destructive text-xs mt-1">{errors.street}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      City <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Mumbai"
                      className={inputClass('city')}
                    />
                    {errors.city && (
                      <p className="text-destructive text-xs mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      State <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="Maharashtra"
                      className={inputClass('state')}
                    />
                    {errors.state && (
                      <p className="text-destructive text-xs mt-1">{errors.state}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Pincode <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      placeholder="400001"
                      className={inputClass('pincode')}
                    />
                    {errors.pincode && (
                      <p className="text-destructive text-xs mt-1">{errors.pincode}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Country <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      placeholder="India"
                      className={inputClass('country')}
                    />
                    {errors.country && (
                      <p className="text-destructive text-xs mt-1">{errors.country}</p>
                    )}
                  </div>
                </div>
              </div>

              {placeOrder.isError && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive text-sm">
                  Failed to place order. Please try again.
                </div>
              )}

              <button
                type="submit"
                disabled={placeOrder.isPending || items.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placeOrder.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-foreground mb-5">Order Summary</h2>

              {items.length === 0 ? (
                <p className="text-muted-foreground text-sm">No items in cart.</p>
              ) : (
                <>
                  <div className="space-y-3 mb-5">
                    {items.map((item) => (
                      <div
                        key={`${item.productId.toString()}-${item.variantName}`}
                        className="flex justify-between text-sm"
                      >
                        <div>
                          <p className="font-medium text-foreground">{item.productName}</p>
                          <p className="text-muted-foreground text-xs">
                            {item.variantName} × {item.quantity}
                          </p>
                        </div>
                        <span className="font-medium text-foreground">
                          ₹{item.quantity * Number(item.unitPrice)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="text-xl font-bold text-primary">₹{cartTotal}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
