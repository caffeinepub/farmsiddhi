# Specification

## Summary
**Goal:** Fix the ProductDetail page to correctly fetch and display all product variants and nutritional information, fix the Admin page, ensure CartContext is fully wired, seed all six backend product records with correct slugs, and add missing product variant images.

**Planned changes:**
- Rewrite `useGetProductByCategory` hook to correctly call the backend's `getProductByCategory` function using the URL `productId` param, handle null/empty responses as "not found", and disable the query when `productId` is undefined
- Rewrite the `ProductDetail` page to show loading/not-found states, product name/category/description/price/specifications, a nutritional information section, a Product Variants grid with all variants, a variant selector pre-populated with all variants, a quantity selector (default 1, increment/decrement), and an Add to Cart button with toast notification
- Audit and fix `backend/main.mo` and `backend/migration.mo` to ensure all six product records are seeded with correct slugs (`rice`, `wheat`, `pulses`, `spices`, `processed-food-products`, `makhana`), fully populated `nutritionData`, and all variants with `name` and `imageUrl`; migration must not overwrite existing contact or order data
- Fix `Admin.tsx` to load without errors, render a "Contact Submissions" tab (Name, Email, Phone, Message, User Type) and an "Orders" tab (Order ID, Buyer Name, Email, Phone, Total, Status, Date) with a per-row status update dropdown; fix all broken imports and TypeScript errors
- Verify `CartContext` provides `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `cartTotal`, and `itemCount`; ensure `CartProvider` wraps the app and that `/cart`, `/checkout`, and `/order-confirmation/$orderId` routes are registered with lazy-loaded components
- Add all 33 missing product variant images to `frontend/public/assets/generated/`

**User-visible outcome:** Users can navigate to any product category page and see full product details including all variants, nutritional info, and can add items to cart; admins can view contact submissions and manage orders without errors.
