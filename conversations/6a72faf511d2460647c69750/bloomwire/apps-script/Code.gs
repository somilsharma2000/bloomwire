/**
 * BLOOMWIRE — Google Apps Script API
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Delete all existing code and paste this entire file
 * 4. Click Run → setUp (this creates the sheet tabs and headers)
 * 5. Click Deploy → New Deployment → Type: Web App
 * 6. Set: Execute as: Me, Who has access: Anyone
 * 7. Copy the Web App URL and share it with Elara
 */

const SHEET_NAMES = {
  USERS: 'Users',
  ORDERS: 'Orders',
  REVIEWS: 'Reviews',
  COUPONS: 'Coupons',
  CHECKINS: 'CheckIns',
  ADMIN_LOG: 'AdminLog'
};

const USER_HEADERS = [
  'email', 'name', 'phone', 'petalsBalance', 'pendingPetals', 'referralCode',
  'referredBy', 'orderCount', 'usedCoupons', 'checkInStreak', 'lastCheckIn',
  'unlockedRewards', 'totalSpent', 'createdAt', 'updatedAt'
];

const ORDER_HEADERS = [
  'orderId', 'userEmail', 'items', 'subtotal', 'shipping', 'giftWrap',
  'giftWrapFee', 'deliveryTier', 'deliveryCost', 'total', 'petalsEarned',
  'paymentMethod', 'status', 'trackingNumber', 'giftNote',
  'giftWrapInstructions', 'orderNotes', 'shippingAddress', 'createdAt',
  'estimatedDelivery', 'isPaid'
];

const REVIEW_HEADERS = [
  'reviewId', 'productId', 'userEmail', 'userName', 'rating', 'title',
  'comment', 'verified', 'createdAt'
];

const COUPON_HEADERS = [
  'code', 'type', 'value', 'firstOrderOnly', 'reusable', 'usageCount', 'active'
];

const CHECKIN_HEADERS = [
  'email', 'checkInDate', 'petalsAwarded', 'streakDay'
];

const ADMIN_LOG_HEADERS = [
  'action', 'details', 'timestamp', 'adminEmail'
];

const VALID_COUPONS = {
  'BLOOM15': { type: 'percent', value: 15, firstOrderOnly: true, reusable: false },
  'FREESHIP': { type: 'freeship', value: 0, firstOrderOnly: false, reusable: true },
  'COMEBACK10': { type: 'percent', value: 10, firstOrderOnly: false, reusable: true }
};

const STREAK_REWARDS = [5, 10, 15, 20, 30, 40, 75];

function setUp() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  createSheet(ss, SHEET_NAMES.USERS, USER_HEADERS);
  createSheet(ss, SHEET_NAMES.ORDERS, ORDER_HEADERS);
  createSheet(ss, SHEET_NAMES.REVIEWS, REVIEW_HEADERS);
  createSheet(ss, SHEET_NAMES.COUPONS, COUPON_HEADERS);
  seedCoupons(ss);
  createSheet(ss, SHEET_NAMES.CHECKINS, CHECKIN_HEADERS);
  createSheet(ss, SHEET_NAMES.ADMIN_LOG, ADMIN_LOG_HEADERS);
  return 'Setup complete!';
}

function createSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
}

function seedCoupons(ss) {
  const sheet = ss.getSheetByName(SHEET_NAMES.COUPONS);
  const data = Object.entries(VALID_COUPONS).map(([code, c]) => [
    code, c.type, c.value, c.firstOrderOnly, c.reusable, 0, true
  ]);
  if (data.length > 0) sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const result = handleAction(body.action, body.data || {});
    return jsonOut({ success: true, data: result });
  } catch (err) {
    return jsonOut({ success: false, error: err.toString() });
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    const data = {};
    Object.keys(e.parameter).forEach(k => {
      if (k !== 'action') data[k] = e.parameter[k];
    });
    const result = handleAction(action, data);
    return jsonOut({ success: true, data: result });
  } catch (err) {
    return jsonOut({ success: false, error: err.toString() });
  }
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function handleAction(action, data) {
  switch (action) {
    case 'ping': return { status: 'ok', time: new Date().toISOString() };
    case 'createUser': return createUser(data);
    case 'getUser': return getUser(data.email);
    case 'updateUser': return updateUser(data.email, data.updates);
    case 'addPetals': return addPetals(data.email, data.amount, data.reason);
    case 'deductPetals': return deductPetals(data.email, data.amount, data.reason);
    case 'getPetalsBalance': return getPetalsBalance(data.email);
    case 'recordCheckIn': return recordCheckIn(data.email);
    case 'getCheckInStatus': return getCheckInStatus(data.email);
    case 'createOrder': return createOrder(data);
    case 'getOrder': return getOrder(data.orderId);
    case 'getUserOrders': return getUserOrders(data.email);
    case 'updateOrderStatus': return updateOrderStatus(data.orderId, data.status, data.trackingNumber);
    case 'cancelOrder': return cancelOrder(data.orderId);
    case 'getAllOrders': return getAllOrders(data.limit || 100);
    case 'validateCoupon': return validateCoupon(data.code, data.email, data.orderCount);
    case 'markCouponUsed': return markCouponUsed(data.code, data.email, data.orderId);
    case 'addReview': return addReview(data);
    case 'getProductReviews': return getProductReviews(data.productId);
    case 'hasUserReviewed': return hasUserReviewed(data.email, data.productId);
    case 'hasUserPurchased': return hasUserPurchased(data.email, data.productId);
    case 'validateReferral': return validateReferral(data.referralCode, data.buyerEmail);
    case 'processReferralReward': return processReferralReward(data.referralCode, data.buyerEmail, data.orderId);
    case 'unlockReward': return unlockReward(data.email, data.rewardId, data.rewardName, data.minOrder);
    case 'clearUnlockedReward': return clearUnlockedReward(data.email, data.rewardId);
    case 'getAllUsers': return getAllUsers(data.limit || 100);
    case 'getAdminStats': return getAdminStats();
    case 'logAdminAction': return logAdminAction(data.action, data.details, data.adminEmail);
    default: throw new Error('Unknown action: ' + action);
  }
}

// === USER MANAGEMENT ===
function createUser(data) {
  const sheet = getSheet(SHEET_NAMES.USERS);
  const existing = findRow(sheet, 'email', data.email);
  if (existing) return rowToObject(sheet, existing.row, USER_HEADERS);
  
  const referralCode = 'BLOOM-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  const now = new Date().toISOString();
  let referredBy = '';
  if (data.referralCode) {
    const referrer = findRow(sheet, 'referralCode', data.referralCode);
    if (referrer) {
      const referrerEmail = sheet.getRange(referrer.row, 1).getValue();
      if (referrerEmail !== data.email) referredBy = referrerEmail;
    }
  }
  
  sheet.appendRow([data.email, data.name || '', data.phone || '', 50, 0, referralCode, referredBy, 0, '', 0, '', '', 0, now, now]);
  return { email: data.email, name: data.name || '', petalsBalance: 50, pendingPetals: 0, referralCode, referredBy, orderCount: 0, usedCoupons: [], checkInStreak: 0, lastCheckIn: '', unlockedRewards: [], totalSpent: 0, createdAt: now, updatedAt: now };
}

function getUser(email) {
  const sheet = getSheet(SHEET_NAMES.USERS);
  const found = findRow(sheet, 'email', email);
  if (!found) return null;
  const obj = rowToObject(sheet, found.row, USER_HEADERS);
  obj.usedCoupons = safeParseJSON(obj.usedCoupons, []);
  obj.unlockedRewards = safeParseJSON(obj.unlockedRewards, []);
  obj.petalsBalance = Number(obj.petalsBalance) || 0;
  obj.pendingPetals = Number(obj.pendingPetals) || 0;
  obj.orderCount = Number(obj.orderCount) || 0;
  obj.checkInStreak = Number(obj.checkInStreak) || 0;
  obj.totalSpent = Number(obj.totalSpent) || 0;
  return obj;
}

function updateUser(email, updates) {
  const sheet = getSheet(SHEET_NAMES.USERS);
  const found = findRow(sheet, 'email', email);
  if (!found) throw new Error('User not found');
  for (const [key, value] of Object.entries(updates)) {
    const col = USER_HEADERS.indexOf(key);
    if (col >= 0) sheet.getRange(found.row, col + 1).setValue(typeof value === 'object' ? JSON.stringify(value) : value);
  }
  sheet.getRange(found.row, USER_HEADERS.indexOf('updatedAt') + 1).setValue(new Date().toISOString());
  return getUser(email);
}

// === PETALS ===
function addPetals(email, amount, reason) {
  const user = getUser(email);
  if (!user) throw new Error('User not found');
  const newBalance = user.petalsBalance + amount;
  updateUser(email, { petalsBalance: newBalance });
  return { balance: newBalance, added: amount, reason };
}

function deductPetals(email, amount, reason) {
  const user = getUser(email);
  if (!user) throw new Error('User not found');
  updateUser(email, { petalsBalance: user.petalsBalance - amount });
  return { balance: user.petalsBalance - amount, deducted: amount, reason };
}

function getPetalsBalance(email) {
  const user = getUser(email);
  return user ? user.petalsBalance : 0;
}

// === CHECK-INS (server time) ===
function recordCheckIn(email) {
  const user = getUser(email);
  if (!user) throw new Error('User not found');
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  if (user.lastCheckIn === today) return { error: 'Already checked in today', streak: user.checkInStreak };
  
  let newStreak = 1;
  if (user.lastCheckIn) {
    const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
    if (user.lastCheckIn === yesterday.toISOString().split('T')[0]) newStreak = user.checkInStreak + 1;
  }
  const streakDay = ((newStreak - 1) % 7) + 1;
  const bonusPetals = STREAK_REWARDS[streakDay - 1];
  let raffleTicket = (streakDay === 7 && user.orderCount >= 1);
  
  getSheet(SHEET_NAMES.CHECKINS).appendRow([email, today, bonusPetals, streakDay]);
  updateUser(email, { petalsBalance: user.petalsBalance + bonusPetals, checkInStreak: newStreak, lastCheckIn: today });
  return { success: true, petalsAwarded: bonusPetals, streakDay, newStreak, newBalance: user.petalsBalance + bonusPetals, raffleTicket };
}

function getCheckInStatus(email) {
  const user = getUser(email);
  if (!user) throw new Error('User not found');
  const today = new Date().toISOString().split('T')[0];
  return { streak: user.checkInStreak, lastCheckIn: user.lastCheckIn, canCheckIn: user.lastCheckIn !== today, nextRewardDay: (user.checkInStreak % 7) + 1 };
}

// === ORDERS ===
function createOrder(data) {
  const sheet = getSheet(SHEET_NAMES.ORDERS);
  const orderId = 'BLOOM' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 100).toString().padStart(2, '0');
  const now = new Date().toISOString();
  const eta = new Date(); eta.setDate(eta.getDate() + (data.deliveryTier === 'express' ? 4 : 7));
  const petalsEarned = Math.round(Number(data.total) * 0.05);
  const user = getUser(data.userEmail);
  const isFirstOrder = user ? user.orderCount === 0 : true;
  const totalPetals = isFirstOrder ? petalsEarned + 50 : petalsEarned;
  
  sheet.appendRow([orderId, data.userEmail, JSON.stringify(data.items || []), data.subtotal || 0, data.shipping || 0, data.giftWrap ? 'true' : 'false', data.giftWrapFee || 0, data.deliveryTier || 'standard', data.deliveryCost || 0, data.total || 0, totalPetals, data.paymentMethod || 'cod', 'Processing', '', data.giftNote || '', data.giftWrapInstructions || '', data.orderNotes || '', JSON.stringify(data.shippingAddress || {}), now, eta.toISOString(), 'false']);
  
  if (user) {
    updateUser(data.userEmail, { orderCount: user.orderCount + 1, pendingPetals: (user.pendingPetals || 0) + totalPetals, totalSpent: (user.totalSpent || 0) + Number(data.total || 0) });
  }
  if (data.couponCode) markCouponUsed(data.couponCode, data.userEmail, orderId);
  if (user && user.referredBy && isFirstOrder) processReferralReward(user.referralCode, data.userEmail, orderId);
  
  return { orderId, petalsEarned: totalPetals, estimatedDelivery: eta.toISOString() };
}

function getOrder(orderId) {
  const sheet = getSheet(SHEET_NAMES.ORDERS);
  const found = findRow(sheet, 'orderId', orderId);
  if (!found) return null;
  const obj = rowToObject(sheet, found.row, ORDER_HEADERS);
  obj.items = safeParseJSON(obj.items, []);
  obj.shippingAddress = safeParseJSON(obj.shippingAddress, {});
  return obj;
}

function getUserOrders(email) {
  const sheet = getSheet(SHEET_NAMES.ORDERS);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data[0]; const emailCol = headers.indexOf('userEmail');
  const orders = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][emailCol] === email) {
      const obj = {}; headers.forEach((h, j) => { obj[h] = data[i][j]; });
      obj.items = safeParseJSON(obj.items, []);
      obj.shippingAddress = safeParseJSON(obj.shippingAddress, {});
      orders.push(obj);
    }
  }
  return orders;
}

function updateOrderStatus(orderId, status, trackingNumber) {
  const sheet = getSheet(SHEET_NAMES.ORDERS);
  const found = findRow(sheet, 'orderId', orderId);
  if (!found) throw new Error('Order not found');
  sheet.getRange(found.row, ORDER_HEADERS.indexOf('status') + 1).setValue(status);
  if (trackingNumber) sheet.getRange(found.row, ORDER_HEADERS.indexOf('trackingNumber') + 1).setValue(trackingNumber);
  if (status === 'Shipped' || status === 'Dispatched') {
    sheet.getRange(found.row, ORDER_HEADERS.indexOf('isPaid') + 1).setValue('true');
    const order = getOrder(orderId);
    if (order) creditPendingPetals(order.userEmail, orderId);
  }
  return getOrder(orderId);
}

function cancelOrder(orderId) {
  const order = getOrder(orderId);
  if (!order) throw new Error('Order not found');
  if (order.status !== 'Processing') throw new Error('Cannot cancel');
  const sheet = getSheet(SHEET_NAMES.ORDERS);
  const found = findRow(sheet, 'orderId', orderId);
  sheet.getRange(found.row, ORDER_HEADERS.indexOf('status') + 1).setValue('Cancelled');
  const user = getUser(order.userEmail);
  if (user) {
    updateUser(order.userEmail, {
      pendingPetals: Math.max(0, (user.pendingPetals || 0) - (Number(order.petalsEarned) || 0)),
      orderCount: Math.max(0, user.orderCount - 1),
      totalSpent: Math.max(0, (user.totalSpent || 0) - Number(order.total || 0))
    });
  }
  return { success: true, orderId, status: 'Cancelled' };
}

function getAllOrders(limit) {
  const sheet = getSheet(SHEET_NAMES.ORDERS);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data[0]; const orders = [];
  for (let i = data.length - 1; i >= 1 && orders.length < limit; i--) {
    const obj = {}; headers.forEach((h, j) => { obj[h] = data[i][j]; });
    obj.items = safeParseJSON(obj.items, []);
    obj.shippingAddress = safeParseJSON(obj.shippingAddress, {});
    orders.push(obj);
  }
  return orders;
}

// === COUPONS ===
function validateCoupon(code, email, orderCount) {
  code = (code || '').toUpperCase().trim();
  if (!VALID_COUPONS[code]) return { valid: false, error: 'Invalid coupon code' };
  const config = VALID_COUPONS[code];
  if (config.firstOrderOnly && orderCount > 0) return { valid: false, error: 'Coupon only valid for first order' };
  if (!config.reusable) {
    const user = getUser(email);
    if (user) { const used = safeParseJSON(user.usedCoupons, []); if (used.includes(code)) return { valid: false, error: 'Coupon already used' }; }
  }
  return { valid: true, type: config.type, value: config.value };
}

function markCouponUsed(code, email, orderId) {
  code = (code || '').toUpperCase().trim();
  const user = getUser(email);
  if (!user) return;
  const used = safeParseJSON(user.usedCoupons, []);
  if (!used.includes(code)) { used.push(code); updateUser(email, { usedCoupons: JSON.stringify(used) }); }
  const sheet = getSheet(SHEET_NAMES.COUPONS);
  const found = findRow(sheet, 'code', code);
  if (found) { const col = COUPON_HEADERS.indexOf('usageCount'); sheet.getRange(found.row, col + 1).setValue((Number(sheet.getRange(found.row, col + 1).getValue()) || 0) + 1); }
}

// === REVIEWS ===
function addReview(data) {
  if (!hasUserPurchased(data.userEmail, data.productId)) return { error: 'Must purchase before reviewing' };
  if (hasUserReviewed(data.userEmail, data.productId)) return { error: 'Already reviewed' };
  if (!data.comment || data.comment.length < 10) return { error: 'Review too short' };
  const sheet = getSheet(SHEET_NAMES.REVIEWS);
  sheet.appendRow(['REV' + Date.now(), data.productId, data.userEmail, data.userName || '', data.rating || 5, data.title || '', data.comment, 'true', new Date().toISOString()]);
  addPetals(data.userEmail, 10, 'Review: ' + data.productId);
  return { success: true };
}

function getProductReviews(productId) {
  const sheet = getSheet(SHEET_NAMES.REVIEWS);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data[0]; const col = headers.indexOf('productId'); const reviews = [];
  for (let i = 1; i < data.length; i++) { if (data[i][col] === productId) { const obj = {}; headers.forEach((h, j) => { obj[h] = data[i][j]; }); reviews.push(obj); } }
  return reviews;
}

function hasUserReviewed(email, productId) {
  const sheet = getSheet(SHEET_NAMES.REVIEWS);
  const data = sheet.getDataRange().getValues(); if (data.length <= 1) return false;
  const headers = data[0]; const ec = headers.indexOf('userEmail'); const pc = headers.indexOf('productId');
  for (let i = 1; i < data.length; i++) { if (data[i][ec] === email && data[i][pc] === productId) return true; }
  return false;
}

function hasUserPurchased(email, productId) {
  const orders = getUserOrders(email);
  return orders.some(o => safeParseJSON(o.items, []).some(i => i.slug === productId));
}

// === REFERRALS ===
function validateReferral(referralCode, buyerEmail) {
  const sheet = getSheet(SHEET_NAMES.USERS);
  const referrer = findRow(sheet, 'referralCode', referralCode);
  if (!referrer) return { valid: false, error: 'Invalid referral code' };
  const referrerEmail = sheet.getRange(referrer.row, 1).getValue();
  if (referrerEmail === buyerEmail) return { valid: false, error: 'Cannot use own referral code' };
  return { valid: true, referrerEmail };
}

function processReferralReward(referralCode, buyerEmail, orderId) {
  const sheet = getSheet(SHEET_NAMES.USERS);
  const referrer = findRow(sheet, 'referralCode', referralCode);
  if (!referrer) return { success: false };
  const referrerEmail = sheet.getRange(referrer.row, 1).getValue();
  if (referrerEmail === buyerEmail) return { success: false, error: 'Self-referral' };
  addPetals(referrerEmail, 50, 'Referral: ' + buyerEmail);
  addPetals(buyerEmail, 50, 'Referral bonus from: ' + referrerEmail);
  return { success: true };
}

// === REWARDS ===
function unlockReward(email, rewardId, rewardName, minOrder) {
  const user = getUser(email); if (!user) throw new Error('User not found');
  const unlocked = safeParseJSON(user.unlockedRewards, []);
  if (unlocked.some(r => r.id === rewardId)) return { error: 'Already unlocked' };
  unlocked.push({ id: rewardId, name: rewardName, minOrder: Number(minOrder) });
  updateUser(email, { unlockedRewards: JSON.stringify(unlocked) });
  return { success: true, unlocked };
}

function clearUnlockedReward(email, rewardId) {
  const user = getUser(email); if (!user) throw new Error('User not found');
  let unlocked = safeParseJSON(user.unlockedRewards, []).filter(r => r.id !== rewardId);
  updateUser(email, { unlockedRewards: JSON.stringify(unlocked) });
  return { success: true, unlocked };
}

// === ADMIN ===
function getAllUsers(limit) {
  const sheet = getSheet(SHEET_NAMES.USERS);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data[0]; const users = [];
  for (let i = data.length - 1; i >= 1 && users.length < limit; i--) {
    const obj = {}; headers.forEach((h, j) => { obj[h] = data[i][j]; });
    obj.usedCoupons = safeParseJSON(obj.usedCoupons, []);
    obj.unlockedRewards = safeParseJSON(obj.unlockedRewards, []);
    obj.petalsBalance = Number(obj.petalsBalance) || 0;
    users.push(obj);
  }
  return users;
}

function getAdminStats() {
  const users = getAllUsers(1000);
  const orders = getAllOrders(1000);
  const totalRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + (Number(o.total) || 0), 0);
  return {
    totalUsers: users.length, totalOrders: orders.length, totalRevenue,
    pendingOrders: orders.filter(o => o.status === 'Processing').length,
    shippedOrders: orders.filter(o => o.status === 'Shipped').length,
    deliveredOrders: orders.filter(o => o.status === 'Delivered').length,
    recentOrders: orders.slice(0, 10), recentUsers: users.slice(0, 10)
  };
}

function logAdminAction(action, details, adminEmail) {
  getSheet(SHEET_NAMES.ADMIN_LOG).appendRow([action, JSON.stringify(details), new Date().toISOString(), adminEmail || '']);
  return { success: true };
}

// === HELPERS ===
function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) { const h = getHeadersForSheet(name); if (h) { sheet = ss.insertSheet(name); sheet.getRange(1, 1, 1, h.length).setValues([h]); sheet.setFrozenRows(1); } else throw new Error('Sheet not found'); }
  return sheet;
}

function getHeadersForSheet(name) {
  return { [SHEET_NAMES.USERS]: USER_HEADERS, [SHEET_NAMES.ORDERS]: ORDER_HEADERS, [SHEET_NAMES.REVIEWS]: REVIEW_HEADERS, [SHEET_NAMES.COUPONS]: COUPON_HEADERS, [SHEET_NAMES.CHECKINS]: CHECKIN_HEADERS, [SHEET_NAMES.ADMIN_LOG]: ADMIN_LOG_HEADERS }[name] || null;
}

function findRow(sheet, columnName, value) {
  const data = sheet.getDataRange().getValues(); if (data.length <= 1) return null;
  const col = data[0].indexOf(columnName); if (col < 0) return null;
  for (let i = 1; i < data.length; i++) { if (String(data[i][col]) === String(value)) return { row: i + 1, data: data[i] }; }
  return null;
}

function rowToObject(sheet, row, headers) {
  const values = sheet.getRange(row, 1, 1, headers.length).getValues()[0];
  const obj = {}; headers.forEach((h, i) => { obj[h] = values[i]; }); return obj;
}

function safeParseJSON(str, fallback) {
  if (!str) return fallback; if (typeof str === 'object') return str;
  try { return JSON.parse(str); } catch (e) { return fallback; }
}
