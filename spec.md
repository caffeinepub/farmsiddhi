# Specification

## Summary
**Goal:** Fix the "Product Not Found" error for all six product categories and fully restore the e-commerce cart, checkout, and order management features that were removed.

**Planned changes:**
- Seed all six ProductDetail records (rice, wheat, pulses, spices, processed-food-products, makhana) in backend stable storage with exact lowercase hyphenated category slugs; fix the `getProductByCategory` lookup and the postupgrade migration hook so seeding is automatic and existing data is preserved
- Fix the `useGetProductByCategory` hook to pass the URL slug correctly to the backend and handle null/undefined responses gracefully
- Fix product category card links on the Products page to use the correct URL slugs matching backend values
- Implement CartContext with full cart state management (addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount) and wrap the app with CartProvider in App.tsx
- Restore all four e-commerce React Query hooks: `usePlaceOrder`, `useGetAllOrders`, `useGetOrderById`, and `useUpdateOrderStatus`
- Restore "Add to Cart" functionality on the ProductDetail page with variant selector, quantity selector, and success toast notification
- Restore the Cart page at `/cart` with item list, editable quantities, subtotal, and navigation to checkout or products
- Restore the Checkout page at `/checkout` with buyer details form, shipping address, order summary sidebar, and order submission logic
- Restore the Order Confirmation page at `/order-confirmation/$orderId` with full order details, thank-you message, and color-coded status badge
- Restore the cart icon with item count badge in the Navigation component linking to `/cart`
- Register `/cart`, `/checkout`, and `/order-confirmation/$orderId` routes in App.tsx
- Fix the Admin page to load without errors, showing a Contact Submissions tab and an Orders tab with per-row status update dropdowns

**User-visible outcome:** Clicking any product category navigates to a working product detail page; users can add items to a cart, proceed through checkout, and receive an order confirmation; the cart icon in the navigation shows the current item count; the Admin page correctly displays contact submissions and orders with status management.
