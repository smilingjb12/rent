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
import type * as apartments from "../apartments.js";
import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as interactions from "../interactions.js";
import type * as services_apartmentService from "../services/apartmentService.js";
import type * as services_interactionService from "../services/interactionService.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  apartments: typeof apartments;
  auth: typeof auth;
  http: typeof http;
  interactions: typeof interactions;
  "services/apartmentService": typeof services_apartmentService;
  "services/interactionService": typeof services_interactionService;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
