// ============================================================
// ANUSHREE SINGH - PORTFOLIO CONTENT
// ============================================================
// 
// HOW TO UPDATE YOUR PORTFOLIO:
// 
// 1. Add your photos to the folders:
//    - src/assets/portfolio/wedding/
//    - src/assets/portfolio/saree-branding/
//    - src/assets/portfolio/makeup/
//    - src/assets/portfolio/aesthetic/
// 
// 2. Import your images at the top of this file like:
//    import weddingImage1 from '@/assets/portfolio/wedding/photo1.jpg';
// 
// 3. Update the gallery arrays below with your imported images
// 
// 4. Update your bio, contact info, and other details below
// 
// ============================================================

// SITE CONFIGURATION
export const siteConfig = {
  name: "Anushree Singh",
  tagline: "Model",
  title: "Anushree Singh | Professional Model Portfolio",
  description: "Premium editorial modeling portfolio of Anushree Singh featuring wedding, saree branding, makeup, and aesthetic photography.",
};

// NAVIGATION
export const navigation = [
  { name: "Galleries", href: "/galleries" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

// ABOUT PAGE CONTENT
export const aboutContent = {
  // Your main bio paragraph
  bio: `With a passion for bringing editorial visions to life, I collaborate with photographers, designers, and creative teams to create compelling visual narratives. My portfolio spans wedding editorials, traditional saree campaigns, beauty and makeup artistry, and artistic aesthetic photography.`,
  
  // Professional details (optional - set to null to hide)
  details: {
    location: "India",
    height: null, // e.g., "5'8\" / 173 cm"
    experience: "Professional Model",
    agencies: null, // e.g., "Elite Model Management"
  },
  
  // Feature image for about page (replace with your photo)
  // Import your image and use it here, or use a placeholder
  featureImage: "/placeholder.svg",
};

// CONTACT PAGE CONTENT
export const contactContent = {
  email: "contact@anushreesingh.com",
  phone: null, // Optional: "+91 XXXXX XXXXX"
  
  // Social media links (set to null to hide)
  social: {
    instagram: "https://instagram.com/anushreesingh",
    facebook: null,
    twitter: null,
    linkedin: null,
  },
  
  // Contact form recipient (for Lovable Cloud integration)
  formSubject: "Portfolio Inquiry - Anushree Singh",
};

// ============================================================
// GALLERY CONTENT
// ============================================================
// 
// Each gallery category has:
// - id: unique identifier (don't change)
// - title: display name for the category
// - description: short tagline
// - coverImage: main image shown in horizontal scroll
// - images: array of photos for the category detail view
// 
// For each image in the images array:
// - src: the image source (import your images)
// - alt: description for accessibility
// - aspectRatio: "portrait" | "landscape" | "square"
// 
// ============================================================

export interface GalleryImage {
  src: string;
  alt: string;
  aspectRatio: "portrait" | "landscape" | "square";
}

export interface GalleryCategory {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  images: GalleryImage[];
}

export const galleryCategories: GalleryCategory[] = [
  {
    id: "wedding",
    title: "Wedding",
    description: "Bridal & Wedding Editorials",
    coverImage: "/placeholder.svg",
    images: [
      // Add your wedding photos here
      // Example:
      // { src: weddingImage1, alt: "Bridal portrait in traditional attire", aspectRatio: "portrait" },
      { src: "/placeholder.svg", alt: "Wedding editorial placeholder", aspectRatio: "portrait" },
      { src: "/placeholder.svg", alt: "Bridal portrait placeholder", aspectRatio: "portrait" },
      { src: "/placeholder.svg", alt: "Wedding shoot placeholder", aspectRatio: "landscape" },
    ],
  },
  {
    id: "saree-branding",
    title: "Saree Branding",
    description: "Traditional Saree Campaigns",
    coverImage: "/placeholder.svg",
    images: [
      // Add your saree branding photos here
      { src: "/placeholder.svg", alt: "Saree campaign placeholder", aspectRatio: "portrait" },
      { src: "/placeholder.svg", alt: "Traditional saree placeholder", aspectRatio: "portrait" },
      { src: "/placeholder.svg", alt: "Saree editorial placeholder", aspectRatio: "landscape" },
    ],
  },
  {
    id: "makeup",
    title: "Makeup",
    description: "Beauty & Makeup Artistry",
    coverImage: "/placeholder.svg",
    images: [
      // Add your makeup/beauty photos here
      { src: "/placeholder.svg", alt: "Beauty shot placeholder", aspectRatio: "portrait" },
      { src: "/placeholder.svg", alt: "Makeup editorial placeholder", aspectRatio: "square" },
      { src: "/placeholder.svg", alt: "Beauty portrait placeholder", aspectRatio: "portrait" },
    ],
  },
  {
    id: "aesthetic",
    title: "Aesthetic",
    description: "Artistic & Creative Work",
    coverImage: "/placeholder.svg",
    images: [
      // Add your aesthetic/artistic photos here
      { src: "/placeholder.svg", alt: "Artistic portrait placeholder", aspectRatio: "portrait" },
      { src: "/placeholder.svg", alt: "Creative shot placeholder", aspectRatio: "landscape" },
      { src: "/placeholder.svg", alt: "Aesthetic editorial placeholder", aspectRatio: "portrait" },
    ],
  },
];

// HOME PAGE HERO
export const heroContent = {
  // Main hero image (replace with your best photo)
  image: "/placeholder.svg",
  
  // Scroll indicator text
  scrollText: "Explore Portfolio",
};
