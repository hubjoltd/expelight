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
  - Home.tsx           # Landing page with all sections
  - Products.tsx       # Product listing page
  - ProductDetail.tsx  # Individual product page
  - Science.tsx        # TIR optics education page
  - VehicleFitPage.tsx # Vehicle compatibility finder

components/
  - Header.tsx         # Navigation header
  - HeroSection.tsx    # Full-screen hero with light effects
  - ScienceOfLight.tsx # Educational section with comparison slider
  - StageSelector.tsx  # Product tier cards (Sport/Pro/Max)
  - VehicleFit.tsx     # Vehicle selector component
  - ReviewsSection.tsx # Customer testimonials carousel
  - TrustBar.tsx       # Trust highlights strip
  - Footer.tsx         # Site footer
  - ProductPage.tsx    # Product detail component
```

### Backend (server/)
- routes.ts - API endpoints
- storage.ts - In-memory storage for products, vehicles, reviews

### Shared (shared/)
- schema.ts - Data models for Products, Vehicles, Reviews

## Key Features
1. **Hero Section**: Full-screen looping video of SUV headlights in fog, "See What You've Been Missing" headline
2. **Science of Light**: Speedometer-style Lux gauge (850 LUX) with "Slide to Upgrade" interactive comparison slider
3. **Stage Selector**: Stacked card gallery - cards initially stacked, click to expand into 3-column row with highlighting
4. **Vehicle Fit Finder**: Select your vehicle to find compatible products
5. **Reviews Carousel**: Customer testimonials with verified badges
6. **Social Proof**: Masonry grid of customer photos with "Built by Enthusiasts" heading
7. **Trust Highlights**: Key value propositions (Plug & Play, USA Engineering, etc.)

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
