# SpoonUp — React Redesign

A from-scratch redesign of [spoonupfoods.com](https://spoonupfoods.com), converted to a production-grade **React.js (Vite + React Router + GSAP)** application with all animations, interactions, routing, and cart management preserved.

## Structure

- [`frontend/`](frontend) — The React.js application (Vite, React 18, React Router v6, GSAP 3, Lenis).
- [`backend/`](backend) — Placeholder for future server/database integrations (see [`backend/README.md`](backend/README.md)).

## Running Locally

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

## Key Features & Components

- **Choreographed GSAP Animations**:
  - Preloader with liquid stirring wave and percentage counter.
  - Draggable polaroid dishes with throw physics and subtle mouse tilt.
  - Dual velocity-reactive ribbon marquees.
  - Word-by-word lighted manifesto scroll reveal.
  - Pinned horizontal scrolling of the counter cards.
  - 3D exploded jar anatomy with orbiting ingredient chips.
  - Dynamic Kashmir route SVG drawing with rider motion path.
  - 3D flip promise stamp cards.
- **Shop & Pantry**:
  - Live search filtering by keyword across dish titles, categories, and descriptions.
  - Real-time category chips filtering with count badges.
  - Sort by Price (Low to High, High to Low) and Name (A → Z).
- **Cart & Order System**:
  - Sticky header with animated Pickup / Delivery toggle pill.
  - Fly-to-cart GSAP animation on adding items.
  - Dynamic Free Delivery progress bar (₹499 threshold).
  - 5% GST and Subtotal live calculations.
  - Persistent cart & mode storage in `localStorage`.
- **Pages**:
  - Home (`/`)
  - Shop (`/shop`)
  - Our Story (`/story`)
  - Ingredients (`/ingredients`)
  - Contact (`/contact` with email client generation and accordion FAQs)
  - Policies (`/policies` with tabbed navigation and URL hash routing)
