# Bloomwire Backend Function Security Audit Report

**Target File:** `/app/conversations/6a72faf511d2460647c69750/bloomwire/functions/bloomwireApi.ts`  
**Audit Date:** August 7, 2026  
**Status:** Audit Completed — Critical Vulnerabilities Identified  

---

## Executive Summary

A comprehensive security review of the Bloomwire backend API service (`bloomwireApi.ts`) was conducted. The backend serves as a centralized Deno handler for database operations, user management, order processing, coupon controls, and administrative actions. 

The audit identified multiple high-risk security flaws that completely compromise the application's authentication, authorization, data isolation, and business logic. Most critically, the API operates as a Service Role client (`base44.asServiceRole.entities`) without verifying user identity, allowing any unauthenticated visitor to execute arbitrary read, write, update, or delete operations across all application entities.

---

## Detailed Audit Findings

### 1. No Authentication Check (Broken Authentication & Authorization)
* **Severity:** CRITICAL
* **Location:** `bloomwireApi.ts`, Lines 3–23 (Handler entry point) & Lines 23–732 (Switch actions)
* **Description:**
  The `Deno.serve` HTTP entry point parses the request JSON body (`action` and `data`) and instantiates an elevated database context using `base44.asServiceRole.entities` (Line 12). Service role execution bypasses all row-level security (RLS) policies. Crucially, there is no authentication middleware, session verification, JWT validation, or authorization token check prior to dispatching actions in the switch statement (Lines 23–732).
* **Impact:**
  An unauthenticated attacker can send HTTP POST requests directly to the API endpoint and invoke sensitive administrative or privileged actions, including:
  * **`getAllUsers`** (Lines 299–302): Dumps all registered user accounts and sensitive profile data.
  * **`getAllOrders`** (Lines 149–152): Exfiltrates all order history and customer purchase details.
  * **`promoteToAdmin`** (Lines 339–345): Grants admin role privileges to any specified user account.
  * **`clearAllData`** (Lines 659–708): Purges all database records across 17 entity types.
  * **`createCoupon`** (Lines 354–357): Generates arbitrary discount coupons (e.g., 100% discount, zero minimum purchase, infinite usage).
  * **`addPetals`** (Lines 68–80): Arbitrarily inflates petal currency balances for any account.
  * **`adminLogin`** (Lines 507–516): Directly callable without restriction.
  * **`suspendUser`** (Lines 325–331) / **`banUser`** (Lines 332–338): Suspends or bans arbitrary users.
  * **`deleteCoupon`** (Lines 367–370): Removes coupons from the system.
  * **`updateOrderStatus`** (Lines 137–141): Modifies delivery status and tracking numbers for any order.

---

### 2. Hardcoded Admin Password & Weak Token Logic
* **Severity:** HIGH
* **Location:** `bloomwireApi.ts`, Line 509 (`adminLogin`, Lines 507–516) & Lines 518–524 (`verifyAdminToken`)
* **Description:**
  The admin authentication handler hardcodes the administrative credential directly in source code:
  ```typescript
  const ADMIN_PASSWORD = "bloomwire2026";
  ```
  In addition, successful authentication returns a mock token constructed as `"bw_admin_" + Date.now()` (Line 513). The token verification endpoint `verifyAdminToken` (Lines 518–524) simply checks whether `token.startsWith("bw_admin_")` without checking signature, expiration, or session validity.
* **Impact:**
  Hardcoding credentials in source files exposes administrative access to anyone with code repository access or static inspection tools. Furthermore, because token verification only checks for the string prefix `"bw_admin_"`, any attacker can forge a valid admin token (e.g., `"bw_admin_12345"`) without ever knowing the password.

---

### 3. No User Data Isolation (Insecure Direct Object Reference - IDOR)
* **Severity:** CRITICAL
* **Location:** `bloomwireApi.ts`:
  * `getUser` (Lines 51–57)
  * `updateUser` (Lines 59–65)
  * `getUserOrders` (Lines 131–135)
  * `addPetals` (Lines 68–80)
  * `recordCheckIn` (Lines 90–114)
* **Description:**
  Endpoints that retrieve or modify individual user state rely solely on an `email` string passed inside the unauthenticated request payload `data`. The function does not compare the requested `email` against an authenticated user session token or bearer identity.
* **Impact:**
  An attacker can supply any victim's email address in the request payload to:
  * Read victim profile details (`getUser`).
  * Modify victim account settings or user attributes (`updateUser`).
  * Access full purchase and order history (`getUserOrders`).
  * Alter petal loyalty balances (`addPetals`).
  * Trigger or alter daily check-in streaks (`recordCheckIn`).

---

### 4. Predictable Order Identifiers
* **Severity:** MEDIUM
* **Location:** `bloomwireApi.ts`: `createOrder` (Lines 126–129), `updateOrderStatus` (Lines 137–141), `cancelOrder` (Lines 143–147); and `src/store/orderStore.ts` (Lines 55 & 94)
* **Description:**
  `createOrder` accepts client-provided payload data directly. Front-end store logic (`orderStore.ts`) formats order identifiers using `ORD-${Date.now().toString().slice(-6)}` (simple truncated timestamp suffixes).
* **Impact:**
  Because order IDs are short, sequential timestamp derivatives (e.g. `ORD-882101`), attackers can easily iterate through or enumerate order IDs. When combined with unauthenticated actions like `updateOrderStatus` or `cancelOrder`, attackers can inspect, cancel, or modify order statuses for arbitrary customers across the platform.

---

### 5. Absence of Rate Limiting
* **Severity:** HIGH
* **Location:** `bloomwireApi.ts`, Lines 3–737 (Global API scope)
* **Description:**
  There are no rate-limiting headers, IP throttling mechanisms, memory request buckets, or request rate constraints anywhere in the function implementation.
* **Impact:**
  The lack of rate control enables automated brute-force attacks against `adminLogin` and coupon/gift card validation (`validateCoupon`, `createGiftCard`). It also leaves the application vulnerable to Denial of Service (DoS) and database exhaustion via repeated calls to resource-intensive handlers like `seedDemoData` or `clearAllData`.

---

### 6. Review Verification Bypass (Business Logic Vulnerability)
* **Severity:** MEDIUM
* **Location:** `bloomwireApi.ts`, Lines 176–178 (`addReview`)
* **Description:**
  The `addReview` handler creates new product reviews with a hardcoded `verified: true` property:
  ```typescript
  case "addReview": {
    const review = await A.Review.create({ ...data, verified: true, created_date: new Date().toISOString() });
    return Response.json({ success: true, data: review });
  }
  ```
  The function does not cross-reference the user's order history or execute the `hasUserPurchased` check (defined on Lines 190–200) before marking the review as verified.
* **Impact:**
  Any user or automated script can submit false product reviews that are instantly displayed as "Verified Buyer" reviews, compromising store integrity and potentially gaming reward mechanisms.

---

## Summary Table of Vulnerabilities

| # | Vulnerability | Location in `bloomwireApi.ts` | Severity |
|---|---|---|---|
| 1 | No Authentication & Authorization | Lines 3–23, 23–732 | Critical |
| 2 | Hardcoded Admin Password & Weak Tokens | Line 509, Lines 518–524 | High |
| 3 | No User Data Isolation (IDOR) | Lines 51–57, 59–65, 68–80, 90–114, 131–135 | Critical |
| 4 | Predictable Order IDs | Lines 126–129, 137–147 | Medium |
| 5 | Missing Rate Limiting | Entire File (Lines 3–737) | High |
| 6 | Review Verification Bypassed | Lines 176–178 | Medium |

---

## Remediation Checklist

1. **Implement Authentication Middleware:**
   * Extract and verify user session tokens/JWTs from `req.headers.get("Authorization")` before processing actions.
   * Restrict `asServiceRole` usage; execute user operations under authenticated user context (`base44.asUser(...)`).
2. **Secure Administrative Access:**
   * Move `ADMIN_PASSWORD` to environment variables (`Deno.env.get("ADMIN_PASSWORD")`).
   * Replace token prefix matching with signed JWTs or session tokens stored securely.
3. **Enforce Authorization & User Isolation:**
   * Validate that the authenticated session user matches `data.email` before returning or modifying user records.
4. **Use Cryptographically Secure UUIDs:**
   * Generate order IDs server-side using `crypto.randomUUID()` instead of timestamp concatenation.
5. **Add Rate Limiting:**
   * Implement rate-limiting middleware (e.g. keying by IP / user token) to restrict API requests per minute.
6. **Enforce Purchase Verification for Reviews:**
   * Verify purchase history using `hasUserPurchased` before setting `verified: true` on review creation.
