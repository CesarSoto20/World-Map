# World Map - Interactive Country Explorer

An interactive world map web application built with Angular and TypeScript that displays live country data from the World Bank API.

## About This Project

I initially developed this project as part of my software engineering coursework. After getting the core functionality working, I used AI tools to help review and improve the code's organization, readability, and error handling. I reviewed and tested the changes to make sure I understood how the application worked. The process also helped me identify areas where I could improve my Angular and TypeScript skills.

## Features

- **Interactive SVG Map:** Click on any country to highlight it and view its information.
- **Hover Preview:** Move the cursor over the map to see country names before clicking.
- **Quick Select Dropdown:** Search or select from an alphabetical list of countries, making it easy to find smaller nations.
- **Live World Bank Data:** Displays country name, capital city, region, income level, and geographic coordinates.
- **Data Caching:** Saves previously viewed countries in memory to prevent unnecessary network requests.
- **Error & Loading Handling:** Shows clear feedback while data is loading or if data is unavailable for a region.

## Technologies Used

- **Framework:** Angular 20
- **Language:** TypeScript
- **Reactive Programming:** RxJS
- **API:** World Bank Indicators API v2
- **Styling:** Vanilla CSS

## Getting Started

### Prerequisites

- Node.js (v20 or newer recommended)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd world-map
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the local development server:

```bash
npm start
```

Then open your browser and navigate to `http://localhost:4200/`.

### Building the Project

To build the project for production:

```bash
npm run build
```

The output will be placed in the `dist/` directory.

### Running Tests

To run the unit tests:

```bash
npm test
```

## Project Structure

```text
src/
├── app/
│   ├── map-comp/               # Map component (SVG template, logic, styles, tests)
│   ├── country-service.ts      # Service handling World Bank API calls and caching
│   ├── country-service.spec.ts # Unit tests for the country service
│   ├── app.routes.ts           # Route definitions
│   └── app.ts                  # Root application component
├── index.html                  # Main HTML page
└── styles.css                  # Global styles and design tokens
```

<img width="1533" height="923" alt="Screenshot 2026-10-20 at 9 23 17 PM" src="https://github.com/user-attachments/assets/e87a4f36-b83c-482a-88d0-54fea610337b" />

<img width="1692" height="901" alt="Screenshot 2026-10-20 at 9 22 50 PM" src="https://github.com/user-attachments/assets/b98d9030-7bd5-4ed5-ba9b-9b1a6f8b7b54" />

<img width="1842" height="913" alt="Screenshot 2026-10-20 at 9 22 33 PM" src="https://github.com/user-attachments/assets/afc010b1-0d8e-4c04-977d-67ec09e75181" />

<img width="1849" height="926" alt="Screenshot 2026-10-20 at 9 22 20 PM" src="https://github.com/user-attachments/assets/05f6614e-154b-42e1-91a6-8f544df1d90f" />
