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
    - **Social Proof**: Animated brand logos and a masonry grid of customer photos.
    - **Floating Contact Button**: Pulsing button for WhatsApp and Telegram contact.
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
- **Search & Filtering**: Pagination, category filtering, series filtering (Sport/Pro/Max), and sorting options on product listings.
- **Internationalization**: Pricing converted to INR.

## External Dependencies
- **Diode Dynamics USA**: Primary product source and brand partnership.
- **PostgreSQL**: Database for all persistent data (users, products, orders, etc.).
- **bcryptjs**: For password hashing.
- **express-session**: For session management.
- **PDFKit**: For generating PDF invoices.
- **WhatsApp Cloud API**: For sending invoice PDFs to customers.
- **Advlust.com**: External Shopify store used as a source for product import.