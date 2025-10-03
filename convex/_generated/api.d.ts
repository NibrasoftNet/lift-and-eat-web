/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as actions_seedAssets from "../actions/seedAssets.js";
import type * as actions from "../actions.js";
import type * as admin from "../admin.js";
import type * as analytics from "../analytics.js";
import type * as assets from "../assets.js";
import type * as internal_ from "../internal.js";
import type * as mutations_assets from "../mutations/assets.js";
import type * as mutations_customIngredients from "../mutations/customIngredients.js";
import type * as mutations_customMeals from "../mutations/customMeals.js";
import type * as mutations_events from "../mutations/events.js";
import type * as mutations_initTestUsers from "../mutations/initTestUsers.js";
import type * as mutations_mealPlans from "../mutations/mealPlans.js";
import type * as mutations_plans from "../mutations/plans.js";
import type * as mutations_savedMeals from "../mutations/savedMeals.js";
import type * as mutations_users from "../mutations/users.js";
import type * as mutations_waitlist from "../mutations/waitlist.js";
import type * as queries_analytics from "../queries/analytics.js";
import type * as queries_assets from "../queries/assets.js";
import type * as queries_customIngredients from "../queries/customIngredients.js";
import type * as queries_customMeals from "../queries/customMeals.js";
import type * as queries_debug from "../queries/debug.js";
import type * as queries_mealPlans from "../queries/mealPlans.js";
import type * as queries_planDays from "../queries/planDays.js";
import type * as queries_plans from "../queries/plans.js";
import type * as queries_savedMeals from "../queries/savedMeals.js";
import type * as queries_users from "../queries/users.js";
import type * as queries_waitlist from "../queries/waitlist.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "actions/seedAssets": typeof actions_seedAssets;
  actions: typeof actions;
  admin: typeof admin;
  analytics: typeof analytics;
  assets: typeof assets;
  internal: typeof internal_;
  "mutations/assets": typeof mutations_assets;
  "mutations/customIngredients": typeof mutations_customIngredients;
  "mutations/customMeals": typeof mutations_customMeals;
  "mutations/events": typeof mutations_events;
  "mutations/initTestUsers": typeof mutations_initTestUsers;
  "mutations/mealPlans": typeof mutations_mealPlans;
  "mutations/plans": typeof mutations_plans;
  "mutations/savedMeals": typeof mutations_savedMeals;
  "mutations/users": typeof mutations_users;
  "mutations/waitlist": typeof mutations_waitlist;
  "queries/analytics": typeof queries_analytics;
  "queries/assets": typeof queries_assets;
  "queries/customIngredients": typeof queries_customIngredients;
  "queries/customMeals": typeof queries_customMeals;
  "queries/debug": typeof queries_debug;
  "queries/mealPlans": typeof queries_mealPlans;
  "queries/planDays": typeof queries_planDays;
  "queries/plans": typeof queries_plans;
  "queries/savedMeals": typeof queries_savedMeals;
  "queries/users": typeof queries_users;
  "queries/waitlist": typeof queries_waitlist;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
