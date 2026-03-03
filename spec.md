# Specification

## Summary
**Goal:** Fix the Products and ProductDetail pages so all six product categories display their complete sub-categories and products correctly, with fully seeded backend data and all variant images present.

**Planned changes:**
- Audit and fix the backend Motoko actor and migration module to fully seed all six ProductDetail records (Rice, Wheat, Pulses, Spices, Processed Food Products, Makhana) with correct category slugs, complete variant lists, and all required fields (nutritionData, specifications, description, price, imageUrl)
- Fix `getProductByCategory` to look up records by exact lowercase hyphenated slugs
- Ensure backend migration runs on postupgrade without overwriting existing contact form or order data
- Fix the Products page to correctly fetch and display all variants for each category card, with proper URL slugs and a grid/scrollable variant sub-section
- Fix the ProductDetail page and `useGetProductByCategory` hook to pass the raw category slug to the backend, handle null/undefined responses gracefully, and display the full variant list in the Product Variants grid and variant selector
- Add all 33 missing variant product images to `frontend/public/assets/generated/`

**User-visible outcome:** All six product category pages show their complete list of sub-variants with images and product details; no blank or missing product states appear on the Products or ProductDetail pages.
