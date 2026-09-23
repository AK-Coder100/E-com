// Ruby Wardrobe - Ruby Garments Udyog Enterprises Main App Initializer

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initial product catalog render
  renderProducts("all");

  // 2. Initial Wishlist count
  updateWishlistCount();

  // 3. Subscribe store state changes to render cart UI
  store.subscribe(() => {
    renderCartUI();
  });
  renderCartUI();

  // 4. Category filter pills
  const filterPills = document.querySelectorAll(".filter-pill");
  filterPills.forEach(pill => {
    pill.addEventListener("click", () => {
      filterPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const cat = pill.getAttribute("data-category") || "all";
      renderProducts(cat);
    });
  });

  // 5. Sticky header scroll effect
  const header = document.querySelector(".site-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }
  });

  // 6. Mobile navigation menu toggle
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const navMenu = document.getElementById("main-nav-menu");
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });
    // Close mobile menu on nav link click
    navMenu.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
      });
    });
  }

  // 7. Global Keyboard shortcuts (Ctrl+K or Cmd+K to open search)
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openSearchModal();
    }
    if (e.key === "Escape") {
      closeModal("quickview-modal");
      closeModal("checkout-modal");
      closeModal("policy-modal");
      closeModal("receipt-modal");
      closeModal("search-modal");
      closeCartDrawer();
    }
  });

  // 8. Search input event
  const searchInput = document.getElementById("search-query-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      handleLiveSearch(e.target.value);
    });
  }

  // 9. Payment Option Card selection in Checkout
  const paymentCards = document.querySelectorAll(".payment-card-opt");
  paymentCards.forEach(card => {
    card.addEventListener("click", () => {
      paymentCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  console.log("Ruby Wardrobe - Ruby Garments Udyog Enterprises loaded successfully.");
});
