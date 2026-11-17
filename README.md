# 🏥 National Care Group Medical Store
### مجموعة العناية الوطنية — متجر المستلزمات الطبية

A bilingual **(Arabic / English)** medical e-commerce web application built for the Kuwaiti market. Customers can browse a product catalog with multi-tier bundle pricing in KWD, manage a shopping cart, apply promo codes, and go through a full demo checkout flow — all in a responsive, RTL/LTR-aware interface.

---

## ✨ Features

### 🛍️ Customer Storefront
| Feature | Details |
|---|---|
| **Home Page Carousel** | Animated product carousel — 3 cards on desktop, 2 on tablet, 1 on mobile. Arrow navigation + pagination dots. |
| **Products Page** | Full product listing in a 3-column responsive grid. Real-time search + brand/category filters. |
| **Product Details Page** | Dedicated page per product (`/products/:id`). Shows all pricing tiers, quantity selector, calculated total, and Add to Cart. |
| **Shopping Cart** | Bundle quantity management. Each offer variant is a separate cart line. Promo code support. Subtotal / discount / grand total breakdown. |
| **Promo Code** | Enter `PROMO50` at checkout for **50% off** the entire cart. |
| **Demo Checkout** | Cash on Delivery or Visa (simulation only — no real payment gateway). |
| **Order Confirmation** | Shows order reference number, order summary, and clears the cart. |

### 🌐 Localisation & Accessibility
| Feature | Details |
|---|---|
| **Arabic (RTL)** | Full right-to-left layout, Arabic product names and descriptions. |
| **English (LTR)** | Standard left-to-right layout. |
| **Language Switcher** | Persistent across all pages via `LanguageContext`. |
| **Dark / Light Theme** | Toggle in the navbar, persisted in `ThemeContext`. |

### 🔒 Admin Dashboard
| Feature | Details |
|---|---|
| **Protected Route** | `/admin` requires a Supabase-authenticated user with `role = 'admin'` in `public.profiles`. |
| **Product Management** | Create, edit, and delete products with image upload to Supabase Storage. |
| **Brand & Category CRUD** | Manage brands and categories used for filtering. |
| **Pricing Tier Management** | Add multiple bundle offers per product (e.g. 1 box, 3 boxes, 6 boxes). |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [TypeScript 7](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 8](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) (via `@tailwindcss/vite`) |
| **Database / Auth / Storage** | [Supabase](https://supabase.com/) (Postgres + Auth + Storage) |
| **Routing** | [React Router DOM v7](https://reactrouter.com/) |
| **Animations** | [Motion](https://motion.dev/) (formerly Framer Motion) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Toasts** | [Sonner](https://sonner.emilkowal.ski/) |
| **Utilities** | `clsx`, `tailwind-merge` |

---

## 📋 Prerequisites

- **Node.js** v18 or later (`node -v` to check)
- **npm** v9 or later (`npm -v` to check)
- A free **[Supabase](https://supabase.com/)** account and project

---

## 🚀 Setup & Installation

### 1 — Clone / Download the project

```bash
cd national-care-group-medical-store
```

### 2 — Install dependencies

```bash
npm install
```

> If you see an `ERESOLVE` peer dependency error, run:
> ```bash
> npm install --legacy-peer-deps
> ```

### 3 — Configure environment variables

Create a `.env` file in the project root (copy the template below):

```bash
cp .env.example .env   # if .env.example exists, otherwise create .env manually
```

Then open `.env` and fill in your values:

```env
# Gemini AI API key (used for any AI features)
GEMINI_API_KEY="your_gemini_api_key_here"

# Public URL of your deployed app (optional for local dev)
APP_URL="http://localhost:3000"

# Supabase — copy from: Dashboard → Project Settings → API
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your_supabase_anon_key_here"
```

### 4 — Set up the Supabase database

1. Open your **Supabase Dashboard** → **SQL Editor** → **New Query**
2. Paste the entire contents of [`supabase/schema.sql`](./supabase/schema.sql) and click **Run**

This will create:
- `public.profiles` — user roles (`customer` / `admin`)
- `public.brands` — product brands
- `public.categories` — product categories
- `public.products` — the product catalog (AR + EN names and descriptions)
- `public.pricing_tiers` — bundle pricing offers per product
- RLS (Row-Level Security) policies for all tables
- Storage bucket: `product-images`
- 3 sample products with multi-tier pricing (seeded automatically)

### 5 — Start the development server

```bash
npm run dev
```

The app runs at **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 Admin Account Setup

The admin dashboard at `/admin` requires a user with `role = 'admin'` in the database. Here is how to create one:

### Step 1 — Create the user in Supabase Auth

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter an email and password, and **enable "Auto Confirm User"**
4. Click **Create User**

### Step 2 — Grant admin role via SQL Editor

Go to **SQL Editor** → **New Query** and run:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-admin-email@example.com';
```

> **Why SQL Editor?** The app has a `prevent_role_self_escalation` trigger that blocks role changes from client-side queries. The SQL Editor runs as the Postgres superuser and is exempt from this restriction.

### Step 3 — Verify

```sql
SELECT id, email, role FROM public.profiles WHERE email = 'your-admin-email@example.com';
```

The `role` column should show `admin`.

### Step 4 — Sign in

Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login) and sign in with the credentials you created.

---

## 🎟️ Promo Code

| Code | Discount | Where to use |
|---|---|---|
| `PROMO50` | **50% off** the entire cart | Cart page → Order Summary sidebar |

---

## 🗺️ Application Routes

| Route | Page | Access |
|---|---|---|
| `/` | Home — animated product carousel + hero | Public |
| `/products` | Products listing — search, brand/category filters, 3-col grid | Public |
| `/products/:id` | Product Details — pricing tiers, quantity, Add to Cart | Public |
| `/cart` | Shopping Cart — bundle management, promo code, totals | Public |
| `/checkout` | Demo Checkout — customer info + payment simulation | Public |
| `/admin/login` | Admin Sign In | Public |
| `/admin` | Admin Dashboard — product/brand/category/pricing CRUD | Admin only |

---

## 📁 Project Structure

```
national-care-group-medical-store/
├── public/                        # Static assets
├── src/
│   ├── components/
│   │   ├── auth/                  # ProtectedRoute (admin guard)
│   │   ├── layout/                # Navbar, Footer
│   │   ├── storefront/            # ProductCard, ProductCarousel, ProductCardSkeleton
│   │   └── ui/                    # MedicalImage, ConfirmDialog
│   ├── context/
│   │   ├── AuthContext.tsx        # Supabase auth + admin role check
│   │   ├── CartContext.tsx        # Cart state, promo code (PROMO50), totals
│   │   ├── LanguageContext.tsx    # AR / EN switcher, RTL/LTR direction
│   │   └── ThemeContext.tsx       # Dark / Light theme toggle
│   ├── i18n/
│   │   └── translations.ts        # All UI strings in Arabic and English
│   ├── pages/
│   │   ├── HomePage.tsx           # Hero + ProductCarousel + CTA
│   │   ├── ProductsPage.tsx       # Full product listing + filters
│   │   ├── ProductDetailsPage.tsx # Single product detail + Add to Cart
│   │   ├── CartPage.tsx           # Cart items + promo code + totals
│   │   ├── CheckoutPage.tsx       # Demo checkout + order confirmation
│   │   ├── AdminLoginPage.tsx     # Admin sign-in form
│   │   └── AdminDashboardPage.tsx # Full admin CRUD dashboard
│   ├── services/
│   │   ├── catalog.ts             # Supabase queries for storefront
│   │   └── adminCatalog.ts        # Supabase queries for admin CRUD
│   ├── types/
│   │   └── database.ts            # TypeScript types for all DB tables
│   ├── utils/
│   │   ├── currency.ts            # KWD fils formatting helpers
│   │   └── cn.ts                  # clsx + tailwind-merge utility
│   ├── App.tsx                    # Route definitions
│   ├── main.tsx                   # React entry point
│   └── supabaseClient.ts          # Supabase JS client initialisation
├── supabase/
│   └── schema.sql                 # Full DB schema + RLS + seed data
├── .env                           # Environment variables (not committed)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🧪 Available Scripts

```bash
npm run dev       # Start development server at http://localhost:3000
npm run build     # Production build (outputs to /dist)
npm run preview   # Locally preview the production build
npm run lint      # TypeScript type check (tsc --noEmit), zero errors required
npm run clean     # Remove dist/ and server.js
```

---

## 💰 Pricing System

Products use a **multi-tier bundle pricing** model in **Kuwaiti Dinar (KWD)**, stored internally as **fils** (1 KWD = 1000 fils) for precision:

- Each product can have multiple `pricing_tiers` (e.g. 1 box, 3 boxes, 6 boxes)
- Each tier has a **quantity** (number of units per bundle) and a **price in fils**
- Customers select a tier on the Product Details page, choose how many bundles, and the total is calculated automatically
- Each tier selection is stored as a **separate line** in the cart

---

## 🛒 Cart & Checkout Flow

```
Home  →  Products  →  Product Details  →  Cart  →  Checkout  →  Confirmation  →  Home
```

1. **Add to Cart** — Select a pricing tier and quantity on the Product Details page
2. **Cart** — Review items, adjust bundle quantities, apply promo code `PROMO50`
3. **Checkout** — Enter name, phone, delivery address; choose Cash on Delivery or Visa (Demo)
4. **Confirmation** — See order reference number and summary; cart is cleared automatically

> ⚠️ **This is a frontend demo only.** No real payment is processed. No customer data is stored. The Visa form is clearly marked as a simulation and uses placeholder values only.

---

## 🌍 Localisation

All UI strings live in [`src/i18n/translations.ts`](./src/i18n/translations.ts).

| Language | Direction | Switch |
|---|---|---|
| English | LTR (left-to-right) | "English" button in Navbar |
| العربية | RTL (right-to-left) | "العربية" button in Navbar |

The selected language persists across page navigation via `LanguageContext`.

Product names and descriptions are stored **bilingual** in the database (`name_en`, `name_ar`, `description_en`, `description_ar`).

---

## 🔐 Security Notes

- **Row-Level Security (RLS)** is enabled on all Supabase tables
- The `anon` key only has read access to the catalog
- Admin write operations require a verified `role = 'admin'` in `public.profiles`
- The `prevent_role_self_escalation` trigger prevents any client from promoting themselves to admin
- No real payment data is ever collected or transmitted

---

## 📦 Database Tables

| Table | Description |
|---|---|
| `public.profiles` | Linked to `auth.users`. Stores `role` (`customer` or `admin`) |
| `public.brands` | Product brands (e.g. manufacturer names) |
| `public.categories` | Product categories (e.g. Medical Devices, Supplements) |
| `public.products` | Product catalog with AR + EN names, descriptions, image URL |
| `public.pricing_tiers` | Bundle pricing offers linked to products |

Storage bucket: **`product-images`** (public read, admin write)

---

## 🐛 Common Issues

### `npm install` fails with ERESOLVE error
Vite 8 requires `esbuild ^0.27.0 || ^0.28.0`. Run:
```bash
npm install --legacy-peer-deps
```

### "This account does not have administrator privileges"
The user exists in Supabase Auth but their `profiles.role` is still `customer`.  
Run the SQL update in the **Supabase SQL Editor** (see [Admin Account Setup](#-admin-account-setup) above).

### Products not showing on storefront
Make sure you ran `supabase/schema.sql` in the Supabase SQL Editor. The schema seeds 3 sample products. You can also add more via the Admin Dashboard.

### Environment variables not loading
Vite only exposes variables prefixed with `VITE_` to the browser. Make sure your Supabase keys use `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` exactly.

---

## 📄 License

This project is proprietary and belongs to **Nermeen Radwan**. All rights reserved.
