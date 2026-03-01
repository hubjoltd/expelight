# Expelight - Premium Automotive Lighting Website

## Overview
Expelight is an e-commerce website serving as the official India partner for Diode Dynamics USA. It specializes in selling premium, engineering-grade automotive LED lighting systems for various vehicles, including popular models like Mahindra Thar, Scorpio-N, and Maruti Jimny. The project aims to provide a high-quality online shopping experience for automotive enthusiasts.

## User Preferences
I prefer iterative development with clear communication on progress. Before making any major architectural changes or implementing new complex features, please describe your proposed approach. I value detailed explanations for significant code decisions. Please ensure all changes align with the established "Midnight Engineering" design system.

## System Architecture

### Design System - "Midnight Engineering"
- **Theme**: Default dark mode using deep blacks (#050505) and dark greys (#1A1A1A).
- **Accent Color**: Diode Red (#E53935) used exclusively for CTAs and highlights.
- **Typography**: Space Grotesk for headers, Inter for body text.
- **Aesthetic**: Cinematic, moody, and premium automotive feel.

### Technical Implementation
- **Frontend**: React-based application using TypeScript, structured with dedicated pages and reusable components. Key UI/UX elements include:
    - **Hero Section**: Full-screen video loop with a strong brand message and light effects.
    - **Problem vs Solution**: Animated visual explanation of lighting differences (scattered vs. focused beams).
    - **Science of Light**: Interactive educational section with animated tables, comparison sliders, and voice-search optimized FAQ.
    - **Stage Selector**: Interactive card gallery for product tiers (Sport, Pro, Max) with expansion and highlighting.
    - **Vehicle Fit Finder**: Component for users to find compatible products based on their vehicle.
    - **Premium Testimonials**: 3D book-opening carousel showcasing verified owner reviews with large car night shots.
    - **Video Gallery Section**: Trendy video gallery with YouTube embeds featuring Diode Dynamics product videos, with hover play buttons and category badges.
    - **Customer Photos Grid**: Masonry grid of verified customer photos with vehicle brands.
    - **Floating WhatsApp Button**: Green blinking WhatsApp button with dual-ring pulse animation for instant contact.
    - **Mega Menu Navigation**: Hierarchical category navigation with subcategories, "Shop by Series" links, and featured products.
    - **Guest Cart**: Items stored in `localStorage` for guests, synced upon login.
    - **Product Display**: Car-configurator style product listings with hover zoom, staggered entries, and floating badges.
    - **TIR Optics Section**: Enhanced visuals with animated light beams and key statistical highlights.
    - **Invoice Generation**: PDFKit-based invoice creation with company branding, tax breakdown, and professional layout.

- **Backend**: Node.js with Express, using PostgreSQL for data persistence.
    - **Authentication**: Custom username/password authentication with bcryptjs for hashing, `express-session` for session management. Users can add to cart freely, login is prompted at checkout.
    - **API Endpoints**: RESTful API for authentication, cart management, orders, and admin functionalities.
    - **Data Models**: Defined schemas for Products, Vehicles, Reviews, Users, Sessions, Cart Items, Orders, Categories, Product Variants, Product Media, and Invoices.
    - **Admin Panel**: Role-based access with CRUD operations for products, categories, orders, and product media. Includes overview stats and an Advlust.com product import feature.

### Feature Specifications
- **E-commerce Core**: Shopping cart, checkout flow with shipping forms, order confirmation, and order storage.
- **Product Management**: Comprehensive product details with descriptions, specifications, installation guides, Q&A, and multiple variants.
- **Content Pages**: Dedicated pages for Installation Guidelines, Warranty Claims, Shipping & Returns, and Order Tracking.
- **Search & Filtering**: Global product search bar in header (searches by product name, SKU, and description), pagination, category filtering, series filtering (Sport/Pro/Max), and sorting options on product listings.
- **Internationalization**: Pricing converted to INR.
- **Admin Panel**: Sidebar navigation with Dashboard, Products, Categories, Orders, and Advlust Import links. Includes logout button and "View Site" link. Admin authentication at `/admin/login` with session-based cookies (CHIPS enabled for iframe compatibility).

## External Dependencies
- **Diode Dynamics USA**: Primary product source and brand partnership.
- **PostgreSQL**: Database for all persistent data (users, products, orders, etc.).
- **bcryptjs**: For password hashing.
- **express-session**: For session management.
- **PDFKit**: For generating PDF invoices.
- **WhatsApp Cloud API**: For sending invoice PDFs to customers.
- **Advlust.com**: External Shopify store used as a source for product import. 104 products imported with full details including images, SKUs, prices, specifications, and variants.

## Recent Updates
- **Category Images & Navigation Update (Jan 2026)**: 
  - Added CDN images from advlust.com to all categories (banners for parent categories, product images for sub-categories)
  - Updated mega menu to show 3-column layout with category images and hover effects
  - Removed "Shop by Series" section from navigation
  - Added "View All Products" link in mega menu
  - Logo size increased to 60px height
- **3-Level Category Hierarchy with Images (Jan 2026)**: 
  - **Off-Road** (banner: offroad-banner.jpg): LED Light Bars, LED Pods (SSC1, SSC2, SS3, SS5), Brackets & Kits, Switch Panel, Hitch Mount, Rock Lights (Single-Color, RGBW), Accessories (Bezels, Brackets & Mounts, Covers, Hardware Kits, Replacement Lenses, Wiring Harnesses)
  - **Lamps** (banner: lamp-banner.jpg): Headlights, Sidemarkers, Turn Signals, Fog Lamps
  - **Extras** (banner: extra-banner.jpg): Controllers, LED Wiring and Installation, Anti-Flicker Modules, Flashers and Resistors, Power/Dimmers/Drivers
- **Original SKUs (Jan 2026)**: Product variants now use original advlust.com SKUs (e.g., ADV5011, DD6794) with duplicate detection
- **Enhanced Product Import (Jan 2026)**: Re-imported all 104 products from advlust.com with complete details:
  - Full product descriptions (up to 7000+ characters per product)
  - All variant options with beam patterns (e.g., "2 Spot + 2 Driving + 2 Combo")
  - Power level variants (Sport 40W, Pro 90W)
  - Features extracted from HTML (TIR optics, waterproof ratings, etc.)
  - "What's in the Box" items extracted from product listings
  - Specifications including optic options and power levels
  - Unique SKUs per variant to prevent duplicates
- **Product Page Improvements**:
  - Full overview description displayed in Description tab
  - Key features with bullet points
  - Actual "What's in the Box" contents from advlust.com
  - Technical specifications table
  - Installation guide with step-by-step instructions
  - Q&A section for common questions
  - Similar Products section showing up to 4 related products from same series
  - Watch Video button with embedded YouTube player
  - Conditional variant display (only shows selectors when multiple options exist)
- **Pre-Order Functionality (Jan 2026)**:
  - Added `isPreOrder` and `preOrderMessage` fields to products schema
  - Amber "Pre-Order" badge on product pages for pre-order items
  - **Amber "Pre-Order Now" button** (like advlust.com) with clock icon instead of shopping bag
  - Button changes to "Pre-Ordering..." during add and "Pre-Order Placed!" on success
  - Pre-order delivery notice: "6-8 weeks delivery. In-stock items ship together with pre-order items."
  - Dynamic shipping text shows "6-8 Weeks Delivery" for pre-order items
  - 18 SS5 products marked as pre-order items
- **Vehicle & Price Filtering (Jan 2026)**:
  - Vehicle Fit Finder "View Upgrades" now redirects to products page with vehicle filter applied
  - Price range filter dropdown with ranges: Under ₹10k, ₹10k-25k, ₹25k-50k, ₹50k-1L, Above ₹1L
  - Vehicle badge displays selected vehicle with clear option
  - All filters support URL parameters for direct linking
- **Category Hierarchy Updates (Jan 2026)**:
  - Added Stage Series LED Light Bars and SS5 CrossLink LED Light Bars subcategories
  - Added Backlight subcategory under Accessories
  - Fixed category slug mappings for better product organization
- **Video URLs (Jan 2026)**: 87 products now have YouTube video URLs
- **Specifications Tab with Variant Comparison Table (Jan 2026)**:
  - 80 products updated with real specifications data from advlust.com
  - Variant Comparison Table displaying: Peak Beam Intensity, Illuminance @ 10m, Measured Output, Raw Output, Output Color
  - Technical Specifications matching advlust.com: Power, Voltage, Current, LED Emitter, Materials, IP Rating, etc.
  - SS3 specs: Up to 170,000 cd (Driving White Pro), 40W Sport / 90W Pro
  - SS5 specs: Up to 420,000 cd (Spot White Pro), 40W Sport / 90W Pro  
  - Stage Series Light Bar specs: 55,000-165,000 cd depending on size
  - SSC1/SSC2 specs with proper power and lumen values
- **Mobile Menu with 3-Level Nested Categories (Jan 2026)**:
  - Parent categories expandable with chevron icons
  - Subcategories shown with chevron-right indicators
  - Third-level categories indented for visual hierarchy
- **Google Domain Verification**: Added google9b70b42b655e5d1d.html for domain verification
- **Razorpay Payment Integration (Feb 2026)**:
  - Integrated Razorpay checkout for online payments (UPI, Cards, Net Banking, Wallets)
  - Removed COD (Cash on Delivery) option
  - Backend: `/api/razorpay/create-order` creates Razorpay order, `/api/razorpay/verify-payment` verifies payment signature
  - Orders table extended with `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`, `payment_status` fields
  - Payment flow: Create order -> Razorpay checkout popup -> Verify signature -> Confirm order
  - Test keys currently in use (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET env vars) - switch to production keys when ready
  - Razorpay SDK: `razorpay` npm package for server-side, Checkout.js script loaded dynamically on frontend
- **DiodeDynamics Product Import (Feb 2026)**:
  - Imported 37 new products from DiodeDynamics.com with 155+ new variants
  - Total: 136 active products, 357 variants, 797 media entries
  - All 234 requested SKUs confirmed in database (DD6440P through DD8815)
  - Products include: C2 2.0 LED Pods, SS6/SS10/SS20/SS30/SS40 Light Bars, SSC1 pods, wiring harnesses, brackets, covers, bezels
  - Import scripts: server/importDiodeDynamics.ts (DD page scraper), server/enrichImages.ts (image enrichment)
  - Fixed case-sensitive SKU matching issues
  - Updated variant names with descriptive beam pattern/mount type info
- **Automatic Full Database Seeding (Mar 2026)**:
  - All data is now seeded into the PostgreSQL database on every server start via idempotent seeders:
    - `server/seedMissingProducts.ts` - 131 products, 357 variants, 982 media from `server/seedData.json`
    - `server/seedMissingCategories.ts` - 38 categories with images, hierarchy, and product-category mappings
    - `server/seedVehiclesAndReviews.ts` - 20 vehicles (7 makes) and 5 verified reviews
  - Vehicle and review storage methods in `server/storage.ts` now read from the database instead of in-memory maps
  - Product data exported to `server/seedData.json` for reliable offline seeding
- **Product Image & Data Enrichment (Mar 2026)**:
  - Enriched all 131 products with multi-image galleries from advlust.com Shopify store
  - Products matched by SKU (exact match) and product family (SS3, SS5, SSC1, C2, etc.) for image inheritance
  - Images sourced from Shopify CDN (cdn.shopify.com) for reliable loading
  - Updated product descriptions, features, "what's in the box" from Shopify product HTML
  - Variant metadata updated: names, featured images, weights
  - Fixed broken product name ("Search results for..." -> "SS6 SAE/DOT Yellow LED Light Bar (one)")
  - Fixed mismatched images (wiring harnesses, bezels, mounting kits matched to correct product families)
  - 128 products now have 3+ images, 3 products have 1-2 images (no Shopify equivalent available)
  - Total: 131 products, 357 variants, 982 media entries
- **Variant Selection Fix (Mar 2026)**:
  - Fixed bug where variant switching didn't update SKU, price, or images on product pages
  - Root cause: useEffect dependency on `selectedVariantIndex` caused variant reset on every selection change
  - Added direct `switchToVariantImage` call in Option button click handler
  - Assigned product images to all 227 variants that had no imageUrl
  - Fixed 36 products with ₹2,546 placeholder prices (set proper tier-based pricing)
  - Fixed bad variant names (DD8658S, DD8659S "Search results..." → proper names; DD7420 "C1" → "C1 LED Pod Kit"; DD7738 "No" → "White Standard")
  - Re-exported seed data: 131 products, 357 variants, 981 media
  - Added YouTube video URLs to all 131 products (11 unique videos from DD website, mapped by product family)
- **Admin Variant Manager (Mar 2026)**:
  - Added VariantManager component to admin product edit dialog
  - Shows all variants with SKU, name, beam pattern, color, price
  - Toggle switch to enable/disable individual variants (isAvailable field)
  - Enable All / Disable All bulk action buttons
  - Inline edit for variant name and price
  - Disabled variants are filtered out from the product page (beam patterns, colors, and option buttons only show enabled variants)
- **Admin Credentials**: Username: "admin", Password: "Expelight@2024"