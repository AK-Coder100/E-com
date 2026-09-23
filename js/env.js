// Environment Configuration Loader for Browser & Server Runtime
// Reads from .env / runtime configurations

window.ENV = {
  // Paytm Payment Gateway Configuration
  PAYTM_MID: "UHYEFn90798504990109",
  PAYTM_MERCHANT_KEY: "zFOtTSahK6#Hq_V9",
  PAYTM_WEBSITE: "WEBSTAGING",
  PAYTM_INDUSTRY_TYPE_ID: "Retail",
  PAYTM_CHANNEL_ID_WEB: "WEB",
  PAYTM_CHANNEL_ID_WAP: "WAP",
  PAYTM_PAYMENT_URL: "https://securegw-stage.paytm.in/theia/processTransaction",

  // Store & Merchant Info
  STORE_NAME: "Ruby Wardrobe",
  COMPANY_NAME: "Ruby Garments Udyog Enterprises",
  BRAND_NAME: "RB Garment Enterprises",
  OWNER_NAME: "Pappu Singh",
  OFFICE_LOCATION: "Townhall, Gorakhpur - 273001, Uttar Pradesh, India",
  SUPPORT_EMAIL: "support@neoclare.com",
  SUPPORT_PHONE: "+91 98765 43210",

  // Policy Settings
  RETURN_REFUND_POLICY: "STRICT_NON_REFUNDABLE",

  // Cart & Order Limits
  MAX_QUANTITY_PER_ITEM: 5,
  MAX_TOTAL_CART_ITEMS: 10,
  MIN_ORDER_AMOUNT: 299,
  FREE_SHIPPING_THRESHOLD: 999,
  STANDARD_SHIPPING_FEE: 79
};
