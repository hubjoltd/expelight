# Software Requirements Specification (SRS)
## Expelight — Premium Automotive LED Lighting E-Commerce Platform

**Version:** 1.0  
**Date:** March 2026  
**Status:** Final

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [System Flows and Use Cases](#5-system-flows-and-use-cases)
6. [External Interface Requirements](#6-external-interface-requirements)
7. [Constraints and Assumptions](#7-constraints-and-assumptions)

---

## 1. Introduction

### 1.1 Purpose

This document defines the software requirements for **Expelight**, a full-stack e-commerce web application for selling premium automotive LED lighting systems. Expelight operates as the Official India Partner for Diode Dynamics, offering curated lighting solutions for modern Indian explorers and off-road enthusiasts.

### 1.2 Scope

The system covers:
- Public product catalog (discovery, filtering, search)
- Vehicle fitment selector
- User authentication and account management
- Shopping cart (guest + authenticated)
- Checkout and payment via Razorpay (INR)
- GST-compliant invoice generation (PDF)
- WhatsApp-based order delivery notifications
- Admin dashboard (catalog, orders, content, invoicing)
- Blog content management

### 1.3 Definitions

| Term | Definition |
|---|---|
| SKU | Stock Keeping Unit — a unique product variant (color + beam pattern) |
| GST | Goods and Services Tax (India) |
| HMAC | Hash-based Message Authentication Code (payment verification) |
| Razorpay | Indian payment gateway supporting INR transactions |
| Advlust | External supplier system used for product data import |
| Drizzle ORM | TypeScript ORM used for database access |

### 1.4 Overview

The system is a **monorepo** full-stack application with a React (Vite) frontend and an Express (Node.js) backend, sharing a PostgreSQL database via Drizzle ORM.

---

## 2. Overall Description

### 2.1 Product Perspective

Expelight is a standalone web platform. It integrates with:
- **Razorpay** — Payment processing
- **Meta Graph API (WhatsApp)** — Order notifications
- **Advlust / Diode Dynamics** — Product data import
- **PDFKit** — Invoice generation

### 2.2 Product Functions (Summary)

| # | Function |
|---|---|
| F1 | Product browsing with category hierarchy and search |
| F2 | Vehicle fitment selector (Make → Model → Year) |
| F3 | Guest and authenticated shopping cart |
| F4 | User registration and session-based login |
| F5 | Razorpay-powered checkout |
| F6 | GST-compliant PDF invoice generation |
| F7 | WhatsApp order notification delivery |
| F8 | Order tracking |
| F9 | Admin product and category CRUD |
| F10 | Admin order management |
| F11 | Admin blog content management |
| F12 | Advlust product data import tool |

### 2.3 User Classes

| User Class | Description |
|---|---|
| **Guest User** | Browses catalog, uses vehicle selector, adds to local cart |
| **Registered User** | All guest capabilities + checkout, order history, synced cart |
| **Admin** | All user capabilities + full catalog, order, and content management |

### 2.4 Operating Environment

- **Frontend:** Modern browsers (Chrome, Firefox, Safari, Edge)
- **Backend:** Node.js 20+, Express 5
- **Database:** PostgreSQL (Neon serverless)
- **Hosting:** Replit (development and deployment)

---

## 3. Functional Requirements

### 3.1 Authentication Module

| ID | Requirement |
|---|---|
| AUTH-01 | Users shall be able to register with a unique username, email, and password |
| AUTH-02 | Passwords shall be hashed using bcryptjs before storage |
| AUTH-03 | Users shall be able to log in using username and password |
| AUTH-04 | Sessions shall be persisted server-side in the PostgreSQL sessions table |
| AUTH-05 | Users shall be able to log out, destroying their session |
| AUTH-06 | The system shall expose `/api/auth/user` to return the currently authenticated user |
| AUTH-07 | Roles shall be either `user` or `admin`; admin routes are protected by middleware |

### 3.2 Product Catalog Module

| ID | Requirement |
|---|---|
| CAT-01 | Products shall have a name, SKU, series (Sport/Pro/Max), description, images, specs, and price |
| CAT-02 | Products shall belong to one or more categories via a many-to-many mapping |
| CAT-03 | Categories shall support three levels: Category → Sub-Category → Sub-Sub-Category |
| CAT-04 | Each product shall have one or more variants (color + beam pattern combinations) with individual pricing and stock |
| CAT-05 | The catalog shall be searchable by product name or SKU |
| CAT-06 | Products shall be filterable by series |
| CAT-07 | The system shall expose public API endpoints to list products and categories without authentication |

### 3.3 Vehicle Fitment Module

| ID | Requirement |
|---|---|
| VEH-01 | Users shall be able to select their vehicle by Make, Model, and Year |
| VEH-02 | The system shall return a list of compatible products for the selected vehicle |
| VEH-03 | Vehicle data shall be managed in the `vehicles` database table |

### 3.4 Shopping Cart Module

| ID | Requirement |
|---|---|
| CART-01 | Guest users shall be able to add products and variants to a local cart (localStorage) |
| CART-02 | Upon login, the local guest cart shall be merged with the user's server-side cart |
| CART-03 | Authenticated users' carts shall be persisted to the `cart_items` database table |
| CART-04 | Users shall be able to update quantities and remove items from their cart |
| CART-05 | Cart items shall reference a specific product variant |

### 3.5 Checkout and Payment Module

| ID | Requirement |
|---|---|
| PAY-01 | Only authenticated users shall be able to proceed to checkout |
| PAY-02 | At checkout, users shall provide delivery address and contact information |
| PAY-03 | The backend shall calculate the order total: product subtotals + shipping (₹500, or free above ₹25,000) |
| PAY-04 | The backend shall create a Razorpay order and return the order ID and public key to the frontend |
| PAY-05 | The frontend shall load the Razorpay checkout modal with the order details |
| PAY-06 | After payment, the frontend shall send the Razorpay payment ID, order ID, and signature to the backend |
| PAY-07 | The backend shall verify the payment signature using HMAC-SHA256 |
| PAY-08 | On successful verification, the order status shall be set to "confirmed" and the cart cleared |
| PAY-09 | A PDF invoice shall be generated automatically after payment confirmation |

### 3.6 Invoice Module

| ID | Requirement |
|---|---|
| INV-01 | Invoices shall be generated as PDF documents using PDFKit |
| INV-02 | Invoices shall include: seller info, buyer info, itemized line items, CGST/SGST/IGST breakdown, and total |
| INV-03 | Invoice PDFs shall be stored in the `public/invoices/` directory |
| INV-04 | Invoice metadata shall be persisted in the `invoices` database table |
| INV-05 | Admins shall be able to manually trigger invoice generation for an order |

### 3.7 WhatsApp Notification Module

| ID | Requirement |
|---|---|
| WA-01 | The system shall send order confirmation details to the customer via WhatsApp after successful payment |
| WA-02 | The WhatsApp integration shall use the Meta Graph API |
| WA-03 | Delivery shall include the invoice PDF link |

### 3.8 Order Management Module

| ID | Requirement |
|---|---|
| ORD-01 | Authenticated users shall be able to view their order history |
| ORD-02 | Orders shall have statuses: pending, confirmed, shipped, delivered |
| ORD-03 | A public order tracking page shall allow users to check order status |
| ORD-04 | Admins shall be able to view all orders and update their status |

### 3.9 Admin Module

| ID | Requirement |
|---|---|
| ADM-01 | Admin dashboard shall display key metrics: revenue, total orders, active products |
| ADM-02 | Admins shall be able to create, read, update, and delete products and variants |
| ADM-03 | Admins shall be able to create, read, update, and delete categories |
| ADM-04 | Admins shall be able to import product data from Advlust via a dedicated import tool |
| ADM-05 | Admins shall be able to create and edit blog posts |
| ADM-06 | All admin routes shall be protected by the `isAdmin` middleware |

### 3.10 Reviews Module

| ID | Requirement |
|---|---|
| REV-01 | Customers shall be able to submit reviews with ratings for products |
| REV-02 | Reviews shall have a `verified` flag settable by admins |
| REV-03 | Product pages shall display aggregated ratings and individual reviews |

---

## 4. Non-Functional Requirements

### 4.1 Performance

- API responses for product listing shall complete within 500ms under normal load
- The Razorpay payment flow shall complete end-to-end within 10 seconds
- Invoice PDF generation shall complete within 5 seconds

### 4.2 Security

- All passwords shall be stored as bcrypt hashes (never plaintext)
- Payment signatures shall be verified server-side using HMAC-SHA256
- Admin routes shall be inaccessible to non-admin users
- Sessions shall use secure, HTTP-only cookies in production
- The backend shall trust the reverse proxy (Replit) for IP forwarding

### 4.3 Reliability

- The system shall handle seeding failures gracefully without crashing the server
- Payment verification failures shall not silently succeed; errors shall be returned to the client

### 4.4 Usability

- The site shall be fully responsive (mobile, tablet, desktop)
- The vehicle fitment selector shall guide users with cascading dropdowns
- Animations shall use Framer Motion for smooth transitions

### 4.5 Maintainability

- Database schema shall be managed via Drizzle ORM and kept in sync with `npm run db:push`
- Shared types between frontend and backend shall be defined in `shared/schema.ts`

---

## 5. System Flows and Use Cases

### 5.1 User Registration & Login Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      USER AUTHENTICATION FLOW                           │
└─────────────────────────────────────────────────────────────────────────┘

  [User visits site]
         │
         ▼
  [Clicks "Login"]
         │
         ├─────────────────── New User? ────────────────────┐
         │ No                                               │ Yes
         ▼                                                  ▼
  [Enter username +                              [Enter username + email
   password]                                      + password]
         │                                                  │
         ▼                                                  ▼
  POST /api/auth/login                         POST /api/auth/register
         │                                                  │
         ▼                                                  ▼
  [Server: Lookup user                         [Server: Hash password
   → bcrypt.compare()]                          → Insert into users table]
         │                                                  │
         ├── Invalid? ──────────────────────────────────────┤
         │                                                  │
         │ Valid                                            │ Success
         ▼                                                  ▼
  [Create session]                             [Auto-login → Create session]
         │                                                  │
         └──────────────────────┬───────────────────────────┘
                                │
                                ▼
                    [Merge guest localStorage cart
                     → synced to DB cart_items]
                                │
                                ▼
                    [Redirect to previous page]
```

---

### 5.2 Product Discovery Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       PRODUCT DISCOVERY FLOW                            │
└─────────────────────────────────────────────────────────────────────────┘

  [User on Home Page]
         │
         ├──────────────────────────────────────────────────┐
         │                                                  │
         ▼                                                  ▼
  [Browse by Category]                           [Fit Your Vehicle]
  GET /api/categories                            GET /api/vehicles
         │                                                  │
         ▼                                                  ▼
  [Select Category]                              [Select Make → Model → Year]
  GET /api/products?category=...                         │
         │                                       GET /api/vehicles/compatible
         │                                                  │
         └──────────────────────┬───────────────────────────┘
                                │
                                ▼
                    [Product Listing Page]
                    ┌───────────────────┐
                    │ Filter by Series  │
                    │ Search by name    │
                    │ or SKU            │
                    └────────┬──────────┘
                             │
                             ▼
                    [Product Detail Page]
                    ┌───────────────────┐
                    │ Images / Gallery  │
                    │ Specs / Series    │
                    │ Select Variant    │
                    │ (Color + Beam)    │
                    │ Reviews           │
                    └────────┬──────────┘
                             │
                             ▼
                    [Add to Cart Button]
```

---

### 5.3 Shopping Cart Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SHOPPING CART FLOW                              │
└─────────────────────────────────────────────────────────────────────────┘

  [User clicks "Add to Cart"]
         │
         ├──── Authenticated? ─────────────────────────────────────────┐
         │ No                                                          │ Yes
         ▼                                                             ▼
  [Save to localStorage]                               POST /api/cart
  (guest cart)                                         [Save to cart_items table]
         │                                                             │
         │                                                             │
  [User later logs in]                                                 │
         │                                                             │
         ▼                                                             │
  [Merge local cart items                                              │
   into server cart]                                                  │
  POST /api/cart (each item)                                          │
         │                                                             │
         └────────────────────────────┬────────────────────────────────┘
                                      │
                                      ▼
                          [Cart Page: /cart]
                          ┌────────────────────────┐
                          │ View items + quantities │
                          │ Update quantity         │
                          │ PATCH /api/cart/:id     │
                          │ Remove item             │
                          │ DELETE /api/cart/:id    │
                          └──────────┬─────────────┘
                                     │
                                     ▼
                          [Proceed to Checkout]
                          (requires authentication)
```

---

### 5.4 Checkout and Payment Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      CHECKOUT & PAYMENT FLOW                            │
└─────────────────────────────────────────────────────────────────────────┘

  [User at Cart → "Checkout"]
         │
         ├──── Not logged in? ──────► [Redirect to Login] ──► [Return to Cart]
         │
         ▼
  [Checkout Page (/checkout)]
  ┌─────────────────────┐
  │ Enter:              │
  │  • Delivery address │
  │  • Contact info     │
  │  • Phone number     │
  └──────────┬──────────┘
             │
             ▼
  [Click "Pay Now"]
             │
             ▼
  POST /api/razorpay/create-order
  ┌──────────────────────────────────────┐
  │ Server:                              │
  │  1. Calculate subtotal               │
  │  2. Add shipping (₹500 or free      │
  │     if subtotal ≥ ₹25,000)          │
  │  3. Create order in Razorpay API     │
  │  4. Return { orderId, amount, key }  │
  └──────────────────────┬───────────────┘
             │
             ▼
  [Razorpay Checkout Modal Opens]
  ┌──────────────────────────────┐
  │ User enters card / UPI /     │
  │ NetBanking details           │
  └──────────────┬───────────────┘
             │
             ├──── Payment Failed? ──────► [Show error message]
             │                             [Allow retry]
             ▼
  [Razorpay returns:
   razorpay_payment_id,
   razorpay_order_id,
   razorpay_signature]
             │
             ▼
  POST /api/razorpay/verify-payment
  ┌──────────────────────────────────────────┐
  │ Server:                                  │
  │  1. Construct expected signature          │
  │     HMAC-SHA256(order_id + "|" +         │
  │     payment_id, secret)                  │
  │  2. Compare with received signature       │
  │  3. If match:                             │
  │     a. Create order in DB (confirmed)    │
  │     b. Clear cart_items for user         │
  │     c. Generate PDF invoice              │
  │     d. Send WhatsApp notification        │
  │  4. Return { success, orderId }          │
  └──────────────────────────┬───────────────┘
             │
             ▼
  [Order Success Page]
  ┌──────────────────────────┐
  │ Order ID                 │
  │ Download Invoice (PDF)   │
  │ Track Order link         │
  └──────────────────────────┘
```

---

### 5.5 Invoice Generation Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       INVOICE GENERATION FLOW                           │
└─────────────────────────────────────────────────────────────────────────┘

  [Payment Verified / Admin triggers]
         │
         ▼
  [invoiceService.generateInvoice(orderId)]
         │
         ▼
  ┌─────────────────────────────────────────────┐
  │ Fetch order + line items + user from DB      │
  │ Calculate:                                   │
  │  • Base amounts per item                     │
  │  • CGST (9%) + SGST (9%) for intra-state    │
  │  • IGST (18%) for inter-state               │
  │  • Grand Total                               │
  └──────────────────────┬──────────────────────┘
         │
         ▼
  [PDFKit: Build PDF document]
  ┌──────────────────────────────────┐
  │ Header: Expelight logo + address │
  │ Buyer: Name, address, GSTIN      │
  │ Invoice #, Date, Order ID        │
  │ Table: Item | Qty | Rate | GST   │
  │ Footer: Tax summary + Grand Total│
  └──────────────────────┬───────────┘
         │
         ▼
  [Save PDF → public/invoices/{orderId}.pdf]
         │
         ▼
  [Insert invoice metadata into invoices table]
         │
         ▼
  [Return invoice URL]
         │
         ▼
  [WhatsApp service sends PDF link to customer]
```

---

### 5.6 Admin Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            ADMIN FLOW                                   │
└─────────────────────────────────────────────────────────────────────────┘

  [Admin logs in]
         │
         ▼
  [Server: isAdmin middleware checks session role]
         │
         ├──── Not admin? ──────────────────► [403 Forbidden]
         │
         ▼
  [Admin Dashboard (/admin)]
  ┌─────────────────────────────────────────┐
  │  • Revenue summary                      │
  │  • Total orders                         │
  │  • Active products                      │
  └─────────────┬───────────────────────────┘
                │
        ┌───────┼───────────────────────────┐
        │       │                           │
        ▼       ▼                           ▼
  [Products] [Orders]                   [Blog]
     │           │                          │
     ▼           ▼                          ▼
  CRUD ops   View all orders            Create / Edit
  + Variants  Update status             blog posts
  + Import    Trigger invoice
  from Advlust
```

---

### 5.7 Order Tracking Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ORDER TRACKING FLOW                              │
└─────────────────────────────────────────────────────────────────────────┘

  [User visits /track]
         │
         ▼
  [Enter Order ID]
         │
         ▼
  GET /api/orders/:id
         │
         ├──── Not Found? ──────────────────► [Show "Order not found"]
         │
         ▼
  [Display order status timeline]
  ┌───────────────────────────────────────────────┐
  │  Pending ──► Confirmed ──► Shipped ──► Delivered │
  └───────────────────────────────────────────────┘
         │
         ▼
  [Show invoice download link if available]
```

---

## 6. External Interface Requirements

### 6.1 Razorpay API

- Endpoint: `https://api.razorpay.com/v1/orders`
- Auth: Key ID + Key Secret (server-side only)
- Webhook: HMAC-SHA256 signature verification on `/api/razorpay/verify-payment`

### 6.2 Meta Graph API (WhatsApp)

- Used for sending order confirmation messages with invoice PDF links
- Requires WhatsApp Business Account and approved message templates

### 6.3 Advlust Import API

- Used by admins to pull product data (images, variants, specs) from `advlust.com`
- Consumed via admin-only endpoint in `server/routes.ts`

### 6.4 Frontend ↔ Backend API

All communication is via RESTful HTTP JSON APIs on the same port.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | None | Register new user |
| POST | `/api/auth/login` | None | Login |
| POST | `/api/auth/logout` | User | Logout |
| GET | `/api/auth/user` | User | Get current user |
| GET | `/api/products` | None | List products |
| GET | `/api/products/:id` | None | Get product details |
| GET | `/api/categories` | None | List categories |
| GET | `/api/vehicles` | None | List vehicles |
| GET | `/api/reviews` | None | Get reviews |
| GET | `/api/cart` | User | Get cart |
| POST | `/api/cart` | User | Add to cart |
| PATCH | `/api/cart/:id` | User | Update cart item |
| DELETE | `/api/cart/:id` | User | Remove cart item |
| GET | `/api/orders` | User | Get user orders |
| POST | `/api/razorpay/create-order` | User | Initiate payment |
| POST | `/api/razorpay/verify-payment` | User | Verify & confirm payment |
| POST | `/api/admin/products` | Admin | Create product |
| PATCH | `/api/admin/products/:id` | Admin | Update product |
| DELETE | `/api/admin/products/:id` | Admin | Delete product |
| GET | `/api/admin/orders` | Admin | All orders |
| PATCH | `/api/admin/orders/:id` | Admin | Update order status |
| POST | `/api/admin/invoices/:id` | Admin | Generate invoice |

---

## 7. Constraints and Assumptions

### 7.1 Constraints

- Payment currency is INR only (Razorpay India)
- GST calculation supports intra-state (CGST+SGST) and inter-state (IGST) scenarios
- Admin accounts are seeded manually; self-registration only creates `user` role accounts
- Product images are managed via Advlust import or direct URL references

### 7.2 Assumptions

- Users have access to modern browsers with JavaScript enabled
- The hosting environment provides a PostgreSQL-compatible connection string via `DATABASE_URL`
- Razorpay credentials (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`) are configured as environment variables
- WhatsApp Business API credentials are configured as environment variables
- The `public/invoices/` directory is writable at runtime
