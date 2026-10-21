# 🌍 Interactive Angular SVG World Map & Country Explorer

[![Angular](https://img.shields.io/badge/Angular-20.3-dd0031.svg?logo=angular)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C.svg?logo=reactivex)](https://rxjs.dev/)
[![World Bank API](https://img.shields.io/badge/Data-World%20Bank%20API%20v2-0071bc.svg)](https://datahelpdesk.worldbank.org/knowledgebase/articles/898590-country-api-queries)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An interactive single-page web application built with **Angular 20**, **TypeScript**, and **RxJS** that lets users explore live geographic, administrative, and economic data for 250+ countries. Users can explore by hovering over or clicking any country on the interactive SVG map, or by using the accessible quick-select dropdown. All metadata is retrieved in real time from the **World Bank REST API** with client-side caching.

---

## ✨ Features

- **🗺️ Interactive SVG World Map:** High-resolution vector map with 256 uniquely identified country paths, smooth hover lighting, and active selection glow.
- **⚡ Live World Bank API Integration:** Real-time retrieval of official World Bank country indicators using Angular's `HttpClient` with RxJS observables.
- **💾 In-Memory Request Caching:** Client-side caching in `CountryService` prevents redundant API calls and eliminates rate-limiting delays when revisiting previously inspected countries.
- **🔍 Quick Country Select (A11y):** An accessible dropdown listing all 256 countries alphabetically. Enables keyboard users, screen readers, and mobile users to easily inspect micro-nations and island territories that are difficult to click on small screens.
- **🎯 Dynamic Hover Feedback:** Instant status badge shows the country name as the cursor moves across borders before clicking.
- **📊 Structured Country Details Panel:** Displays key indicators:
  - Official Country Name & ISO Code
  - Capital City
  - World Region
  - Income Level Classification
  - Geographic Coordinates (Longitude & Latitude)
- **🛡️ Robust Error & Edge-Case Handling:** Graceful handling of network timeouts, territories without World Bank data, and malformed payload schemas using safe navigation.
- **📱 Fully Responsive Design:** Modern dark oceanic aesthetic that scales seamlessly from large desktop monitors down to mobile smartphones.

---

## 🛠️ Technologies Used

| Technology | Purpose |
| :--- | :--- |
| **Angular 20** | Modern frontend framework using Standalone Components, new `@if` / `@for` control flow, and SSR readiness. |
| **TypeScript 5.9** | Strict type safety with strict template checking and complete World Bank response models. |
| **RxJS 7.8** | Reactive stream management with `tap`, `of`, in-flight request cancellation, and caching. |
| **World Bank REST API v2** | Live geographic and economic indicator data provider. |
| **Custom Vanilla CSS3** | Custom design tokens, glassmorphism, responsive Flexbox, and SVG transitions without bloated CSS libraries. |
| **Jasmine & Karma** | Comprehensive unit testing with `HttpTestingController` and DOM event simulation. |

---

## 📋 Prerequisites

- **Node.js:** v20.x or v22.x
- **npm:** v10.x or later
- **Angular CLI:** `20.3.0` (included via project `devDependencies`)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd world-map
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm start
```
Navigate your browser to `http://localhost:4200/`. The app will automatically redirect to `/map` and hot-reload when changes are saved.

---

## 🧪 Verification, Testing & Building

### Type-Check
Verify TypeScript compilation for both application and unit tests:
```bash
npx tsc --noEmit -p tsconfig.app.json
npx tsc --noEmit -p tsconfig.spec.json
```

### Production Build
Build the optimized production bundles (stored in `dist/`):
```bash
npm run build
```

### Run Unit Tests
Run the Karma test suite:
```bash
npm test
```

---

## 🏗️ Architecture & Key Engineering Decisions

### 1. Why Inline SVG Instead of an External Mapping Library (Leaflet/Mapbox)?
- **Zero Third-Party Dependencies:** Avoids heavy third-party bundle weight (~200KB–1MB) and proprietary map tiles.
- **Direct CSS & DOM Control:** SVG paths can be styled, hovered, and selected using standard CSS transitions, CSS variables, and class bindings.
- **Crystal Clear Scalability:** Vector graphics scale infinitely on 4K monitors and mobile screens without pixelation.

### 2. Decoupled Selection Architecture
The selection logic is separated from mouse click events:
```text
User Action (Click, Dropdown, Keyboard)
               │
               ▼
      selectCountry(code, name)
         ┌─────┴─────────────────────┐
         ▼                           ▼
  highlightPath(code)        getCountryDetail(code)
  (DOM / Class Update)       (HTTP / Cache Lookup)
```
This architectural separation allows any input mechanism (mouse, dropdown, keyboard, query parameter) to trigger selection without duplicating logic.

### 3. Client-Side Caching Strategy
The `CountryService` maintains an in-memory `Map<string, WorldBankCountryResponse>` cache. Subsequent requests for the same country return an immediate `of(cachedResponse)` without hitting the external API, reducing latency to 0ms and preventing rate-limiting.

### 4. Accessibility (WCAG / a11y) Consideration
Complex SVG maps often trap keyboard users if every path is a tab stop. By pairing the visual map with a `<select>` combobox and `aria-live="polite"` detail regions:
- Screen readers announce live country details upon selection.
- Keyboard users can search or jump to any country using arrow keys or typing.
- Micro-territories (e.g., Andorra, Singapore, Monaco) are just as accessible as large continents.

---

## 📂 Project Structure

```text
world-map/
├── public/                     # Static assets (custom SVG favicon)
├── resources/                  # Raw standalone SVG source files
├── src/
│   ├── app/
│   │   ├── map-comp/           # Map component
│   │   │   ├── map-comp.ts     # Selection, hover, and country list logic
│   │   │   ├── map-comp.html   # Header, controls, SVG paths & detail cards
│   │   │   ├── map-comp.css    # Responsive styles, glassmorphism, animations
│   │   │   └── map-comp.spec.ts# Unit tests (click, dropdown, hover, error handling)
│   │   ├── country-service.ts  # World Bank API client, cache, and TypeScript types
│   │   ├── country-service.spec.ts # Service unit tests (HTTP mock & cache tests)
│   │   ├── app.routes.ts       # Application routing
│   │   ├── app.config.ts       # Providers (Router, HttpClient withFetch, Hydration)
│   │   └── app.ts              # Root shell component
│   ├── index.html              # Main HTML entry with SEO metadata & Inter font
│   ├── main.ts                 # Application browser bootstrap
│   └── styles.css              # Global design tokens and reset
├── angular.json                # Angular CLI workspace configuration
├── package.json                # Dependencies and npm scripts
└── tsconfig.json               # TypeScript strict configuration
```

---

## 📝 Publishing to GitHub

When publishing this project to your GitHub profile:

```bash
# 1. Initialize git
git init

# 2. Stage all project files (ignoring dist, node_modules, .angular via .gitignore)
git add .

# 3. Create your initial commit
git commit -m "feat: complete interactive SVG world map with World Bank API integration"

# 4. Link to your GitHub repository and push
git remote add origin https://github.com/<your-username>/world-map.git
git branch -M main
git push -u origin main
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
