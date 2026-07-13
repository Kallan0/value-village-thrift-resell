export const APP_CONSTRAINTS = {
  // SECURITY & AUTHENTICATION
  AUTH: {
    PASSWORD: {
      MIN_LENGTH: 8,
      MAX_LENGTH: 32,
      REQUIRE_UPPERCASE: true,
      REQUIRE_LOWERCASE: true,
      REQUIRE_NUMBER: true,
      REQUIRE_SPECIAL_CHAR: true,
      REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/
    },
    OTP: {
      LENGTH: 6,
      EXPIRY_MINUTES: 5
    },
    USERNAME: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 20,
      ALLOWED_CHARS: /^[a-zA-Z0-9_]+$/ // Alphanumeric and underscores only
    }
  },

  // FORMS & INPUT LIMITS (Missing items to secure your DB input)
  FORMS: {
    PRODUCT_TITLE: { MAX_LENGTH: 50 },
    PRODUCT_DESCRIPTION: { MAX_LENGTH: 500 },
    USER_REVIEW: { MAX_LENGTH: 250 }
  },

  // MEDIA & IMAGES (Missing critical constraints for uploads)
  MEDIA: {
    MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB Limit per image
    ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
    MAX_IMAGES_PER_PRODUCT: 5
  }
};