# Space Mint Web App

Premium ecommerce frontend for **Space Mint**, a modular interior brand focused on kitchens, living room furniture, bedroom wardrobes, and made-to-measure furniture systems.

The UI direction is luxury minimal, editorial, spacious, and architectural. The current theme uses only:

- Black: `#111111`
- White: `#FFFFFF`
- Warm beige: `#faf7f2`

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- GSAP
- Lenis smooth scrolling
- Three.js for GLB product previews
- Radix UI primitives through shadcn-style components
- lucide-react icons
- clsx, tailwind-merge, class-variance-authority

## Getting Started

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Preview production build:

```bash
npm run preview
```

## Project Structure

```text
src/
  App.tsx
  main.tsx
  components/
    commerce/          Product cards, category cards, GLB model viewer
    layout/            Header, mega navigation, footer, app layout
    primitives/        Container, section, typography primitives
    sections/          Home page sections and hero video
    ui/                Reusable UI primitives
  config/
    design-system.ts   Design-system configuration
  data/
    catalog.ts
    collections.ts
    local-assets.ts
    mega-menu.ts
    product-models.ts  Automatic GLB registry
    spacemint-products.json
  hooks/
    use-lenis.ts
    use-product-route.ts
  lib/
    animation.ts
    scroll.ts
    utils.ts
  pages/
    home.tsx
    collection-detail.tsx
    product-detail.tsx
  styles/
    globals.css
```

## Routing

The app currently uses hash-based client routing:

- Home: `/#` or no hash
- Collection page: `/#collection/kitchens`
- Product page: `/#product/sm-002`

Routing logic lives in:

```text
src/hooks/use-product-route.ts
src/App.tsx
```

## Design System

Global tokens are defined mainly in:

```text
src/styles/globals.css
tailwind.config.ts
src/config/design-system.ts
```

Current token areas include:

- colors
- typography
- spacing
- radius
- shadows
- motion durations/easing
- layout widths

The system is intentionally prepared for future themes, accent colors, typography presets, spacing systems, component variants, and animation presets.

## Product Data

Normalized product data lives in:

```text
src/data/spacemint-products.json
```

The raw Excel-converted source file is:

```text
SPACEMINT Product Details 1.json
```

Use the normalized JSON for the app. The raw file should be treated as source/reference data.

## GLB Product Models

3D models live in:

```text
glb_files/
```

The app automatically maps GLB files to products by product code.

Example:

```text
glb_files/2DSU750-01.glb
```

maps to:

```json
{
  "code": "2DSU750-01"
}
```

Versioned filenames also work:

```text
glb_files/ULWU600-01.glb
```

can map to product code:

```json
{
  "code": "ULWU600"
}
```

The registry is implemented in:

```text
src/data/product-models.ts
```

The reusable Three.js viewer is:

```text
src/components/commerce/model-viewer.tsx
```

It supports:

- auto-rotate
- reset view
- zoom in/out
- fullscreen
- drag-to-inspect interaction

The viewer is lazy-loaded so Three.js is only loaded for product pages that have a matching GLB.

## Assets

Important assets:

```text
assets/mp_.mp4                    Home hero video
assets/space-mint-logo-ui.webp    Optimized UI logo
assets/images/                    Kitchen and wardrobe images
glb_files/                        Product 3D models
```

The hero video component is:

```text
src/components/sections/hero-carousel.tsx
```

It includes play/pause and mute/unmute controls.

## Header And Navigation

Header behavior:

- On the home hero, the header switches to white text over a dark scrim.
- After scrolling, it switches to a white/glassy background with black text.
- On collection and product pages, it stays in the beige/black system.

Mega navigation data lives in:

```text
src/data/mega-menu.ts
```

Mega navigation UI lives in:

```text
src/components/layout/mega-navigation.tsx
```

## Performance Notes

- The 3D viewer is code-split and lazy-loaded.
- GLB files are emitted as separate assets.
- The home hero video is currently about 1.2 MB after build.
- Several local PNG images are large, around 1.7-2 MB each. A good next optimization is converting them to WebP or AVIF.

## Development Notes

- Use `src/data/spacemint-products.json` as the app-facing product source.
- Add new product GLBs to `glb_files/` with the product code as the filename.
- Keep the visual theme restrained: black, white, and `#faf7f2`.
- Avoid colorful gradients, aggressive animation, and noisy ecommerce clutter.
- Keep components reusable and data-driven where possible.

## Git Ignore

The repo should ignore generated and local-only files:

```text
node_modules/
dist/
.env
.env.*
.DS_Store
*.log
*.tsbuildinfo
```

Do not ignore `glb_files/` if product detail pages depend on those GLB models.
