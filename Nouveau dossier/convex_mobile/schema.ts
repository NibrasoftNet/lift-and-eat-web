// convex/schema.ts
// Schéma minimal Convex pour les assets (ingredients/meals), events (KPIs) et users (owner-only)

import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  ingredients: defineTable({
    slug: v.string(),
    name: v.string(),
    nameI18n: v.optional(
      v.object({
        fr: v.string(),
        en: v.optional(v.string()),
        ar: v.optional(v.string()),
      }),
    ),
    nameNormalized: v.string(),
    synonyms: v.array(v.string()),
    tags: v.array(v.string()),
    unit: v.string(), // ex: "g"
    macrosPer100g: v.object({
      kcal: v.number(),
      protein: v.number(),
      carbs: v.number(),
      fat: v.number(),
    }),
    imageKey: v.optional(v.string()),
    source: v.string(),
    sourceVersion: v.number(),
    createdAt: v.number(), // timestamp ms
  })
    .index('by_slug', ['slug']) // unicité logique à gérer côté code
    .index('by_nameNormalized', ['nameNormalized']) // lookup rapide par nom normalisé
    .searchIndex('search_name', { searchField: 'nameNormalized' }), // search FR/diacritiques

  meals: defineTable({
    slug: v.string(),
    name: v.string(),
    nameI18n: v.optional(
      v.object({
        fr: v.string(),
        en: v.optional(v.string()),
        ar: v.optional(v.string()),
      }),
    ),
    descriptionI18n: v.optional(
      v.object({
        fr: v.string(),
        en: v.optional(v.string()),
        ar: v.optional(v.string()),
      }),
    ),
    nameNormalized: v.string(),
    tags: v.array(v.string()),
    imageKey: v.optional(v.string()),
    source: v.string(),
    sourceVersion: v.number(),
    createdAt: v.number(), // timestamp ms
  })
    .index('by_slug', ['slug'])
    .index('by_nameNormalized', ['nameNormalized'])
    .searchIndex('search_name', { searchField: 'nameNormalized' }),

  meal_ingredients: defineTable({
    mealSlug: v.string(), // ref logique vers meals.slug
    ingredientSlug: v.string(), // ref logique vers ingredients.slug
    quantityGr: v.number(),
    cookingMethod: v.optional(v.string()),
  })
    .index('by_mealSlug', ['mealSlug'])
    .index('by_ingredientSlug', ['ingredientSlug']),

  events: defineTable({
    eventType: v.string(), // asset_view | search | add_to_meal | plan_add_meal | create_meal
    ts: v.number(), // timestamp ms
    anonymousId: v.string(),
    userId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    payload: v.any(), // payload minimal (json libre)
    appVersion: v.optional(v.string()),
  })
    .index('by_type_ts', ['eventType', 'ts'])
    .index('by_userId', ['userId'])
    .index('by_anonymousId', ['anonymousId']),

  users: defineTable({
    userId: v.string(), // identifiant Clerk
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    locale: v.optional(v.string()),
    appVersion: v.optional(v.string()),
    platform: v.optional(v.string()),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    preferences: v.optional(v.any()), // json libre
  }).index('by_userId', ['userId']),

  // Owner-only Plans Cloud (SoT Convex)
  plans: defineTable({
    userId: v.string(),
    name: v.string(),
    goal: v.optional(v.string()),
    unit: v.optional(v.string()), // kg|lbs|st
    initialWeight: v.optional(v.number()),
    targetWeight: v.optional(v.number()),
    calories: v.optional(v.number()),
    carbs: v.optional(v.number()),
    fat: v.optional(v.number()),
    protein: v.optional(v.number()),
    durationWeeks: v.optional(v.number()),
    startDate: v.optional(v.string()), // YYYY-MM-DD
    current: v.optional(v.boolean()),
    completed: v.optional(v.boolean()),
    clientId: v.optional(v.string()), // idempotence clé côté client
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_current', ['userId', 'current'])
    .index('by_user_clientId', ['userId', 'clientId']),

  // Days within a plan
  plan_days: defineTable({
    planId: v.id('plans'),
    date: v.string(), // YYYY-MM-DD
    calories: v.optional(v.number()),
    carbs: v.optional(v.number()),
    fat: v.optional(v.number()),
    protein: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_plan', ['planId'])
    .index('by_plan_date', ['planId', 'date']),

  // Owner-only daily plan entries (meals & ingredients)
  plan_entries: defineTable({
    userId: v.string(), // owner (Clerk subject)
    day: v.string(), // YYYY-MM-DD
    slot: v.string(), // breakfast|lunch|dinner|snack|...
    kind: v.string(), // 'meal' | 'ingredient'
    refType: v.string(), // 'seed' | 'custom'
    refKey: v.string(), // seed: slug; custom: clientId
    quantity: v.number(),
    unit: v.optional(v.string()), // 'g' etc.
    planId: v.optional(v.id('plans')), // scope optionnelle par plan (nouveau)
    clientId: v.optional(v.string()), // idempotence stable côté client
    idempotenceKey: v.string(), // for de-duplication
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user_day', ['userId', 'day'])
    .index('by_user', ['userId'])
    .index('by_idem', ['userId', 'idempotenceKey'])
    .index('by_user_clientId', ['userId', 'clientId'])
    .index('by_user_plan_day', ['userId', 'planId', 'day'])
    .index('by_user_plan', ['userId', 'planId']),

  // Owner-only: water logs per day (cross-device portability)
  water_logs: defineTable({
    userId: v.string(),
    day: v.string(), // YYYY-MM-DD
    ts: v.number(), // event timestamp ms
    ml: v.number(),
    source: v.optional(v.string()), // e.g. 'manual' | 'device'
    deviceId: v.optional(v.string()),
  })
    .index('by_user_day', ['userId', 'day'])
    .index('by_user_ts', ['userId', 'ts']),

  // Owner-only: saved meals (favorites/shortcuts)
  saved_meals: defineTable({
    userId: v.string(),
    refType: v.string(), // 'seed' | 'custom'
    refKey: v.string(), // slug or clientId
    note: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_ref', ['userId', 'refType', 'refKey']),

  meta: defineTable({
    key: v.string(), // ex: assetsDataVersion
    value: v.any(), // string | number | object
  }).index('by_key', ['key']),

  // Owner-only: custom ingredients created by users (portable across devices)
  custom_ingredients: defineTable({
    userId: v.string(),
    clientId: v.string(), // stable id referenced by plans
    name: v.optional(v.string()),
    macrosPer100g: v.object({
      kcal: v.number(),
      protein: v.number(),
      carbs: v.number(),
      fat: v.number(),
    }),
    unit: v.optional(v.string()), // e.g. 'g'
    imageKey: v.optional(v.string()),
    barcode: v.optional(v.string()), // for OFF provenance
    source: v.optional(v.string()), // e.g. 'off'
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user_clientId', ['userId', 'clientId'])
    .index('by_user', ['userId']),

  // Owner-only: custom meals created by users (portable across devices)
  custom_meals: defineTable({
    userId: v.string(),
    clientId: v.string(), // stable id referenced by plans/saved lists
    name: v.optional(v.string()),
    macrosPer100g: v.object({
      kcal: v.number(),
      protein: v.number(),
      carbs: v.number(),
      fat: v.number(),
    }),
    imageKey: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user_clientId', ['userId', 'clientId'])
    .index('by_user', ['userId']),
});
