export const auth_errors = {
  // General errors
  invalid_credentials: "بيانات تسجيل الدخول غير صحيحة",
  validation_failed: "تنسيق الإدخال غير صحيح",
  unexpected_failure: "حدث خطأ غير متوقع",
  request_timeout: "انتهت مهلة الطلب. يرجى المحاولة مرة أخرى",
  over_request_rate_limit: "عدد الطلبات كبير جداً. يرجى المحاولة لاحقاً",

  // Email related errors
  email_exists: "البريد الإلكتروني مسجل مسبقاً",
  email_not_confirmed: "البريد الإلكتروني غير مؤكد",
  email_provider_disabled: "تسجيل البريد الإلكتروني معطل",
  email_address_invalid: "عنوان البريد الإلكتروني غير صحيح",
  email_address_not_authorized:
    "إرسال البريد الإلكتروني غير مصرح به لهذا العنوان",
  over_email_send_rate_limit:
    "تم إرسال عدد كبير من رسائل البريد الإلكتروني. يرجى المحاولة لاحقاً",

  // Password related errors
  weak_password: "كلمة المرور ضعيفة جداً",
  same_password:
    "يجب أن تكون كلمة المرور الجديدة مختلفة عن كلمة المرور الحالية",
  reauthentication_needed: "يرجى إعادة المصادقة لتغيير كلمة المرور",
  reauthentication_not_valid: "رمز إعادة المصادقة غير صحيح",

  // Session related errors
  session_expired: "انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى",
  session_not_found: "لم يتم العثور على الجلسة",
  refresh_token_not_found: "لم يتم العثور على رمز التحديث",
  refresh_token_already_used: "تم استخدام رمز التحديث مسبقاً",

  // OAuth related errors
  oauth_provider_not_supported: "مزود OAuth غير مدعوم",
  provider_disabled: "مزود OAuth معطل",
  bad_oauth_callback: "استدعاء OAuth غير صحيح",
  bad_oauth_state: "حالة OAuth غير صحيحة",
  provider_email_needs_verification:
    "تأكيد البريد الإلكتروني مطلوب لمزود OAuth",

  // MFA related errors
  insufficient_aal: "مطلوب مصادقة إضافية",
  mfa_challenge_expired: "انتهت صلاحية تحدي MFA",
  mfa_factor_not_found: "لم يتم العثور على عامل MFA",
  mfa_factor_name_conflict: "اسم عامل MFA موجود مسبقاً",
  mfa_ip_address_mismatch: "يجب إكمال تسجيل MFA من نفس عنوان IP",
  too_many_enrolled_mfa_factors: "تم الوصول إلى الحد الأقصى لعوامل MFA",

  // Phone related errors
  phone_exists: "رقم الهاتف مسجل مسبقاً",
  phone_not_confirmed: "رقم الهاتف غير مؤكد",
  phone_provider_disabled: "تسجيل الهاتف معطل",
  over_sms_send_rate_limit:
    "تم إرسال عدد كبير من رسائل SMS. يرجى المحاولة لاحقاً",
  sms_send_failed: "فشل في إرسال رسالة SMS",

  // User related errors
  user_not_found: "لم يتم العثور على المستخدم",
  user_already_exists: "المستخدم موجود مسبقاً",
  user_banned: "حساب المستخدم محظور",
  user_sso_managed: "حساب المستخدم يديره SSO",

  // SSO related errors
  sso_provider_not_found: "لم يتم العثور على مزود SSO",
  sso_domain_already_exists: "نطاق SSO موجود مسبقاً",
  saml_provider_disabled: "مزود SAML معطل",
  saml_idp_not_found: "لم يتم العثور على مزود هوية SAML",
  saml_assertion_no_email: "بيان SAML يفتقد البريد الإلكتروني",
  saml_assertion_no_user_id: "بيان SAML يفتقد معرف المستخدم",

  // Other errors
  signup_disabled: "التسجيل معطل",
  otp_disabled: "كلمة المرور لمرة واحدة معطلة",
  otp_expired: "انتهت صلاحية كلمة المرور لمرة واحدة",
  captcha_failed: "فشل التحقق من CAPTCHA",
  identity_not_found: "لم يتم العثور على الهوية",
  identity_already_exists: "الهوية موجودة مسبقاً",
  manual_linking_disabled: "ربط الهوية اليدوي معطل",
  single_identity_not_deletable: "لا يمكن حذف الهوية الوحيدة",
  email_conflict_identity_not_deletable:
    "لا يمكن إلغاء ربط الهوية بسبب تعارض البريد الإلكتروني",
  flow_state_expired: "انتهت صلاحية تدفق المصادقة",
  flow_state_not_found: "لم يتم العثور على تدفق المصادقة",
  bad_code_verifier: "التحقق من الرمز غير صحيح",
  bad_jwt: "رمز JWT غير صحيح",
  no_authorization: "مطلوب تفويض",
  not_admin: "مطلوب وصول المسؤول",
  conflict: "تعارض في الموارد",
  bad_json: "تنسيق JSON غير صحيح",
  hook_timeout: "انتهت مهلة الويب هوك",
  hook_payload_invalid_content_type: "نوع محتوى الويب هوك غير صحيح",
  hook_payload_over_size_limit: "حجم حمولة الويب هوك كبير جداً",
  hook_timeout_after_retry: "انتهت مهلة الويب هوك بعد إعادة المحاولة",
  invite_not_found: "لم يتم العثور على الدعوة أو انتهت صلاحيتها",
  mfa_phone_enroll_not_enabled: "تسجيل MFA للهاتف معطل",
  mfa_phone_verify_not_enabled: "التحقق من MFA للهاتف معطل",
  mfa_totp_enroll_not_enabled: "تسجيل MFA لـ TOTP معطل",
  mfa_totp_verify_not_enabled: "التحقق من MFA لـ TOTP معطل",
  mfa_web_authn_enroll_not_enabled: "تسجيل MFA لـ WebAuthn معطل",
  mfa_web_authn_verify_not_enabled: "التحقق من MFA لـ WebAuthn معطل",
  anonymous_provider_disabled: "تسجيل الدخول المجهول معطل",
  saml_entity_id_mismatch: "عدم تطابق معرف كيان SAML",
  saml_idp_already_exists: "مزود SAML موجود مسبقاً",
  saml_metadata_fetch_failed: "فشل في جلب بيانات SAML الوصفية",
  saml_relay_state_expired: "انتهت صلاحية حالة SAML الترحيلية",
  saml_relay_state_not_found: "لم يتم العثور على حالة SAML الترحيلية",
  unexpected_audience: "جمهور JWT غير متوقع",
};
