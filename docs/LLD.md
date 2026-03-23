# Low Level Design (LLD)
## Expelight — Premium Automotive LED Lighting E-Commerce Platform

**Version:** 1.0  
**Date:** March 2026  
**Status:** Final

---

## Table of Contents

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Database Design](#2-database-design)
3. [Backend Module Design](#3-backend-module-design)
4. [Frontend Module Design](#4-frontend-module-design)
5. [Detailed Flow Diagrams](#5-detailed-flow-diagrams)
6. [API Contract Details](#6-api-contract-details)
7. [Service Layer Design](#7-service-layer-design)
8. [State Management Design](#8-state-management-design)

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         EXPELIGHT SYSTEM                                │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    CLIENT (Browser)                             │   │
│  │                                                                 │   │
│  │  React 18 + Vite + TypeScript                                   │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │   │
│  │  │  Pages   │  │Components│  │  Hooks   │  │ TanStack     │   │   │
│  │  │ (Wouter) │  │(Shadcn)  │  │(cart,    │  │ Query        │   │   │
│  │  │          │  │          │  │ auth,    │  │ (API Cache)  │   │   │
│  │  └──────────┘  └──────────┘  │ toast)   │  └──────────────┘   │   │
│  │                               └──────────┘                     │   │
│  └─────────────────────┬───────────────────────────────────────────┘   │
│                        │ HTTP REST (JSON) / Same Port                   │
│  ┌─────────────────────▼───────────────────────────────────────────┐   │
│  │                   SERVER (Express 5 / Node.js 20)               │   │
│  │                                                                 │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌────────────┐  │   │
│  │  │   Auth    │  │  Routes   │  │  Storage  │  │ Services   │  │   │
│  │  │ (Passport │  │ (REST API)│  │(Interface)│  │(Invoice,   │  │   │
│  │  │  Session) │  │           │  │           │  │ WhatsApp)  │  │   │
│  │  └───────────┘  └───────────┘  └─────┬─────┘  └────────────┘  │   │
│  │                                       │                         │   │
│  │  ┌─────────────────────────────────── │ ──────────────────────┐│   │
│  │  │               Drizzle ORM          │                       ││   │
│  │  └─────────────────────────────────── │ ──────────────────────┘│   │
│  └───────────────────────────────────────│─────────────────────────┘   │
│                                          │                              │
│  ┌───────────────────────────────────────▼─────────────────────────┐   │
│  │              PostgreSQL (Neon Serverless)                        │   │
│  │  users │ products │ product_variants │ categories │ orders       │   │
│  │  cart_items │ vehicles │ reviews │ invoices │ blog_posts │ sessions│ │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  External Services:                                                     │
│  ┌──────────────┐  ┌─────────────────┐  ┌─────────────────────────┐   │
│  │  Razorpay    │  │ Meta Graph API  │  │  Advlust JSON API       │   │
│  │  (Payments)  │  │  (WhatsApp)     │  │  (Product Import)       │   │
│  └──────────────┘  └─────────────────┘  └─────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Request Lifecycle

```
Browser Request
     │
     ▼
Express App (server/index.ts)
     │
     ├─► Static files (public/) ──────────────────────────────► Response
     │
     ├─► /api/* routes
     │        │
     │        ├─► express.json() middleware (parse body)
     │        ├─► express-session middleware (attach req.user)
     │        ├─► Passport.js (deserialize session user)
     │        ├─► isAuthenticated / isAdmin middleware
     │        ├─► Route handler (server/routes.ts)
     │        │        │
     │        │        ├─► storage.someMethod() ──► Drizzle ORM ──► PostgreSQL
     │        │        └─► External API call (Razorpay / WhatsApp)
     │        │
     │        └─► JSON Response
     │
     └─► /* (non-API)
              │
              ├─► Development: Vite middleware (HMR)
              └─► Production: Serve dist/public/index.html
```

---

## 2. Database Design

### 2.1 Entity Relationship Diagram

```
┌──────────────┐         ┌─────────────────┐         ┌──────────────┐
│    users     │         │    products      │         │  categories  │
├──────────────┤         ├─────────────────┤         ├──────────────┤
│ id (PK)      │         │ id (PK)          │         │ id (PK)      │
│ username     │         │ name             │    ┌───►│ name         │
│ email        │         │ slug             │    │    │ slug         │
│ passwordHash │    ┌────│ sku              │    │    │ parentId(FK) │
│ role         │    │    │ series           │    │    │ level (1-3)  │
│ firstName    │    │    │ description      │    │    │ isActive     │
│ lastName     │    │    │ basePrice        │    │    └──────────────┘
└──────┬───────┘    │    │ images[]         │    │
       │            │    │ specs (JSON)     │    │    ┌─────────────────────┐
       │            │    │ beamPatterns[]   │    │    │  product_categories │
       │            │    │ colors[]         │    │    ├─────────────────────┤
       │            │    │ isActive         │    └────│ productId (FK)      │
       │            │    └────────┬─────────┘         │ categoryId (FK)     │
       │            │             │                    └─────────────────────┘
       │            │    ┌────────▼──────────┐
       │            │    │  product_variants  │
       │            │    ├───────────────────┤
       │            │    │ id (PK)            │
       │            │    │ productId (FK)     │
       │            │    │ color              │
       │            │    │ beamPattern        │
       │            │    │ sku                │
       │            │    │ price              │
       │            │    │ stock              │
       │            │    │ isActive           │
       │            │    └───────────────────┘
       │            │
       │            │    ┌──────────────┐    ┌──────────────────┐
       │            │    │  cart_items  │    │    orders        │
       │            │    ├──────────────┤    ├──────────────────┤
       │            └───►│ userId (FK)  │    │ id (PK)          │
       └───────────────► │ variantId(FK)│    │ userId (FK)      │
                    │    │ quantity     │    │ items (JSON)     │
                    │    └──────────────┘    │ totalAmount      │
                    │                        │ shippingAddress  │
                    │                        │ status           │
                    │                        │ razorpayOrderId  │
                    │                        │ razorpayPaymentId│
                    │                        └────────┬─────────┘
                    │                                 │
                    │    ┌──────────────┐             │
                    │    │   invoices   │             │
                    │    ├──────────────┤             │
                    │    │ id (PK)      │◄────────────┘
                    │    │ orderId (FK) │
                    │    │ invoiceNo    │
                    │    │ pdfUrl       │
                    │    │ cgst, sgst   │
                    │    │ igst, total  │
                    │    └──────────────┘
                    │
                    │    ┌──────────────┐    ┌──────────────┐
                    │    │   vehicles   │    │   reviews    │
                    │    ├──────────────┤    ├──────────────┤
                    │    │ id (PK)      │    │ id (PK)      │
                    │    │ make         │    │ productId(FK)│◄──┐
                    │    │ model        │    │ userId (FK)  │   │
                    │    │ year         │    │ rating       │   │
                    │    │ compatible   │    │ comment      │   │
                    │    │ ProductIds[] │    │ verified     │   │
                    │    └──────────────┘    └──────────────┘   │
                    └────────────────────────────────────────────┘
```

### 2.2 Table Specifications

#### `users`
| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | serial | PK | Auto-increment |
| username | varchar(50) | UNIQUE NOT NULL | Login identifier |
| email | varchar(255) | UNIQUE NOT NULL | Contact email |
| passwordHash | text | NOT NULL | bcryptjs hash |
| role | varchar(20) | DEFAULT 'user' | 'user' or 'admin' |
| firstName | varchar(100) | | Optional |
| lastName | varchar(100) | | Optional |

#### `products`
| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | serial | PK | |
| name | varchar(255) | NOT NULL | |
| slug | varchar(255) | UNIQUE NOT NULL | URL-friendly |
| sku | varchar(100) | UNIQUE NOT NULL | |
| series | varchar(50) | | Sport / Pro / Max |
| description | text | | |
| basePrice | integer | NOT NULL | Stored in paise (×100) |
| images | text[] | | Array of URLs |
| specs | json | | Beam specs, dimensions |
| beamPatterns | text[] | | Spot, Flood, Combo |
| colors | text[] | | White, Amber, etc. |
| isActive | boolean | DEFAULT true | |

#### `product_variants`
| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | serial | PK | |
| productId | integer | FK → products.id | |
| color | varchar(100) | NOT NULL | |
| beamPattern | varchar(100) | NOT NULL | |
| sku | varchar(100) | UNIQUE NOT NULL | |
| price | integer | NOT NULL | In paise |
| stock | integer | DEFAULT 0 | |
| isActive | boolean | DEFAULT true | |

#### `orders`
| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | serial | PK | |
| userId | integer | FK → users.id | |
| items | json | NOT NULL | Snapshot of cart |
| totalAmount | integer | NOT NULL | In paise |
| shippingAddress | json | NOT NULL | Full address object |
| status | varchar(50) | DEFAULT 'pending' | |
| razorpayOrderId | varchar(255) | | |
| razorpayPaymentId | varchar(255) | | |
| createdAt | timestamp | DEFAULT now() | |

---

## 3. Backend Module Design

### 3.1 File Structure

```
server/
├── index.ts                  ← App entry: Express setup, server start, seeding
├── routes.ts                 ← All REST API routes (products, auth, cart, orders, admin, payment)
├── auth.ts                   ← Passport.js LocalStrategy, session serialization
├── storage.ts                ← IStorage interface + DatabaseStorage implementation
├── static.ts                 ← Static file serving for production
├── vite.ts                   ← Vite dev middleware integration
├── invoiceService.ts         ← PDF invoice generation (PDFKit)
├── whatsappService.ts        ← WhatsApp message delivery (Meta Graph API)
├── seedAdminUser.ts          ← Seeds default admin (admin / admin123)
├── seedMissingProducts.ts    ← Seeds initial product catalog
├── seedMissingCategories.ts  ← Seeds category hierarchy
└── seedVehiclesAndReviews.ts ← Seeds vehicle fitment data and sample reviews
```

### 3.2 Storage Interface (`IStorage`)

```typescript
interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>
  getUserByUsername(username: string): Promise<User | undefined>
  getUserByEmail(email: string): Promise<User | undefined>
  createUser(user: InsertUser): Promise<User>

  // Products
  getProducts(filters?: ProductFilters): Promise<Product[]>
  getProductById(id: number): Promise<Product | undefined>
  getProductBySlug(slug: string): Promise<Product | undefined>
  createProduct(product: InsertProduct): Promise<Product>
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>
  deleteProduct(id: number): Promise<void>

  // Variants
  getVariantsByProductId(productId: number): Promise<ProductVariant[]>
  createVariant(variant: InsertProductVariant): Promise<ProductVariant>
  updateVariant(id: number, variant: Partial<InsertProductVariant>): Promise<ProductVariant>

  // Categories
  getCategories(): Promise<Category[]>
  getCategoryBySlug(slug: string): Promise<Category | undefined>
  createCategory(category: InsertCategory): Promise<Category>
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category>

  // Cart
  getCartItems(userId: number): Promise<CartItem[]>
  addToCart(item: InsertCartItem): Promise<CartItem>
  updateCartItem(id: number, quantity: number): Promise<CartItem>
  removeFromCart(id: number): Promise<void>
  clearCart(userId: number): Promise<void>

  // Orders
  getOrders(userId?: number): Promise<Order[]>
  getOrderById(id: number): Promise<Order | undefined>
  createOrder(order: InsertOrder): Promise<Order>
  updateOrderStatus(id: number, status: string): Promise<Order>
  setRazorpayPaymentId(id: number, paymentId: string): Promise<Order>

  // Vehicles
  getVehicles(): Promise<Vehicle[]>
  getCompatibleProducts(make: string, model: string, year: number): Promise<Product[]>

  // Reviews
  getReviews(productId?: number): Promise<Review[]>
  createReview(review: InsertReview): Promise<Review>

  // Invoices
  getInvoiceByOrderId(orderId: number): Promise<Invoice | undefined>
  createInvoice(invoice: InsertInvoice): Promise<Invoice>

  // Blog
  getBlogPosts(): Promise<BlogPost[]>
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost>
}
```

### 3.3 Middleware Chain

```
Incoming Request
       │
       ▼
  express.static()          ← Serve /public files
       │
       ▼
  express.json()            ← Parse JSON body; capture rawBody for HMAC
       │
       ▼
  express.urlencoded()      ← Parse form data
       │
       ▼
  express-session()         ← Attach/restore session (Postgres store)
       │
       ▼
  passport.initialize()     ← Set up Passport
       │
       ▼
  passport.session()        ← Deserialize user from session
       │
       ▼
  Request Logger            ← Log method, path, status, duration
       │
       ▼
  Route Handler             ← Business logic
       │
       ├── isAuthenticated  ← req.isAuthenticated() check → 401 if not
       │
       └── isAdmin          ← req.user.role === 'admin' check → 403 if not
```

### 3.4 Authentication Design (`server/auth.ts`)

```
PassportLocalStrategy:
  usernameField: 'username'
  passwordField: 'password'

  verify(username, password, done):
    1. storage.getUserByUsername(username)
    2. If not found → done(null, false, { message: 'User not found' })
    3. bcrypt.compare(password, user.passwordHash)
    4. If no match → done(null, false, { message: 'Invalid password' })
    5. done(null, user)

serializeUser:  (user, done) → done(null, user.id)
deserializeUser: (id, done) → storage.getUser(id) → done(null, user)

Session Store: connect-pg-simple
  Table: sessions
  TTL: 7 days
  Cookie: httpOnly, secure (production), sameSite: 'lax'
```

---

## 4. Frontend Module Design

### 4.1 File Structure

```
client/src/
├── App.tsx                    ← Root: ThemeProvider, QueryClient, Router
├── main.tsx                   ← ReactDOM.createRoot entry
├── pages/
│   ├── Home.tsx               ← Landing page with hero, features, products
│   ├── Products.tsx           ← Product listing with filters
│   ├── ProductDetail.tsx      ← Single product: gallery, variants, reviews
│   ├── Cart.tsx               ← Cart page
│   ├── Checkout.tsx           ← Checkout form + Razorpay integration
│   ├── OrderSuccess.tsx       ← Post-payment confirmation
│   ├── OrderHistory.tsx       ← User's order list
│   ├── TrackOrder.tsx         ← Order status tracker
│   ├── VehicleFit.tsx         ← Fitment selector
│   ├── Category.tsx           ← Category product listing
│   ├── Auth.tsx               ← Login / Register form
│   ├── Admin/
│   │   ├── Dashboard.tsx      ← Admin home: stats
│   │   ├── ProductsAdmin.tsx  ← Product CRUD
│   │   ├── CategoriesAdmin.tsx← Category CRUD
│   │   ├── OrdersAdmin.tsx    ← Order management
│   │   └── BlogAdmin.tsx      ← Blog CMS
│   └── Blog.tsx               ← Public blog listing
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx         ← Top navigation with cart icon
│   │   └── Footer.tsx
│   ├── product/
│   │   ├── ProductCard.tsx    ← Grid card with image, name, price
│   │   ├── ProductGallery.tsx ← Image carousel
│   │   └── VariantSelector.tsx← Color + beam pattern picker
│   ├── cart/
│   │   └── CartDrawer.tsx     ← Slide-out cart panel
│   └── ui/                   ← Shadcn UI components (button, dialog, etc.)
├── hooks/
│   ├── use-auth.ts            ← Auth state: user, login(), logout(), register()
│   ├── use-cart.ts            ← Cart state: items, add(), remove(), merge()
│   └── use-toast.ts           ← Toast notifications
└── lib/
    ├── queryClient.ts         ← TanStack Query client + apiRequest utility
    └── utils.ts               ← clsx/cn, formatting helpers
```

### 4.2 Routing Map

| Path | Component | Auth Required |
|---|---|---|
| `/` | Home | No |
| `/products` | Products | No |
| `/products/:slug` | ProductDetail | No |
| `/category/:slug` | Category | No |
| `/vehicle-fit` | VehicleFit | No |
| `/cart` | Cart | No |
| `/checkout` | Checkout | Yes |
| `/order-success/:id` | OrderSuccess | Yes |
| `/orders` | OrderHistory | Yes |
| `/track` | TrackOrder | No |
| `/auth` | Auth | No |
| `/blog` | Blog | No |
| `/admin` | Admin Dashboard | Admin |
| `/admin/products` | ProductsAdmin | Admin |
| `/admin/categories` | CategoriesAdmin | Admin |
| `/admin/orders` | OrdersAdmin | Admin |
| `/admin/blog` | BlogAdmin | Admin |

### 4.3 Cart Hook Design (`use-cart.ts`)

```
useCart():
  State:
    items: CartItem[]

  On mount:
    if authenticated:
      fetch /api/cart
      set items from server
    else:
      load from localStorage

  addItem(variantId, quantity):
    if authenticated:
      POST /api/cart { variantId, quantity }
      invalidate ['api/cart']
    else:
      update localStorage
      update local state

  removeItem(id):
    if authenticated:
      DELETE /api/cart/:id
    else:
      remove from localStorage

  updateQuantity(id, quantity):
    if authenticated:
      PATCH /api/cart/:id { quantity }
    else:
      update localStorage

  mergeGuestCart() [called on login]:
    guestItems = localStorage.getItem('cart')
    for each guestItem:
      POST /api/cart { variantId, quantity }
    localStorage.removeItem('cart')
    invalidate ['api/cart']
```

### 4.4 Auth Hook Design (`use-auth.ts`)

```
useAuth():
  Query:
    GET /api/auth/user
    queryKey: ['/api/auth/user']
    returns: User | null

  login(credentials):
    POST /api/auth/login
    on success:
      invalidate ['/api/auth/user']
      mergeGuestCart()

  logout():
    POST /api/auth/logout
    on success:
      invalidate ['/api/auth/user']
      clear cart state

  register(data):
    POST /api/auth/register
    on success:
      auto-login
```

---

## 5. Detailed Flow Diagrams

### 5.1 Complete Checkout Sequence Diagram

```
Client (Browser)        Express Server           Razorpay API         PostgreSQL
─────────────────       ────────────────         ────────────         ──────────
      │                       │                       │                    │
      │── POST /checkout ─────►│                       │                    │
      │   (address, phone)    │                       │                    │
      │                       │── isAuthenticated? ───┤                    │
      │                       │                       │                    │
      │◄── 200 form OK ───────│                       │                    │
      │                       │                       │                    │
      │── POST /api/razorpay ─►│                       │                    │
      │   /create-order       │── GET /api/cart ──────────────────────────►│
      │                       │◄─ cart items ─────────────────────────────│
      │                       │                       │                    │
      │                       │ calculate total        │                    │
      │                       │ (items + shipping)     │                    │
      │                       │                       │                    │
      │                       │── POST /v1/orders ────►│                    │
      │                       │   (amount, currency)  │                    │
      │                       │◄── { id, amount } ────│                    │
      │                       │                       │                    │
      │◄── { orderId, key } ──│                       │                    │
      │                       │                       │                    │
      │ [Razorpay modal opens]│                       │                    │
      │ [User pays]           │                       │                    │
      │                       │                       │                    │
      │── POST /api/razorpay ─►│                       │                    │
      │   /verify-payment     │                       │                    │
      │   (paymentId,         │ HMAC verify            │                    │
      │    orderId, sig)      │ (no external call)     │                    │
      │                       │                       │                    │
      │                       │── INSERT orders ──────────────────────────►│
      │                       │◄── order ─────────────────────────────────│
      │                       │                       │                    │
      │                       │── DELETE cart_items ──────────────────────►│
      │                       │                       │                    │
      │                       │── generateInvoice() ───────────────────────►│
      │                       │◄── invoice saved ─────────────────────────│
      │                       │                       │                    │
      │                       │── sendWhatsApp() ─────────────────────────►│(Meta API)
      │                       │                       │                    │
      │◄── { success, orderId}│                       │                    │
      │                       │                       │                    │
      │ [Redirect /order-success/:id]                  │                    │
```

---

### 5.2 Cart Merge Flow (Guest → Authenticated)

```
  localStorage (Browser)        useAuth hook           API Server          PostgreSQL
  ──────────────────────        ─────────────          ──────────          ──────────
          │                          │                      │                   │
  [guest adds items]                 │                      │                   │
  [{variantId, qty}, ...]            │                      │                   │
          │                          │                      │                   │
  [User submits login form]          │                      │                   │
          │                          │                      │                   │
          │──────────────────────────► login()              │                   │
          │                          │── POST /api/auth/login──────────────────►│
          │                          │◄── { user } ────────────────────────────│
          │                          │                      │                   │
          │                          │ mergeGuestCart()     │                   │
          │                          │                      │                   │
          │◄─ read localStorage ─────│                      │                   │
          │── guestItems ───────────►│                      │                   │
          │                          │                      │                   │
          │                          │ for each item:       │                   │
          │                          │── POST /api/cart ───►│                   │
          │                          │   { variantId, qty } │── INSERT cart ───►│
          │                          │◄── 201 ─────────────│◄── item ──────────│
          │                          │                      │                   │
          │◄─ localStorage.clear() ──│                      │                   │
          │                          │                      │                   │
          │                          │ invalidate('/api/cart')                  │
          │                          │── GET /api/cart ────►│                   │
          │                          │◄── merged items ────│                   │
          │                          │                      │                   │
          │                    [Cart UI updates]            │                   │
```

---

### 5.3 Admin Product Import Flow (Advlust)

```
  Admin Browser           Express (isAdmin)        Advlust API         PostgreSQL
  ─────────────           ─────────────────        ───────────         ──────────
       │                         │                     │                   │
  [Admin opens import tool]      │                     │                   │
       │── POST /api/admin/ ────►│                     │                   │
       │   /import-advlust       │                     │                   │
       │   { url or sku }        │                     │                   │
       │                         │── GET advlust JSON ─►│                   │
       │                         │◄── product data ────│                   │
       │                         │                     │                   │
       │                         │ Map fields:          │                   │
       │                         │  name, sku, images   │                   │
       │                         │  specs, variants     │                   │
       │                         │  price, categories   │                   │
       │                         │                     │                   │
       │                         │── INSERT product ───────────────────────►│
       │                         │── INSERT variants ──────────────────────►│
       │                         │── INSERT categories ────────────────────►│
       │                         │◄── success ─────────────────────────────│
       │                         │                     │                   │
       │◄── { imported product } │                     │                   │
       │                         │                     │                   │
  [Admin sees new product        │                     │                   │
   in catalog list]              │                     │                   │
```

---

### 5.4 Invoice Generation Internal Flow

```
invoiceService.generateInvoice(orderId)
         │
         ▼
  storage.getOrderById(orderId)
         │
         ▼
  storage.getUserById(order.userId)
         │
         ▼
  ┌──────────────────────────────────────────┐
  │ GST Calculation Logic:                   │
  │                                          │
  │ items = JSON.parse(order.items)          │
  │ subtotal = Σ (item.price × item.qty)    │
  │                                          │
  │ if (buyer.state === SELLER_STATE):       │
  │   cgst = subtotal × 0.09                │
  │   sgst = subtotal × 0.09                │
  │   igst = 0                              │
  │ else:                                    │
  │   igst = subtotal × 0.18               │
  │   cgst = sgst = 0                       │
  │                                          │
  │ total = subtotal + cgst + sgst + igst   │
  └──────────────────────┬───────────────────┘
         │
         ▼
  new PDFDocument()
         │
         ├── addPage()
         ├── drawHeader(logo, companyInfo, GSTIN)
         ├── drawBuyerInfo(user.name, address)
         ├── drawInvoiceNumber(invoiceNo, date)
         ├── drawItemsTable(items[])
         ├── drawTaxSummary(cgst, sgst, igst)
         └── drawGrandTotal(total)
         │
         ▼
  pipe → fs.WriteStream('public/invoices/{orderId}.pdf')
         │
         ▼
  storage.createInvoice({
    orderId,
    invoiceNumber,
    pdfUrl: '/invoices/{orderId}.pdf',
    cgst, sgst, igst,
    total
  })
         │
         ▼
  return invoiceUrl
```

---

## 6. API Contract Details

### 6.1 POST `/api/razorpay/create-order`

**Request Body:**
```json
{
  "shippingAddress": {
    "line1": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "phone": "9876543210"
}
```

**Response:**
```json
{
  "razorpayOrderId": "order_Abc123",
  "amount": 2999900,
  "currency": "INR",
  "key": "rzp_live_..."
}
```

---

### 6.2 POST `/api/razorpay/verify-payment`

**Request Body:**
```json
{
  "razorpay_order_id": "order_Abc123",
  "razorpay_payment_id": "pay_Xyz789",
  "razorpay_signature": "hmac_sha256_digest",
  "shippingAddress": { ... },
  "phone": "9876543210"
}
```

**Verification Logic:**
```
expectedSignature = HMAC-SHA256(
  key   = RAZORPAY_KEY_SECRET,
  data  = razorpay_order_id + "|" + razorpay_payment_id
)

if expectedSignature === razorpay_signature:
  → proceed with order creation
else:
  → return 400 { message: "Invalid payment signature" }
```

**Response (success):**
```json
{
  "success": true,
  "orderId": 42,
  "invoiceUrl": "/invoices/42.pdf"
}
```

---

### 6.3 GET `/api/products`

**Query Params:**
| Param | Type | Description |
|---|---|---|
| series | string | Filter by series (Sport, Pro, Max) |
| search | string | Search by name or SKU |
| categoryId | number | Filter by category |

**Response:**
```json
[
  {
    "id": 1,
    "name": "SL5 Light Bar",
    "slug": "sl5-light-bar",
    "sku": "DD-SL5",
    "series": "Pro",
    "basePrice": 2499900,
    "images": ["https://..."],
    "specs": { "lumens": 14000, "watts": 100 },
    "isActive": true
  }
]
```

---

## 7. Service Layer Design

### 7.1 `invoiceService.ts`

```
Responsibilities:
  - Fetch order and user data from storage
  - Perform GST tax calculations
  - Build PDF document layout with PDFKit
  - Persist PDF to public/invoices/
  - Create invoice record in database

Key function:
  generateInvoice(orderId: number): Promise<string>
    Returns: public URL of the generated PDF
```

### 7.2 `whatsappService.ts`

```
Responsibilities:
  - Compose order notification message
  - Attach invoice PDF link
  - Send via Meta Graph API
  - Handle API errors gracefully (log, don't crash)

Key function:
  sendOrderNotification(phone: string, order: Order, invoiceUrl: string): Promise<void>

API call:
  POST https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages
  Authorization: Bearer {WHATSAPP_TOKEN}
  Body:
  {
    "messaging_product": "whatsapp",
    "to": "{phone}",
    "type": "template",
    "template": {
      "name": "order_confirmation",
      "components": [...]
    }
  }
```

---

## 8. State Management Design

### 8.1 Server State (TanStack Query)

All server data is managed via TanStack Query v5. No Redux or Zustand is used.

| Query Key | Endpoint | Usage |
|---|---|---|
| `['/api/auth/user']` | GET /api/auth/user | Current user |
| `['/api/products']` | GET /api/products | Product listing |
| `['/api/products', id]` | GET /api/products/:id | Single product |
| `['/api/categories']` | GET /api/categories | Navigation menu |
| `['/api/cart']` | GET /api/cart | Cart contents |
| `['/api/orders']` | GET /api/orders | Order history |
| `['/api/vehicles']` | GET /api/vehicles | Vehicle selector |
| `['/api/reviews', productId]` | GET /api/reviews?productId=x | Product reviews |

### 8.2 Client State

| State | Location | Description |
|---|---|---|
| Guest cart | localStorage `'cart'` | JSON array of cart items |
| Theme | localStorage `'theme'` | 'light' or 'dark' |
| Toast queue | `use-toast` hook | In-memory notification queue |
| Checkout form | `react-hook-form` | Address fields, contact info |
| Admin forms | `react-hook-form` | Product/category CRUD forms |

### 8.3 Cache Invalidation Strategy

```
After login:
  invalidate: ['/api/auth/user'], ['/api/cart']

After logout:
  invalidate: ['/api/auth/user'], ['/api/cart']

After add-to-cart:
  invalidate: ['/api/cart']

After order confirmed:
  invalidate: ['/api/cart'], ['/api/orders']

After admin creates product:
  invalidate: ['/api/products']

After admin updates order:
  invalidate: ['/api/orders']
```
