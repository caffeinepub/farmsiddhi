# Specification

## Summary
**Goal:** Restore all e-commerce features that were removed from the FarmSiddhi app and fix the Admin page failing to load.

**Planned changes:**
- Restore `CartContext` provider with full cart state management (`addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `cartTotal`) and wrap the app in `App.tsx`
- Restore the Cart page (`/cart`) with item listing, quantity controls, subtotal, and navigation to checkout or products
- Restore the Checkout page (`/checkout`) with buyer details form, shipping address form, order summary sidebar, and order submission via `usePlaceOrder`
- Restore the Order Confirmation page (`/order-confirmation/:orderId`) fetching and displaying order details with a thank-you message
- Restore "Add to Cart" functionality on the ProductDetail page (variant selector, quantity selector, add-to-cart button with success toast) without altering existing product display sections
- Restore the cart icon with item count badge in the Navigation component linking to `/cart` without altering logo, links, or mobile menu
- Restore React Query hooks in `useQueries.ts`: `usePlaceOrder`, `useGetAllOrders`, `useGetOrderById`, `useUpdateOrderStatus`
- Register `/cart`, `/checkout`, and `/order-confirmation/$orderId` routes in `App.tsx` with lazy-loaded components
- Restore the backend Motoko actor with `Order` and `OrderItem` types, stable order storage, and `placeOrder`, `getOrderById`, `getAllOrders`, `updateOrderStatus` functions
- Fix the Admin page not loading by resolving broken imports, TypeScript errors, and ensuring both the Contact Submissions and Orders tabs render correctly with order status update support

**User-visible outcome:** Users can add products to a cart, proceed through checkout, and receive an order confirmation. Admins can view and update orders on the Admin page without errors.
