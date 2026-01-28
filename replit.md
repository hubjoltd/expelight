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
- **Hierarchical Category Structure (Jan 2026)**: Organized categories into parent-child hierarchy matching advlust.com:
  - **Off-Road Lighting**: SS5 LED Pods (7), SS3 LED Pods (12), SSC2 LED Pods (9), SSC1 LED Pods (8), Rock Lights (12), Vehicle Brackets & Kits (4)
  - **LED Light Bars**: SS5 CrossLink Light Bars (9), Stage Series Light Bars (6)
  - **Lamps**: Fog Light Kits (6), Reverse Light Kits (2), Ditch Light Kits (2)
  - **Accessories**: Wiring Harnesses (9), Mounting Brackets (6), Pod Covers (8), Bezels & Gaskets (2), Controllers & Switches (2)
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
- **Google Domain Verification**: Added google9b70b42b655e5d1d.html for domain verification
- **Admin Credentials**: Username: "admin", Password: "Expelight@2024"