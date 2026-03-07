import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { usePlaceOrder } from "../hooks/useQueries";

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
  buyerName: "",
  buyerEmail: "",
  buyerPhone: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

export default function Checkout() {
  const navigate = useNavigate();
  const { items, cartTotal, clearCart } = useCart();
  const { mutateAsync: placeOrder, isPending } = usePlaceOrder();
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.buyerName.trim()) newErrors.buyerName = "Name is required";
    if (!form.buyerEmail.trim()) newErrors.buyerEmail = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.buyerEmail))
      newErrors.buyerEmail = "Invalid email";
    if (!form.buyerPhone.trim()) newErrors.buyerPhone = "Phone is required";
    if (!form.street.trim()) newErrors.street = "Street is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    if (!form.pincode.trim()) newErrors.pincode = "Pincode is required";
    if (!form.country.trim()) newErrors.country = "Country is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      const order = await placeOrder({
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
          productId: BigInt(item.productId),
          productName: item.productName,
          variantName: item.variantName,
          quantity: BigInt(item.quantity),
          unitPrice: BigInt(item.unitPrice),
        })),
      });

      // Save order to sessionStorage for confirmation page
      sessionStorage.setItem(
        "lastOrder",
        JSON.stringify({
          ...order,
          orderId: order.orderId.toString(),
          totalAmount: order.totalAmount.toString(),
          createdAt: order.createdAt.toString(),
          items: order.items.map((i) => ({
            ...i,
            productId: i.productId.toString(),
            quantity: i.quantity.toString(),
            unitPrice: i.unitPrice.toString(),
          })),
        }),
      );

      clearCart();
      toast.success("Order placed successfully!");
      navigate({
        to: "/order-confirmation/$orderId",
        params: { orderId: order.orderId.toString() },
      });
    } catch (error) {
      console.error("Order placement failed:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <ShoppingBag className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Your Cart is Empty
        </h2>
        <p className="text-muted-foreground mb-8">
          Add some products before checking out.
        </p>
        <Link to="/products">
          <Button size="lg">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Fields */}
            <div className="lg:col-span-2 space-y-8">
              {/* Buyer Details */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-5">
                  Buyer Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="buyerName">Full Name *</Label>
                    <Input
                      id="buyerName"
                      name="buyerName"
                      value={form.buyerName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={errors.buyerName ? "border-destructive" : ""}
                      data-ocid="checkout.input"
                    />
                    {errors.buyerName && (
                      <p
                        className="text-xs text-destructive mt-1"
                        data-ocid="checkout.error_state"
                      >
                        {errors.buyerName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="buyerEmail">Email Address *</Label>
                    <Input
                      id="buyerEmail"
                      name="buyerEmail"
                      type="email"
                      value={form.buyerEmail}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={errors.buyerEmail ? "border-destructive" : ""}
                      data-ocid="checkout.input"
                    />
                    {errors.buyerEmail && (
                      <p
                        className="text-xs text-destructive mt-1"
                        data-ocid="checkout.error_state"
                      >
                        {errors.buyerEmail}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="buyerPhone">Phone Number *</Label>
                    <Input
                      id="buyerPhone"
                      name="buyerPhone"
                      type="tel"
                      value={form.buyerPhone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className={errors.buyerPhone ? "border-destructive" : ""}
                      data-ocid="checkout.input"
                    />
                    {errors.buyerPhone && (
                      <p
                        className="text-xs text-destructive mt-1"
                        data-ocid="checkout.error_state"
                      >
                        {errors.buyerPhone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-5">
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="street">Street Address *</Label>
                    <Input
                      id="street"
                      name="street"
                      value={form.street}
                      onChange={handleChange}
                      placeholder="House/Building No., Street Name"
                      className={errors.street ? "border-destructive" : ""}
                    />
                    {errors.street && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.street}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="City"
                      className={errors.city ? "border-destructive" : ""}
                    />
                    {errors.city && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="State"
                      className={errors.state ? "border-destructive" : ""}
                    />
                    {errors.state && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      placeholder="6-digit pincode"
                      className={errors.pincode ? "border-destructive" : ""}
                    />
                    {errors.pincode && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.pincode}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      placeholder="Country"
                      className={errors.country ? "border-destructive" : ""}
                    />
                    {errors.country && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantName}`}
                      className="flex justify-between text-sm"
                    >
                      <div className="flex-1 min-w-0 mr-2">
                        <p className="text-foreground font-medium truncate">
                          {item.productName}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {item.variantName} × {item.quantity}
                        </p>
                      </div>
                      <span className="text-foreground font-medium flex-shrink-0">
                        ₹
                        {(item.unitPrice * item.quantity).toLocaleString(
                          "en-IN",
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold text-foreground">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2"
                  disabled={isPending}
                  data-ocid="checkout.submit_button"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  By placing your order, you agree to our terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
