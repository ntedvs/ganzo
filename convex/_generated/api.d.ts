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
} from "convex/server"
import type * as auth from "../auth.js"
import type * as claimExtraction from "../claimExtraction.js"
import type * as claims from "../claims.js"
import type * as debates from "../debates.js"
import type * as deepgramToken from "../deepgramToken.js"
import type * as extractionSessions from "../extractionSessions.js"
import type * as factCheck from "../factCheck.js"
import type * as http from "../http.js"
import type * as transcriptChunks from "../transcriptChunks.js"

declare const fullApi: ApiFromModules<{
  auth: typeof auth
  claimExtraction: typeof claimExtraction
  claims: typeof claims
  debates: typeof debates
  deepgramToken: typeof deepgramToken
  extractionSessions: typeof extractionSessions
  factCheck: typeof factCheck
  http: typeof http
  transcriptChunks: typeof transcriptChunks
}>

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>

export declare const components: {}
