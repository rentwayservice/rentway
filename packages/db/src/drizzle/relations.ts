import { relations } from "drizzle-orm/relations";
import {
  bodyTypes,
  brands,
  carFeatures,
  cars,
  featureCategories,
  features,
  models,
  profiles,
  providers,
  usersInAuth,
} from "./schema";

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  usersInAuth: one(usersInAuth, {
    fields: [profiles.id],
    references: [usersInAuth.id],
  }),
  cars: many(cars),
  providers_approvedBy: many(providers, {
    relationName: "providers_approvedBy_profiles_id",
  }),
  providers_userId: many(providers, {
    relationName: "providers_userId_profiles_id",
  }),
}));

export const usersInAuthRelations = relations(usersInAuth, ({ many }) => ({
  profiles: many(profiles),
}));

export const modelsRelations = relations(models, ({ one, many }) => ({
  bodyType: one(bodyTypes, {
    fields: [models.bodyTypeId],
    references: [bodyTypes.id],
  }),
  brand: one(brands, {
    fields: [models.brandId],
    references: [brands.id],
  }),
  cars: many(cars),
}));

export const bodyTypesRelations = relations(bodyTypes, ({ many }) => ({
  models: many(models),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  models: many(models),
}));

export const carsRelations = relations(cars, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [cars.approvedBy],
    references: [profiles.id],
  }),
  model: one(models, {
    fields: [cars.modelId],
    references: [models.id],
  }),
  provider: one(providers, {
    fields: [cars.providerId],
    references: [providers.id],
  }),
  carFeatures: many(carFeatures),
}));

export const providersRelations = relations(providers, ({ one, many }) => ({
  cars: many(cars),
  profile_approvedBy: one(profiles, {
    fields: [providers.approvedBy],
    references: [profiles.id],
    relationName: "providers_approvedBy_profiles_id",
  }),
  profile_userId: one(profiles, {
    fields: [providers.userId],
    references: [profiles.id],
    relationName: "providers_userId_profiles_id",
  }),
}));

export const featuresRelations = relations(features, ({ one, many }) => ({
  featureCategory: one(featureCategories, {
    fields: [features.categoryId],
    references: [featureCategories.id],
  }),
  carFeatures: many(carFeatures),
}));

export const featureCategoriesRelations = relations(
  featureCategories,
  ({ many }) => ({
    features: many(features),
  })
);

export const carFeaturesRelations = relations(carFeatures, ({ one }) => ({
  car: one(cars, {
    fields: [carFeatures.carId],
    references: [cars.id],
  }),
  feature: one(features, {
    fields: [carFeatures.featureId],
    references: [features.id],
  }),
}));
