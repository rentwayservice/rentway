export enum AuthErrorKeys {
  EMAIL_REQUIRED = "auth_errors.auth_email_required",
  EMAIL_INVALID = "auth_errors.auth_email_invalid",

  // Store name errors
  STORE_NAME_REQUIRED = "auth_errors.store_name_required",
  STORE_NAME_TOO_SHORT = "auth_errors.store_name_too_short",

  // Store type errors
  SELECT_REQUIRED = "auth_errors.select_required",

  // Slug errors
  SLUG_REQUIRED = "auth_errors.slug_required",
  SLUG_TOO_SHORT = "auth_errors.slug_too_short",
  SLUG_TOO_LONG = "auth_errors.slug_too_long",
  SLUG_INVALID_FORMAT = "auth_errors.slug_invalid_format",
  SLUG_NO_CONSECUTIVE_HYPHENS = "auth_errors.slug_no_consecutive_hyphens",
  SLUG_CANNOT_BE_NUMERIC = "auth_errors.slug_cannot_be_numeric",
  SLUG_RESERVED_WORD = "auth_errors.slug_reserved_word",

  // Password errors
  PASSWORD_REQUIRED = "auth_errors.auth_password_required",
  PASSWORD_TOO_SHORT = "auth_errors.auth_password_too_short",
  PASSWORDS_NOT_MATCHING = "auth_errors.passwords_not_matching",
  CONFIRM_PASSWORD_REQUIRED = "auth_errors.confirm_password_required",
  PASSWORD_TOO_WEAK = "auth_errors.auth_password_too_weak",
  // Basic info errors
  FULL_NAME_REQUIRED = "auth_errors.full_name_required",
  FULL_NAME_TOO_SHORT = "auth_errors.full_name_too_short",
  COUNTRY_REQUIRED = "auth_errors.country_required",

  // OTP related
  OTP_REQUIRED = "auth_errors.auth_otp_required",
  OTP_INVALID = "auth_errors.auth_otp_invalid",

  // Generic errors
  ACCOUNT_EXISTS = "auth_errors.account_exists",
  STORE_NAME_EXISTS = "auth_errors.store_name_exists",
  SLUG_EXISTS = "auth_errors.slug_exists",
  REGISTRATION_FAILED = "auth_errors.registration_failed",
  SERVER_ERROR = "auth_errors.server_error",
}

export enum SupabaseAuthErrorKeys {
  // Email errors
  EMAIL_IN_USE = "auth_errors.email_in_use",
  INVALID_EMAIL = "auth_errors.invalid_email",

  // Password errors
  WEAK_PASSWORD = "auth_errors.weak_password",
  PASSWORD_MISMATCH = "auth_errors.password_mismatch",

  // Rate limiting/security
  TOO_MANY_ATTEMPTS = "auth_errors.too_many_attempts",
  CAPTCHA_REQUIRED = "auth_errors.captcha_required",

  // Server errors
  SERVER_ERROR = "auth_errors.server_error",
  NETWORK_ERROR = "auth_errors.network_error",

  // Generic errors
  SIGNUP_FAILED = "auth_errors.signup_failed",
  UNKNOWN_ERROR = "auth_errors.unknown_error",
}
