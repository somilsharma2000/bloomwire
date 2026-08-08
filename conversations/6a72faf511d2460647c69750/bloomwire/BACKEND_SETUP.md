# Bloomwire Backend Setup Guide

## What's Been Built

✅ **Backend API** — Deployed at `https://elara-89a373b9.base44.app/functions/bloomwireApi`
   - Handles all user data, orders, petals, check-ins, coupons, reviews, referrals
   - Server-side validation prevents all localStorage exploits
   - Uses Base44 entity system (fast, secure, built-in CRUD)

✅ **Frontend API Client** — `src/lib/api.ts`
   - All frontend stores now sync with the backend
   - Graceful degradation: if API is down, localStorage still works

✅ **Admin Panel** — `/#/admin` (password: `bloomwire2026`)
   - Real-time dashboard with stats
   - Orders management (update status, add tracking)
   - Users overview
   - Auto-refreshes every 30 seconds

## Google Sheets Integration (Optional)

If you want a Google Sheets mirror of all data:

### Step 1: Create the Sheet
1. Go to [Google Sheets](https://sheets.google.com) → create a new blank spreadsheet
2. Go to **Extensions → Apps Script**
3. Delete all existing code
4. Open the file `apps-script/Code.gs` from this project
5. Copy ALL the code and paste it into the Apps Script editor
6. Click **Run → setUp** (this creates all the tabs and headers)
7. Authorize the script when prompted

### Step 2: Deploy as Web App
1. Click **Deploy → New Deployment**
2. Select type: **Web App**
3. Set:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Copy the **Web App URL** (looks like `https://script.google.com/macros/s/XXXX/exec`)

### Step 3: Share the URL
Share the Web App URL with Elara. She will:
- Store it as a secret
- Set up automatic syncing from the Base44 backend to your Google Sheet
- All new users, orders, reviews, and check-ins will appear in the sheet in real-time

## What the Sheet Contains

| Tab | Description |
|-----|-------------|
| Users | Email, name, phone, petals balance, referral code, order count, total spent, check-in streak |
| Orders | Order ID, customer email, items, total, payment method, status, tracking number, gift notes |
| Reviews | Product ID, reviewer email, rating, title, comment, verified status |
| Coupons | Coupon code, type, value, usage count |
| CheckIns | Email, check-in date, petals awarded, streak day |
| AdminLog | Admin actions audit trail |

## Security Features

- 🔒 All Petals operations are server-side validated
- 🔒 Check-ins use server time (can't manipulate device clock)
- 🔒 Coupons validated server-side (first-order check, reuse prevention)
- 🔒 Reviews require proof of purchase (checked server-side)
- 🔒 Self-referral prevention (email comparison server-side)
- 🔒 Petals are "pending" until order is dispatched (admin confirms)
- 🔒 Admin panel requires password
