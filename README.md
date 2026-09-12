# Hiljhil Cafe — Product Information Management (PIM) UI (`pim-ui`)

> **Dedicated Merchant & Roastery Catalog Management Portal for Hiljhil Cafe**

`pim-ui` is a standalone back-office application built with [Refine](https://refine.dev/), **React 18**, **Vite 5**, and **Tailwind CSS**. It serves as the single administrative cockpit for coffee roasters, merchandisers, and operations teams to configure, enrich, and publish products across the Hiljhil Cafe platform.

---

## 🏗️ Architecture & Ecosystem Fit

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Hiljhil Cafe Ecosystem                          │
│                                                                        │
│   Storefront Shell:           Back-Office PIM:                         │
│   mycommerce (Next.js :5170)  pim-ui (Refine / Vite :5180)             │
│            │                             │                             │
│            │                             ▼ REST / HTTP                 │
│            │                  ┌────────────────────────────────────┐   │
│            └─────────────────►│  product-catalog-service (:8001)   │   │
│                               │  • SQLite Ground-Truth DB          │   │
│                               │  • Full CRUD APIs                  │   │
│                               │  • CounterCheck™ Spatial Rules     │   │
│                               └────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

`pim-ui` connects directly to [`product-catalog-service`](https://github.com/dipeshsingh2012/product-catalog-service) on port `8001` via Refine's REST data provider, providing real-time synchronization with zero intermediate caching bottlenecks.

---

## 🌟 Key Features

### 1. Catalog Dashboard & Data Grid
* **Live Catalog KPIs:** Real-time counters for Total SKUs, Active Coffee Lots, Space-Verified Gear, and In-Stock percentage.
* **Instant Debounced Search:** Query across product titles, SKUs, roastery brands, and descriptions.
* **Category Filters:** Quick toggle across `Coffee Beans`, `Espresso Machines`, `Grinders`, `Brewing Equipment`, and `Drinkware`.
* **Lifecycle State Filtering:** Filter by `Active` (published to storefront), `Draft` (in-progress enrichment), and `Archived`.
* **1-Click Inventory Control:** Real-time toggle switch for `In Stock` / `Out of Stock` with immediate storefront propagation.

### 2. Multi-Tab Product Configuration Drawer
* **Identity & Classification:** Name, SKU, Brand, Category, Lifecycle Status, and Tax Category (HSN `0901` for coffee, HSN `8419` for appliances, or exempt).
* **Commercial Pricing & Stock:** Selling price in INR (₹), Compare-At MSRP strikethrough price, and promotional badges (`EXCLUSIVE HARVEST`, `BESTSELLER`, `NEW`, `FLAGSHIP GEAR`, `SAVE 15%`).
* **Coffee Roastery Specs:**
  * Roast profile selector (`Light`, `Medium Light`, `Medium`, `Medium Dark`, `Dark Espresso`, `Vienna Dark`).
  * Estate / Farm Origin name, Altitude (e.g. `1,450 MASL`), and Processing method (`Whiskey Barrel Washed`, `Pulp Sun-Dried`, `Natural`).
  * Interactive chip tag manager for flavor and aroma notes (e.g. `Ripe Banana`, `Dark Chocolate`, `Honey`).
* **CounterCheck™ Spatial Dimensions:**
  * Physical dimensions: Width, Height, Depth (cm) and appliance weight (kg).
  * Operational & ventilation headroom: Top clearance (for hopper refill/lid tilt), side clearance, and rear airflow clearances.
  * Real-time clearance compliance checking against standard 45cm wall cabinetry.
* **Media & Brand Story:** High-resolution product image URL with instant live thumbnail preview, optional cutout PNG, and roastery story copy.

### 3. Storefront Integration
* Direct **"Preview in Storefront"** action on every product row, opening the canonical Next.js Product Detail Page (`${VITE_STOREFRONT_URL}/product/[id]`) in a new tab.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** >= 18.0.0
* **npm** >= 9.0.0
* **`product-catalog-service`** running on port `8001` (optional; mock data used if offline)

### Installation
```bash
# Clone the repository
git clone https://github.com/dipeshsingh2012/pim-ui.git
cd pim-ui

# Install dependencies
npm install
```

### Running Locally
```bash
# Start the Vite development server (Port 5180)
npm run dev
```
Open port **`5180`** in your browser.

### Production Build
```bash
# Type check and build optimized bundle
npm run build

# Preview production build
npm run preview
```

---

## ⚙️ Configuration & Environment Variables

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `VITE_CATALOG_API_URL` | `''` (Offline simulated fallback) | Base REST API URL of `product-catalog-service` |
| `VITE_STOREFRONT_URL` | `''` (Relative `/`) | Canonical URL of `mycommerce` storefront |

---

## 🛠️ Tech Stack

* **Framework:** [Refine 5](https://refine.dev/) (`@refinedev/core`)
* **Core:** React 18 / TypeScript 5 / Vite 5
* **Styling:** Tailwind CSS 3
* **Icons:** Lucide React
* **Design System:** `@dipesh.singh/proton` & `@dipesh.singh/commerce-ui`

---

## 📄 License

Private repository for Hiljhil Cafe Commerce Platform.
