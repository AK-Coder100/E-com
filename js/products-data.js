// Ruby Wardrobe - Ruby Garments Udyog Enterprises Product Catalog Data
// Master JSON source: products.json

let PRODUCTS_DATA = [
  {
    id: "rw-101",
    name: "Oversized Vintage Acid Wash Graphic Tee",
    category: "oversized-tees",
    categoryLabel: "Oversized Tees",
    originalPrice: 1499,
    price: 699,
    discount: "53% OFF",
    rating: 4.8,
    reviewsCount: 142,
    stock: 7,
    isBestSeller: true,
    isNew: false,
    image: "https://dukaan.b-cdn.net/700x700/webp/media/aed317d4-4e67-446c-9ef3-7d7208d66566.png",
    hoverImage: "https://dukaan.b-cdn.net/700x700/webp/media/aed317d4-4e67-446c-9ef3-7d7208d66566.png",
    gallery: [
      "https://dukaan.b-cdn.net/700x700/webp/media/aed317d4-4e67-446c-9ef3-7d7208d66566.png"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Charcoal Grey", code: "#333333" },
      { name: "Vintage Black", code: "#1a1a1a" },
      { name: "Washed Olive", code: "#4a5340" }
    ],
    description: "Crafted from heavy 240 GSM pure combed cotton with a relaxed drop-shoulder silhouette and aesthetic retro typography print. Manufactured by Ruby Garments Udyog Enterprises.",
    fabric: "100% Combed Cotton (240 GSM Heavyweight)",
    policyNotice: "Strict Non-Refundable & Non-Returnable item by Ruby Garments Udyog Enterprises (Townhall, Gorakhpur - 273001)."
  },
  {
    id: "rw-102",
    name: "Classic Luxury Pique Polo Shirt",
    category: "polos",
    categoryLabel: "Polo T-Shirts",
    originalPrice: 1799,
    price: 799,
    discount: "56% OFF",
    rating: 4.9,
    reviewsCount: 98,
    stock: 12,
    isBestSeller: true,
    isNew: true,
    image: "https://imagescdn.thecollective.in/img/app/product/1/1158675-21874887.jpg?asp=true&crop=700&auto=format",
    hoverImage: "https://imagescdn.thecollective.in/img/app/product/1/1158675-21874887.jpg?asp=true&crop=700&auto=format",
    gallery: [
      "https://imagescdn.thecollective.in/img/app/product/1/1158675-21874887.jpg?asp=true&crop=700&auto=format"
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Royal Navy", code: "#001f3f" },
      { name: "Emerald Green", code: "#0f5132" },
      { name: "Burgundy Red", code: "#800020" }
    ],
    description: "Refined honeycomb knit polo shirt featuring tipping collar detail, mother-of-pearl buttons, and ribbed cuffs. Impeccable drape for smart casual everyday wear.",
    fabric: "100% Bio-Washed Pique Cotton (220 GSM)",
    policyNotice: "Strict Non-Refundable & Non-Returnable item by Ruby Garments Udyog Enterprises (Townhall, Gorakhpur - 273001)."
  },
  {
    id: "rw-103",
    name: "Downtown Striped Relaxed Cuban Collar Shirt",
    category: "shirts",
    categoryLabel: "Casual Shirts",
    originalPrice: 1999,
    price: 899,
    discount: "55% OFF",
    rating: 4.7,
    reviewsCount: 64,
    stock: 5,
    isBestSeller: false,
    isNew: true,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Sage Stripe", code: "#7b9084" },
      { name: "Sand Beige", code: "#d8cbb5" },
      { name: "Sky Blue", code: "#6ea8fe" }
    ],
    description: "Breathable resort-ready Cuban camp collar shirt in textured vertical stripes. Features clean wooden buttons and a relaxed boxy cut tailored for warm climate comfort.",
    fabric: "Linen-Cotton Blend (Pre-Shrunk)",
    policyNotice: "Strict Non-Refundable & Non-Returnable item by Ruby Garments Udyog Enterprises (Townhall, Gorakhpur - 273001)."
  },
  {
    id: "rw-104",
    name: "Urban Tactical Hoodie FullZip Black",
    category: "winterwear",
    categoryLabel: "Winter Wear",
    originalPrice: 2499,
    price: 1199,
    discount: "52% OFF",
    rating: 4.9,
    reviewsCount: 210,
    stock: 4,
    isBestSeller: true,
    isNew: false,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKfp_9Tet37hJ83k65QYsd-njXQjx6CjwbQ5J_7DeuoA&s=10",
    hoverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKfp_9Tet37hJ83k65QYsd-njXQjx6CjwbQ5J_7DeuoA&s=10",
    gallery: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKfp_9Tet37hJ83k65QYsd-njXQjx6CjwbQ5J_7DeuoA&s=10"
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Pitch Black", code: "#111111" }
    ],
    description: "Ultra-plush 380 GSM brushed fleece hooded sweatshirt with double-layered hood, kangaroo pocket, ribbed hems, and minimalist brand tag.",
    fabric: "80% Cotton / 20% Polyester Heavy Fleece (380 GSM)",
    policyNotice: "Strict Non-Refundable & Non-Returnable item by Ruby Garments Udyog Enterprises (Townhall, Gorakhpur - 273001)."
  },
  {
    id: "rw-105",
    name: "Relaxed Fit 6-Pocket Tactical Cargo Pants",
    category: "denims",
    categoryLabel: "Bottoms & Pants",
    originalPrice: 2199,
    price: 999,
    discount: "55% OFF",
    rating: 4.8,
    reviewsCount: 130,
    stock: 8,
    isBestSeller: false,
    isNew: true,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["30", "32", "34", "36", "38"],
    colors: [
      { name: "Midnight Black", code: "#1c1c1c" }
    ],
    description: "Heavy-duty twill cargo pants built with reinforced knee panels, spacious bellows pockets with snap closures, and elasticated ankle adjusters.",
    fabric: "100% Cotton Canvas Twill (290 GSM)",
    policyNotice: "Strict Non-Refundable & Non-Returnable item by Ruby Garments Udyog Enterprises (Townhall, Gorakhpur - 273001)."
  }
];

// Async loader to sync from products.json when served via HTTP
async function loadProductsFromJson() {
  try {
    const basePath = window.location.pathname.includes('/checkout') ? '../products.json' : 'products.json';
    const res = await fetch(basePath);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        PRODUCTS_DATA = data;
        if (typeof renderProducts === 'function') {
          renderProducts('all');
        }
      }
    }
  } catch (e) {
    // Fallback quietly to embedded PRODUCTS_DATA when opened via file:// protocol
  }
}

// Automatically initiate JSON sync
if (typeof window !== 'undefined') {
  loadProductsFromJson();
}

const PROMO_CODES = {
  "RUBY10": { discountPercent: 10, description: "10% Off on all orders" },
  "FIRSTBUY": { discountFlat: 100, minCart: 999, description: "₹100 Off on orders above ₹999" },
  "BRAND50": { discountFlat: 50, minCart: 499, description: "₹50 Instant Discount" }
};
