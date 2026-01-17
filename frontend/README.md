# Anushree Singh – Premium Modeling Portfolio

A cinematic, editorial-grade modeling portfolio website built with React, TypeScript, and Tailwind CSS. Designed for maximum visual impact with smooth animations, horizontal scroll galleries, and a premium aesthetic.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Data Architecture](#3-data-architecture)
4. [Complete Project Structure](#4-complete-project-structure)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Beginner Setup Guide](#7-beginner-setup-guide)
8. [GitHub Copilot Repair Guide](#8-github-copilot-repair-guide)
9. [Common Errors and Troubleshooting](#9-common-errors-and-troubleshooting)
10. [Development Workflow](#10-development-workflow)
11. [Contribution and Maintenance Guidelines](#11-contribution-and-maintenance-guidelines)

---

## 1. Project Overview

### Purpose of the System

This is a **premium modeling portfolio website** designed to showcase professional photography work across multiple categories. It serves as a digital portfolio for models, photographers, or creative professionals seeking an agency-ready online presence.

### Business Problem It Solves

- **Professional Presentation**: Provides a high-end, editorial website that competes with agency portfolios
- **Easy Content Management**: Non-technical users can update photos and text via a centralized data file
- **Multi-Category Organization**: Separates work into distinct categories (Wedding, Saree Branding, Makeup, Aesthetic)
- **Cross-Device Experience**: Delivers a premium experience on mobile, tablet, and desktop

### High-Level Workflow

```
User visits site
    ↓
Intro Animation (1.5s cinematic reveal)
    ↓
Home Page (Full-screen hero image)
    ↓
Navigation Options:
    ├── Galleries → Horizontal scroll categories → Individual gallery grids → Lightbox view
    ├── About → Professional bio and details
    └── Contact → Inquiry form + social links
```

### Role of Data in the System

Currently, this is a **static frontend application**. All content is managed through:
- **`src/data/portfolioContent.ts`**: Centralized content file containing all text, image paths, and configuration
- **`src/assets/portfolio/`**: Directory structure for organizing portfolio images by category

**Note**: There is no database. To add database functionality (user authentication, form submissions, dynamic content), enable Lovable Cloud.

---

## 2. Technology Stack

### Programming Languages

| Language | Version | Purpose |
|----------|---------|---------|
| TypeScript | 5.x | Primary development language with type safety |
| JavaScript | ES2022 | Build tooling and configuration |
| CSS | CSS3 | Styling via Tailwind CSS |
| HTML | HTML5 | Semantic markup |

### Build Tools and Runtime

| Tool | Version | Purpose |
|------|---------|---------|
| Vite | 5.x | Build tool and development server |
| Node.js | 18+ | JavaScript runtime |
| npm/bun | Latest | Package management |

### Frameworks and Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| React | 18.3.1 | UI component framework |
| React Router DOM | 6.30.1 | Client-side routing |
| Framer Motion | 12.25.0 | Animation library |
| Tailwind CSS | 3.x | Utility-first CSS framework |
| shadcn/ui | Latest | Pre-built UI components |
| TanStack React Query | 5.83.0 | Data fetching and caching |
| Lucide React | 0.462.0 | Icon library |
| Zod | 3.25.76 | Schema validation |
| React Hook Form | 7.61.1 | Form handling |

### Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| TypeScript Compiler | Type checking |
| Vite Dev Server | Hot module replacement |
| PostCSS | CSS processing |

---

## 3. Data Architecture

### Current Architecture: Static Content

This project uses a **file-based content system** rather than a database.

#### Content Data Structure

**File**: `src/data/portfolioContent.ts`

```typescript
// Site Configuration
interface SiteConfig {
  name: string;        // "ANUSHREE SINGH"
  tagline: string;     // "Model & Artist"
  title: string;       // Browser tab title
  description: string; // SEO meta description
}

// Navigation Links
interface NavItem {
  name: string;  // Display text
  path: string;  // Route path
}

// Gallery Structure
interface GalleryImage {
  src: string;                              // Image path
  alt: string;                              // Alt text for accessibility
  aspectRatio: "portrait" | "landscape" | "square";
}

interface GalleryCategory {
  id: string;           // URL slug (e.g., "wedding")
  title: string;        // Display title
  description: string;  // Category description
  coverImage: string;   // Hero image path
  images: GalleryImage[];
}

// About Page Content
interface AboutContent {
  bio: string;
  details: { label: string; value: string }[];
  featureImage: string;
}

// Contact Information
interface ContactContent {
  email: string;
  phone: string;
  socialLinks: { platform: string; url: string; icon: string }[];
  formSubject: string;
}
```

#### Data Flow Diagram

```
portfolioContent.ts
        ↓
    ┌───┴───┐
    ↓       ↓
Components  Pages
    ↓       ↓
    └───┬───┘
        ↓
    React DOM
        ↓
    Browser
```

#### Image Organization

```
src/assets/portfolio/
├── wedding/
│   ├── image1.jpg
│   ├── image2.jpg
│   └── ...
├── saree-branding/
│   ├── image1.jpg
│   └── ...
├── makeup/
│   └── ...
└── aesthetic/
    └── ...
```

### Future Database Architecture (If Lovable Cloud Enabled)

When Lovable Cloud is enabled, the following tables would be created:

| Table | Purpose |
|-------|---------|
| `gallery_categories` | Store category metadata |
| `gallery_images` | Store image records with category FK |
| `contact_submissions` | Store form submissions |
| `site_settings` | Dynamic site configuration |

---

## 4. Complete Project Structure

### Root Directory

```
/
├── public/                 # Static assets served directly
├── src/                    # Source code
├── index.html              # Entry HTML file
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
└── README.md               # This documentation
```

---

### Configuration Files

#### File: `/index.html`

| Attribute | Value |
|-----------|-------|
| **Description** | Entry point HTML file that loads the React application |
| **Dependencies** | None |
| **Used By** | Vite build system |
| **Responsibilities** | Define HTML structure, load fonts, set meta tags |
| **What Breaks If Missing** | Application will not load at all |
| **Common Issues** | Missing font links, incorrect script paths |

#### File: `/vite.config.ts`

| Attribute | Value |
|-----------|-------|
| **Description** | Vite build tool configuration |
| **Dependencies** | `vite`, `@vitejs/plugin-react-swc` |
| **Used By** | Build system, dev server |
| **Responsibilities** | Configure build process, aliases, plugins |
| **What Breaks If Missing** | Cannot start dev server or build project |
| **Common Issues** | Path alias misconfiguration (`@/` not resolving) |

```typescript
// Key configuration
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

#### File: `/tailwind.config.ts`

| Attribute | Value |
|-----------|-------|
| **Description** | Tailwind CSS configuration with custom design tokens |
| **Dependencies** | `tailwindcss`, `tailwindcss-animate` |
| **Used By** | All components using Tailwind classes |
| **Responsibilities** | Define colors, fonts, animations, breakpoints |
| **What Breaks If Missing** | All styling breaks, no CSS generated |
| **Common Issues** | Missing color definitions, font family errors |

**Critical Sections**:
```typescript
theme: {
  extend: {
    fontFamily: {
      serif: ["Cormorant Garamond", "serif"],
      sans: ["Inter", "sans-serif"],
    },
    colors: {
      border: "hsl(var(--border))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      // ... semantic color tokens
    },
  },
}
```

#### File: `/tsconfig.json`

| Attribute | Value |
|-----------|-------|
| **Description** | TypeScript compiler configuration |
| **Dependencies** | None |
| **Used By** | TypeScript compiler, IDE |
| **Responsibilities** | Define compilation rules, path mappings |
| **What Breaks If Missing** | TypeScript compilation fails |
| **Common Issues** | Strict mode errors, path resolution failures |

---

### Source Directory (`/src`)

#### File: `/src/main.tsx`

| Attribute | Value |
|-----------|-------|
| **Description** | Application entry point, mounts React to DOM |
| **Dependencies** | `react`, `react-dom`, `App.tsx`, `index.css` |
| **Used By** | Vite (referenced in index.html) |
| **Responsibilities** | Initialize React app, import global styles |
| **What Breaks If Missing** | Application will not render |
| **Common Issues** | Missing root element, CSS import errors |

```typescript
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
```

#### File: `/src/App.tsx`

| Attribute | Value |
|-----------|-------|
| **Description** | Root React component with routing configuration |
| **Dependencies** | React Router, TanStack Query, Layout, all page components |
| **Used By** | `main.tsx` |
| **Responsibilities** | Configure providers, define routes, wrap in Layout |
| **What Breaks If Missing** | No application renders |
| **Common Issues** | Route misconfiguration, missing page imports |

**Route Structure**:
```typescript
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/galleries" element={<Galleries />} />
  <Route path="/galleries/:categoryId" element={<GalleryCategory />} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

#### File: `/src/index.css`

| Attribute | Value |
|-----------|-------|
| **Description** | Global styles, CSS variables, Tailwind directives |
| **Dependencies** | Tailwind CSS |
| **Used By** | Entire application |
| **Responsibilities** | Define design tokens, base styles, animations |
| **What Breaks If Missing** | No styling applied, broken appearance |
| **Common Issues** | Missing CSS variables, HSL format errors |

**Critical CSS Variables**:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --primary: 0 0% 9%;
  --primary-foreground: 0 0% 98%;
  /* ... more tokens */
}

.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  /* ... dark mode tokens */
}
```

---

### Data Directory (`/src/data`)

#### File: `/src/data/portfolioContent.ts`

| Attribute | Value |
|-----------|-------|
| **Description** | **CRITICAL** - Centralized content management file |
| **Dependencies** | None |
| **Used By** | All pages and components |
| **Responsibilities** | Store all text, image paths, configuration |
| **What Breaks If Missing** | Entire site has no content |
| **Common Issues** | Invalid image paths, missing category IDs |

**Exported Constants**:
| Export | Type | Used By |
|--------|------|---------|
| `siteConfig` | `SiteConfig` | Layout, Navigation, SEO |
| `navigation` | `NavItem[]` | Navigation component |
| `aboutContent` | `AboutContent` | About page |
| `contactContent` | `ContactContent` | Contact page |
| `galleryCategories` | `GalleryCategory[]` | Galleries, GalleryCategory pages |
| `heroContent` | `HeroContent` | Home page |

**How to Update Content**:
```typescript
// To add a new gallery image:
export const galleryCategories: GalleryCategory[] = [
  {
    id: "wedding",
    title: "Wedding",
    images: [
      {
        src: "/src/assets/portfolio/wedding/new-image.jpg", // Add path
        alt: "Description of image",                        // Add alt text
        aspectRatio: "portrait",                            // Set ratio
      },
      // ... existing images
    ],
  },
];
```

---

### Components Directory (`/src/components`)

#### File: `/src/components/Layout.tsx`

| Attribute | Value |
|-----------|-------|
| **Description** | Main layout wrapper with intro animation logic |
| **Dependencies** | `IntroAnimation`, `Navigation`, `framer-motion` |
| **Used By** | `App.tsx` (wraps all routes) |
| **Responsibilities** | Handle intro animation state, render navigation |
| **Inputs** | `children: React.ReactNode` |
| **Outputs** | Wrapped page content with navigation |
| **What Breaks If Missing** | No navigation, no intro animation |

**Key Logic**:
```typescript
const [showIntro, setShowIntro] = useState(() => {
  return !sessionStorage.getItem('introShown');
});

// Shows intro only once per session
```

#### File: `/src/components/IntroAnimation.tsx`

| Attribute | Value |
|-----------|-------|
| **Description** | Opening cinematic animation with name reveal |
| **Dependencies** | `framer-motion`, `portfolioContent` |
| **Used By** | `Layout.tsx` |
| **Responsibilities** | Animate site name, trigger completion callback |
| **Inputs** | `onComplete: () => void` |
| **Outputs** | Animated intro screen |
| **What Breaks If Missing** | No intro animation (graceful degradation) |

**Animation Sequence**:
1. Black screen appears
2. "ANUSHREE SINGH" fades in with letter spacing
3. After 1.5s, screen fades out
4. `onComplete` callback triggers

#### File: `/src/components/Navigation.tsx`

| Attribute | Value |
|-----------|-------|
| **Description** | Responsive navigation with mobile menu |
| **Dependencies** | `react-router-dom`, `framer-motion`, `portfolioContent` |
| **Used By** | `Layout.tsx` |
| **Responsibilities** | Render nav links, handle mobile menu toggle |
| **What Breaks If Missing** | No site navigation |

**Features**:
- Fixed position, transparent background
- Desktop: Horizontal link layout
- Mobile: Hamburger menu with full-screen overlay
- Animated menu transitions

#### File: `/src/components/NavLink.tsx`

| Attribute | Value |
|-----------|-------|
| **Description** | Styled navigation link component |
| **Dependencies** | `react-router-dom` |
| **Used By** | `Navigation.tsx` |
| **Responsibilities** | Render styled links with active state |

---

### Gallery Components (`/src/components/gallery`)

#### File: `/src/components/gallery/HorizontalGallery.tsx`

| Attribute | Value |
|-----------|-------|
| **Description** | Full-screen horizontal scrolling category showcase |
| **Dependencies** | `framer-motion`, `react-router-dom`, `portfolioContent` |
| **Used By** | `Galleries.tsx` page |
| **Responsibilities** | Render scrollable category cards, track progress |
| **What Breaks If Missing** | Gallery overview page is empty |

**Key Features**:
- Horizontal scroll with momentum
- Full-viewport category cards
- Progress indicators (dots)
- Links to individual category pages

**Scroll Behavior**:
```typescript
const handleScroll = () => {
  const container = scrollContainerRef.current;
  const scrollLeft = container.scrollLeft;
  const maxScroll = container.scrollWidth - container.clientWidth;
  setScrollProgress(scrollLeft / maxScroll);
  
  const categoryWidth = container.clientWidth;
  const newIndex = Math.round(scrollLeft / categoryWidth);
  setActiveIndex(newIndex);
};
```

#### File: `/src/components/gallery/ImageGrid.tsx`

| Attribute | Value |
|-----------|-------|
| **Description** | Responsive masonry-style image grid |
| **Dependencies** | `framer-motion`, `Lightbox.tsx`, `portfolioContent` types |
| **Used By** | `GalleryCategory.tsx` page |
| **Inputs** | `images: GalleryImage[]` |
| **Responsibilities** | Render image grid, open lightbox on click |
| **What Breaks If Missing** | Category pages show no images |

**Grid Logic**:
```typescript
// Dynamic grid classes based on aspect ratio
const getGridClass = (aspectRatio, index) => {
  if (aspectRatio === "landscape") return "col-span-2";
  if (aspectRatio === "portrait" && index % 5 === 0) return "row-span-2";
  return "";
};
```

#### File: `/src/components/gallery/Lightbox.tsx`

| Attribute | Value |
|-----------|-------|
| **Description** | Full-screen image viewer with navigation |
| **Dependencies** | `framer-motion`, `lucide-react` |
| **Used By** | `ImageGrid.tsx` |
| **Inputs** | `images`, `initialIndex`, `isOpen`, `onClose` |
| **Responsibilities** | Display images full-screen, handle navigation |
| **What Breaks If Missing** | Cannot view images in detail |

**Controls**:
- Left/Right arrows: Navigate images
- Escape key: Close lightbox
- Click outside: Close lightbox
- Image counter: Shows current position

---

### Pages Directory (`/src/pages`)

#### File: `/src/pages/Home.tsx`

| Attribute | Value |
|-----------|-------|
| **Description** | Landing page with hero section |
| **Dependencies** | `framer-motion`, `react-router-dom`, `portfolioContent` |
| **Route** | `/` |
| **Responsibilities** | Display hero image, site name, scroll indicator |
| **What Breaks If Missing** | 404 on homepage |

#### File: `/src/pages/Galleries.tsx`

| Attribute | Value |
|-----------|-------|
| **Description** | Gallery overview with horizontal scroll |
| **Dependencies** | `HorizontalGallery` component |
| **Route** | `/galleries` |
| **Responsibilities** | Render gallery category selector |

#### File: `/src/pages/GalleryCategory.tsx`

| Attribute | Value |
|-----------|-------|
| **Description** | Individual category page with image grid |
| **Dependencies** | `ImageGrid`, `react-router-dom`, `portfolioContent` |
| **Route** | `/galleries/:categoryId` |
| **Responsibilities** | Display category images, navigation to other categories |
| **URL Parameter** | `categoryId` - matches `GalleryCategory.id` |

**Category Lookup**:
```typescript
const { categoryId } = useParams();
const category = galleryCategories.find(c => c.id === categoryId);
```

#### File: `/src/pages/About.tsx`

| Attribute | Value |
|-----------|-------|
| **Description** | Biography and professional details page |
| **Dependencies** | `framer-motion`, `portfolioContent` |
| **Route** | `/about` |
| **Responsibilities** | Display bio, feature image, professional stats |

#### File: `/src/pages/Contact.tsx`

| Attribute | Value |
|-----------|-------|
| **Description** | Contact form and social links |
| **Dependencies** | `framer-motion`, shadcn/ui components, `portfolioContent` |
| **Route** | `/contact` |
| **Responsibilities** | Render contact form, display contact info |
| **Form Fields** | Name, Email, Subject, Message |

**Current Limitation**: Form submission is simulated (shows toast). Enable Lovable Cloud for real form handling.

#### File: `/src/pages/NotFound.tsx`

| Attribute | Value |
|-----------|-------|
| **Description** | 404 error page |
| **Route** | `*` (catch-all) |
| **Responsibilities** | Display error message, link to home |

---

### UI Components (`/src/components/ui`)

These are **shadcn/ui** components - pre-built, accessible UI primitives.

| Component | Purpose |
|-----------|---------|
| `button.tsx` | Styled button with variants |
| `input.tsx` | Form input field |
| `textarea.tsx` | Multi-line text input |
| `toast.tsx` | Notification messages |
| `toaster.tsx` | Toast container |
| `card.tsx` | Content container |
| `dialog.tsx` | Modal dialogs |
| `form.tsx` | Form handling with react-hook-form |

**Usage Pattern**:
```typescript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

<Button variant="outline" size="lg">
  Click Me
</Button>
```

---

### Hooks Directory (`/src/hooks`)

#### File: `/src/hooks/use-mobile.tsx`

| Attribute | Value |
|-----------|-------|
| **Description** | Responsive breakpoint detection hook |
| **Returns** | `boolean` - true if viewport < 768px |
| **Used By** | Components needing responsive behavior |

#### File: `/src/hooks/use-toast.ts`

| Attribute | Value |
|-----------|-------|
| **Description** | Toast notification hook |
| **Returns** | `{ toast, toasts, dismiss }` |
| **Used By** | Contact form, any notification needs |

---

### Utilities (`/src/lib`)

#### File: `/src/lib/utils.ts`

| Attribute | Value |
|-----------|-------|
| **Description** | Utility functions (className merging) |
| **Exports** | `cn(...classes)` - Tailwind class merger |
| **Used By** | All components |

```typescript
import { cn } from "@/lib/utils";

<div className={cn("base-class", conditional && "conditional-class")} />
```

---

## 5. Functional Requirements

### Supported Operations

| Operation | Location | Description |
|-----------|----------|-------------|
| View Intro Animation | `/` | Cinematic name reveal on first visit |
| Browse Home | `/` | View hero image and navigation |
| Browse Galleries | `/galleries` | Horizontal scroll through categories |
| View Category | `/galleries/:id` | See all images in a category |
| Open Lightbox | Gallery pages | View images full-screen |
| Navigate Lightbox | Lightbox | Arrow keys/buttons to browse |
| View About | `/about` | Read bio and details |
| View Contact | `/contact` | See contact information |
| Submit Inquiry | `/contact` | Fill and submit contact form |

### Validation Rules

**Contact Form**:
| Field | Validation |
|-------|------------|
| Name | Required, non-empty |
| Email | Required, valid email format |
| Subject | Required |
| Message | Required, non-empty |

### Error Handling

| Scenario | Behavior |
|----------|----------|
| Invalid route | Redirect to NotFound page |
| Missing category | Show "Category not found" message |
| Form validation fail | Display inline error messages |
| Image load failure | Show placeholder/broken image |

---

## 6. Non-Functional Requirements

### Performance

| Metric | Target |
|--------|--------|
| First Contentful Paint (FCP) | ≤ 2 seconds |
| Animation Frame Rate | 60 FPS |
| Time to Interactive | ≤ 3 seconds |
| Largest Contentful Paint | ≤ 2.5 seconds |

**Optimization Strategies**:
- Lazy loading images
- Optimized animations with `will-change`
- Minimal JavaScript bundle
- WebP image format recommended

### Accessibility

| Requirement | Implementation |
|-------------|----------------|
| WCAG Level | AA compliance |
| Keyboard Navigation | Full support |
| Screen Readers | Semantic HTML, ARIA labels |
| Reduced Motion | Respects `prefers-reduced-motion` |
| Color Contrast | 4.5:1 minimum |

### Responsiveness

| Breakpoint | Device | Min Width |
|------------|--------|-----------|
| Mobile | Phones | 320px |
| Tablet | Tablets | 768px |
| Desktop | Computers | 1024px |
| Large | Wide screens | 1280px |

### Security

| Requirement | Implementation |
|-------------|----------------|
| Input Sanitization | Zod validation on forms |
| XSS Prevention | React's built-in escaping |
| HTTPS | Required for production |

### Maintainability

- **Centralized Content**: All text/images in one file
- **Component Architecture**: Reusable, focused components
- **TypeScript**: Full type safety
- **Consistent Styling**: Design tokens in CSS variables

---

## 7. Beginner Setup Guide

### Prerequisites

| Software | Version | Installation |
|----------|---------|--------------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) or nvm |
| npm | 9+ | Included with Node.js |
| Git | Latest | [git-scm.com](https://git-scm.com) |
| Code Editor | - | VS Code recommended |

### Step 1: Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Navigate to project
cd YOUR_REPO
```

### Step 2: Install Dependencies

```bash
# Using npm
npm install

# Or using bun (faster)
bun install
```

### Step 3: Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Step 4: Add Your Photos

1. Create folders in `src/assets/portfolio/`:
   ```
   src/assets/portfolio/
   ├── wedding/
   ├── saree-branding/
   ├── makeup/
   └── aesthetic/
   ```

2. Add your images to appropriate folders

3. Update `src/data/portfolioContent.ts` with image paths:
   ```typescript
   images: [
     {
       src: "/src/assets/portfolio/wedding/photo1.jpg",
       alt: "Bridal portrait",
       aspectRatio: "portrait",
     },
   ],
   ```

### Step 5: Customize Content

Edit `src/data/portfolioContent.ts`:

```typescript
// Update site name
export const siteConfig = {
  name: "YOUR NAME",
  tagline: "Your Tagline",
  // ...
};

// Update about page
export const aboutContent = {
  bio: "Your biography here...",
  // ...
};

// Update contact info
export const contactContent = {
  email: "your@email.com",
  // ...
};
```

### Step 6: Build for Production

```bash
npm run build
```

Output is in the `dist/` folder.

---

## 8. GitHub Copilot Repair Guide

### Common Repair Scenarios

#### Fix Broken Imports

**Problem**: Module not found errors

**Copilot Prompt**:
```
Fix the import statement. The file exists at src/components/gallery/ImageGrid.tsx 
but the import path is wrong. Use the @ alias for src directory.
```

**Example Fix**:
```typescript
// Before (broken)
import ImageGrid from "../../components/gallery/ImageGrid";

// After (fixed)
import ImageGrid from "@/components/gallery/ImageGrid";
```

#### Recreate Missing Component

**Problem**: Component file was deleted

**Copilot Prompt**:
```
Create a React component called ImageGrid that:
- Accepts an images prop of type GalleryImage[]
- Renders a responsive grid using Tailwind CSS
- Opens a Lightbox when an image is clicked
- Uses framer-motion for animations
- Follows the project's TypeScript patterns
```

#### Repair Type Definitions

**Problem**: TypeScript errors about missing types

**Copilot Prompt**:
```
The GalleryImage interface is missing. Create it with:
- src: string (image path)
- alt: string (accessibility text)  
- aspectRatio: "portrait" | "landscape" | "square"

Export it from src/data/portfolioContent.ts
```

#### Fix Route Configuration

**Problem**: Page not loading

**Copilot Prompt**:
```
Add a route for the GalleryCategory page in App.tsx.
The route should be /galleries/:categoryId and render the GalleryCategory component.
Import the component from @/pages/GalleryCategory.
```

#### Rebuild Animation Logic

**Problem**: Intro animation not working

**Copilot Prompt**:
```
The IntroAnimation component should:
1. Show a black background with the site name
2. Animate the name with fade-in and letter-spacing
3. After 1.5 seconds, call onComplete callback
4. Use framer-motion AnimatePresence for exit animation
```

#### Fix Tailwind Configuration

**Problem**: Custom classes not working

**Copilot Prompt**:
```
Add the font-serif and font-sans classes to tailwind.config.ts.
font-serif should use "Cormorant Garamond" with serif fallback.
font-sans should use "Inter" with sans-serif fallback.
```

### Repair Workflow

1. **Identify the Error**: Read the console/terminal error message
2. **Locate the File**: Find the file mentioned in the error
3. **Understand the Context**: Read surrounding code
4. **Prompt Copilot**: Be specific about what needs fixing
5. **Verify the Fix**: Run `npm run dev` and check browser

---

## 9. Common Errors and Troubleshooting

### Build Errors

#### Error: Cannot find module '@/...'

**Cause**: Path alias not configured or file missing

**Solution**:
1. Check `vite.config.ts` has alias configured:
   ```typescript
   resolve: {
     alias: {
       "@": path.resolve(__dirname, "./src"),
     },
   },
   ```
2. Verify the file exists at the path
3. Restart dev server

#### Error: JSX element type does not have any construct

**Cause**: Missing React import or type definitions

**Solution**:
```typescript
// Add at top of file if needed
import React from 'react';
```

### Runtime Errors

#### Error: Cannot read property 'map' of undefined

**Cause**: Data not loaded or missing from content file

**Solution**:
1. Check `portfolioContent.ts` exports the data
2. Add fallback: `{images?.map(...) || []}`
3. Verify import statement

#### Error: useNavigate() may only be used within Router

**Cause**: Component using router hooks outside Router context

**Solution**:
Ensure `BrowserRouter` wraps the entire app in `App.tsx`

### Styling Issues

#### Tailwind classes not applying

**Cause**: Class not in safelist or CSS not compiled

**Solution**:
1. Check `index.css` has Tailwind directives:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
2. Restart dev server
3. Check for typos in class names

#### Custom colors not working

**Cause**: CSS variable not defined

**Solution**:
1. Define in `index.css`:
   ```css
   :root {
     --custom-color: 0 0% 50%;
   }
   ```
2. Add to `tailwind.config.ts`:
   ```typescript
   colors: {
     custom: "hsl(var(--custom-color))",
   }
   ```

### Animation Issues

#### Animations janky/stuttering

**Cause**: Too many animated elements or heavy calculations

**Solution**:
1. Use `will-change` CSS property
2. Reduce number of animated elements
3. Use `transform` instead of `left/top`
4. Check for memory leaks in useEffect

---

## 10. Development Workflow

### Adding a New Gallery Category

1. **Add folder**: Create `src/assets/portfolio/new-category/`

2. **Add images**: Place photos in the folder

3. **Update content file**:
   ```typescript
   // In src/data/portfolioContent.ts
   export const galleryCategories: GalleryCategory[] = [
     // ... existing categories
     {
       id: "new-category",
       title: "New Category",
       description: "Description here",
       coverImage: "/src/assets/portfolio/new-category/cover.jpg",
       images: [
         { src: "/src/assets/portfolio/new-category/1.jpg", alt: "...", aspectRatio: "portrait" },
       ],
     },
   ];
   ```

4. **Test**: Navigate to `/galleries/new-category`

### Modifying the Design System

1. **Colors**: Edit CSS variables in `src/index.css`
2. **Fonts**: Update `tailwind.config.ts` and `index.html`
3. **Spacing**: Modify Tailwind config extend section
4. **Animations**: Add keyframes in `index.css`, reference in Tailwind config

### Adding a New Page

1. **Create page component**: `src/pages/NewPage.tsx`
   ```typescript
   const NewPage = () => {
     return <div>New Page Content</div>;
   };
   export default NewPage;
   ```

2. **Add route** in `src/App.tsx`:
   ```typescript
   import NewPage from "@/pages/NewPage";
   
   <Route path="/new-page" element={<NewPage />} />
   ```

3. **Add navigation link** in `portfolioContent.ts`:
   ```typescript
   export const navigation = [
     // ... existing
     { name: "New Page", path: "/new-page" },
   ];
   ```

### Testing Changes

```bash
# Development mode (with hot reload)
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 11. Contribution and Maintenance Guidelines

### Coding Standards

#### TypeScript

- Enable strict mode
- Define interfaces for all props
- Avoid `any` type
- Use descriptive variable names

```typescript
// ✅ Good
interface GalleryImageProps {
  src: string;
  alt: string;
  onClick: () => void;
}

// ❌ Bad
const GalleryImage = (props: any) => {...}
```

#### React

- Use functional components
- Prefer hooks over class components
- Keep components focused (single responsibility)
- Extract reusable logic into custom hooks

#### CSS/Tailwind

- Use semantic color tokens, never raw colors
- Follow mobile-first responsive design
- Use design system spacing scale
- Group related classes logically

```typescript
// ✅ Good
className="bg-background text-foreground p-4 md:p-8"

// ❌ Bad
className="bg-white text-black p-[17px]"
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ImageGrid.tsx` |
| Hooks | camelCase with 'use' | `useGallery.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Constants | SCREAMING_SNAKE | `MAX_IMAGES` |
| CSS Variables | kebab-case | `--primary-color` |
| Routes | kebab-case | `/gallery-category` |

### File Organization

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui primitives
│   └── gallery/         # Feature-specific components
├── pages/               # Route page components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and helpers
├── data/                # Static content and config
└── assets/              # Images and static files
    └── portfolio/       # Organized by category
```

### Documentation Practices

- Add JSDoc comments to exported functions
- Document complex business logic
- Keep README updated with changes
- Comment non-obvious code decisions

```typescript
/**
 * Opens the lightbox at the specified image index
 * @param index - Zero-based index of the image to display
 */
const openLightbox = (index: number) => {...}
```

### Git Commit Messages

Follow conventional commits:

```
feat: add new gallery category support
fix: resolve lightbox navigation on mobile
docs: update setup instructions
style: improve button hover states
refactor: extract image loading logic
```

---

## Quick Reference

### Key Files to Edit

| Task | File |
|------|------|
| Update text/images | `src/data/portfolioContent.ts` |
| Change colors | `src/index.css` |
| Modify fonts | `tailwind.config.ts` + `index.html` |
| Add pages | `src/pages/` + `src/App.tsx` |
| Edit navigation | `src/data/portfolioContent.ts` |

### Useful Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Check code quality
```

### Support Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [shadcn/ui Components](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

*Last Updated: January 2026*
