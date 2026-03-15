# Backend Documentation

This document covers the Express server, API endpoints, authentication, database schema, and service integrations for Expelight.

---

## Table of Contents

- [Server Entry Point](#server-entry-point)
- [Authentication](#authentication)
- [API Routes](#api-routes)
  - [Public Routes](#public-routes)
  - [Authenticated User Routes](#authenticated-user-routes)
  - [Admin Routes](#admin-routes)
- [Database Schema](#database-schema)
- [Storage Interface](#storage-interface)
- [Services](#services)
  - [Invoice Generation](#invoice-generation)
  - [WhatsApp Integration](#whatsapp-integration)
  - [Image Uploads](#image-uploads)
- [Database Seeding](#database-seeding)

---

## Server Entry Point

**File:** `server/index.ts`

The server is a standard Node.js HTTP server built on Express. On startup it:

1. Creates an Express app and HTTP server
2. Enables `trust proxy` for session cookies behind Replit's proxy
3. Attaches JSON body parsing (with raw body capture for Razorpay signature verification)
4. Calls `registerRoutes()` to mount all API routes
5. Mounts Vite middleware in development, or serves `dist/public` in production
6. Listens on the port specified by `process.env.PORT` (default `5000`)
7. Runs all database seeders (products, categories, vehicles, admin user)

**Development vs. Production:**

- Development: `NODE_ENV=development npx tsx server/index.ts`
- Production: `node dist/index.cjs`

---

## Authentication

**File:** `server/auth.ts`

Authentication is session-based using `express-session` and `bcryptjs`.

### Session Configuration

- **Store:** PostgreSQL via `connect-pg-simple` (table: `sessions`, auto-created on startup)
- **Session duration:** 7 days
- **Cookie settings:** `httpOnly`, `secure` and `sameSite: "none"` in production/Replit, `lax` in local development
- **Secret:** `SESSION_SECRET` environment variable (falls back to a development default — always set this in production)

### Middleware

Two route-protection middlewares are exported from `server/auth.ts`:

```
isAuthenticated  — any logged-in user
isAdmin          — users with role === "admin"
```

Both return `401 Not authenticated` or `403 Forbidden` if the check fails.

### User Roles

The `users` table has a `role` column (`"user"` | `"admin"`). The default role for new registrations is `"user"`. Admin accounts must be created manually or via the seed script.

---

## API Routes

All routes are registered in `server/routes.ts`.

### Public Routes

These require no authentication.

#### Health check

| Method | Path | Description |
|---|---|---|
| GET | `/_health` | Returns `"ok"` — used by the deployment host |

#### Authentication

| Method | Path | Body | Description |
|---|---|---|---|
| POST | `/api/auth/register` | `{ username, email, password, firstName?, lastName? }` | Register a new user |
| POST | `/api/auth/login` | `{ username, password }` | Log in and create a session |
| POST | `/api/auth/logout` | — | Destroy the current session |
| GET | `/api/auth/user` | — | Return the current logged-in user, or `null` |

#### Categories

| Method | Path | Description |
|---|---|---|
| GET | `/api/categories` | All categories (hierarchical, sorted) |

#### Products

| Method | Path | Description |
|---|---|---|
| GET | `/api/products` | All active products (supports `?search=` and `?category=`) |
| GET | `/api/products/:slug` | Single product with full details |
| GET | `/api/products/:id/variants` | All variants for a product |

#### Vehicles & Fitment

| Method | Path | Description |
|---|---|---|
| GET | `/api/vehicles` | All vehicles |
| GET | `/api/vehicle-makes` | Distinct makes (e.g. Mahindra, Toyota) |
| GET | `/api/vehicle-models/:make` | Models for a given make |
| GET | `/api/vehicles/:id/compatible-products` | Products compatible with a vehicle |

#### Reviews

| Method | Path | Description |
|---|---|---|
| GET | `/api/reviews` | All published reviews |

#### Blog

| Method | Path | Description |
|---|---|---|
| GET | `/api/blog` | All published blog posts |
| GET | `/api/blog/:slug` | Single blog post |

---

### Authenticated User Routes

These require the user to be logged in (`isAuthenticated`).

#### Cart

| Method | Path | Body | Description |
|---|---|---|---|
| GET | `/api/cart` | — | Get the current user's cart items |
| POST | `/api/cart` | `{ productId, variantId, quantity }` | Add an item |
| PATCH | `/api/cart/:id` | `{ quantity }` | Update quantity |
| DELETE | `/api/cart/:id` | — | Remove an item |

#### Payments (Razorpay)

| Method | Path | Body | Description |
|---|---|---|---|
| GET | `/api/razorpay/key` | — | Returns `{ key: RAZORPAY_KEY_ID }` for the frontend |
| POST | `/api/razorpay/create-order` | `{ amount, currency? }` | Creates a Razorpay order, returns `{ orderId }` |
| POST | `/api/razorpay/verify-payment` | `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData }` | Verifies HMAC signature and creates the order in the database |

**Payment flow:**
1. Frontend calls `POST /api/razorpay/create-order` with the INR amount (in paise)
2. Frontend opens the Razorpay modal with the returned `orderId`
3. On success, frontend calls `POST /api/razorpay/verify-payment`
4. Server verifies the HMAC-SHA256 signature using `RAZORPAY_KEY_SECRET`
5. On success, the order is created in the database

#### Orders

| Method | Path | Description |
|---|---|---|
| GET | `/api/orders` | Orders belonging to the current user |

---

### Admin Routes

All routes below require `isAdmin`.

#### Dashboard

| Method | Path | Description |
|---|---|---|
| GET | `/api/admin/stats` | Total orders, revenue, products, and recent orders |
| GET | `/api/admin/check` | Returns `{ ok: true }` — used by the frontend to gate admin pages |

#### Categories

| Method | Path | Body | Description |
|---|---|---|---|
| GET | `/api/admin/categories` | — | All categories |
| POST | `/api/admin/categories` | Category fields | Create a category |
| PATCH | `/api/admin/categories/:id` | Partial category fields | Update a category |
| DELETE | `/api/admin/categories/:id` | — | Delete a category |

#### Products

| Method | Path | Body | Description |
|---|---|---|---|
| GET | `/api/admin/products` | — | All products (including inactive) |
| POST | `/api/admin/products` | Product fields | Create a product |
| PATCH | `/api/admin/products/:id` | Partial product fields | Update a product |
| DELETE | `/api/admin/products/:id` | — | Delete a product |

#### Product Variants

| Method | Path | Body | Description |
|---|---|---|---|
| POST | `/api/admin/products/:productId/variants` | Variant fields | Add a variant to a product |
| PATCH | `/api/admin/variants/:id` | Partial variant fields | Update a variant |
| DELETE | `/api/admin/variants/:id` | — | Delete a variant |

#### Product Media

| Method | Path | Body | Description |
|---|---|---|---|
| POST | `/api/admin/products/:productId/media` | `{ url, altText?, mediaType?, isPrimary?, sortOrder? }` | Add a media record |
| DELETE | `/api/admin/media/:id` | — | Remove a media record |

#### Orders (Admin)

| Method | Path | Body | Description |
|---|---|---|---|
| GET | `/api/admin/orders` | — | All orders with line items |
| PATCH | `/api/admin/orders/:id` | `{ status }` | Update order status |

#### Invoices

| Method | Path | Description |
|---|---|---|
| GET | `/api/admin/invoices` | All invoices |
| POST | `/api/admin/orders/:id/generate-invoice` | Generate a PDF invoice for an order |
| POST | `/api/admin/invoices/:id/send-whatsapp` | Send invoice PDF via WhatsApp |
| GET | `/api/admin/whatsapp/status` | Check WhatsApp API connectivity |

#### Blog

| Method | Path | Body | Description |
|---|---|---|---|
| GET | `/api/admin/blog` | — | All posts (including drafts) |
| POST | `/api/admin/blog` | Post fields | Create a blog post |
| PATCH | `/api/admin/blog/:id` | Partial post fields | Update a blog post |
| DELETE | `/api/admin/blog/:id` | — | Delete a post |

#### Image Upload

| Method | Path | Body | Description |
|---|---|---|---|
| POST | `/api/admin/upload` | `multipart/form-data` with field `image` | Upload an image file; returns `{ url }` |

Accepted types: PNG, JPG, WebP (any `image/*` MIME type). Max size: 10 MB. Files are saved to `public/uploads/` and served as static assets.

#### Advlust / Diode Dynamics Sync

| Method | Path | Description |
|---|---|---|
| GET | `/api/admin/advlust/products` | Fetch raw product list from Advlust |
| POST | `/api/admin/advlust/import` | Import all Advlust products into the database |
| POST | `/api/admin/advlust/sync/:productId` | Sync a single product from Advlust |

---

## Database Schema

**File:** `shared/schema.ts` (and `shared/models/auth.ts` for users/sessions)

All primary keys are UUID strings generated by PostgreSQL (`gen_random_uuid()`). Monetary values are stored as integers in paise (INR × 100).

### `users`

| Column | Type | Notes |
|---|---|---|
| id | varchar (UUID) | Primary key |
| username | text | Unique |
| email | text | Unique |
| password_hash | text | bcrypt hash |
| first_name | text | Nullable |
| last_name | text | Nullable |
| role | text | `"user"` or `"admin"` |
| created_at | timestamp | Auto |
| updated_at | timestamp | Auto |

### `sessions`

Managed automatically by `connect-pg-simple`. Stores Express session data.

### `categories`

| Column | Type | Notes |
|---|---|---|
| id | varchar (UUID) | Primary key |
| name | text | |
| slug | text | Unique URL-safe identifier |
| description | text | Nullable |
| parent_id | varchar | References another category (nullable) |
| level | integer | 0 = top, 1 = sub, 2 = sub-sub |
| sort_order | integer | Display ordering |
| is_active | boolean | |
| image_url | text | Nullable |

### `products`

| Column | Type | Notes |
|---|---|---|
| id | varchar (UUID) | Primary key |
| name | text | |
| slug | text | Unique |
| sku | text | Nullable |
| series | text | Sport / Pro / Max |
| tagline | text | Short marketing line |
| short_description | text | |
| full_description | text | |
| price | integer | INR paise |
| original_price | integer | Nullable, for showing strikethrough price |
| beam_patterns | text[] | Spot, Driving, Fog, etc. |
| colors | text[] | White, Yellow, etc. |
| features | text[] | Bullet-point features |
| specs | text[] | Technical spec strings |
| specifications_table | text | JSON string |
| part_numbers | text | JSON string |
| qa_content | text | JSON string |
| installation_guide | text | JSON string |
| whats_in_box | text[] | |
| warranty_years | integer | Default 8 |
| images | text[] | Array of image URLs |
| compatible_vehicles | text[] | |
| is_popular | boolean | |
| is_active | boolean | |
| advlust_product_id | text | Nullable — Advlust sync reference |
| advlust_handle | text | Nullable |
| video_url | text | Nullable YouTube URL |
| is_pre_order | boolean | |
| pre_order_message | text | Nullable |

### `product_variants`

| Column | Type | Notes |
|---|---|---|
| id | varchar (UUID) | Primary key |
| product_id | varchar | FK → products |
| sku | text | Unique |
| name | text | |
| price | integer | INR paise |
| compare_at_price | integer | Nullable |
| color | text | Nullable |
| beam_pattern | text | Nullable |
| model | text | Nullable |
| size | text | Nullable |
| stock_quantity | integer | |
| is_available | boolean | |
| weight | decimal | Nullable |
| image_url | text | Nullable |

### `product_media`

| Column | Type | Notes |
|---|---|---|
| id | varchar (UUID) | Primary key |
| product_id | varchar | FK → products |
| url | text | |
| alt_text | text | Nullable |
| media_type | text | `"image"` or `"video"` |
| is_primary | boolean | |
| sort_order | integer | |

### `product_categories`

Junction table for many-to-many product ↔ category mapping.

| Column | Type |
|---|---|
| id | varchar (UUID) |
| product_id | varchar |
| category_id | varchar |

### `vehicles`

| Column | Type | Notes |
|---|---|---|
| id | varchar (UUID) | Primary key |
| make | text | e.g. Mahindra |
| model | text | e.g. Thar |
| year | text | |
| compatible_product_ids | text[] | Array of product IDs |

### `orders`

| Column | Type | Notes |
|---|---|---|
| id | varchar (UUID) | Primary key |
| user_id | varchar | FK → users |
| status | text | pending / confirmed / shipped / delivered / cancelled |
| total_amount | integer | INR paise |
| razorpay_order_id | text | |
| razorpay_payment_id | text | |
| shipping_address | text | JSON string |
| line_items | text | JSON string |

### `cart_items`

| Column | Type |
|---|---|
| id | varchar (UUID) |
| user_id | varchar |
| product_id | varchar |
| variant_id | varchar (nullable) |
| quantity | integer |

### `invoices`

| Column | Type | Notes |
|---|---|---|
| id | varchar (UUID) | Primary key |
| order_id | varchar | FK → orders |
| invoice_number | text | Unique |
| subtotal | integer | |
| tax_amount | integer | |
| shipping_amount | integer | |
| discount_amount | integer | |
| total_amount | integer | |
| tax_breakdown | text | JSON (CGST / SGST / IGST) |
| pdf_url | text | Path to generated PDF |
| status | text | generated / sent / paid |
| sent_via_whatsapp | boolean | |
| whatsapp_sent_at | timestamp | Nullable |

### `blog_posts`

| Column | Type | Notes |
|---|---|---|
| id | varchar (UUID) | Primary key |
| title | text | |
| slug | text | Unique |
| content | text | Full markdown/HTML |
| excerpt | text | Nullable |
| featured_image | text | Nullable URL |
| author | text | |
| category | text | |
| is_published | boolean | |
| published_at | timestamp | Nullable |

---

## Storage Interface

**File:** `server/storage.ts`

The `IStorage` interface defines all database operations used by route handlers. Using this layer keeps routes thin and the data access logic testable.

Key method groups:

```
Users:      getUser, getUserByUsername, getUserByEmail, createUser
Products:   getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct
Variants:   getVariantsByProduct, createVariant, updateVariant, deleteVariant
Categories: getCategories, createCategory, updateCategory, deleteCategory
Orders:     getOrders, getOrdersByUser, createOrder, updateOrderStatus
Cart:       getCartItems, addCartItem, updateCartItem, removeCartItem
Invoices:   getInvoices, createInvoice, updateInvoice
Blog:       getBlogPosts, getBlogPostBySlug, createBlogPost, updateBlogPost, deleteBlogPost
Vehicles:   getVehicles, getVehicleMakes, getVehicleModels, getCompatibleProducts
```

---

## Services

### Invoice Generation

**File:** `server/invoiceService.ts`

Uses `pdfkit` to generate branded, GST-compliant PDF invoices. Generated files are saved to `public/invoices/` with a unique invoice number as the filename.

The PDF includes:
- Expelight branding and address
- Customer billing/shipping address
- Line items with HSN codes and quantities
- CGST / SGST / IGST breakdown (determined by the customer's state)
- Grand total
- QR code / payment reference

### WhatsApp Integration

**File:** `server/whatsappService.ts`

Sends invoice PDFs to customers via the Meta WhatsApp Business Cloud API.

**Required environment variables:**
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_ACCESS_TOKEN`

Supports:
- `sendDocument()` — sends a PDF file as a WhatsApp document message
- `sendText()` — sends a plain text message

### Image Uploads

**File:** `server/routes.ts` (upload middleware)

Uses `multer` with disk storage. Configuration:

- **Destination:** `public/uploads/`
- **Filename:** `{timestamp}-{random}.{ext}`
- **Max file size:** 10 MB
- **Accepted types:** Any `image/*` MIME type
- **Endpoint:** `POST /api/admin/upload` (admin only)
- **Response:** `{ url: "/uploads/filename.jpg" }`

---

## Database Seeding

On every startup, four seeders run automatically (errors are caught and logged without crashing):

| Seeder | File | What it does |
|---|---|---|
| `seedAdminUser` | `server/seedAdminUser.ts` | Creates a default `admin` user if none exists |
| `seedMissingProducts` | `server/seedMissingProducts.ts` | Imports any products not yet in the database |
| `seedMissingCategories` | `server/seedMissingCategories.ts` | Creates any categories not yet in the database |
| `seedVehiclesAndReviews` | `server/seedVehiclesAndReviews.ts` | Populates vehicles and sample reviews |

To reset and re-seed, truncate the relevant tables and restart the server.
