import { sql } from "drizzle-orm";
import {
  boolean,
  char,
  check,
  date,
  foreignKey,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgPolicy,
  pgSchema,
  pgTable,
  smallint,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const approvalStatus = pgEnum("approval_status", [
  "pending",
  "approved",
  "rejected",
]);
export const availabilityStatus = pgEnum("availability_status", [
  "available",
  "rented",
  "reserved",
  "maintenance",
]);
export const carStatus = pgEnum("car_status", [
  "active",
  "inactive",
  "deleted",
]);
export const fuelType = pgEnum("fuel_type", [
  "petrol",
  "diesel",
  "electric",
  "hybrid",
  "plug_in_hybrid",
]);
export const providerStatus = pgEnum("provider_status", [
  "active",
  "inactive",
  "suspended",
  "pending",
  "deleted",
]);
export const transmissionType = pgEnum("transmission_type", [
  "automatic",
  "manual",
  "cvt",
  "semi_automatic",
]);

export const auth = pgSchema("auth");

export const usersInAuth = auth.table(
  "users",
  {
    instanceId: uuid("instance_id"),
    id: uuid().primaryKey().notNull(),
    aud: varchar({ length: 255 }),
    role: varchar({ length: 255 }),
    email: varchar({ length: 255 }),
    encryptedPassword: varchar("encrypted_password", { length: 255 }),
    emailConfirmedAt: timestamp("email_confirmed_at", {
      withTimezone: true,
      mode: "string",
    }),
    invitedAt: timestamp("invited_at", { withTimezone: true, mode: "string" }),
    confirmationToken: varchar("confirmation_token", { length: 255 }),
    confirmationSentAt: timestamp("confirmation_sent_at", {
      withTimezone: true,
      mode: "string",
    }),
    recoveryToken: varchar("recovery_token", { length: 255 }),
    recoverySentAt: timestamp("recovery_sent_at", {
      withTimezone: true,
      mode: "string",
    }),
    emailChangeTokenNew: varchar("email_change_token_new", { length: 255 }),
    emailChange: varchar("email_change", { length: 255 }),
    emailChangeSentAt: timestamp("email_change_sent_at", {
      withTimezone: true,
      mode: "string",
    }),
    lastSignInAt: timestamp("last_sign_in_at", {
      withTimezone: true,
      mode: "string",
    }),
    rawAppMetaData: jsonb("raw_app_meta_data"),
    rawUserMetaData: jsonb("raw_user_meta_data"),
    isSuperAdmin: boolean("is_super_admin"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
    phone: text().default(sql`NULL`),
    phoneConfirmedAt: timestamp("phone_confirmed_at", {
      withTimezone: true,
      mode: "string",
    }),
    phoneChange: text("phone_change").default(""),
    phoneChangeToken: varchar("phone_change_token", { length: 255 }).default(
      ""
    ),
    phoneChangeSentAt: timestamp("phone_change_sent_at", {
      withTimezone: true,
      mode: "string",
    }),
    confirmedAt: timestamp("confirmed_at", {
      withTimezone: true,
      mode: "string",
    }).generatedAlwaysAs(sql`LEAST(email_confirmed_at, phone_confirmed_at)`),
    emailChangeTokenCurrent: varchar("email_change_token_current", {
      length: 255,
    }).default(""),
    emailChangeConfirmStatus: smallint("email_change_confirm_status").default(
      0
    ),
    bannedUntil: timestamp("banned_until", {
      withTimezone: true,
      mode: "string",
    }),
    reauthenticationToken: varchar("reauthentication_token", {
      length: 255,
    }).default(""),
    reauthenticationSentAt: timestamp("reauthentication_sent_at", {
      withTimezone: true,
      mode: "string",
    }),
    isSsoUser: boolean("is_sso_user").default(false).notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
    isAnonymous: boolean("is_anonymous").default(false).notNull(),
  },
  (table) => [
    uniqueIndex("confirmation_token_idx")
      .using("btree", table.confirmationToken.asc().nullsLast().op("text_ops"))
      .where(sql`((confirmation_token)::text !~ '^[0-9 ]*$'::text)`),
    uniqueIndex("email_change_token_current_idx")
      .using(
        "btree",
        table.emailChangeTokenCurrent.asc().nullsLast().op("text_ops")
      )
      .where(sql`((email_change_token_current)::text !~ '^[0-9 ]*$'::text)`),
    uniqueIndex("email_change_token_new_idx")
      .using(
        "btree",
        table.emailChangeTokenNew.asc().nullsLast().op("text_ops")
      )
      .where(sql`((email_change_token_new)::text !~ '^[0-9 ]*$'::text)`),
    uniqueIndex("reauthentication_token_idx")
      .using(
        "btree",
        table.reauthenticationToken.asc().nullsLast().op("text_ops")
      )
      .where(sql`((reauthentication_token)::text !~ '^[0-9 ]*$'::text)`),
    uniqueIndex("recovery_token_idx")
      .using("btree", table.recoveryToken.asc().nullsLast().op("text_ops"))
      .where(sql`((recovery_token)::text !~ '^[0-9 ]*$'::text)`),
    uniqueIndex("users_email_partial_key")
      .using("btree", table.email.asc().nullsLast().op("text_ops"))
      .where(sql`(is_sso_user = false)`),
    index("users_instance_id_email_idx").using(
      "btree",
      sql`instance_id`,
      sql`null`
    ),
    index("users_instance_id_idx").using(
      "btree",
      table.instanceId.asc().nullsLast().op("uuid_ops")
    ),
    index("users_is_anonymous_idx").using(
      "btree",
      table.isAnonymous.asc().nullsLast().op("bool_ops")
    ),
    unique("users_phone_key").on(table.phone),
    check(
      "users_email_change_confirm_status_check",
      sql`(email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)`
    ),
  ]
);

export const profiles = pgTable(
  "profiles",
  {
    id: uuid().primaryKey().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
    email: text(),
    phone: text().notNull(),
    fullName: text("full_name"),
    avatarUrl: text("avatar_url"),
  },
  (table) => [
    index("idx_profiles_email").using(
      "btree",
      table.email.asc().nullsLast().op("text_ops")
    ),
    foreignKey({
      columns: [table.id],
      foreignColumns: [usersInAuth.id],
      name: "profiles_id_fkey",
    }).onDelete("cascade"),
    unique("profiles_email_key").on(table.email),
    unique("profiles_phone_key").on(table.phone),
    pgPolicy("Users can update own profile.", {
      as: "permissive",
      for: "update",
      to: ["public"],
      using: sql`(( SELECT auth.uid() AS uid) = id)`,
    }),
    pgPolicy("Users can insert their own profile.", {
      as: "permissive",
      for: "insert",
      to: ["public"],
    }),
    pgPolicy("Public profiles are viewable by everyone.", {
      as: "permissive",
      for: "select",
      to: ["public"],
    }),
  ]
);

export const brands = pgTable(
  "brands",
  {
    id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    name: varchar({ length: 100 }).notNull(),
    slug: varchar({ length: 100 }).notNull(),
    logoUrl: text("logo_url"),
    countryOfOrigin: char("country_of_origin", { length: 2 }),
    isActive: boolean("is_active").default(true),
    sortOrder: integer("sort_order").default(0),
  },
  (table) => [
    index("idx_brands_active").using(
      "btree",
      table.isActive.asc().nullsLast().op("bool_ops")
    ),
    index("idx_brands_slug").using(
      "btree",
      table.slug.asc().nullsLast().op("text_ops")
    ),
    unique("brands_slug_key").on(table.slug),
  ]
);

export const bodyTypes = pgTable(
  "body_types",
  {
    id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    name: varchar({ length: 100 }).notNull(),
    slug: varchar({ length: 100 }).notNull(),
    icon: varchar({ length: 50 }),
    isActive: boolean("is_active").default(true),
    sortOrder: integer("sort_order").default(0),
  },
  (table) => [
    index("idx_body_types_active").using(
      "btree",
      table.isActive.asc().nullsLast().op("bool_ops")
    ),
    index("idx_body_types_slug").using(
      "btree",
      table.slug.asc().nullsLast().op("text_ops")
    ),
    unique("body_types_slug_key").on(table.slug),
  ]
);

export const models = pgTable(
  "models",
  {
    id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
    brandId: uuid("brand_id").notNull(),
    bodyTypeId: uuid("body_type_id"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    name: varchar({ length: 100 }).notNull(),
    slug: varchar({ length: 100 }).notNull(),
    fuelType: fuelType("fuel_type"),
    transmissionType: transmissionType("transmission_type"),
    seats: integer().default(5),
    doors: integer().default(4),
    luggageCapacityLiters: integer("luggage_capacity_liters"),
    largeBags: integer("large_bags"),
    smallBags: integer("small_bags"),
    engineSizeCc: integer("engine_size_cc"),
    horsepower: integer(),
    fuelEfficiencyKmpl: numeric("fuel_efficiency_kmpl", {
      precision: 5,
      scale: 2,
    }),
    yearStart: integer("year_start"),
    yearEnd: integer("year_end"),
    images: jsonb().default([]),
    isActive: boolean("is_active").default(true),
    sortOrder: integer("sort_order").default(0),
  },
  (table) => [
    index("idx_models_active").using(
      "btree",
      table.isActive.asc().nullsLast().op("bool_ops")
    ),
    index("idx_models_body_type").using(
      "btree",
      table.bodyTypeId.asc().nullsLast().op("uuid_ops")
    ),
    index("idx_models_brand").using(
      "btree",
      table.brandId.asc().nullsLast().op("uuid_ops")
    ),
    foreignKey({
      columns: [table.bodyTypeId],
      foreignColumns: [bodyTypes.id],
      name: "models_body_type_id_fkey",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.brandId],
      foreignColumns: [brands.id],
      name: "models_brand_id_fkey",
    }).onDelete("cascade"),
    unique("models_brand_slug_unique").on(table.brandId, table.slug),
  ]
);

export const cars = pgTable(
  "cars",
  {
    id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
    slug: text("slug").notNull(),
    providerId: uuid("provider_id").notNull(),
    modelId: uuid("model_id").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    vin: varchar({ length: 17 }),
    fleetNumber: varchar("fleet_number", { length: 50 }),
    year: integer().notNull(),
    color: varchar({ length: 50 }),
    colorHex: char("color_hex", { length: 7 }),
    interiorColor: varchar("interior_color", { length: 50 }),
    currentMileage: integer("current_mileage").default(0),
    fuelLevelPercent: integer("fuel_level_percent").default(100),
    status: carStatus().default("active"),
    approvalStatus: approvalStatus("approval_status").default("pending"),
    availability: availabilityStatus().default("available"),
    approvedAt: timestamp("approved_at", {
      withTimezone: true,
      mode: "string",
    }),
    approvedBy: uuid("approved_by"),
    rejectionReason: text("rejection_reason"),
    dailyRate: numeric("daily_rate", { precision: 10, scale: 2 }),
    weeklyRate: numeric("weekly_rate", { precision: 10, scale: 2 }),
    monthlyRate: numeric("monthly_rate", { precision: 10, scale: 2 }),
    currency: char({ length: 3 }).default("EGP"),
    depositAmount: numeric("deposit_amount", { precision: 10, scale: 2 }),
    dailyMileageLimit: integer("daily_mileage_limit"),
    extraMileageRate: numeric("extra_mileage_rate", { precision: 8, scale: 2 }),
    insurance: jsonb().default({
      provider: null,
      expiry_date: null,
      policy_number: null,
    }),
    registrationExpiryDate: date("registration_expiry_date"),
    primaryImageUrl: text("primary_image_url"),
    images: jsonb().default([]),
    availableFrom: date("available_from"),
    availableUntil: date("available_until"),
    stats: jsonb().default({
      total_revenue: 0,
      average_rating: 0,
      total_bookings: 0,
    }),
    description: text(),
    internalNotes: text("internal_notes"),
    metadata: jsonb().default({}),
  },
  (table) => [
    index("idx_cars_active_approved").using(
      "btree",
      table.providerId.asc().nullsLast().op("enum_ops"),
      table.status.asc().nullsLast().op("uuid_ops"),
      table.approvalStatus.asc().nullsLast().op("enum_ops"),
      table.availability.asc().nullsLast().op("uuid_ops")
    ),
    index("idx_cars_approval").using(
      "btree",
      table.approvalStatus.asc().nullsLast().op("enum_ops")
    ),
    index("idx_cars_availability").using(
      "btree",
      table.availability.asc().nullsLast().op("enum_ops")
    ),
    index("idx_cars_model").using(
      "btree",
      table.modelId.asc().nullsLast().op("uuid_ops")
    ),
    index("idx_cars_price").using(
      "btree",
      table.dailyRate.asc().nullsLast().op("numeric_ops")
    ),
    index("idx_cars_provider").using(
      "btree",
      table.providerId.asc().nullsLast().op("uuid_ops")
    ),
    index("idx_cars_status").using(
      "btree",
      table.status.asc().nullsLast().op("enum_ops")
    ),
    foreignKey({
      columns: [table.approvedBy],
      foreignColumns: [profiles.id],
      name: "cars_approved_by_fkey",
    }),
    foreignKey({
      columns: [table.modelId],
      foreignColumns: [models.id],
      name: "cars_model_id_fkey",
    }).onDelete("restrict"),
    foreignKey({
      columns: [table.providerId],
      foreignColumns: [providers.id],
      name: "cars_provider_id_fkey",
    }).onDelete("cascade"),
  ]
);

export const featureCategories = pgTable(
  "feature_categories",
  {
    id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    name: varchar({ length: 100 }).notNull(),
    slug: varchar({ length: 100 }).notNull(),
    icon: varchar({ length: 50 }),
    isActive: boolean("is_active").default(true),
    sortOrder: integer("sort_order").default(0),
  },
  (table) => [
    index("idx_feature_categories_slug").using(
      "btree",
      table.slug.asc().nullsLast().op("text_ops")
    ),
    unique("feature_categories_slug_key").on(table.slug),
  ]
);

export const features = pgTable(
  "features",
  {
    id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
    categoryId: uuid("category_id").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    name: varchar({ length: 100 }).notNull(),
    slug: varchar({ length: 100 }).notNull(),
    description: text(),
    icon: varchar({ length: 50 }),
    isActive: boolean("is_active").default(true),
    sortOrder: integer("sort_order").default(0),
  },
  (table) => [
    index("idx_features_category").using(
      "btree",
      table.categoryId.asc().nullsLast().op("uuid_ops")
    ),
    index("idx_features_slug").using(
      "btree",
      table.slug.asc().nullsLast().op("text_ops")
    ),
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [featureCategories.id],
      name: "features_category_id_fkey",
    }).onDelete("cascade"),
    unique("features_slug_key").on(table.slug),
  ]
);

export const carFeatures = pgTable(
  "car_features",
  {
    id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
    carId: uuid("car_id").notNull(),
    featureId: uuid("feature_id").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => [
    index("idx_car_features_car").using(
      "btree",
      table.carId.asc().nullsLast().op("uuid_ops")
    ),
    index("idx_car_features_feature").using(
      "btree",
      table.featureId.asc().nullsLast().op("uuid_ops")
    ),
    foreignKey({
      columns: [table.carId],
      foreignColumns: [cars.id],
      name: "car_features_car_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.featureId],
      foreignColumns: [features.id],
      name: "car_features_feature_id_fkey",
    }).onDelete("cascade"),
    unique("car_features_unique").on(table.carId, table.featureId),
  ]
);

export const providers = pgTable(
  "providers",
  {
    id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    name: varchar({ length: 200 }).notNull(),
    slug: varchar({ length: 100 }).notNull(),
    description: text(),
    email: varchar({ length: 255 }).notNull(),
    phone: varchar({ length: 50 }),
    whatsapp: varchar({ length: 50 }),
    website: varchar({ length: 255 }),
    addressLine1: varchar("address_line_1", { length: 255 }),
    addressLine2: varchar("address_line_2", { length: 255 }),
    city: varchar({ length: 100 }),
    stateProvince: varchar("state_province", { length: 100 }),
    postalCode: varchar("postal_code", { length: 20 }),
    countryCode: char("country_code", { length: 2 }).default("EG"),
    status: providerStatus().default("pending"),
    approvalStatus: approvalStatus("approval_status").default("pending"),
    approvedAt: timestamp("approved_at", {
      withTimezone: true,
      mode: "string",
    }),
    approvedBy: uuid("approved_by"),
    rejectionReason: text("rejection_reason"),
    branding: jsonb().default({
      logo_url: null,
      primary_color: null,
      cover_image_url: null,
      secondary_color: null,
    }),
    settings: jsonb().default({
      timezone: "Africa/Cairo",
      default_currency: "EGP",
    }),
    businessInfo: jsonb("business_info").default({
      tax_id: null,
      commercial_registration: null,
    }),
    stats: jsonb().default({
      total_cars: 0,
      average_rating: 0,
      total_bookings: 0,
    }),
    metadata: jsonb().default({}),
  },
  (table) => [
    index("idx_providers_approval").using(
      "btree",
      table.approvalStatus.asc().nullsLast().op("enum_ops")
    ),
    index("idx_providers_owner").using(
      "btree",
      table.userId.asc().nullsLast().op("uuid_ops")
    ),
    index("idx_providers_slug").using(
      "btree",
      table.slug.asc().nullsLast().op("text_ops")
    ),
    index("idx_providers_status").using(
      "btree",
      table.status.asc().nullsLast().op("enum_ops")
    ),
    foreignKey({
      columns: [table.approvedBy],
      foreignColumns: [profiles.id],
      name: "providers_approved_by_fkey",
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profiles.id],
      name: "providers_owner_id_fkey",
    }).onDelete("restrict"),
    unique("providers_slug_key").on(table.slug),
  ]
);
