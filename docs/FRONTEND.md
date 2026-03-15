# Frontend Documentation

This document covers the React frontend for Expelight — its pages, routing, components, hooks, data fetching patterns, and how it connects to the backend.

---

## Table of Contents

- [Overview](#overview)
- [Path Aliases](#path-aliases)
- [Routing](#routing)
- [Pages](#pages)
  - [Customer Pages](#customer-pages)
  - [Admin Pages](#admin-pages)
  - [Policy Pages](#policy-pages)
- [Key Components](#key-components)
- [Hooks](#hooks)
- [Data Fetching](#data-fetching)
- [Payment Flow](#payment-flow)
- [Image Uploads](#image-uploads)
- [Styling](#styling)
- [Admin Area](#admin-area)

---

## Overview

The frontend is a React 18 single-page application written in TypeScript. It is served by Vite in development (with hot module replacement) and compiled to `dist/public/` for production. In both cases it shares the same Express server on port 5000.

**Entry point:** `client/src/main.tsx`
**Root component:** `client/src/App.tsx`

The `App` component wraps everything in:
- `QueryClientProvider` (TanStack Query)
- `TooltipProvider` (Shadcn UI)
- `Toaster` (toast notification output)
- `ScrollToTop` (resets scroll position on navigation)

---

## Path Aliases

Configured in `vite.config.ts` and `tsconfig.json`:

| Alias | Resolves to |
|---|---|
| `@/` | `client/src/` |
| `@shared/` | `shared/` |
| `@assets/` | `attached_assets/` |

Use these in all imports — avoid relative paths that traverse up more than one level.

---

## Routing

**Library:** `wouter`

Routes are defined in `client/src/App.tsx` using `<Switch>` and `<Route>`. There is no lazy loading — all pages are imported eagerly.

A `ScrollToTop` component listens to route changes and calls `window.scrollTo(0, 0)` unless a hash anchor is present.

---

## Pages

### Customer Pages

| Path | File | Description |
|---|---|---|
| `/` | `Home.tsx` | Landing page — hero, featured products, trust bar |
| `/products` | `Products.tsx` | Full product catalog with search and filtering |
| `/product/:slug` | `ProductDetail.tsx` | Product page — gallery, variants, specs, add to cart |
| `/categories` | `Categories.tsx` | Top-level category grid |
| `/category/:slug` | `Category.tsx` | Products filtered by category |
| `/vehicle-fit` | `VehicleFitPage.tsx` | Make → Model → Year fitment selector |
| `/science` | `Science.tsx` | Educational content about LED/TIR optics |
| `/cart` | `Cart.tsx` | Shopping cart with quantity controls |
| `/checkout` | `Checkout.tsx` | Address form + Razorpay payment |
| `/login` | `Login.tsx` | User login form |
| `/signup` | `Signup.tsx` | User registration form |
| `/orders` | `Orders.tsx` | Logged-in user's order history |
| `/track` | `TrackOrder.tsx` | Order status lookup |
| `/guides` | `InstallationGuides.tsx` | Installation guide library |
| `/warranty` | `WarrantyClaims.tsx` | Warranty claim form |
| `/shipping` | `Shipping.tsx` | Shipping info page |
| `/blog/:slug?` | `Blog.tsx` | Blog listing and individual posts |
| `/contact` | `Contact.tsx` | Contact/support form |
| `/faqs` | `FAQs.tsx` | Frequently asked questions |

### Admin Pages

All admin pages render inside `AdminLayout` which checks `/api/admin/check` on mount. If the response is not 200, the user is redirected to `/admin/login`.

| Path | File | Description |
|---|---|---|
| `/admin/login` | `AdminLogin.tsx` | Admin login form |
| `/admin` | `AdminDashboard.tsx` | Sales stats, recent orders |
| `/admin/products` | `AdminProducts.tsx` | Product CRUD, variant management |
| `/admin/categories` | `AdminCategories.tsx` | Category hierarchy management |
| `/admin/orders` | `AdminOrders.tsx` | Order list and status updates |
| `/admin/blog` | `AdminBlog.tsx` | Blog post CRUD |
| `/admin/advlust` | `AdminAdvlust.tsx` | Advlust/Diode Dynamics product sync |

### Policy Pages

Located in `client/src/pages/policies/`.

| Path | File |
|---|---|
| `/policies/returns-warranty` | `ReturnsWarranty.tsx` |
| `/policies/shipping-delivery` | `ShippingDelivery.tsx` |
| `/policies/cancellation` | `CancellationPolicy.tsx` |
| `/policies/pre-order` | `PreOrderPolicy.tsx` |
| `/policies/grievance-redressal` | `GrievanceRedressal.tsx` |
| `/policies/terms-conditions` | `TermsConditions.tsx` |
| `/policies/privacy-policy` | `PrivacyPolicy.tsx` |

---

## Key Components

All shared components live in `client/src/components/`.

### Layout

| File | Description |
|---|---|
| `Header.tsx` | Navigation bar with mega-menu, search, cart icon, and user dropdown |
| `Footer.tsx` | Links, newsletter signup, and policy links |
| `AdminLayout.tsx` | Wrapper for all admin pages — performs auth check |
| `AdminSidebar.tsx` | Navigation sidebar for the admin section |

### Feature Components

| File | Description |
|---|---|
| `ProductPage.tsx` | Image gallery (with zoom), variant selector, spec tabs, add-to-cart logic |
| `VehicleFit.tsx` | Multi-step make/model/year selector that calls the vehicle fitment API |
| `HeroSection.tsx` | Animated landing page hero |
| `FloatingContact.tsx` | Sticky WhatsApp/contact button |
| `ImageUploadInput.tsx` | Dual-mode image field (URL or file upload) — used in all admin forms |

### UI Components

Located in `client/src/components/ui/`. These are all from the Shadcn UI library and should not be modified directly.

Key components used throughout the app:
- `Button`, `Input`, `Textarea`, `Label`
- `Dialog`, `Select`, `Switch`, `Tabs`
- `Card`, `Badge`, `Separator`
- `Toast` / `Toaster` (via `useToast`)

---

## Hooks

Located in `client/src/hooks/`.

### `use-auth.ts`

Manages the current user session.

```ts
const { user, isLoading, login, register, logout } = useAuth();
```

- `user` — the logged-in user object, or `null`
- `login(credentials)` — calls `POST /api/auth/login`
- `register(data)` — calls `POST /api/auth/register`
- `logout()` — calls `POST /api/auth/logout`

Uses TanStack Query with the key `["/api/auth/user"]`. Mutations invalidate this key on success.

### `use-cart.ts`

Manages a hybrid cart that works for both logged-in and anonymous users.

- Anonymous users: cart items are stored in `localStorage`
- Logged-in users: cart items are synced to the server via `/api/cart`
- On login, the local cart is merged with the server cart

```ts
const { items, addItem, updateItem, removeItem, clearCart, total } = useCart();
```

### `use-mobile.tsx`

Returns a boolean indicating whether the viewport is below the mobile breakpoint.

```ts
const isMobile = useMobile();
```

### `use-toast.ts`

Re-export of the Shadcn toast hook.

```ts
const { toast } = useToast();
toast({ title: "Done", description: "Your item was added." });
```

---

## Data Fetching

The frontend uses **TanStack Query v5** for all server state. The global `QueryClient` is configured in `client/src/lib/queryClient.ts`.

### Default fetcher

A default `queryFn` is pre-configured. Any query whose key starts with `"/"` will be fetched automatically:

```ts
useQuery({ queryKey: ["/api/products"] });
```

No `queryFn` is needed for standard GET requests.

### Mutations

Use `apiRequest` from `@/lib/queryClient` for POST/PATCH/DELETE:

```ts
import { apiRequest, queryClient } from "@/lib/queryClient";

const mutation = useMutation({
  mutationFn: (data) => apiRequest("POST", "/api/cart", data),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/cart"] }),
});
```

Always invalidate the relevant query key after a successful mutation.

### Cache invalidation patterns

For hierarchical or parameterized keys, use arrays:

```ts
queryKey: ["/api/products", productId]
// Invalidate all products:
queryClient.invalidateQueries({ queryKey: ["/api/products"] });
```

### Loading and error states

- Use `.isLoading` for queries (shows skeleton/spinner)
- Use `.isPending` for mutations (disables submit buttons)
- Handle `.error` to show error messages

---

## Payment Flow

The checkout page implements a full Razorpay payment flow:

1. User fills in the shipping address and clicks "Pay"
2. Frontend calls `POST /api/razorpay/create-order` with the total in paise
3. Backend creates a Razorpay order and returns `{ orderId }`
4. Frontend fetches the Razorpay key from `GET /api/razorpay/key`
5. Frontend loads the Razorpay JS SDK and opens the payment modal
6. On successful payment, Razorpay calls the frontend handler with `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }`
7. Frontend calls `POST /api/razorpay/verify-payment` with those values plus the order data
8. Backend verifies the HMAC-SHA256 signature and creates the order in the database
9. Frontend receives the confirmed order and redirects to the orders page

---

## Image Uploads

**File:** `client/src/components/ImageUploadInput.tsx`

Two reusable components handle image input across all admin forms:

### `ImageUploadInput` (single image)

Used for: category images, blog featured images, product variant images.

```tsx
<ImageUploadInput
  label="Featured Image"
  value={formData.featuredImage}
  onChange={(url) => setFormData({ ...formData, featuredImage: url })}
  testId="input-blog-image"
/>
```

### `MultiImageUploadInput` (multiple images)

Used for: product images array. Supports selecting multiple files at once.

```tsx
<MultiImageUploadInput
  label="Product Images"
  value={formData.images}          // newline-separated URL string
  onChange={(val) => setFormData({ ...formData, images: val })}
  testId="input-product-images"
/>
```

Both components provide two modes toggled by buttons:

- **URL mode** — paste one or more URLs directly
- **Upload mode** — click to open a file picker; the file is POSTed to `POST /api/admin/upload` and the returned URL is added automatically

A thumbnail preview with an × remove button is shown for each image.

---

## Styling

The project uses **Tailwind CSS** with the Shadcn UI design system.

### Conventions

- Use the `@/components/ui/` Shadcn components for all form controls and layout primitives
- Use `cn()` from `@/lib/utils` to conditionally merge class names
- Dark mode is handled via the `dark` class on `<html>` — use `dark:` variants for all colour properties not covered by design tokens
- Icons: `lucide-react` for UI icons, `react-icons/si` for brand logos (Razorpay, WhatsApp, etc.)
- Animations: `framer-motion` for page transitions and interactive animations

### CSS variables

Custom colour tokens are defined in `client/src/index.css` as HSL values without the `hsl()` wrapper:

```css
:root {
  --primary: 15 100% 50%;    /* H S% L% format */
}
.dark {
  --primary: 15 100% 60%;
}
```

Reference them in Tailwind with `bg-primary`, `text-primary`, etc.

---

## Admin Area

### Access control

Every admin page component checks authentication by querying `GET /api/admin/check` inside `AdminLayout`. If it returns 401 or 403, the user is shown an "Access Denied" message.

Admin credentials are set during seeding (see [Database Seeding](./BACKEND.md#database-seeding)).

### Navigation

The `AdminSidebar` renders links to:
- Dashboard
- Products
- Categories
- Orders
- Blog
- Advlust Sync

### Adding a new admin page

1. Create the page file in `client/src/pages/AdminMyPage.tsx`
2. Wrap the content with `<AdminLayout>`
3. Add the route in `client/src/App.tsx`:
   ```tsx
   <Route path="/admin/my-page" component={AdminMyPage} />
   ```
4. Add a link to `AdminSidebar.tsx`
5. Add the corresponding API route(s) in `server/routes.ts` using the `isAdmin` middleware
