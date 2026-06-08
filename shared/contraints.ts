export const AUTH_CONSTRAINTS = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 64,
  MAX_NAME_LENGTH: 50,
};

export const ORDER_CONSTRAINTS = {
  FREE_SHIPPING_THRESHOLD_USD: 35,
  STANDARD_SHIPPING_COST_USD: 7.99,
  MAX_CART_ITEMS: 20,
  MAX_QTY_PER_THRIFT_ITEM: 1, 
};

export const PRODUCT_CONSTRAINTS = {
  CATEGORIES: ['Womens', 'Mens', 'Shoes', 'Accessories', 'Vintage'] as const,
  CONDITIONS: ['Like New', 'Excellent', 'Good', 'Fair'] as const,
  MAX_TITLE_LENGTH: 60,
  MAX_DESCRIPTION_LENGTH: 1000,
};

export const SELLER_CONSTRAINTS = {
  PAYOUT_PERCENTAGE: 0.85,
  MAX_IMAGES_PER_LISTING: 4,
  MAX_IMAGE_FILE_SIZE_MB: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
};