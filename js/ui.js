// Ruby Wardrobe - Ruby Garments Udyog Enterprises UI Controller

// Toast notification helper
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  let icon = "✓";
  if (type === "warning") icon = "⚠️";
  if (type === "info") icon = "ℹ️";

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Render Products Grid
function renderProducts(category = "all") {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  let filtered = PRODUCTS_DATA;
  if (category !== "all") {
    filtered = PRODUCTS_DATA.filter(p => p.category === category);
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
        <h3>No products found in this collection.</h3>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(product => {
    const isWishlisted = store.isInWishlist(product.id);
    return `
      <div class="product-card" data-id="${product.id}">
        <div class="product-image-wrap">
          <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" />
          <img src="${product.hoverImage}" alt="${product.name}" class="product-img product-img-hover" loading="lazy" />
          
          <div class="card-badge-group">
            ${product.isBestSeller ? '<span class="badge-bestseller">BESTSELLER</span>' : ''}
            <span class="badge-sale">${product.discount}</span>
            <span class="badge-nonref">NON-REFUNDABLE</span>
          </div>

          <button class="card-wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="handleToggleWishlist('${product.id}', this)" title="Add to Wishlist">
            ${isWishlisted ? '❤️' : '🤍'}
          </button>

          <div class="card-overlay-actions">
            <button class="btn-card-quick-view" onclick="openQuickView('${product.id}')">
              🔍 Quick View
            </button>
          </div>
        </div>

        <div class="product-content">
          <span class="product-category-name">${product.categoryLabel}</span>
          <h3 class="product-title" title="${product.name}">${product.name}</h3>
          
          <div class="product-rating">
            <div class="star-icons">★ ★ ★ ★ ★</div>
            <span class="rating-count">(${product.reviewsCount})</span>
          </div>

          <div class="product-pricing">
            <span class="price-current">₹${product.price}</span>
            <span class="price-original">₹${product.originalPrice}</span>
            <span class="price-discount">${product.discount}</span>
          </div>

          <div class="card-bottom-actions">
            <button class="btn-quick-add" onclick="handleQuickAdd('${product.id}')">
              ⚡ Quick Add (${product.sizes[0]})
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Quick Add Handler
function handleQuickAdd(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const defaultSize = product.sizes[0] || "L";
  const defaultColor = product.colors[0]?.name || "Standard";

  const result = store.addToCart(product, defaultSize, defaultColor, 1);
  if (result.success) {
    showToast(`Added "${product.name}" (${defaultSize}) to cart!`, "success");
    openCartDrawer();
  } else {
    showToast(result.message, "warning");
  }
}

// Wishlist Handler
function handleToggleWishlist(productId, btnElement) {
  const isAdded = store.toggleWishlist(productId);
  if (btnElement) {
    btnElement.classList.toggle("active", isAdded);
    btnElement.innerHTML = isAdded ? '❤️' : '🤍';
  }
  showToast(isAdded ? "Added to your wishlist!" : "Removed from wishlist", "info");
  updateWishlistCount();
}

function updateWishlistCount() {
  const badge = document.getElementById("wishlist-badge");
  if (badge) {
    badge.textContent = store.wishlist.length;
  }
}

// Quick View Modal
let currentQuickViewProduct = null;
let currentSelectedSize = "M";
let currentSelectedColor = "";
let currentSelectedQty = 1;

function openQuickView(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  currentQuickViewProduct = product;
  currentSelectedSize = product.sizes[0] || "L";
  currentSelectedColor = product.colors[0]?.name || "Standard";
  currentSelectedQty = 1;

  const modal = document.getElementById("quickview-modal");
  const content = document.getElementById("quickview-body");
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="quickview-grid">
      <div class="quickview-gallery">
        <img id="qv-main-image" src="${product.image}" alt="${product.name}" class="quickview-main-img" />
        <div class="quickview-thumbs">
          ${product.gallery.map((img, idx) => `
            <img src="${img}" class="quickview-thumb-img ${idx === 0 ? 'active' : ''}" onclick="switchQuickViewImage('${img}', this)" />
          `).join("")}
        </div>
      </div>

      <div class="quickview-details">
        <span class="product-category-name">${product.categoryLabel}</span>
        <h2 class="quickview-title">${product.name}</h2>
        
        <div class="product-rating" style="margin-bottom: 16px;">
          <div class="star-icons">★ ★ ★ ★ ★</div>
          <span class="rating-count">(${product.reviewsCount} Customer Reviews)</span>
        </div>

        <div class="product-pricing" style="margin-bottom: 20px;">
          <span class="price-current" style="font-size: 1.6rem;">₹${product.price}</span>
          <span class="price-original" style="font-size: 1.1rem;">₹${product.originalPrice}</span>
          <span class="price-discount" style="font-size: 0.9rem;">${product.discount}</span>
        </div>

        <!-- Strict Non-Refundable Policy Notice -->
        <div class="policy-strict-box">
          <div class="policy-strict-header">
            <span>🛡️</span> STRICT NON-REFUNDABLE POLICY
          </div>
          <p class="policy-strict-text">
            Direct factory dispatch by <strong>Ruby Garments Udyog Enterprises</strong> (Owner: Pappu Singh). All items are strictly non-returnable & non-refundable once dispatched to maintain highest quality standards.
          </p>
        </div>

        <!-- Size Selection -->
        <div class="option-group">
          <div class="option-label">
            <span>Select Size</span>
            <span style="color: var(--accent-gold); cursor: pointer;" onclick="openPolicyModal('size-guide')">Size Chart 📏</span>
          </div>
          <div class="size-pill-group">
            ${product.sizes.map((sz, i) => `
              <button class="size-pill ${i === 0 ? 'active' : ''}" onclick="selectQuickViewSize('${sz}', this)">
                ${sz}
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Color Selection -->
        <div class="option-group">
          <div class="option-label">
            <span>Color: <strong id="qv-color-name">${currentSelectedColor}</strong></span>
          </div>
          <div class="color-dots-group">
            ${product.colors.map((c, i) => `
              <div class="color-dot ${i === 0 ? 'active' : ''}" style="background-color: ${c.code};" title="${c.name}" onclick="selectQuickViewColor('${c.name}', this)"></div>
            `).join("")}
          </div>
        </div>

        <!-- Stock indicator -->
        <div class="stock-indicator">
          <span class="stock-dot"></span>
          <span>Hurry! Only ${product.stock} items left in stock</span>
        </div>

        <!-- Action buttons -->
        <div style="display: flex; gap: 12px; margin-top: 10px;">
          <div class="cart-qty-ctrl" style="padding: 4px;">
            <button class="cart-qty-btn" style="width: 32px; height: 32px;" onclick="changeQvQty(-1)">-</button>
            <span class="cart-qty-val" id="qv-qty-val" style="min-width: 36px; font-size: 0.95rem;">1</span>
            <button class="cart-qty-btn" style="width: 32px; height: 32px;" onclick="changeQvQty(1)">+</button>
          </div>

          <button class="btn-primary" style="flex: 1; justify-content: center;" onclick="addQuickViewToCart()">
            🛒 Add To Cart
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add("active");
}

function switchQuickViewImage(imgUrl, thumbEl) {
  const main = document.getElementById("qv-main-image");
  if (main) main.src = imgUrl;

  document.querySelectorAll(".quickview-thumb-img").forEach(el => el.classList.remove("active"));
  if (thumbEl) thumbEl.classList.add("active");
}

function selectQuickViewSize(size, el) {
  currentSelectedSize = size;
  document.querySelectorAll(".size-pill").forEach(p => p.classList.remove("active"));
  if (el) el.classList.add("active");
}

function selectQuickViewColor(colorName, el) {
  currentSelectedColor = colorName;
  const nameEl = document.getElementById("qv-color-name");
  if (nameEl) nameEl.textContent = colorName;

  document.querySelectorAll(".color-dot").forEach(d => d.classList.remove("active"));
  if (el) el.classList.add("active");
}

function changeQvQty(delta) {
  currentSelectedQty = Math.max(1, currentSelectedQty + delta);
  const valEl = document.getElementById("qv-qty-val");
  if (valEl) valEl.textContent = currentSelectedQty;
}

function addQuickViewToCart() {
  if (!currentQuickViewProduct) return;
  const result = store.addToCart(currentQuickViewProduct, currentSelectedSize, currentSelectedColor, currentSelectedQty);
  if (result.success) {
    closeModal("quickview-modal");
    showToast(`Added ${currentSelectedQty}x "${currentQuickViewProduct.name}" to cart!`, "success");
    openCartDrawer();
  } else {
    showToast(result.message, "warning");
  }
}

// Drawer and Modals Open/Close
function openCartDrawer() {
  document.getElementById("drawer-backdrop")?.classList.add("active");
  document.getElementById("cart-drawer")?.classList.add("active");
}

function closeCartDrawer() {
  document.getElementById("drawer-backdrop")?.classList.remove("active");
  document.getElementById("cart-drawer")?.classList.remove("active");
}

function closeModal(modalId) {
  document.getElementById(modalId)?.classList.remove("active");
}

function handleCartQtyChange(itemKey, delta) {
  const result = store.updateQuantity(itemKey, delta);
  if (result && !result.success && result.message) {
    showToast(result.message, "warning");
  }
}

// Render Cart Drawer
function renderCartUI() {
  const badge = document.getElementById("cart-badge");
  const count = store.getCartCount();
  if (badge) badge.textContent = count;

  const container = document.getElementById("cart-items-container");
  const footer = document.getElementById("cart-footer");
  const progressText = document.getElementById("shipping-progress-text");
  const progressFill = document.getElementById("shipping-progress-fill");

  const subtotal = store.getSubtotal();
  const threshold = store.freeShippingThreshold;

  // Free shipping bar & Cart limit info
  if (progressText && progressFill) {
    if (subtotal >= threshold) {
      progressText.innerHTML = "🎉 Congratulations! You have unlocked <strong>FREE Express Shipping</strong>!";
      progressFill.style.width = "100%";
    } else {
      const remaining = threshold - subtotal;
      const pct = Math.min(100, Math.round((subtotal / threshold) * 100));
      progressText.innerHTML = `Add <strong>₹${remaining}</strong> more for <strong>FREE Express Shipping</strong> <span style="display:block; font-size: 0.7rem; color: var(--text-muted); margin-top:2px;">(Cart limit: Max 10 items / Max 5 per design)</span>`;
      progressFill.style.width = `${pct}%`;
    }
  }

  if (!container) return;

  if (store.cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart-state">
        <div class="empty-icon">🛒</div>
        <h4>Your Shopping Cart is Empty</h4>
        <p>Explore our exclusive collection of luxury streetwear and classic polos.</p>
        <button class="btn-primary" onclick="closeCartDrawer(); window.location.href='#catalog'">
          Explore Collections
        </button>
      </div>
    `;
    if (footer) footer.style.display = "none";
    return;
  }

  if (footer) footer.style.display = "block";

  container.innerHTML = store.cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.name}</h4>
        <div class="cart-item-meta">Size: <strong>${item.size}</strong> | Color: <strong>${item.color}</strong></div>
        
        <div class="cart-item-price-row">
          <div class="cart-qty-ctrl">
            <button class="cart-qty-btn" onclick="handleCartQtyChange('${item.key}', -1)">-</button>
            <span class="cart-qty-val">${item.quantity}</span>
            <button class="cart-qty-btn" onclick="handleCartQtyChange('${item.key}', 1)">+</button>
          </div>
          <span class="cart-item-total">₹${item.price * item.quantity}</span>
        </div>
      </div>
      <button class="cart-item-remove" onclick="store.removeFromCart('${item.key}')" title="Remove Item">✕</button>
    </div>
  `).join("");

  // Update Summary numbers
  const subtotalEl = document.getElementById("cart-subtotal-val");
  const discountLine = document.getElementById("cart-discount-line");
  const discountVal = document.getElementById("cart-discount-val");
  const shippingVal = document.getElementById("cart-shipping-val");
  const totalVal = document.getElementById("cart-total-val");
  const appliedTag = document.getElementById("applied-promo-tag");

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;

  const discount = store.getDiscount();
  if (discount > 0 && discountLine && discountVal) {
    discountLine.style.display = "flex";
    discountVal.textContent = `-₹${discount}`;
  } else if (discountLine) {
    discountLine.style.display = "none";
  }

  if (appliedTag) {
    if (store.appliedCoupon) {
      appliedTag.style.display = "flex";
      appliedTag.innerHTML = `
        <span>Coupon <strong>${store.appliedCoupon.code}</strong> applied (${store.appliedCoupon.description})</span>
        <button onclick="store.removePromoCode()" style="color: #ef4444; font-weight: bold; margin-left: 8px;">✕</button>
      `;
    } else {
      appliedTag.style.display = "none";
    }
  }

  const shipping = store.getShippingFee();
  if (shippingVal) {
    shippingVal.textContent = shipping === 0 ? "FREE" : `₹${shipping}`;
  }

  const finalTotal = store.getFinalTotal();
  if (totalVal) totalVal.textContent = `₹${finalTotal}`;
}

// Promo Code Apply
function handleApplyPromo() {
  const input = document.getElementById("promo-input-field");
  if (!input) return;

  const result = store.applyPromoCode(input.value);
  if (result.success) {
    showToast(result.message, "success");
    input.value = "";
  } else {
    showToast(result.message, "warning");
  }
}

// Checkout Modal Open
function openCheckoutModal() {
  const ack = document.getElementById("cart-policy-checkbox");
  if (ack && !ack.checked) {
    showToast("Please acknowledge the Non-Refundable Policy to proceed.", "warning");
    return;
  }

  closeCartDrawer();
  const modal = document.getElementById("checkout-modal");
  if (!modal) return;

  // populate checkout summary
  const summaryEl = document.getElementById("checkout-order-summary");
  if (summaryEl) {
    summaryEl.innerHTML = `
      <div style="background: var(--bg-card); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: 700;">
          <span>Items (${store.getCartCount()}):</span>
          <span>₹${store.getSubtotal()}</span>
        </div>
        ${store.getDiscount() > 0 ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: var(--accent-emerald);">
            <span>Coupon Discount:</span>
            <span>-₹${store.getDiscount()}</span>
          </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Shipping:</span>
          <span>${store.getShippingFee() === 0 ? 'FREE' : `₹${store.getShippingFee()}`}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 800; border-top: 1px solid var(--border-subtle); padding-top: 10px; color: var(--accent-gold);">
          <span>Grand Total:</span>
          <span>₹${store.getFinalTotal()}</span>
        </div>
      </div>
    `;
  }

  modal.classList.add("active");
}

// Complete Order Submission
function handlePlaceOrder(event) {
  event.preventDefault();

  const form = document.getElementById("checkout-form");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const name = document.getElementById("cust-name").value;
  const phone = document.getElementById("cust-phone").value;
  const address = document.getElementById("cust-address").value;
  const city = document.getElementById("cust-city").value;
  const state = document.getElementById("cust-state").value;
  const pincode = document.getElementById("cust-pincode").value;
  const paymentMethod = document.querySelector('input[name="payment_opt"]:checked')?.value || "Paytm Payment Gateway";

  const orderId = "RG-" + Math.floor(100000 + Math.random() * 900000);
  const orderTotal = store.getFinalTotal();
  const orderItems = [...store.cart];

  const orderData = {
    orderId,
    name,
    phone,
    address,
    city,
    state,
    pincode,
    paymentMethod,
    total: orderTotal,
    items: orderItems,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  };

  closeModal("checkout-modal");

  // If Paytm Gateway is selected, show realistic Paytm Payment Gateway interface
  if (paymentMethod.includes("Paytm")) {
    openPaytmGatewayModal(orderData);
  } else {
    store.clearCart();
    openReceiptModal(orderData);
    showToast(`Order #${orderId} Placed Successfully!`, "success");
  }
}

// Paytm Payment Gateway Modal
function openPaytmGatewayModal(orderData) {
  const modal = document.getElementById("paytm-gateway-modal");
  const body = document.getElementById("paytm-modal-body");
  if (!modal || !body) return;

  body.innerHTML = `
    <div class="paytm-gateway-container">
      <!-- Paytm Header -->
      <div class="paytm-header">
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="assets/logo.png" alt="RB Garment Enterprises" style="width: 46px; height: 46px; border-radius: 50%; border: 2px solid #f59e0b;" />
          <div>
            <div style="font-weight: 800; font-size: 0.95rem; color: #fff;">RB Garment Enterprises (Ruby Garments Udyog)</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">Townhall, Gorakhpur - 273001 | Order #${orderData.orderId}</div>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.75rem; color: var(--text-muted);">Payable Amount</div>
          <div style="font-size: 1.3rem; font-weight: 800; color: #00b9f5;">₹${orderData.total}</div>
        </div>
      </div>

      <!-- Merchant Details Banner -->
      <div style="background: rgba(0, 185, 245, 0.08); border: 1px dashed rgba(0, 185, 245, 0.3); border-radius: 8px; padding: 10px 14px; margin: 16px 0; font-size: 0.75rem; color: #bae6fd;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
          <div><strong>Merchant ID (MID):</strong> <code style="color:#38bdf8;">${store.paytmConfig.mid}</code></div>
          <div><strong>Environment:</strong> <code style="color:#38bdf8;">${store.paytmConfig.website}</code></div>
          <div><strong>Industry Type:</strong> ${store.paytmConfig.industryType}</div>
          <div><strong>Channel:</strong> ${store.paytmConfig.channelIdWeb} / ${store.paytmConfig.channelIdWap}</div>
        </div>
      </div>

      <!-- Paytm Payment Options -->
      <div class="paytm-options-tabs" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 20px;">
        <button class="paytm-tab-btn active" onclick="switchPaytmTab('upi', this)">
          📱 Paytm UPI / QR
        </button>
        <button class="paytm-tab-btn" onclick="switchPaytmTab('wallet', this)">
          👛 Paytm Wallet
        </button>
        <button class="paytm-tab-btn" onclick="switchPaytmTab('cards', this)">
          💳 Debit / Credit Card
        </button>
      </div>

      <!-- Paytm Tab Content -->
      <div id="paytm-tab-content" style="background: var(--bg-card); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); text-align: center; margin-bottom: 20px;">
        <div id="paytm-upi-view">
          <p style="font-size: 0.85rem; margin-bottom: 12px; color: #fff;">Scan QR with <strong>Paytm App</strong> or any UPI App to Pay</p>
          <div style="background: #fff; padding: 12px; display: inline-block; border-radius: 8px; margin-bottom: 12px;">
            <!-- Simulated QR -->
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=rubygarments@paytm&pn=RubyGarmentsUdyog&am=${orderData.total}&cu=INR" alt="Paytm QR Code" style="width: 150px; height: 150px;" />
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">
            UPI ID: <strong>rubygarments@paytm</strong> • Instant API Confirmation
          </div>
        </div>
      </div>

      <!-- Complete Payment Button -->
      <button class="btn-primary" style="width: 100%; background: linear-gradient(135deg, #00b9f5, #002970); color: #fff; font-size: 1rem; justify-content: center; box-shadow: 0 4px 15px rgba(0, 185, 245, 0.4);" onclick="finishPaytmTransaction(${JSON.stringify(orderData).replace(/"/g, '&quot;')})">
        🔒 Approve & Complete Paytm Payment (₹${orderData.total})
      </button>
    </div>
  `;

  modal.classList.add("active");
}

function switchPaytmTab(tab, btn) {
  document.querySelectorAll(".paytm-tab-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  const content = document.getElementById("paytm-tab-content");
  if (!content) return;

  if (tab === 'wallet') {
    content.innerHTML = `
      <div style="text-align: left; padding: 10px;">
        <label style="display:block; font-size: 0.8125rem; margin-bottom: 6px;">Enter Linked Paytm Mobile Number:</label>
        <input type="tel" class="form-input" placeholder="+91 9876543210" value="${document.getElementById('cust-phone')?.value || ''}" style="margin-bottom: 12px;" />
        <p style="font-size: 0.75rem; color: var(--text-muted);">An OTP will be sent to your registered mobile number for seamless wallet debit.</p>
      </div>
    `;
  } else if (tab === 'cards') {
    content.innerHTML = `
      <div style="text-align: left; padding: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div style="grid-column: span 2;">
          <label style="font-size: 0.78rem;">Card Number:</label>
          <input type="text" class="form-input" placeholder="4111 2222 3333 4444" />
        </div>
        <div>
          <label style="font-size: 0.78rem;">Valid Thru:</label>
          <input type="text" class="form-input" placeholder="MM/YY" />
        </div>
        <div>
          <label style="font-size: 0.78rem;">CVV:</label>
          <input type="password" maxlength="4" class="form-input" placeholder="123" />
        </div>
      </div>
    `;
  } else {
    content.innerHTML = `
      <div id="paytm-upi-view">
        <p style="font-size: 0.85rem; margin-bottom: 12px; color: #fff;">Scan QR with <strong>Paytm App</strong> or any UPI App to Pay</p>
        <div style="background: #fff; padding: 12px; display: inline-block; border-radius: 8px; margin-bottom: 12px;">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=rubygarments@paytm&pn=RubyGarmentsUdyog&am=100&cu=INR" alt="Paytm QR Code" style="width: 150px; height: 150px;" />
        </div>
        <div style="font-size: 0.78rem; color: var(--text-muted);">
          UPI ID: <strong>rubygarments@paytm</strong> • Instant API Confirmation
        </div>
      </div>
    `;
  }
}

function finishPaytmTransaction(orderData) {
  closeModal("paytm-gateway-modal");
  store.clearCart();
  orderData.paymentMethod = "Paytm Gateway (TXN_SUCCESS - MID: " + store.paytmConfig.mid.substring(0, 8) + "...)";
  openReceiptModal(orderData);
  showToast(`Paytm API Payment Approved! Order #${orderData.orderId} Placed.`, "success");
}

function openReceiptModal(order) {
  const modal = document.getElementById("receipt-modal");
  const body = document.getElementById("receipt-modal-body");
  if (!modal || !body) return;

  body.innerHTML = `
    <div style="text-align: center; margin-bottom: 24px;">
      <img src="assets/logo.png" alt="RB Garment Enterprises" style="width: 72px; height: 72px; border-radius: 50%; border: 3px solid #f59e0b; margin: 0 auto 12px; box-shadow: 0 0 20px rgba(245,158,11,0.4);" />
      <h2 style="font-size: 1.6rem; color: var(--accent-gold);">Order Placed Successfully!</h2>
      <p style="color: var(--text-muted); font-size: 0.875rem;">
        Thank you for shopping with <strong>Ruby Wardrobe</strong><br/>
        Fulfilled by <strong>Ruby Garments Udyog Enterprises / RB Garment Enterprises</strong> (Owner: Pappu Singh)<br/>
        <strong>Office:</strong> Townhall, Gorakhpur - 273001, UP
      </p>
    </div>

    <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px; margin-bottom: 24px;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.8125rem; margin-bottom: 16px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 16px;">
        <div><strong>Order ID:</strong> <span style="color: var(--accent-gold); font-family: var(--font-mono);">${order.orderId}</span></div>
        <div><strong>Date:</strong> ${order.date}</div>
        <div><strong>Customer:</strong> ${order.name} (${order.phone})</div>
        <div><strong>Payment:</strong> ${order.paymentMethod}</div>
        <div style="grid-column: span 2;"><strong>Delivery To:</strong> ${order.address}, ${order.city}, ${order.state} - ${order.pincode}</div>
      </div>

      <h4 style="font-size: 0.95rem; margin-bottom: 10px;">Ordered Items:</h4>
      <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
        ${order.items.map(it => `
          <div style="display: flex; justify-content: space-between; font-size: 0.8125rem;">
            <span>${it.quantity}x ${it.name} (${it.size})</span>
            <strong>₹${it.price * it.quantity}</strong>
          </div>
        `).join("")}
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 800; color: #fff; border-top: 1px solid var(--border-subtle); padding-top: 10px;">
        <span>Total Paid:</span>
        <span style="color: var(--accent-gold);">₹${order.total}</span>
      </div>
    </div>

    <!-- Policy Reminder -->
    <div class="policy-strict-box" style="margin-bottom: 24px;">
      <div class="policy-strict-header">
        <span>🛡️</span> NON-REFUNDABLE POLICY ACKNOWLEDGMENT
      </div>
      <p class="policy-strict-text">
        As per Ruby Garments Udyog Enterprises policy (Townhall, Gorakhpur - 273001), all orders are manufactured and checked under rigorous standards and are final sale (Non-refundable / Non-returnable).
      </p>
    </div>

    <div style="display: flex; gap: 12px; justify-content: center;">
      <button class="btn-primary" onclick="window.print()">🖨️ Print Receipt</button>
      <button class="btn-secondary" onclick="closeModal('receipt-modal')">Continue Shopping</button>
    </div>
  `;

  modal.classList.add("active");
}

// Policy Modal Viewer
function openPolicyModal(tabName = "refund-policy") {
  const modal = document.getElementById("policy-modal");
  const body = document.getElementById("policy-modal-body");
  if (!modal || !body) return;

  if (tabName === "refund-policy") {
    body.innerHTML = `
      <div class="policy-doc-content">
        <h2>Return & Refund Policy</h2>
        <p class="doc-subtitle">Ruby Garments Udyog Enterprises | Office: Townhall, Gorakhpur - 273001</p>
        
        <div class="policy-section-block" style="border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.05);">
          <h3 style="color: #f87171;">🚫 STRICT NON-REFUNDABLE & NO RETURN POLICY</h3>
          <p>
            At <strong>Ruby Wardrobe</strong>, managed and operated by <strong>Ruby Garments Udyog Enterprises</strong> (Proprietor: <strong>Pappu Singh</strong>, Office: <strong>Townhall, Gorakhpur - 273001, Uttar Pradesh</strong>), we deliver factory-direct, superior grade apparel at subsidized wholesale margins.
          </p>
          <p style="margin-top: 10px; font-weight: 700; color: #fff;">
            Due to the direct-to-consumer discounted pricing model and strict textile hygiene standards, all sales are 100% FINAL. We strictly enforce a NO RETURN and NON-REFUNDABLE policy on all merchandise once dispatched.
          </p>
        </div>

        <div class="policy-section-block">
          <h3>1. Scope of Non-Refundable Policy</h3>
          <p>This strict policy applies universally across all product categories including:</p>
          <ul>
            <li>Oversized Streetwear T-Shirts & Graphic Tees</li>
            <li>Bio-Washed Classic Polo T-Shirts</li>
            <li>Casual & Formal Linen/Cotton Shirts</li>
            <li>Selvedge Jeans, Cargo Pants, and Denim Bottoms</li>
            <li>Hoodies, Sweatshirts, and Winter Collections</li>
            <li>Discounted Multi-Pack Bundles and Combos</li>
          </ul>
        </div>

        <div class="policy-section-block">
          <h3>2. Quality Assurance & Cart Limits</h3>
          <p>
            Every single article undergoes multi-stage manual quality checks by Ruby Garments Udyog Enterprises before final packing. Cart limits are capped at a maximum of 5 units per item and 10 total items per order to maintain individual retail fairness and prohibit unauthorized black-market reselling.
          </p>
        </div>

        <div class="policy-section-block">
          <h3>3. Exceptional Inquiries</h3>
          <p>
            In the improbable event of receiving an incorrect parcel or transit damage, customers must submit an uninterrupted unboxing video within 24 hours of delivery to our support team for verification.
          </p>
          <p style="margin-top: 8px;">
            <strong>Official Support:</strong> support@neoclare.com | WhatsApp: +91 98765 43210<br/>
            <strong>Office:</strong> Townhall, Gorakhpur - 273001, Uttar Pradesh, India
          </p>
        </div>
      </div>
    `;
  } else if (tabName === "about-us") {
    body.innerHTML = `
      <div class="policy-doc-content">
        <h2>About Ruby Garments Udyog Enterprises</h2>
        <p class="doc-subtitle">Office Location: Townhall, Gorakhpur - 273001, Uttar Pradesh</p>
        
        <div class="policy-section-block">
          <h3>🏢 Company Overview</h3>
          <p>
            <strong>Ruby Wardrobe</strong> is the flagship direct-to-consumer digital portal of <strong>Ruby Garments Udyog Enterprises</strong>, founded and led by entrepreneur <strong>Pappu Singh</strong>.
          </p>
          <p style="margin-top: 8px;">
            Headquartered at <strong>Townhall, Gorakhpur 273001</strong>, Ruby Garments Udyog produces high-density combed cotton apparel, classic pique polo knits, and premium selvedge denims that rival top international luxury brands at accessible Indian pricing.
          </p>
        </div>

        <div class="policy-section-block">
          <h3>👑 Founder & Leadership</h3>
          <p>
            Under the visionary leadership of <strong>Mr. Pappu Singh</strong>, Ruby Garments Udyog Enterprises has focused relentlessly on fabric durability, heavyweight GSM standards (220-380 GSM), vibrant color retention, and transparent factory-to-doorstep delivery without intermediaries.
          </p>
        </div>

        <div class="policy-section-block">
          <h3>🌟 Our Core Pillars</h3>
          <ul>
            <li><strong>100% Pure Combed Cotton:</strong> No synthetics or cheap fillers.</li>
            <li><strong>Direct Factory Pricing:</strong> Eliminating distributor markups.</li>
            <li><strong>Official Office:</strong> Townhall, Gorakhpur - 273001.</li>
            <li><strong>Secure Paytm Gateway:</strong> Seamless, verified instant digital checkout.</li>
          </ul>
        </div>
      </div>
    `;
  } else if (tabName === "contact-us") {
    body.innerHTML = `
      <div class="policy-doc-content">
        <h2>Customer Support & Business Inquiries</h2>
        <p class="doc-subtitle">Ruby Garments Udyog Enterprises Help Desk</p>
        
        <div class="policy-section-block">
          <h3>📞 Contact Channels</h3>
          <p><strong>Business Name:</strong> Ruby Garments Udyog Enterprises</p>
          <p><strong>Proprietor:</strong> Pappu Singh</p>
          <p><strong>Office Location:</strong> Townhall, Gorakhpur - 273001, Uttar Pradesh, India</p>
          <p><strong>Support Email:</strong> support@neoclare.com</p>
          <p><strong>WhatsApp Support:</strong> +91 98765 43210 (Mon-Sat, 10 AM - 7 PM IST)</p>
          <p><strong>Payment Gateway:</strong> Paytm (MID: ${store.paytmConfig.mid})</p>
        </div>
      </div>
    `;
  } else if (tabName === "size-guide") {
    body.innerHTML = `
      <div class="policy-doc-content">
        <h2>Size Guide & Measurement Chart</h2>
        <p class="doc-subtitle">Find your exact fit before ordering</p>
        
        <div class="policy-section-block">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border-subtle); color: var(--accent-gold);">
                <th style="padding: 10px;">Size</th>
                <th style="padding: 10px;">Chest (Inches)</th>
                <th style="padding: 10px;">Length (Inches)</th>
                <th style="padding: 10px;">Shoulder (Inches)</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--border-subtle);"><td style="padding: 10px;">S</td><td style="padding: 10px;">38 - 40"</td><td style="padding: 10px;">27"</td><td style="padding: 10px;">18"</td></tr>
              <tr style="border-bottom: 1px solid var(--border-subtle);"><td style="padding: 10px;">M</td><td style="padding: 10px;">40 - 42"</td><td style="padding: 10px;">28"</td><td style="padding: 10px;">19"</td></tr>
              <tr style="border-bottom: 1px solid var(--border-subtle);"><td style="padding: 10px;">L</td><td style="padding: 10px;">42 - 44"</td><td style="padding: 10px;">29"</td><td style="padding: 10px;">20"</td></tr>
              <tr style="border-bottom: 1px solid var(--border-subtle);"><td style="padding: 10px;">XL</td><td style="padding: 10px;">44 - 46"</td><td style="padding: 10px;">30"</td><td style="padding: 10px;">21"</td></tr>
              <tr><td style="padding: 10px;">XXL</td><td style="padding: 10px;">46 - 48"</td><td style="padding: 10px;">31"</td><td style="padding: 10px;">22"</td></tr>
            </tbody>
          </table>
          <p style="margin-top: 14px; font-size: 0.78rem; color: var(--text-muted);">
            *All oversized tees have an intentional +2 inch relaxed drop shoulder chest room. Cart limit: max 5 pieces per size.
          </p>
        </div>
      </div>
    `;
  }

  modal.classList.add("active");
}

// Search Drawer / Modal
function openSearchModal() {
  const modal = document.getElementById("search-modal");
  const input = document.getElementById("search-query-input");
  if (modal) {
    modal.classList.add("active");
    setTimeout(() => input?.focus(), 100);
  }
}

function handleLiveSearch(query) {
  const resultsContainer = document.getElementById("search-results-box");
  if (!resultsContainer) return;

  const q = (query || "").trim().toLowerCase();
  if (!q) {
    resultsContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: 20px;">Type to search oversized tees, polos, shirts, denims...</p>`;
    return;
  }

  const matches = PRODUCTS_DATA.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.categoryLabel.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );

  if (matches.length === 0) {
    resultsContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: 20px;">No items match "${query}"</p>`;
    return;
  }

  resultsContainer.innerHTML = matches.map(p => `
    <div class="search-item-row" onclick="closeModal('search-modal'); openQuickView('${p.id}')">
      <img src="${p.image}" alt="${p.name}" class="search-item-img" />
      <div class="search-item-info">
        <h5>${p.name}</h5>
        <span class="search-item-price">₹${p.price} <span style="text-decoration: line-through; color: var(--text-muted); font-size: 0.75rem;">₹${p.originalPrice}</span></span>
      </div>
    </div>
  `).join("");
}
