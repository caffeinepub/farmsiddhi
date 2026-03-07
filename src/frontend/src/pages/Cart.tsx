import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, cartTotal, itemCount } =
    useCart();

  if (items.length === 0) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center"
        data-ocid="cart.empty_state"
      >
        <ShoppingBag className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Your Cart is Empty
        </h2>
        <p className="text-muted-foreground mb-8">
          Looks like you haven't added any products yet.
        </p>
        <Link to="/products">
          <Button size="lg" data-ocid="cart.primary_button">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Shopping Cart
          <span className="ml-3 text-lg font-normal text-muted-foreground">
            ({itemCount} items)
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, idx) => (
              <div
                key={`${item.productId}-${item.variantName}`}
                data-ocid={`cart.item.${idx + 1}`}
                className="bg-card rounded-xl border border-border p-5 flex flex-col sm:flex-row gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-lg">
                    {item.productName}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {item.variantName}
                  </p>
                  <p className="text-sm text-primary font-medium mt-1">
                    ₹{item.unitPrice.toLocaleString("en-IN")} per quintal
                  </p>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.variantName,
                          item.quantity - 1,
                        )
                      }
                      className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center font-semibold text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.variantName,
                          item.quantity + 1,
                        )
                      }
                      className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[80px]">
                    <p className="font-bold text-foreground">
                      ₹
                      {(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() =>
                      removeFromCart(item.productId, item.variantName)
                    }
                    className="text-destructive hover:text-destructive/80 transition-colors p-1"
                    aria-label="Remove item"
                    data-ocid={`cart.delete_button.${idx + 1}`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantName}`}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-muted-foreground truncate mr-2">
                      {item.productName} × {item.quantity}
                    </span>
                    <span className="text-foreground font-medium flex-shrink-0">
                      ₹
                      {(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-foreground">
                  Subtotal
                </span>
                <span className="text-2xl font-bold text-primary">
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>
              </div>

              <Link to="/checkout" className="block">
                <Button
                  size="lg"
                  className="w-full gap-2"
                  data-ocid="cart.primary_button"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link
                to="/products"
                className="block text-center text-sm text-muted-foreground hover:text-primary mt-4 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
