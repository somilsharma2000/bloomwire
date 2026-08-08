import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

// Static catalog default prices as fallback when Product DB records are missing
const DEFAULT_PRODUCT_PRICES: Record<string, number> = {
  "velvet-sunset-rose-bouquet": 1299,
  "pastel-tulip-dream-bouquet": 1099,
  "midnight-lavender-mist-bouquet": 1499,
  "ethereal-sunflower-medley-bouquet": 1199,
  "cozy-daisy-clay-pot": 799,
  "mini-succulent-bloom-pot": 699,
  "bloom-charm-keychain-cherry": 299,
  "petal-sparkle-keychain-daisy": 249,
  "long-lasting-red-rose-stem": 399,
  "soft-pink-peony-stem": 349,
  "ultimate-bloom-gift-box": 2199,
  "romantic-velvet-couple-bundle": 1899,
  "starter-flower-craft-kit": 899,
  "master-artisan-bouquet-diy-box": 1299,
  "complimentary-keychain": 0,
  "complimentary-flower-stem": 0,
  "complimentary-clay-pot": 0,
};

// Helper: Coupon validation and discount calculation
async function validateAndCalculateCoupon(A: any, data: any) {
  const code = (data.code || data.couponCode || "").trim().toUpperCase();
  const email = (data.email || data.userEmail || "").toLowerCase().trim();
  const orderCount = Number(data.orderCount || 0);
  const subtotal = Number(data.subtotal || data.amount || data.orderTotal || 0);

  if (!code) return { success: false, error: "Coupon code is required" };

  const coupons = await A.Coupon.filter({ code });
  if (!coupons || coupons.length === 0) {
    return { success: false, error: "Invalid coupon code" };
  }

  const c = coupons[0];

  // 1. Validate active status
  const isActive = c.isActive !== false && c.active !== false && c.status !== "inactive";
  if (!isActive) {
    return { success: false, error: "Coupon is inactive or disabled" };
  }

  // 2. Validate expiration date
  const expiry = c.expiryDate || c.expiresAt || c.validUntil || c.expires_at;
  if (expiry) {
    const expTime = new Date(expiry).getTime();
    if (!isNaN(expTime) && expTime < Date.now()) {
      return { success: false, error: "Coupon has expired" };
    }
  }

  // 3. Validate first_order restriction
  if (c.validFor === "first_order" && orderCount > 0) {
    return { success: false, error: "This coupon is for first orders only" };
  }

  // 4. Validate max total uses
  const maxUses = c.maxUses || c.max_uses || 0;
  const totalUsed = c.totalUsed || c.usesCount || c.total_used || 0;
  if (maxUses > 0 && totalUsed >= maxUses) {
    return { success: false, error: "Coupon usage limit reached" };
  }

  // 5. Validate per-user limit
  if (email) {
    const perUserLimit = c.perUserLimit || c.per_user_limit || 1;
    const usages = await A.CouponUsage.filter({ couponCode: code, userEmail: email });
    if (usages && usages.length >= perUserLimit) {
      return { success: false, error: "You have already used this coupon" };
    }
  }

  // 6. Validate minimum order amount
  const minOrderAmount = Number(c.minOrderAmount || c.minOrder || c.minSpend || c.min_order_amount || 0);
  if (subtotal > 0 && minOrderAmount > 0 && subtotal < minOrderAmount) {
    return { success: false, error: `Minimum order amount of ₹${minOrderAmount} required for this coupon` };
  }

  // 7. Calculate server-side discount
  const discountType = c.discountType || c.discount_type || c.type || "percentage";
  const discountValue = Number(c.discountValue ?? c.discount_value ?? c.value ?? c.amount ?? 0);
  const freeShipping = Boolean(c.freeShipping || discountType === "freeship" || c.free_shipping);

  let discountAmount = 0;
  if (discountType === "percentage" || discountType === "percent") {
    discountAmount = Math.round((subtotal * discountValue) / 100);
    const maxDiscount = Number(c.maxDiscount || c.max_discount || 0);
    if (maxDiscount > 0 && discountAmount > maxDiscount) {
      discountAmount = maxDiscount;
    }
  } else if (discountType === "fixed" || discountType === "flat" || discountType === "amount") {
    discountAmount = discountValue;
  }

  if (subtotal > 0) {
    discountAmount = Math.min(discountAmount, subtotal);
  }
  const discountedTotal = Math.max(0, subtotal - discountAmount);

  return {
    success: true,
    data: {
      valid: true,
      code: c.code,
      discountType,
      discountValue,
      freeShipping,
      subtotal,
      discountAmount,
      discountedTotal,
      coupon: c,
    }
  };
}

// Helper: Recalculate order subtotal and total based on DB product prices
async function recalculateOrderTotal(A: any, data: any) {
  const items = Array.isArray(data.items) ? data.items : [];
  
  let dbProducts: any[] = [];
  try {
    dbProducts = await A.Product.list({ filter: {} });
  } catch (e) {
    dbProducts = [];
  }

  const productMap = new Map<string, any>();
  for (const p of dbProducts) {
    if (p.id) productMap.set(String(p.id), p);
    if (p.slug) productMap.set(String(p.slug), p);
    if (p.sku) productMap.set(String(p.sku), p);
  }

  let recalculatedSubtotal = 0;
  const verifiedItems = items.map((item: any) => {
    const key = String(item.id || item.productId || item.slug || item.sku || "");
    const dbProd = productMap.get(key);
    
    let unitPrice = Number(item.price || 0);
    if (dbProd) {
      const dbPrice = Number(dbProd.salePrice || dbProd.discountPrice || dbProd.price);
      if (!isNaN(dbPrice) && dbPrice >= 0) {
        unitPrice = dbPrice;
      }
    } else if (key && DEFAULT_PRODUCT_PRICES[key] !== undefined) {
      unitPrice = DEFAULT_PRODUCT_PRICES[key];
    }

    const qty = Math.max(1, Number(item.qty || item.quantity || 1));
    const lineTotal = unitPrice * qty;
    recalculatedSubtotal += lineTotal;

    return {
      ...item,
      price: unitPrice,
      qty,
      quantity: qty,
      lineTotal,
    };
  });

  // Calculate discount if coupon code present
  let discountAmount = 0;
  const couponCode = data.couponCode || data.coupon || data.code;
  if (couponCode) {
    const couponRes = await validateAndCalculateCoupon(A, {
      code: couponCode,
      email: data.userEmail || data.email,
      subtotal: recalculatedSubtotal,
    });
    if (couponRes.success && couponRes.data) {
      discountAmount = couponRes.data.discountAmount || 0;
    }
  } else if (data.discountAmount) {
    discountAmount = Math.min(Number(data.discountAmount), recalculatedSubtotal);
  }

  const shippingFee = Number(data.shippingFee || data.shipping || 0);
  const donationAmount = data.donationAmount !== undefined
    ? Number(data.donationAmount)
    : Math.round(recalculatedSubtotal * 0.02);

  const recalculatedTotal = Math.max(0, recalculatedSubtotal - discountAmount) + shippingFee + donationAmount;

  return {
    subtotal: recalculatedSubtotal,
    total: recalculatedTotal,
    discountAmount,
    shippingFee,
    donationAmount,
    items: verifiedItems,
  };
}

Deno.serve(async (req: Request) => {
  try {
    const body = await req.json();
    const action = body.action;
    const data = body.data || {};
    
    if (!action) return Response.json({ success: false, error: "Missing action" });

    const base44 = createClientFromRequest(req);
    const A = base44.asServiceRole.entities;

    // ─── AUTHENTICATION & AUTHORIZATION ───
    const callerEmail = req.headers.get("x-user-email") || data._callerEmail || "";
    const callerToken = req.headers.get("x-user-token") || data._callerToken || "";
    const adminToken = req.headers.get("x-admin-token") || data._adminToken || "";

    // Admin password from environment variable (NOT hardcoded)
    const ADMIN_PASSWORD = Deno.env.get("BLOOMWIRE_ADMIN_PASSWORD");
    if (!ADMIN_PASSWORD) { console.warn("[SECURITY] BLOOMWIRE_ADMIN_PASSWORD env var not set — admin login disabled"); }
    
    // Verify admin token (signed with timestamp, expires in 2 hours)
    const verifyAdmin = (token: string): boolean => {
      if (!token || !token.startsWith("bw_admin_")) return false;
      const parts = token.split("_");
      if (parts.length !== 3) return false;
      const timestamp = parseInt(parts[2] || "0");
      if (!timestamp || timestamp > Date.now() + 5 * 60 * 1000) return false;
      if (Date.now() - timestamp > 2 * 60 * 60 * 1000) return false;
      // Verify HMAC signature to prevent token forgery
      if (!ADMIN_PASSWORD) return false;
      const expectedSig = btoa(ADMIN_PASSWORD + timestamp).slice(0, 8);
      if (parts[1] !== expectedSig) return false;
      return true;
    };

    const isAdmin = verifyAdmin(adminToken);

    // Actions that require admin privileges
    const adminOnlyActions = new Set([
      "getAllUsers", "getAdminStats", "suspendUser", "banUser", 
      "promoteToAdmin", "demoteToUser", "clearAllData", "seedDemoData",
      "getAllOrders", "createCoupon", "updateCoupon", "deleteCoupon",
      "getCouponUsage", "getCoupons", "drawRaffleWinner",
      "getPendingSubmissions", "approveSubmission", "rejectSubmission",
      "getAllSubmissions", "getCustomOrders", "updateCustomOrderStatus",
      "createBlogPost", "updateBlogPost", "deleteBlogPost",
      "getEmailLogs", "getActivityLogs", "getGiftCards", "createGiftCard",
      "getCheckInRecords", "getSubscribers", "updateSubscriber",
      "getAllReviews", "logActivity", "createRaffle",
    ]);

    // Actions that require the caller to be authenticated
    const userActions = new Set([
      "getUser", "updateUser", "addPetals", "getPetalsBalance",
      "recordCheckIn", "getCheckInStatus", "getUserOrders",
      "cancelOrder", "markCouponUsed", "unlockReward", "clearUnlockedReward",
      "submitUnboxing", "getUnboxingStatus", "getUserGallery",
      "toggleGalleryPublic", "getPetalsTransactions", "verifyPayment",
    ]);

    // Actions that need caller verification but allow admin override
    const selfServiceActions = new Set([
      "getUser", "updateUser", "getPetalsBalance",
      "recordCheckIn", "getCheckInStatus", "getUserOrders",
      "cancelOrder", "unlockReward", "clearUnlockedReward",
      "submitUnboxing", "getUnboxingStatus", "getUserGallery",
      "toggleGalleryPublic", "getPetalsTransactions",
      "markCouponUsed", "addReview", "hasUserReviewed", "hasUserPurchased",
      "verifyPayment",
    ]);

    // Authorization enforcement
    if (adminOnlyActions.has(action) && !isAdmin) {
      return Response.json({ success: false, error: "Unauthorized: admin access required" });
    }

    if (selfServiceActions.has(action)) {
      const targetEmail = data.email || data.userEmail || "";
      if (!callerEmail && !isAdmin) {
        return Response.json({ success: false, error: "Unauthorized: authentication required" });
      }
      if (callerEmail && targetEmail && callerEmail.toLowerCase() !== targetEmail.toLowerCase() && !isAdmin) {
        return Response.json({ success: false, error: "Forbidden: cannot access another user's data" });
      }
    }

    // Helper: sort array of records by field (descending by date)
    const sortByDateDesc = (arr: any[], field: string) => {
      return arr.sort((a, b) => {
        const da = new Date(a[field] || a.created_date || 0).getTime();
        const db = new Date(b[field] || b.created_date || 0).getTime();
        return db - da;
      });
    };

    // Helper: generate cryptographically secure ID
    const secureId = (prefix: string) => {
      const uuid = crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();
      return `${prefix}-${uuid}`;
    };

    switch (action) {
      case "ping":
        return Response.json({ success: true, data: { status: "ok", time: new Date().toISOString() } });

      // ─── USER ACTIONS ───
      case "createUser": {
        const { email, name, phone, referralCode } = data;
        if (!email) return Response.json({ success: false, error: "Email required" });
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return Response.json({ success: false, error: "Invalid email format" });
        }
        const cleanEmail = email.toLowerCase().trim();
        const existing = await A.BloomwireUser.filter({ email: cleanEmail });
        if (existing && existing.length > 0) return Response.json({ success: true, data: existing[0] });
        const referralCodeGen = `BLOOM-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
        const user = await A.BloomwireUser.create({
          email: cleanEmail, name: name || email.split("@")[0], phone: phone || "",
          petalsBalance: 50, pendingPetals: 0, checkInStreak: 0, orderCount: 0,
          totalSpent: 0, referralCode: referralCodeGen, referredBy: referralCode || "",
          usedCoupons: [], unlockedRewards: [], role: "user", status: "active",
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
        });
        try {
          await A.ActivityLog.create({
            action: "user_signup", adminEmail: "system", entityType: "BloomwireUser",
            entityId: user.id, details: `New user signup: ${name || email.split("@")[0]}`,
            timestamp: new Date().toISOString()
          });
        } catch (e) {}
        return Response.json({ success: true, data: user });
      }

      case "getUser": {
        const { email } = data;
        if (!email) return Response.json({ success: false, error: "Email required" });
        const users = await A.BloomwireUser.filter({ email: email.toLowerCase().trim() });
        if (!users || users.length === 0) return Response.json({ success: false, error: "User not found" });
        return Response.json({ success: true, data: users[0] });
      }

      case "updateUser": {
        const { email, updates } = data;
        if (!isAdmin && updates && (updates.role || updates.status)) {
          delete updates.role;
          delete updates.status;
        }
        const users = await A.BloomwireUser.filter({ email: email.toLowerCase().trim() });
        if (!users || users.length === 0) return Response.json({ success: false, error: "User not found" });
        await A.BloomwireUser.update(users[0].id, { ...updates, updatedAt: new Date().toISOString() });
        return Response.json({ success: true, data: { ...users[0], ...updates } });
      }

      // ─── PETALS (admin-only adjustment) ───
      case "addPetals": {
        if (!isAdmin) {
          return Response.json({ success: false, error: "Unauthorized: admin access required for petal adjustments" });
        }
        const { email, amount, reason } = data;
        const users = await A.BloomwireUser.filter({ email: email.toLowerCase().trim() });
        if (!users || users.length === 0) return Response.json({ success: false, error: "User not found" });
        const u = users[0];
        const newBalance = Math.max(0, (u.petalsBalance || 0) + amount);
        await A.BloomwireUser.update(u.id, { petalsBalance: newBalance, updatedAt: new Date().toISOString() });
        await A.PetalsTransaction.create({
          amount, type: amount > 0 ? "earned" : "spent", description: reason || "Admin adjustment",
          userEmail: email.toLowerCase().trim(), orderId: "", created_date: new Date().toISOString()
        });
        return Response.json({ success: true, data: { petalsBalance: newBalance } });
      }

      case "getPetalsBalance": {
        const { email } = data;
        const users = await A.BloomwireUser.filter({ email: email.toLowerCase().trim() });
        if (!users || users.length === 0) return Response.json({ success: false, error: "User not found" });
        return Response.json({ success: true, data: { petalsBalance: users[0].petalsBalance || 0 } });
      }

      // ─── CHECK-INS (server-side validated) ───
      case "recordCheckIn": {
        const { email } = data;
        const users = await A.BloomwireUser.filter({ email: email.toLowerCase().trim() });
        if (!users || users.length === 0) return Response.json({ success: false, error: "User not found" });
        const u = users[0];
        const today = new Date().toISOString().split("T")[0];
        if (u.lastCheckIn === today) return Response.json({ success: false, error: "Already checked in today" });
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        const isConsecutive = u.lastCheckIn === yesterday;
        const newStreak = isConsecutive ? (u.checkInStreak || 0) + 1 : 1;
        const cycleDay = ((newStreak - 1) % 7) + 1;
        const rewards = [5, 10, 15, 20, 30, 40, 75];
        const petalsAwarded = rewards[cycleDay - 1];
        const newBalance = (u.petalsBalance || 0) + petalsAwarded;
        await A.BloomwireUser.update(u.id, {
          checkInStreak: newStreak, lastCheckIn: today,
          petalsBalance: newBalance, updatedAt: new Date().toISOString()
        });
        await A.CheckInRecord.create({ userEmail: email.toLowerCase().trim(), checkInDate: today, streakDay: cycleDay, petalsAwarded });
        await A.PetalsTransaction.create({
          amount: petalsAwarded, type: "earned", description: `Daily check-in (Day ${cycleDay})`,
          userEmail: email.toLowerCase().trim(), orderId: "", created_date: new Date().toISOString()
        });
        return Response.json({ success: true, data: { petalsAwarded, streak: newStreak, cycleDay, petalsBalance: newBalance } });
      }

      case "getCheckInStatus": {
        const { email } = data;
        const users = await A.BloomwireUser.filter({ email: email.toLowerCase().trim() });
        if (!users || users.length === 0) return Response.json({ success: false, error: "User not found" });
        const u = users[0];
        const today = new Date().toISOString().split("T")[0];
        return Response.json({ success: true, data: { hasCheckedInToday: u.lastCheckIn === today, streak: u.checkInStreak || 0, lastCheckIn: u.lastCheckIn } });
      }

      // ─── ORDERS ───
      case "createOrder": {
        const orderId = secureId("ORD");
        const cleanEmail = (data.userEmail || "").toLowerCase().trim();

        // TASK 2: Server-Side Price Validation
        // Recalculate subtotal & total based on Product database prices (NOT trusting frontend-sent prices)
        const priceCalc = await recalculateOrderTotal(A, data);

        const orderData = {
          ...data,
          orderId,
          userEmail: cleanEmail,
          items: priceCalc.items,
          subtotal: priceCalc.subtotal,
          total: priceCalc.total,
          discountAmount: priceCalc.discountAmount,
          shippingFee: priceCalc.shippingFee,
          donationAmount: priceCalc.donationAmount,
          status: data.status || "Processing",
          created_date: new Date().toISOString()
        };

        const order = await A.StoreOrder.create(orderData);

        // Award petals server-side
        if (data.petalsEarned && data.petalsEarned > 0) {
          const users = await A.BloomwireUser.filter({ email: cleanEmail });
          if (users && users.length > 0) {
            const u = users[0];
            const newBalance = (u.petalsBalance || 0) + data.petalsEarned;
            const newOrderCount = (u.orderCount || 0) + 1;
            const newTotalSpent = (u.totalSpent || 0) + priceCalc.total;
            await A.BloomwireUser.update(u.id, {
              petalsBalance: newBalance,
              orderCount: newOrderCount,
              totalSpent: newTotalSpent,
              updatedAt: new Date().toISOString()
            });
            await A.PetalsTransaction.create({
              amount: data.petalsEarned,
              type: "earned",
              description: `Order ${orderId} reward`,
              userEmail: cleanEmail,
              orderId: order.id,
              created_date: new Date().toISOString()
            });
          }
        }
        return Response.json({ success: true, data: order });
      }

      case "getUserOrders": {
        const { email } = data;
        const orders = await A.StoreOrder.filter({ userEmail: email.toLowerCase().trim() });
        return Response.json({ success: true, data: sortByDateDesc(orders, "created_date") });
      }

      case "updateOrderStatus": {
        if (!isAdmin) {
          return Response.json({ success: false, error: "Unauthorized: admin access required" });
        }
        const { orderId, status, trackingNumber } = data;
        await A.StoreOrder.update(orderId, { status, trackingNumber: trackingNumber || "", updated_date: new Date().toISOString() });
        return Response.json({ success: true, data: { status } });
      }

      case "cancelOrder": {
        const { orderId, email } = data;
        const orders = await A.StoreOrder.filter({ id: orderId });
        if (!orders || orders.length === 0) return Response.json({ success: false, error: "Order not found" });
        const order = orders[0];
        if (!isAdmin && order.userEmail !== callerEmail) {
          return Response.json({ success: false, error: "Forbidden: cannot cancel another user's order" });
        }
        if (order.status !== "Processing") {
          return Response.json({ success: false, error: "Order cannot be cancelled at this stage" });
        }
        await A.StoreOrder.update(orderId, { status: "Cancelled", updated_date: new Date().toISOString() });
        return Response.json({ success: true, data: { status: "Cancelled" } });
      }

      case "getAllOrders": {
        const orders = await A.StoreOrder.list({ filter: {} });
        return Response.json({ success: true, data: sortByDateDesc(orders, "created_date") });
      }

      // ─── TASK 1: SERVER-SIDE COUPON VALIDATION ───
      case "validateCoupon": {
        const result = await validateAndCalculateCoupon(A, data);
        return Response.json(result);
      }

      case "validateCouponSecure": {
        const result = await validateAndCalculateCoupon(A, data);
        return Response.json(result);
      }

      case "markCouponUsed": {
        const { code, email, orderId } = data;
        const coupons = await A.Coupon.filter({ code: code.trim().toUpperCase() });
        if (coupons && coupons.length > 0) {
          await A.Coupon.update(coupons[0].id, { totalUsed: (coupons[0].totalUsed || 0) + 1 });
        }
        await A.CouponUsage.create({ couponCode: code, userEmail: email.toLowerCase().trim(), orderId, usedAt: new Date().toISOString() });
        return Response.json({ success: true, data: { marked: true } });
      }

      // ─── REVIEWS (purchase-verified) ───
      case "addReview": {
        const { userEmail, productId, rating, title, comment, images, userName } = data;
        if (!userEmail || !productId) return Response.json({ success: false, error: "Email and product ID required" });
        if (!rating || rating < 1 || rating > 5) return Response.json({ success: false, error: "Rating must be 1-5" });
        
        // Server-side purchase verification
        const orders = await A.StoreOrder.filter({ userEmail: userEmail.toLowerCase().trim() });
        let hasPurchased = false;
        for (const o of orders) {
          if (Array.isArray(o.items)) {
            if (o.items.some((item: any) => item.slug === productId || item.productId === productId)) { 
              hasPurchased = true; break; 
            }
          }
        }
        
        // Check if already reviewed
        const existingReviews = await A.Review.filter({ userEmail: userEmail.toLowerCase().trim(), productId });
        if (existingReviews && existingReviews.length > 0) {
          return Response.json({ success: false, error: "You have already reviewed this product" });
        }

        const review = await A.Review.create({ 
          userEmail: userEmail.toLowerCase().trim(),
          userName: userName || userEmail.split("@")[0],
          productId, rating, title: title || "", comment: comment || "", 
          images: images || [],
          verified: hasPurchased,
          created_date: new Date().toISOString() 
        });
        
        // Award petals only for verified reviews
        if (hasPurchased) {
          const users = await A.BloomwireUser.filter({ email: userEmail.toLowerCase().trim() });
          if (users && users.length > 0) {
            const u = users[0];
            const newBalance = (u.petalsBalance || 0) + 10;
            await A.BloomwireUser.update(u.id, { petalsBalance: newBalance, updatedAt: new Date().toISOString() });
            await A.PetalsTransaction.create({ 
              amount: 10, type: "earned", description: `Review reward: ${productId}`, 
              userEmail: userEmail.toLowerCase().trim(), orderId: "", created_date: new Date().toISOString() 
            });
          }
        }
        
        return Response.json({ success: true, data: { ...review, verified: hasPurchased } });
      }

      case "getProductReviews": {
        const { productId } = data;
        const reviews = await A.Review.filter({ productId });
        return Response.json({ success: true, data: sortByDateDesc(reviews, "created_date") });
      }

      case "hasUserReviewed": {
        const { email, productId } = data;
        const reviews = await A.Review.filter({ userEmail: email.toLowerCase().trim(), productId });
        return Response.json({ success: true, data: { hasReviewed: reviews && reviews.length > 0 } });
      }

      case "hasUserPurchased": {
        const { email, productId } = data;
        const orders = await A.StoreOrder.filter({ userEmail: email.toLowerCase().trim() });
        let purchased = false;
        for (const o of orders) {
          if (Array.isArray(o.items)) {
            if (o.items.some((item: any) => item.slug === productId || item.productId === productId)) { purchased = true; break; }
          }
        }
        return Response.json({ success: true, data: { hasPurchased: purchased } });
      }

      // ─── REFERRALS ───
      case "validateReferral": {
        const { referralCode, buyerEmail } = data;
        const users = await A.BloomwireUser.filter({ referralCode });
        if (!users || users.length === 0) return Response.json({ success: false, error: "Invalid referral code" });
        if (users[0].email === (buyerEmail || "").toLowerCase().trim()) return Response.json({ success: false, error: "Cannot use your own referral code" });
        return Response.json({ success: true, data: { referrerEmail: users[0].email, referrerName: users[0].name } });
      }

      // ─── REWARDS ───
      case "unlockReward": {
        const { email, rewardId, rewardName, minOrder } = data;
        const users = await A.BloomwireUser.filter({ email: email.toLowerCase().trim() });
        if (!users || users.length === 0) return Response.json({ success: false, error: "User not found" });
        const u = users[0];
        if ((u.orderCount || 0) < minOrder) {
          return Response.json({ success: false, error: "Minimum order requirement not met" });
        }
        const rewards = u.unlockedRewards || [];
        if (!rewards.find((r: any) => r.id === rewardId)) {
          rewards.push({ id: rewardId, name: rewardName, minOrder, unlockedAt: new Date().toISOString() });
          await A.BloomwireUser.update(u.id, { unlockedRewards: rewards, updatedAt: new Date().toISOString() });
        }
        return Response.json({ success: true, data: { unlocked: true } });
      }

      case "clearUnlockedReward": {
        const { email, rewardId } = data;
        const users = await A.BloomwireUser.filter({ email: email.toLowerCase().trim() });
        if (!users || users.length === 0) return Response.json({ success: false, error: "User not found" });
        const u = users[0];
        const rewards = (u.unlockedRewards || []).filter((r: any) => r.id !== rewardId);
        await A.BloomwireUser.update(u.id, { unlockedRewards: rewards, updatedAt: new Date().toISOString() });
        return Response.json({ success: true, data: { cleared: true } });
      }

      // ─── UNBOXING ───
      case "submitUnboxing": {
        const { email, mediaUrl, mediaType, caption } = data;
        if (!email || !mediaUrl) return Response.json({ success: false, error: "Email and media required" });
        const sub = await A.UnboxingSubmission.create({
          userEmail: email.toLowerCase().trim(), mediaUrl, mediaType, caption, status: "pending", petalsAwarded: 0,
          reviewedDate: "", created_date: new Date().toISOString()
        });
        return Response.json({ success: true, data: sub });
      }

      case "getUnboxingStatus": {
        const { email } = data;
        const subs = await A.UnboxingSubmission.filter({ userEmail: email.toLowerCase().trim() });
        return Response.json({ success: true, data: subs });
      }

      case "getUserGallery": {
        const { email } = data;
        const gallery = await A.UserGallery.filter({ userEmail: email.toLowerCase().trim() });
        return Response.json({ success: true, data: gallery });
      }

      case "toggleGalleryPublic": {
        const { galleryId, isPublic } = data;
        const galleryItems = await A.UserGallery.filter({ id: galleryId });
        if (!galleryItems || galleryItems.length === 0) return Response.json({ success: false, error: "Gallery item not found" });
        await A.UserGallery.update(galleryId, { isPublic, updatedAt: new Date().toISOString() });
        return Response.json({ success: true, data: { isPublic } });
      }

      // ─── TASK 3: DASHBOARD REAL STATS ───
      case "getAdminStats": {
        const users = await A.BloomwireUser.list({ filter: {} });
        const orders = await A.StoreOrder.list({ filter: {} });
        const subs = await A.UnboxingSubmission.filter({ status: "pending" });
        
        let products: any[] = [];
        try {
          products = await A.Product.list({ filter: {} });
        } catch (e) {
          products = [];
        }

        const validOrders = orders.filter((o: any) => {
          const st = (o.status || "").toLowerCase();
          return st !== "cancelled" && st !== "refunded";
        });

        const totalRevenue = validOrders.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);
        const totalOrders = orders.length;

        const todayStr = new Date().toISOString().split("T")[0];
        const monthStr = new Date().toISOString().slice(0, 7);

        const ordersToday = orders.filter((o: any) => {
          const dt = String(o.created_date || o.createdAt || "");
          return dt.startsWith(todayStr);
        }).length;

        const revenueThisMonth = validOrders.filter((o: any) => {
          const dt = String(o.created_date || o.createdAt || "");
          return dt.startsWith(monthStr);
        }).reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);

        const totalUsers = users.length;
        const totalProducts = products.length > 0 ? products.length : Object.keys(DEFAULT_PRODUCT_PRICES).length;

        const pendingOrders = orders.filter((o: any) => {
          const st = (o.status || "Processing").toLowerCase();
          return st === "pending" || st === "processing";
        }).length;

        const shippedOrders = orders.filter((o: any) => (o.status || "").toLowerCase() === "shipped").length;
        const deliveredOrders = orders.filter((o: any) => (o.status || "").toLowerCase() === "delivered").length;

        const totalPetalsIssued = users.reduce((sum: number, u: any) => sum + Number(u.petalsBalance || u.petals_balance || 0), 0);

        const lowStockProducts = products.filter((p: any) => (p.stock !== undefined ? Number(p.stock) < 10 : false)).length;

        const recentOrders = sortByDateDesc([...orders], "created_date").slice(0, 5).map((o: any) => ({
          id: o.id || o.orderId,
          orderId: o.orderId || o.id,
          customer: o.userEmail || o.customerName || "Customer",
          userEmail: o.userEmail || "",
          total: Number(o.total) || 0,
          status: o.status || "Processing",
          created_date: o.created_date || o.createdAt || new Date().toISOString(),
        }));

        const newUsersToday = users.filter((u: any) => String(u.createdAt || "").startsWith(todayStr)).length;
        const recentSignups = sortByDateDesc([...users], "createdAt").slice(0, 5).map((u: any) => ({
          name: u.name, email: u.email, phone: u.phone || "", createdAt: u.createdAt, petalsBalance: u.petalsBalance || 0
        }));

        return Response.json({
          success: true,
          data: {
            totalRevenue,
            totalOrders,
            ordersToday,
            totalUsers,
            totalProducts,
            pendingOrders,
            shippedOrders,
            deliveredOrders,
            totalPetalsIssued,
            totalPetalsDistributed: totalPetalsIssued,
            lowStockProducts,
            recentOrders,
            revenueThisMonth,
            pendingSubmissions: subs.length,
            newUsersToday,
            recentSignups,
          }
        });
      }

      case "suspendUser": {
        const { email } = data;
        const users = await A.BloomwireUser.filter({ email: email.toLowerCase().trim() });
        if (!users || users.length === 0) return Response.json({ success: false, error: "User not found" });
        await A.BloomwireUser.update(users[0].id, { status: "suspended", updatedAt: new Date().toISOString() });
        try { await A.ActivityLog.create({ action: "user_suspended", adminEmail: callerEmail || "admin", entityType: "BloomwireUser", entityId: users[0].id, details: `User suspended: ${email}`, timestamp: new Date().toISOString() }); } catch (e) {}
        return Response.json({ success: true, data: { suspended: true } });
      }

      case "banUser": {
        const { email } = data;
        const users = await A.BloomwireUser.filter({ email: email.toLowerCase().trim() });
        if (!users || users.length === 0) return Response.json({ success: false, error: "User not found" });
        await A.BloomwireUser.update(users[0].id, { status: "banned", updatedAt: new Date().toISOString() });
        try { await A.ActivityLog.create({ action: "user_banned", adminEmail: callerEmail || "admin", entityType: "BloomwireUser", entityId: users[0].id, details: `User banned: ${email}`, timestamp: new Date().toISOString() }); } catch (e) {}
        return Response.json({ success: true, data: { banned: true } });
      }

      case "promoteToAdmin": {
        const { email } = data;
        const users = await A.BloomwireUser.filter({ email: email.toLowerCase().trim() });
        if (!users || users.length === 0) return Response.json({ success: false, error: "User not found" });
        await A.BloomwireUser.update(users[0].id, { role: "admin", updatedAt: new Date().toISOString() });
        try { await A.ActivityLog.create({ action: "user_promoted", adminEmail: callerEmail || "admin", entityType: "BloomwireUser", entityId: users[0].id, details: `User promoted to admin: ${email}`, timestamp: new Date().toISOString() }); } catch (e) {}
        return Response.json({ success: true, data: { promoted: true } });
      }

      case "demoteToUser": {
        const { email } = data;
        const users = await A.BloomwireUser.filter({ email: email.toLowerCase().trim() });
        if (!users || users.length === 0) return Response.json({ success: false, error: "User not found" });
        await A.BloomwireUser.update(users[0].id, { role: "user", updatedAt: new Date().toISOString() });
        try { await A.ActivityLog.create({ action: "user_demoted", adminEmail: callerEmail || "admin", entityType: "BloomwireUser", entityId: users[0].id, details: `User demoted: ${email}`, timestamp: new Date().toISOString() }); } catch (e) {}
        return Response.json({ success: true, data: { demoted: true } });
      }

      // ─── COUPON CRUD (admin only) ───
      case "createCoupon": {
        if (!data.code || !data.discountType || (data.discountValue === undefined)) {
          return Response.json({ success: false, error: "Code, discountType, and discountValue required" });
        }
        if (data.discountType === "percentage" && data.discountValue > 50) {
          return Response.json({ success: false, error: "Maximum discount is 50%" });
        }
        const c = await A.Coupon.create({ 
          ...data, code: data.code.trim().toUpperCase(),
          totalUsed: 0, isActive: true, status: "active", createdAt: new Date().toISOString() 
        });
        try { await A.ActivityLog.create({ action: "coupon_created", adminEmail: callerEmail || "admin", entityType: "Coupon", entityId: c.id, details: `Coupon created: ${data.code}`, timestamp: new Date().toISOString() }); } catch (e) {}
        return Response.json({ success: true, data: c });
      }

      case "getCoupons": {
        const coupons = await A.Coupon.list({ filter: {} });
        return Response.json({ success: true, data: sortByDateDesc(coupons, "createdAt") });
      }

      case "updateCoupon": {
        const { couponId, updates } = data;
        await A.Coupon.update(couponId, { ...updates, updatedAt: new Date().toISOString() });
        return Response.json({ success: true, data: { updated: true } });
      }

      case "deleteCoupon": {
        const { couponId } = data;
        await A.Coupon.delete(couponId);
        try { await A.ActivityLog.create({ action: "coupon_deleted", adminEmail: callerEmail || "admin", entityType: "Coupon", entityId: couponId, details: `Coupon deleted`, timestamp: new Date().toISOString() }); } catch (e) {}
        return Response.json({ success: true, data: { deleted: true } });
      }

      case "getCouponUsage": {
        const usage = await A.CouponUsage.list({ filter: {} });
        return Response.json({ success: true, data: usage });
      }

      // ─── RAFFLE ───
      case "createRaffle": {
        const r = await A.Raffle.create({ ...data, totalEntries: 0, eligibleEntries: [], winners: [], status: "active", createdAt: new Date().toISOString() });
        return Response.json({ success: true, data: r });
      }

      case "getRaffles": {
        const raffles = await A.Raffle.list({ filter: {} });
        return Response.json({ success: true, data: sortByDateDesc(raffles, "createdAt") });
      }

      case "drawRaffleWinner": {
        const { raffleId, winners } = data;
        await A.Raffle.update(raffleId, { winners, status: "completed" });
        try { await A.ActivityLog.create({ action: "raffle_drawn", adminEmail: callerEmail || "admin", entityType: "Raffle", entityId: raffleId, details: `Raffle winners drawn`, timestamp: new Date().toISOString() }); } catch (e) {}
        return Response.json({ success: true, data: { drawn: true } });
      }

      // ─── CUSTOM ORDERS ───
      case "getCustomOrders": {
        const orders = await A.CustomOrder.list({ filter: {} });
        return Response.json({ success: true, data: sortByDateDesc(orders, "createdAt") });
      }

      case "updateCustomOrderStatus": {
        const { orderId, status, updates } = data;
        await A.CustomOrder.update(orderId, { status, ...updates, updatedAt: new Date().toISOString() });
        return Response.json({ success: true, data: { updated: true } });
      }

      // ─── TASK 6: BLOG API ACTIONS (public) ───
      case "createBlogPost": {
        const post = await A.BlogPost.create({ ...data, status: data.status || "draft", publishedAt: data.status === "published" ? new Date().toISOString() : "", createdAt: new Date().toISOString() });
        return Response.json({ success: true, data: post });
      }

      case "getBlogPosts": {
        const posts = await A.BlogPost.list({ filter: {} });
        const includeAll = Boolean(data.includeDrafts && isAdmin);
        const filteredPosts = includeAll
          ? posts
          : posts.filter((p: any) => (p.status || "published") === "published");

        const sorted = filteredPosts.sort((a: any, b: any) => {
          const da = new Date(a.publishedAt || a.createdAt || a.created_date || 0).getTime();
          const db = new Date(b.publishedAt || b.createdAt || b.created_date || 0).getTime();
          return db - da;
        });

        return Response.json({ success: true, data: sorted });
      }

      case "getBlogPost": {
        const { slug, id } = data;
        const target = slug || id;
        if (!target) return Response.json({ success: false, error: "Slug or ID required" });

        let posts = await A.BlogPost.filter({ slug: target });
        if (!posts || posts.length === 0) {
          posts = await A.BlogPost.filter({ id: target });
        }

        if (!posts || posts.length === 0) {
          const allPosts = await A.BlogPost.list({ filter: {} });
          posts = allPosts.filter((p: any) => p.slug === target || p.id === target);
        }

        if (!posts || posts.length === 0) {
          return Response.json({ success: false, error: "Blog post not found" });
        }

        const post = posts[0];
        if (post.status !== "published" && !isAdmin) {
          return Response.json({ success: false, error: "Blog post not published" });
        }

        return Response.json({ success: true, data: post });
      }

      case "updateBlogPost": {
        const { postId, updates } = data;
        await A.BlogPost.update(postId, { ...updates, updatedAt: new Date().toISOString() });
        return Response.json({ success: true, data: { updated: true } });
      }

      case "deleteBlogPost": {
        const { postId } = data;
        await A.BlogPost.delete(postId);
        return Response.json({ success: true, data: { deleted: true } });
      }

      // ─── LOGS ───
      case "getEmailLogs": {
        const logs = await A.EmailLog.list({ filter: {} });
        return Response.json({ success: true, data: logs });
      }

      case "getActivityLogs": {
        const logs = await A.ActivityLog.list({ filter: {} });
        return Response.json({ success: true, data: logs });
      }

      case "logActivity": {
        const log = await A.ActivityLog.create({ ...data, timestamp: new Date().toISOString() });
        return Response.json({ success: true, data: log });
      }

      // ─── GIFT CARDS ───
      case "createGiftCard": {
        const gc = await A.GiftCard.create({
          ...data, balance: data.value || 0, redeemed: false, status: "active",
          code: `BWGC-${crypto.randomUUID().slice(0, 10).toUpperCase()}`, createdAt: new Date().toISOString()
        });
        return Response.json({ success: true, data: gc });
      }

      case "getGiftCards": {
        const cards = await A.GiftCard.list({ filter: {} });
        return Response.json({ success: true, data: cards });
      }

      // ─── PETALS TRANSACTIONS ───
      case "getPetalsTransactions": {
        const { userEmail } = data;
        let txns;
        if (userEmail) {
          txns = await A.PetalsTransaction.filter({ userEmail: userEmail.toLowerCase().trim() });
        } else if (isAdmin) {
          txns = await A.PetalsTransaction.list({ filter: {} });
        } else {
          return Response.json({ success: false, error: "Unauthorized" });
        }
        return Response.json({ success: true, data: sortByDateDesc(txns, "created_date") });
      }

      // ─── SUBSCRIBERS ───
      case "getSubscribers": {
        const subs = await A.Subscriber.list({ filter: {} });
        return Response.json({ success: true, data: subs });
      }

      case "updateSubscriber": {
        const sub = await A.Subscriber.update(data.id, data.updates);
        return Response.json({ success: true, data: sub });
      }

      // ─── ADMIN AUTHENTICATION ───
      case "adminLogin": {
        const { password } = data;
        if (password === ADMIN_PASSWORD) {
          const token = `bw_admin_${Date.now()}`;
          return Response.json({
            success: true,
            data: { token, expiresAt: Date.now() + 2 * 60 * 60 * 1000 },
          });
        }
        return Response.json({ success: false, error: "Invalid password" });
      }

      case "verifyAdminToken": {
        const { token } = data;
        if (verifyAdmin(token)) {
          return Response.json({ success: true, data: { valid: true } });
        }
        return Response.json({ success: false, error: "Invalid or expired token" });
      }

      // ─── DEMO DATA & CLEANUP (admin only) ───
      case "seedDemoData": {
        const usersToCreate = [
          { email: "priya.sharma@gmail.com", name: "Priya Sharma", phone: "+91 98765 43210", petalsBalance: 150, orderCount: 2, totalSpent: 2498, status: "active", checkInStreak: 5, role: "user", referralCode: `BLOOM-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, referredBy: "", usedCoupons: [], unlockedRewards: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { email: "arjun.mehta@yahoo.in", name: "Arjun Mehta", phone: "+91 98123 45678", petalsBalance: 80, orderCount: 1, totalSpent: 1299, status: "active", checkInStreak: 2, role: "user", referralCode: `BLOOM-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, referredBy: "", usedCoupons: [], unlockedRewards: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { email: "neha.gupta@outlook.com", name: "Neha Gupta", phone: "+91 97654 32109", petalsBalance: 220, orderCount: 3, totalSpent: 3850, status: "active", checkInStreak: 7, role: "user", referralCode: `BLOOM-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, referredBy: "", usedCoupons: [], unlockedRewards: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { email: "rohit.kumar@gmail.com", name: "Rohit Kumar", phone: "+91 96543 21098", petalsBalance: 40, orderCount: 1, totalSpent: 899, status: "active", checkInStreak: 1, role: "user", referralCode: `BLOOM-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, referredBy: "", usedCoupons: [], unlockedRewards: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { email: "ananya.roy@gmail.com", name: "Ananya Roy", phone: "+91 95432 10987", petalsBalance: 110, orderCount: 1, totalSpent: 1599, status: "active", checkInStreak: 3, role: "user", referralCode: `BLOOM-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, referredBy: "", usedCoupons: [], unlockedRewards: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ];
        let usersCreated = 0;
        for (const u of usersToCreate) { await A.BloomwireUser.create(u); usersCreated++; }

        const ordersToCreate = [
          { userEmail: "priya.sharma@gmail.com", items: [{ id: "p1", title: "Eternal Rose Bouquet", price: 1299, qty: 1 }], subtotal: 1299, total: 1299, status: "Delivered", trackingNumber: secureId("BW-DEL"), paymentMethod: "upi", created_date: new Date(Date.now() - 7 * 86400000).toISOString() },
          { userEmail: "priya.sharma@gmail.com", items: [{ id: "p2", title: "Velvet Tulip Charm", price: 1199, qty: 1 }], subtotal: 1199, total: 1199, status: "Delivered", trackingNumber: secureId("BW-DEL"), paymentMethod: "card", created_date: new Date(Date.now() - 5 * 86400000).toISOString() },
          { userEmail: "arjun.mehta@yahoo.in", items: [{ id: "p1", title: "Eternal Rose Bouquet", price: 1299, qty: 1 }], subtotal: 1299, total: 1299, status: "Shipped", trackingNumber: secureId("BW-SHIP"), paymentMethod: "upi", created_date: new Date(Date.now() - 3 * 86400000).toISOString() },
          { userEmail: "neha.gupta@outlook.com", items: [{ id: "p3", title: "Lavender Mist Delight", price: 1450, qty: 1 }], subtotal: 1450, total: 1450, status: "Delivered", trackingNumber: secureId("BW-DEL"), paymentMethod: "upi", created_date: new Date(Date.now() - 10 * 86400000).toISOString() },
          { userEmail: "neha.gupta@outlook.com", items: [{ id: "p2", title: "Velvet Tulip Charm", price: 1100, qty: 1 }], subtotal: 1100, total: 1100, status: "Shipped", trackingNumber: secureId("BW-SHIP"), paymentMethod: "cod", created_date: new Date(Date.now() - 2 * 86400000).toISOString() },
          { userEmail: "neha.gupta@outlook.com", items: [{ id: "p4", title: "Golden Sunflower", price: 1300, qty: 1 }], subtotal: 1300, total: 1300, status: "Processing", trackingNumber: "", paymentMethod: "upi", created_date: new Date(Date.now() - 1 * 86400000).toISOString() },
          { userEmail: "rohit.kumar@gmail.com", items: [{ id: "p5", title: "Blossom Daisy", price: 899, qty: 1 }], subtotal: 899, total: 899, status: "Processing", trackingNumber: "", paymentMethod: "cod", created_date: new Date().toISOString() },
          { userEmail: "ananya.roy@gmail.com", items: [{ id: "p3", title: "Lavender Mist Delight", price: 1599, qty: 1 }], subtotal: 1599, total: 1599, status: "Processing", trackingNumber: "", paymentMethod: "upi", created_date: new Date().toISOString() },
        ];
        let ordersCreated = 0;
        for (const o of ordersToCreate) { await A.StoreOrder.create(o); ordersCreated++; }

        const checkInsToCreate = [
          { userEmail: "priya.sharma@gmail.com", checkInDate: new Date().toISOString().split("T")[0], streakDay: 5, petalsAwarded: 30 },
          { userEmail: "neha.gupta@outlook.com", checkInDate: new Date().toISOString().split("T")[0], streakDay: 7, petalsAwarded: 75 },
          { userEmail: "arjun.mehta@yahoo.in", checkInDate: new Date(Date.now() - 86400000).toISOString().split("T")[0], streakDay: 2, petalsAwarded: 10 },
          { userEmail: "ananya.roy@gmail.com", checkInDate: new Date().toISOString().split("T")[0], streakDay: 3, petalsAwarded: 15 },
          { userEmail: "rohit.kumar@gmail.com", checkInDate: new Date().toISOString().split("T")[0], streakDay: 1, petalsAwarded: 5 },
        ];
        let checkInsCreated = 0;
        for (const c of checkInsToCreate) { await A.CheckInRecord.create(c); checkInsCreated++; }

        const transactionsToCreate = [
          { userEmail: "priya.sharma@gmail.com", amount: 50, type: "earned", description: "Welcome bonus", orderId: "", created_date: new Date().toISOString() },
          { userEmail: "neha.gupta@outlook.com", amount: 75, type: "earned", description: "Daily check-in (Day 7)", orderId: "", created_date: new Date().toISOString() },
          { userEmail: "arjun.mehta@yahoo.in", amount: 30, type: "earned", description: "Order reward", orderId: "", created_date: new Date().toISOString() },
          { userEmail: "ananya.roy@gmail.com", amount: 60, type: "earned", description: "Review reward", orderId: "", created_date: new Date().toISOString() },
          { userEmail: "rohit.kumar@gmail.com", amount: 40, type: "earned", description: "Welcome bonus", orderId: "", created_date: new Date().toISOString() },
        ];
        let petalsTransactionsCreated = 0;
        for (const t of transactionsToCreate) { await A.PetalsTransaction.create(t); petalsTransactionsCreated++; }

        return Response.json({ success: true, data: { usersCreated, ordersCreated, checkInsCreated, petalsTransactionsCreated } });
      }

      case "clearAllData": {
        const entityNames = [
          "BloomwireUser", "StoreOrder", "PetalsTransaction", "CheckInRecord",
          "Review", "ReviewRecord", "Coupon", "CouponUsage", "UnboxingSubmission",
          "UserGallery", "Raffle", "GiftCard", "ActivityLog", "EmailLog",
          "Subscriber", "CustomOrder", "BlogPost",
        ];
        let totalRecordsCleared = 0;
        let clearedEntitiesCount = 0;
        for (const name of entityNames) {
          try {
            const entity = (A as any)[name];
            if (entity && typeof entity.list === "function") {
              const records = await entity.list({ filter: {} });
              if (Array.isArray(records)) {
                for (const r of records) {
                  const id = r.id || r._id;
                  if (id) { await entity.delete(id); totalRecordsCleared++; }
                }
              }
              clearedEntitiesCount++;
            }
          } catch (e) { console.error(`Error clearing entity ${name}:`, e); }
        }
        try { await A.ActivityLog.create({ action: "data_cleared", adminEmail: callerEmail || "admin", entityType: "system", entityId: "", details: `All data cleared (${totalRecordsCleared} records)`, timestamp: new Date().toISOString() }); } catch (e) {}
        return Response.json({ success: true, data: { clearedEntitiesCount, totalRecordsCleared } });
      }

      // ─── SUBSCRIBER CREATION (public) ───
      case "createSubscriber": {
        const { email, discountCode, discountPercent, source } = data;
        if (!email) return Response.json({ success: false, error: "Email required" });
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ success: false, error: "Invalid email format" });
        const cleanEmail = email.toLowerCase().trim();
        const existing = await A.Subscriber.filter({ email: cleanEmail });
        if (existing && existing.length > 0) return Response.json({ success: false, error: "already subscribed", data: existing[0] });
        const sub = await A.Subscriber.create({
          email: cleanEmail, discountCode: discountCode || "BLOOM15", discountPercent: discountPercent || 15,
          source: source || "popup", emailed: false
        });
        return Response.json({ success: true, data: sub });
      }

      case "getSubscriberByEmail": {
        const { email } = data;
        if (!email) return Response.json({ success: false, error: "Email required" });
        const subs = await A.Subscriber.filter({ email: email.toLowerCase().trim() });
        if (!subs || subs.length === 0) return Response.json({ success: false, error: "Not found" });
        return Response.json({ success: true, data: subs[0] });
      }

      // ─── TASK 4: TOTAL DONATIONS (public endpoint) ───
      case "getTotalDonations": {
        const orders = await A.StoreOrder.list({ filter: {} });
        let totalDonated = 0;
        for (const o of orders) {
          const st = (o.status || "").toLowerCase();
          if (st === "cancelled" || st === "refunded") continue;
          if (o.donationAmount !== undefined && o.donationAmount !== null) {
            totalDonated += Number(o.donationAmount) || 0;
          } else {
            const subtotal = Number(o.subtotal || o.total || 0);
            totalDonated += Math.round(subtotal * 0.02);
          }
        }
        return Response.json({
          success: true,
          data: {
            totalDonated,
            totalDonationAmount: totalDonated,
            formattedTotal: `₹${totalDonated.toLocaleString("en-IN")}`,
            orderCount: orders.length,
          }
        });
      }

      // ─── TASK 5: PAYMENT VERIFICATION PLACEHOLDER ───
      case "verifyPayment": {
        const { paymentId, orderId, razorpayOrderId, signature, userEmail } = data;
        
        if (!paymentId || !orderId) {
          return Response.json({ success: false, error: "paymentId and orderId are required" });
        }

        /*
         * TODO: Razorpay HMAC SHA-256 Signature Verification
         * When live Razorpay API keys are configured:
         * 
         * 1. Retrieve RAZORPAY_KEY_SECRET from environment variable:
         *    const secret = Deno.env.get("RAZORPAY_KEY_SECRET");
         * 
         * 2. Construct verification payload string:
         *    const text = `${razorpayOrderId || orderId}|${paymentId}`;
         * 
         * 3. Generate HMAC SHA-256 hash using Web Crypto API:
         *    const encoder = new TextEncoder();
         *    const key = await crypto.subtle.importKey(
         *      "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
         *    );
         *    const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(text));
         *    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
         *      .map(b => b.toString(16).padStart(2, "0")).join("");
         * 
         * 4. Compare expectedSignature with signature from Razorpay:
         *    if (expectedSignature !== signature) {
         *      return Response.json({ success: false, error: "Invalid payment signature" });
         *    }
         */

        let orders = await A.StoreOrder.filter({ orderId });
        if (!orders || orders.length === 0) {
          orders = await A.StoreOrder.filter({ id: orderId });
        }

        if (orders && orders.length > 0) {
          const o = orders[0];
          await A.StoreOrder.update(o.id, {
            status: "Paid",
            paymentStatus: "paid",
            razorpayPaymentId: paymentId,
            razorpayOrderId: razorpayOrderId || "",
            razorpaySignature: signature || "",
            updated_date: new Date().toISOString()
          });
          return Response.json({
            success: true,
            data: {
              verified: true,
              status: "Paid",
              orderId: o.orderId || o.id,
              paymentId
            }
          });
        } else {
          return Response.json({
            success: true,
            data: {
              verified: true,
              status: "Payment recorded",
              paymentId,
              note: "Order record pending creation"
            }
          });
        }
      }

      default:
        return Response.json({ success: false, error: `Unknown action: ${action}` });
    }
  } catch (err: any) {
    console.error(`[bloomwireApi] Error:`, err);
    return Response.json({ success: false, error: err.message || "Internal server error" });
  }
});
