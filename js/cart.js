// Cart and Wishlist State Manager

class StoreState {
  constructor() {
    const env = window.ENV || {};

    this.cart = this.loadFromStorage('bw_cart', []);
    this.wishlist = this.loadFromStorage('bw_wishlist', []);
    this.appliedCoupon = this.loadFromStorage('bw_coupon', null);
    this.freeShippingThreshold = env.FREE_SHIPPING_THRESHOLD || 999;
    this.shippingFee = env.STANDARD_SHIPPING_FEE || 79;
    
    // Cart Limits from ENV
    this.maxQuantityPerItem = env.MAX_QUANTITY_PER_ITEM || 5; 
    this.maxTotalCartItems = env.MAX_TOTAL_CART_ITEMS || 10; 
    this.minOrderAmount = env.MIN_ORDER_AMOUNT || 299;   

    // Paytm Gateway Configuration from ENV
    this.paytmConfig = {
      mid: env.PAYTM_MID || "UHYEFn90798504990109",
      merchantKey: env.PAYTM_MERCHANT_KEY || "zFOtTSahK6#Hq_V9",
      website: env.PAYTM_WEBSITE || "WEBSTAGING",
      industryType: env.PAYTM_INDUSTRY_TYPE_ID || "Retail",
      channelIdWeb: env.PAYTM_CHANNEL_ID_WEB || "WEB",
      channelIdWap: env.PAYTM_CHANNEL_ID_WAP || "WAP",
      gatewayName: "Paytm Payment Gateway"
    };

    // Business & Location Info from ENV
    this.companyInfo = {
      name: env.COMPANY_NAME || "Ruby Garments Udyog Enterprises",
      brandName: env.BRAND_NAME || "RB Garment Enterprises",
      owner: env.OWNER_NAME || "Pappu Singh",
      address: env.OFFICE_LOCATION || "Townhall, Gorakhpur - 273001, Uttar Pradesh, India",
      email: env.SUPPORT_EMAIL || "support@brandwardrobe.in",
      phone: env.SUPPORT_PHONE || "+91 98765 43210"
    };

    this.subscribers = [];
  }

  loadFromStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn("Storage access failed", e);
      return fallback;
    }
  }

  saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("Storage save failed", e);
    }
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  notify() {
    this.subscribers.forEach(cb => cb(this));
  }

  addToCart(product, size = "L", color = null, quantity = 1) {
    const totalCurrentCount = this.getCartCount();
    if (totalCurrentCount + quantity > this.maxTotalCartItems) {
      return {
        success: false,
        message: `Cart limit reached! Maximum ${this.maxTotalCartItems} total items allowed per order.`
      };
    }

    const selectedColor = color || (product.colors && product.colors[0] ? product.colors[0].name : "Standard");
    const itemKey = `${product.id}-${size}-${selectedColor}`;
    
    const existingIndex = this.cart.findIndex(item => item.key === itemKey);
    if (existingIndex > -1) {
      const newQty = this.cart[existingIndex].quantity + quantity;
      if (newQty > this.maxQuantityPerItem) {
        return {
          success: false,
          message: `Limit reached: Maximum ${this.maxQuantityPerItem} units allowed per item.`
        };
      }
      this.cart[existingIndex].quantity = newQty;
    } else {
      if (quantity > this.maxQuantityPerItem) {
        return {
          success: false,
          message: `Limit reached: Maximum ${this.maxQuantityPerItem} units allowed per item.`
        };
      }
      this.cart.push({
        key: itemKey,
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        size: size,
        color: selectedColor,
        quantity: quantity,
        policyNotice: product.policyNotice
      });
    }

    this.saveToStorage('bw_cart', this.cart);
    this.notify();
    return { success: true, message: `Added to cart!` };
  }

  updateQuantity(itemKey, delta) {
    const itemIndex = this.cart.findIndex(item => item.key === itemKey);
    if (itemIndex > -1) {
      const currentQty = this.cart[itemIndex].quantity;
      const newQty = currentQty + delta;

      if (delta > 0) {
        if (newQty > this.maxQuantityPerItem) {
          return {
            success: false,
            message: `Limit reached: Maximum ${this.maxQuantityPerItem} units per item allowed.`
          };
        }
        if (this.getCartCount() + delta > this.maxTotalCartItems) {
          return {
            success: false,
            message: `Cart limit reached: Maximum ${this.maxTotalCartItems} total items allowed.`
          };
        }
      }

      this.cart[itemIndex].quantity = newQty;
      if (this.cart[itemIndex].quantity <= 0) {
        this.cart.splice(itemIndex, 1);
      }
      this.saveToStorage('bw_cart', this.cart);
      this.notify();
      return { success: true };
    }
    return { success: false };
  }

  removeFromCart(itemKey) {
    this.cart = this.cart.filter(item => item.key !== itemKey);
    this.saveToStorage('bw_cart', this.cart);
    this.notify();
  }

  clearCart() {
    this.cart = [];
    this.appliedCoupon = null;
    this.saveToStorage('bw_cart', this.cart);
    this.saveToStorage('bw_coupon', this.appliedCoupon);
    this.notify();
  }

  toggleWishlist(productId) {
    const exists = this.wishlist.includes(productId);
    if (exists) {
      this.wishlist = this.wishlist.filter(id => id !== productId);
    } else {
      this.wishlist.push(productId);
    }
    this.saveToStorage('bw_wishlist', this.wishlist);
    this.notify();
    return !exists;
  }

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  }

  applyPromoCode(codeStr) {
    const code = (codeStr || '').trim().toUpperCase();
    if (!PROMO_CODES[code]) {
      return { success: false, message: "Invalid promo coupon code." };
    }

    const promo = PROMO_CODES[code];
    const subtotal = this.getSubtotal();

    if (promo.minCart && subtotal < promo.minCart) {
      return {
        success: false,
        message: `Coupon requires minimum order of ₹${promo.minCart}`
      };
    }

    this.appliedCoupon = {
      code: code,
      ...promo
    };
    this.saveToStorage('bw_coupon', this.appliedCoupon);
    this.notify();
    return { success: true, message: `Coupon "${code}" applied successfully!` };
  }

  removePromoCode() {
    this.appliedCoupon = null;
    this.saveToStorage('bw_coupon', null);
    this.notify();
  }

  getCartCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getOriginalTotal() {
    return this.cart.reduce((total, item) => total + ((item.originalPrice || item.price) * item.quantity), 0);
  }

  getDiscount() {
    const subtotal = this.getSubtotal();
    if (!this.appliedCoupon) return 0;

    if (this.appliedCoupon.discountPercent) {
      return Math.round((subtotal * this.appliedCoupon.discountPercent) / 100);
    }
    if (this.appliedCoupon.discountFlat) {
      return Math.min(this.appliedCoupon.discountFlat, subtotal);
    }
    return 0;
  }

  getShippingFee() {
    if (this.cart.length === 0) return 0;
    const subtotal = this.getSubtotal();
    return subtotal >= this.freeShippingThreshold ? 0 : this.shippingFee;
  }

  getFinalTotal() {
    const subtotal = this.getSubtotal();
    if (subtotal === 0) return 0;
    const discount = this.getDiscount();
    const shipping = this.getShippingFee();
    return Math.max(0, subtotal - discount + shipping);
  }

  getSavings() {
    const originalTotal = this.getOriginalTotal();
    const finalTotal = this.getFinalTotal();
    return Math.max(0, originalTotal - finalTotal);
  }
}

// Global store instance
const store = new StoreState();
