# Product Information Management (PIM) & Experience CMS (`pim-ui`)

> **Dedicated Merchant Catalog Management & Store Experience CMS Portal**

`pim-ui` is a standalone back-office application built with [Refine](https://refine.dev/), **React 18**, **Vite 5**, and **Tailwind CSS**. It serves as the unified administrative cockpit for merchandisers, catalog managers, and operations teams to add, enrich, and publish products as well as curate dynamic store discovery rails and content lanes across digital commerce channels.

---

## 🏗️ Architecture & Ecosystem Fit

```
┌───────────────────────────────────────────────────────────────────────────┐
│                           Commerce Ecosystem                              │
│                                                                           │
│   Store Shell:                Back-Office PIM & CMS:                 │
│   mycommerce (Next.js :5170)       pim-ui (Refine / Vite :5180)           │
│         │     │                              │         │                  │
│         │     │        ┌─────────────────────┘         │                  │
│         │     │        │ REST / HTTP                   │ REST / HTTP      │
│         │     │        ▼                               ▼                  │
│         │     │  ┌─────────────────────────┐     ┌──────────────────────┐ │
│         │     └──► product-catalog-service │     │ content-service      │ │
│         │        │ (Cloud Run)             │     │ (Cloud Run)          │ │
│         │        │ • Catalog Ground Truth  │     │ • Content Lanes      │ │
│         │        │ • Full CRUD APIs        │     │ • Hero Rails & CMS   │ │
│         │        │ • Equipment Clearances  │     │ • Merchandising API  │ │
│         │        └─────────────────────────┘     └──────────────────────┘ │
│         │                                                    ▲            │
│         └────────────────────────────────────────────────────┘            │
└───────────────────────────────────────────────────────────────────────────┘
```

`pim-ui` connects directly to two core microservices hosted on Google Cloud Run:
1. [`product-catalog-service`](https://github.com/dipeshsingh2012/product-catalog-service) — Serves catalog ground truth, inventory status, and equipment clearance specifications (`https://product-catalog-service-518971663061.us-central1.run.app`).
2. `content-service` — Serves content lanes, promotional collections, and homepage merchandising layouts (`https://content-service-518971663061.us-central1.run.app`).

`pim-ui` connects directly to these live services to query, enrich, and publish catalog products and merchandising lanes in real time.

---

## 🚀 Steps to Start the Project

Follow these steps to set up and run the `pim-ui` application locally:

### 1. Prerequisites
Ensure you have the following installed and accessible:
* **Node.js**: `>= 18.0.0` (LTS recommended)
* **npm**: `>= 9.0.0` (or `pnpm` / `yarn`)
* **Live Cloud Run Backend Services**: `pim-ui` connects to the live production Cloud Run services (`product-catalog-service` and `content-service`) for catalog data and CMS lane management.
* *(Optional)* Local backend instances: If developing backend services locally, you can override the endpoints in `.env` to point to your local instances (e.g. `http://localhost:8001` and `http://localhost:8006`).

### 2. Clone the Repository
```bash
git clone https://github.com/dipeshsingh2012/pim-ui.git
cd pim-ui
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy the sample environment file to create your local `.env`:
```bash
cp .env.example .env
```

Adjust the endpoint variables in `.env` if your services run on non-default hosts or ports (pre-configured to live Cloud Run by default):
By default, `.env` uses Vite's built-in reverse proxy routes to avoid browser CORS preflights and restrictions during local development:
```env
# Product Catalog Service (Google Cloud Run)
VITE_CATALOG_API_URL=https://product-catalog-service-518971663061.us-central1.run.app
# Product Catalog Service (proxied to Cloud Run via Vite)
VITE_CATALOG_API_URL=/api/catalog

# Content / Experience CMS Service (Google Cloud Run)
VITE_CONTENT_API_URL=https://content-service-518971663061.us-central1.run.app
# Content / Experience CMS Service (proxied to Cloud Run via Vite)
VITE_CONTENT_API_URL=/api/content

# Consumer Storefront URL (Production Domain)
VITE_STORE_URL=https://hilljhil.cafe
```
*(If omitted, `pim-ui` automatically defaults to these live Cloud Run endpoints).*
> [!TIP]
> The Vite development server automatically proxies `/api/catalog/*` to `https://product-catalog-service-518971663061.us-central1.run.app/api/v1/*` and `/api/content/*` to `https://content-service-518971663061.us-central1.run.app/api/v1/*`. This ensures your browser requests are same-origin (`http://localhost:5180`), eliminating browser CORS errors and connecting seamlessly to live Cloud Run backends.

### 5. Run the Development Server
Start the Vite development server on port `5180`:
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:5180
```

### 6. Production Build & Local Preview
To test type safety, compile assets, and preview the optimized production build:
```bash
# Type check and build bundle into dist/
npm run build

# Preview the built application locally on port 5180
npm run preview
```

---

## 🌟 Key Capabilities

`pim-ui` is divided into two specialized administrative workflows accessible via the top navigation bar:

---

### 🎨 1. Experience CMS Capabilities (Product & Category Lanes)

The **Experience CMS** module empowers merchandisers and content managers to visually construct, sequence, and publish dynamic discovery rails and category carousels across the store:

* **Dynamic Merchandising Lanes & Rails:**
  * Create, edit, and manage curated rails for the homepage, discovery pages, or global placement.
  * Define lane metadata: unique slug identifier, customer-facing title, and descriptive subtitle.
  * Categorize lanes by type (`category_lane` for category shortcuts or `product_lane` for curated collections).

* **Flexible Presentation & Card Styling:**
  * **Card Styles:** Switch between `circular` (round avatar/story-style cards) and `standard_card` (square/rectangular commerce cards).
  * **Navigation Controls:** Toggle interactive previous/next navigation arrows (`has_navigation_arrows`) on store sliders.

* **Dual Item Addition Modes:**
  * **Catalog Product Picker:** Search and attach products directly from the live catalog by SKU, name, or brand. Images, titles, and prices automatically populate from catalog data.
  * **Custom Merchandising Items:** Create arbitrary marketing cards with bespoke titles, subtitles, image URLs, custom promotional badges (e.g. `EXCLUSIVE`, `NEW`, `HOT`), custom price labels, and deep-link target URLs (`target_url`).

* **Interactive Sequence & Ordering Editor:**
  * Reorder items within any lane using instant **Move Up** and **Move Down** controls.
  * Set top-level lane sort priorities (`sort_order`) to determine the vertical hierarchy on store landing pages.

* **Live Horizontal Rail Preview:**
  * Built-in interactive horizontal preview track inside both the Lane List and Lane Drawer.
  * Real-time preview of card shapes, fallback images, badges, prices, and arrow controls before publishing.

* **Lifecycle Management & Publishing Controls:**
  * One-click status toggle between `Active` (live on store) and `Draft` (hidden for review).
  * Filter and search lanes by placement, lifecycle state, slug, or title.
  * Delete lanes with confirmation dialogues and toast feedback.

* **Dual Microservice Health Monitoring:**
  * Live status badges in the top header continuously ping and report connectivity to both the live Catalog Service and Content Service on Cloud Run.

---

### 🛍️ 2. Product Information Management (PIM) Capabilities

The **PIM Catalog** module serves as the authoritative interface for product enrichment, inventory status, and dimensional compliance:

* **Catalog Dashboard & Data Grid:**
  * **Live Catalog KPIs:** Real-time counters for Total SKUs, Active Coffee Lots, Space-Verified Gear, and In-Stock percentage.
  * **Instant Debounced Search:** Fast query across titles, SKUs, roastery brands, and descriptions.
  * **Multi-Facet Filters:** Filter across categories (`Coffee Beans`, `Espresso Machines`, `Grinders`, `Brewing Equipment`, `Drinkware`) and lifecycle states (`Active`, `Draft`, `Archived`).
  * **1-Click Inventory Control:** Real-time toggle switch for `In Stock` / `Out of Stock` with immediate store propagation.

* **Multi-Tab Product Configuration Drawer:**
  * **Identity & Classification:** Product name, SKU, brand, category, lifecycle state, and HSN tax codes (`0901` for coffee, `8419` for appliances, or exempt).
  * **Commercial Pricing & Stock:** Selling price in INR (₹), Compare-At MSRP strikethrough price, and promotional badges (`EXCLUSIVE HARVEST`, `BESTSELLER`, `NEW`, `FLAGSHIP GEAR`, `SAVE 15%`).
  * **Roastery & Sensory Specs:** Roast profile selector (`Light` through `Vienna Dark`), origin estate/farm, altitude (MASL), processing method, and interactive flavor/aroma note tag manager.
  * **CounterCheck™ Dimensions & Clearance:** Physical dimensions (width, height, depth in cm, weight in kg) and operational headroom checks (top clearance for hoppers, side/rear clearance for ventilation) validated against standard 45cm cabinetry.
  * **Media & Brand Story:** Image URLs with live preview, cutout PNG support, and rich description copy.

* **Store Deep Linking:**
  * Direct **"Preview in Store"** action on every product row, navigating straight to the canonical Next.js Product Detail Page (`${VITE_STORE_URL}/product/[id]`).

---

## ⚙️ Configuration & Environment Variables

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `VITE_CATALOG_API_URL` | `https://product-catalog-service-518971663061.us-central1.run.app` | Base REST API URL of `product-catalog-service` |
| `VITE_CONTENT_API_URL` | `https://content-service-518971663061.us-central1.run.app` | Base REST API URL of `content-service` |
| `VITE_STORE_URL` | `https://hilljhil.cafe` | Canonical URL of consumer store |

---

## 🛠️ Tech Stack

* **Framework:** [Refine 5](https://refine.dev/) (`@refinedev/core`)
* **Core:** React 18 / TypeScript 5 / Vite 5
* **Styling:** Tailwind CSS 3
* **Icons:** Lucide React
* **Design System:** `@dipesh.singh/proton` & `@dipesh.singh/commerce-ui`

---

## 📄 License

Private repository for Commerce Platform.
