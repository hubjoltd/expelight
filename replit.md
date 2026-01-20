# Expelight - Premium Automotive Lighting Website

## Overview
Expelight is an e-commerce website for premium automotive LED lighting systems. The site is the official India partner for Diode Dynamics USA, selling engineering-grade lighting systems for vehicles like Mahindra Thar, Scorpio-N, Maruti Jimny, and more.

## Design System - "Midnight Engineering"
- **Theme**: Dark mode by default with deep blacks (#050505) and dark greys (#1A1A1A)
- **Accent Color**: Diode Red (#E53935) for CTAs and highlights
- **Typography**: Space Grotesk for headers, Inter for body text
- **Aesthetic**: Cinematic, moody, premium automotive feel

## Project Structure

### Frontend (client/src/)
```
pages/
  - Home.tsx             # Landing page with all sections
  - Products.tsx         # Product listing page
  - ProductDetail.tsx    # Individual product page
  - Science.tsx          # TIR optics education page
  - VehicleFitPage.tsx   # Vehicle compatibility finder
  - InstallationGuides.tsx # Installation guidelines and safety info
  - WarrantyClaims.tsx   # Warranty policy and claims process
  - Shipping.tsx         # Shipping & returns information
  - TrackOrder.tsx       # Order tracking page

components/
  - Header.tsx           # Navigation header
  - HeroSection.tsx      # Full-screen hero with light effects
  - ProblemSolution.tsx  # Animated section with scattered vs focused light beams
  - ScienceOfLight.tsx   # Educational section with animated table and comparison slider
  - StageSelector.tsx    # Product tier cards (Sport/Pro/Max)
  - VehicleFit.tsx       # Vehicle selector component
  - ReviewsSection.tsx   # Book-opening testimonial carousel with car night shots
  - SocialProof.tsx      # Brand logos with animations + customer photo grid
  - TrustBar.tsx         # Trust highlights strip
  - Footer.tsx           # Site footer
  - FloatingContact.tsx  # Pulsing contact button with WhatsApp/Telegram options
  - ProductPage.tsx      # Product detail component
```

### Backend (server/)
- routes.ts - API endpoints
- storage.ts - In-memory storage for products, vehicles, reviews

### Shared (shared/)
- schema.ts - Data models for Products, Vehicles, Reviews

## Key Features
1. **Hero Section**: Full-screen looping video, "Don't Just Add Light. Engineer It." headline, SAE-Compliant messaging
2. **Problem vs Solution**: Animated lighting beams - scattered red light for "Problem", focused green beam for "Solution", pulsing icon effects
3. **Science of Light**: 
   - Animated table that opens from both sides with staggered row animations
   - SUV background imagery in comparison slider (dim for stock, bright for Diode Dynamics)
   - Voice-search optimized FAQ section
4. **Stage Selector**: Stacked card gallery - cards initially stacked, click to expand into 3-column row with highlighting
5. **Vehicle Fit Finder**: Select your vehicle to find compatible products
6. **Premium Testimonials**: Book-opening 3D animation carousel with large car night shots, prominent "Verified Owner" badges, high-contrast white text
7. **Social Proof**: 
   - Animated brand logos (Mahindra, Maruti, Toyota, Force, Tata, Jeep) with hover and glow effects
   - "Built by Enthusiasts. Tested in India." heading
   - Masonry grid of customer photos
8. **Floating Contact Button**: Bottom-right pulsing button with WhatsApp and Telegram options
9. **Trust Highlights**: Official Partner badges, 8-Year Warranty, Express Air Shipping

## Product Tiers
- **Sport Series** (Starting ₹18,000): Daily driver upgrades
- **Pro Series** (Starting ₹30,000): Weekend warrior - most popular
- **Max Series** (Starting ₹50,000): Competition grade

## Running the Project
```bash
npm run dev
```
The application runs on port 5000 with both frontend and backend.

## Recent Changes
- Initial build of full responsive homepage
- Created all major sections as per design document
- Implemented dark "Midnight Engineering" theme with Diode Red (#E53935) accent
- Added responsive navigation and mobile menu
- Products listing page with filtering by series and sorting
- Product detail pages with sticky add-to-cart layout
- Fixed wouter Link component usage to avoid nested anchor tags
- Stage Selector CTAs use native button with onClick navigation for accessibility compliance
- Hero section with "See What You've Been Missing" headline and AI-generated looping video background
- Video shows SUV headlights cutting through fog for dramatic cinematic effect
- Science of Light section with "Slide to Upgrade" interactive comparison slider
- Added Social Proof section with masonry-style customer photo grid
- Stage Selector redesigned with stacked card gallery effect - cards initially stacked behind each other, click to expand into row with highlighting (Good/Better/Best pricing psychology with Pro as anchor)
- All sections follow the "Midnight Engineering" design system specifications

### Latest Updates (Jan 2026)
- **Problem vs Solution**: Added animated lighting beam effects - scattered red rays for problem side, focused green beam for solution side
- **Science of Light Table**: Table now opens from both sides with scaleX animations, rows stagger in with alternating left/right slide effects
- **Comparison Slider**: Added SUV background imagery (dim/grayscale on stock side, brighter on Diode Dynamics side)
- **Premium Testimonials**: Redesigned with book-opening 3D animation, large car night shot images, prominent white "Verified Owner" badges
- **Social Proof**: Added animated brand logos (Mahindra, Maruti, Toyota, Force, Tata, Jeep) with glow and hover effects
- **Floating Contact Button**: Added pulsing contact button in bottom-right with WhatsApp and Telegram options
- **Color Scheme**: Red ONLY for buttons/CTAs - all other text uses white, silver (zinc-400/500), grey for premium feel

### Guest Cart & Enhanced Visuals (Jan 2026)
- **Guest Cart (localStorage)**: Users can add items to cart without login
  - Cart stored in localStorage for guests
  - Cart syncs to server after login/signup via mergeLocalCartToServer
  - Cart count visible in header for all users
- **TIR Optics Section Enhanced**: 
  - Mahindra Thar image with lights on and animated light beams
  - TIR optic overlay visualization with glowing LED core
  - Key stats (95%+ Efficiency, Zero Glare, 10+ Years)
- **Comparison Slider with Thar Images**:
  - Auto-sliding animation when in view
  - Mahindra Thar lights off (grayscale/dim) vs lights on (bright)
  - Interactive drag to compare, toggle auto-animate
- **Lighting Effects on Text**: Glowing text-shadow animations on headings
- **Redesigned FAQ**: Modern accordion with gradient backgrounds, glow effects, rotating Plus icon

### Authentication & E-commerce (Jan 2026)
- **Simple Username/Password Auth**: Implemented custom authentication system with:
  - Login page (/login) with username/email + password
  - Signup page (/signup) with username, email, password, optional first/last name
  - Sessions stored in PostgreSQL using express-session
  - Password hashing with bcryptjs
- **User Menu**: Header shows Login button when logged out, avatar dropdown when logged in (with My Orders, Logout options)
- **Products Page Redesigned**: Car-configurator style with hover zoom animations, staggered card entries, floating badges, dark theme
- **Shopping Cart**: Add to cart from product detail, quantity controls, remove items, free shipping threshold (₹25,000+)
- **Checkout Flow**: Shipping form with phone/address, order confirmation screen, orders stored in database
- **Login required at checkout only**: Users can add to cart freely, login prompted at checkout

### API Endpoints
- **Auth**: POST /api/auth/register, POST /api/auth/login, POST /api/auth/logout, GET /api/auth/user
- **Cart**: GET/POST/PATCH/DELETE /api/cart (authenticated)
- **Orders**: POST /api/orders, GET /api/orders (authenticated)

### Database Tables
- users: id, username, email, passwordHash, firstName, lastName, createdAt, updatedAt
- sessions: sid, sess (JSON), expire
- cart_items: id, userId, productId, quantity, createdAt
- orders: id, userId, items (JSON), totalAmount, status, shippingAddress, phone, email, createdAt

### New Pages & Brand Expansion (Jan 2026)
- **Expelight Logo**: Added official company logo to Header and Footer components
- **Installation Guidelines Page** (/guides): Step-by-step installation guides with safety information, product-specific steps, and pro tips
- **Warranty Claims Page** (/warranty): Comprehensive warranty policy, coverage periods, claim process, and what's covered/not covered
- **Shipping & Returns Page** (/shipping): Shipping methods, delivery timeframes by zone, and return policy details
- **Track Order Page** (/track): Order tracking with status timeline and FAQ
- **Luxury Car Brands Added**: Mercedes-Benz, BMW, Audi, Land Rover, Porsche, Jeep added to SocialProof component with white backgrounds for visibility
- **Vehicle Compatibility Expanded**: Added luxury vehicle makes and models (G-Class, X5, Q7, Defender, Cayenne, Wrangler, etc.) to VehicleFit component

### Admin Panel & Product Management (Jan 2026)
- **Admin Authentication**: Role-based access with isAdmin middleware checking user.role
- **Admin Dashboard** (/admin): Overview stats (products, orders, categories, revenue) with navigation cards
- **Admin Products** (/admin/products): Full CRUD for products, toggle active status, edit pricing
- **Admin Categories** (/admin/categories): Hierarchical category management with 3 levels (parentId/level structure)
- **Admin Orders** (/admin/orders): View all orders, update status, generate invoices, send via WhatsApp
- **Advlust Import** (/admin/advlust): Browse and import products from Advlust.com Shopify JSON feed
  - Fetches products with images, variants, pricing from advlust.com/products.json
  - Creates products with auto-generated variants and media entries
  - Deduplication by advlustProductId

### Database Schema Extensions (Jan 2026)
- **categories**: Hierarchical structure with id (UUID), name, slug, parentId, level (0/1/2), imageUrl, isActive
- **product_variants**: SKU-level variants with id, productId, sku, name, price, color, beamPattern, size, stockQuantity
- **product_media**: Product images/videos with id, productId, url, mediaType, isPrimary, sortOrder
- **product_categories**: Many-to-many mapping between products and categories
- **invoices**: Order invoices with invoiceNumber, tax breakdown (CGST/SGST/IGST), pdfUrl, whatsapp tracking

### Invoice Generation System (Jan 2026)
- **PDF Generation**: PDFKit-based invoice creation with:
  - Company branding (Expelight logo, Diode Dynamics partner)
  - Order details with line items
  - Tax calculation (18% GST with CGST/SGST for intra-state, IGST for interstate)
  - Shipping cost (free above ₹25,000)
  - Professional layout with summary totals
- **Invoice Storage**: PDFs saved to public/invoices/, served statically
- **Invoice Numbers**: Format EXP-YYMMDD-XXXX (e.g., EXP-260120-4532)

### WhatsApp Business API Integration (Jan 2026)
- **WhatsApp Cloud API**: Integration for sending invoice PDFs to customers
- **Credentials**: Requires WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN secrets
- **Document Sending**: Sends PDF as WhatsApp document with custom caption
- **Status Tracking**: Invoice.sentViaWhatsapp flag and whatsappSentAt timestamp
- **UI Integration**: "WhatsApp" button in AdminOrders shows "Sent" badge after delivery

### New API Endpoints (Admin)
- GET /api/admin/stats - Dashboard statistics
- GET/POST/PATCH/DELETE /api/admin/categories - Category CRUD
- GET/POST/PATCH/DELETE /api/admin/products - Product CRUD
- GET/POST/PATCH/DELETE /api/admin/variants - Variant CRUD
- GET/POST/DELETE /api/admin/products/:id/media - Product media management
- GET/PATCH /api/admin/orders - Order management
- GET /api/admin/invoices - List all invoices
- POST /api/admin/orders/:id/generate-invoice - Generate invoice PDF
- POST /api/admin/invoices/:id/send-whatsapp - Send invoice via WhatsApp
- GET /api/admin/advlust/products - Fetch products from Advlust.com
- POST /api/admin/advlust/import - Import single product from Advlust
- POST /api/admin/advlust/import-all - Bulk import all products from Advlust
- GET /api/admin/whatsapp/status - Check WhatsApp configuration

### Advlust.com Product Import (Jan 2026)
- **Bulk Import**: All 104 products from advlust.com automatically imported
- **Categories Created**: 17 auto-generated categories based on product names:
  - SS5 LED Pods, SS5 CrossLink Light Bars
  - SS3 LED Pods, SSC1 LED Pods, SSC2 LED Pods
  - Stage Series Light Bars, Rock Lights
  - Pod Covers, Fog Light Mounting Kits, Ditch Light Kits
  - Wiring Harnesses, Mounting Brackets
  - Bezels & Gaskets, Controllers & Switches
  - Vehicle-Specific Kits, LED Headlights, Sidemarkers
  - Reverse Light Kits, Other Accessories
- **Product Data**: Names, descriptions, images, variants, and pricing (converted to INR at 85x)
- **Series Assignment**: SS5 products -> Max, SS3 products -> Pro, others -> Sport
- **Database Storage**: Products now fetched from PostgreSQL database instead of in-memory
- **Import Script**: server/importAdvlust.ts handles bulk import with deduplication
