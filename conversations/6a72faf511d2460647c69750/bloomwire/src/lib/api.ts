// Bloomwire API Client — calling Base44 backend function

const API_URL = import.meta.env.VITE_BACKEND_URL || 'https://elara-89a373b9.base44.app/functions/bloomwireApi';

// Retrieve auth context from sessionStorage/localStorage for request headers
function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  
  // Get user email from auth store (persisted in localStorage by zustand)
  try {
    const authData = localStorage.getItem('bloomwire-auth-storage');
    if (authData) {
      const parsed = JSON.parse(authData);
      const email = parsed?.state?.user?.email;
      if (email) headers['x-user-email'] = email;
    }
  } catch (e) {}
  
  // Get admin token from sessionStorage
  const adminToken = sessionStorage.getItem('bloomwire_admin_token');
  if (adminToken) headers['x-admin-token'] = adminToken;
  
  return headers;
}

async function callApi(action: string, data: any = {}): Promise<any> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ action, data }),
    });
    return await res.json();
  } catch (err: any) {
    console.warn(`[API] ${action}:`, err.message);
    return { success: false, error: err.message };
  }
}

export const api: any = {
  // === USER ===
  async createUser(email: string, name: string, phone?: string, referralCode?: string) {
    return callApi('createUser', { email, name, phone, referralCode });
  },

  async getUser(email: string) {
    return callApi('getUser', { email });
  },

  async updateUser(email: string, updates: any) {
    return callApi('updateUser', { email, updates });
  },

  // === PETALS ===
  async addPetals(email: string, amount: number, reason?: string) {
    return callApi('addPetals', { email, amount, reason });
  },

  async getPetalsBalance(email: string) {
    return callApi('getPetalsBalance', { email });
  },

  async getPetalsTransactions(limit = 100, userEmail?: string) {
    return callApi('getPetalsTransactions', { limit, userEmail });
  },

  // === CHECK-INS ===
  async recordCheckIn(email: string) {
    return callApi('recordCheckIn', { email });
  },

  async getCheckInStatus(email: string) {
    return callApi('getCheckInStatus', { email });
  },

  async getCheckInRecords(limit = 100) {
    return callApi('getCheckInRecords', { limit });
  },

  // === ORDERS ===
  async createOrder(orderData: any) {
    return callApi('createOrder', orderData);
  },
  async getTotalDonations() {
    return callApi('getTotalDonations', {});
  },

  async getUserOrders(email: string) {
    return callApi('getUserOrders', { email });
  },

  async updateOrderStatus(orderId: string, status: string, trackingNumber?: string) {
    return callApi('updateOrderStatus', { orderId, status, trackingNumber });
  },

  async cancelOrder(orderId: string) {
    return callApi('cancelOrder', { orderId });
  },

  async getAllOrders(limit = 100) {
    return callApi('getAllOrders', { limit });
  },

  // === COUPONS ===
  async validateCoupon(code: string, email: string, orderCount: number) {
    return callApi('validateCoupon', { code, email, orderCount });
  },

  async markCouponUsed(code: string, email: string, orderId: string) {
    return callApi('markCouponUsed', { code, email, orderId });
  },

  async getCouponUsage(limit = 100) {
    return callApi('getCouponUsage', { limit });
  },

  async createCoupon(data: any) {
    return callApi('createCoupon', data);
  },

  async getCoupons(limit = 100) {
    return callApi('getCoupons', { limit });
  },

  async updateCoupon(couponId: string, updates: any) {
    return callApi('updateCoupon', { couponId, updates });
  },

  async deleteCoupon(couponId: string) {
    return callApi('deleteCoupon', { couponId });
  },

  // === REVIEWS ===
  async addReview(data: any) {
    return callApi('addReview', data);
  },

  async getProductReviews(productId: string) {
    return callApi('getProductReviews', { productId });
  },

  async hasUserReviewed(email: string, productId: string) {
    return callApi('hasUserReviewed', { email, productId });
  },

  async hasUserPurchased(email: string, productId: string) {
    return callApi('hasUserPurchased', { email, productId });
  },

  async getAllReviews(limit = 100) {
    return callApi('getAllReviews', { limit });
  },

  // === REFERRALS ===
  async validateReferral(referralCode: string, buyerEmail: string) {
    return callApi('validateReferral', { referralCode, buyerEmail });
  },

  // === REWARDS ===
  async unlockReward(email: string, rewardId: string, rewardName: string, minOrder: number) {
    return callApi('unlockReward', { email, rewardId, rewardName, minOrder });
  },

  async clearUnlockedReward(email: string, rewardId: string) {
    return callApi('clearUnlockedReward', { email, rewardId });
  },

  // === UNBOXING ===
  async submitUnboxing(email: string, mediaUrl: string, mediaType: string, caption: string) {
    return callApi('submitUnboxing', { email, mediaUrl, mediaType, caption });
  },

  async getUnboxingStatus(email: string) {
    return callApi('getUnboxingStatus', { email });
  },

  async getUserGallery(email: string) {
    return callApi('getUserGallery', { email });
  },

  async toggleGalleryPublic(galleryId: string, isPublic: boolean) {
    return callApi('toggleGalleryPublic', { galleryId, isPublic });
  },

  async getPendingSubmissions() {
    return callApi('getPendingSubmissions', {});
  },

  async approveSubmission(submissionId: string) {
    return callApi('approveSubmission', { submissionId });
  },

  async rejectSubmission(submissionId: string) {
    return callApi('rejectSubmission', { submissionId });
  },

  async getAllSubmissions(limit = 100) {
    return callApi('getAllSubmissions', { limit });
  },

  // === ADMIN ===
  async getAllUsers(limit = 500) {
    return callApi('getAllUsers', { limit });
  },

  async getAdminStats() {
    return callApi('getAdminStats', {});
  },

  async suspendUser(email: string, reason: string) {
    return callApi('suspendUser', { email, reason });
  },

  async banUser(email: string, reason: string) {
    return callApi('banUser', { email, reason });
  },

  async promoteToAdmin(email: string) {
    return callApi('promoteToAdmin', { email });
  },

  async demoteToUser(email: string) {
    return callApi('demoteToUser', { email });
  },

  // === SEED & CLEAR DATA ===
  async seedDemoData() {
    return callApi('seedDemoData', {});
  },

  async clearAllData() {
    return callApi('clearAllData', {});
  },

  // === RAFFLE ===
  async createRaffle(data: any) {
    return callApi('createRaffle', data);
  },

  async getRaffles(limit = 50) {
    return callApi('getRaffles', { limit });
  },

  async drawRaffleWinner(raffleId: string, winners: any[]) {
    return callApi('drawRaffleWinner', { raffleId, winners });
  },

  // === CUSTOM ORDERS ===
  async getCustomOrders(limit = 100) {
    return callApi('getCustomOrders', { limit });
  },

  async updateCustomOrderStatus(orderId: string, status: string, updates?: any) {
    return callApi('updateCustomOrderStatus', { orderId, status, updates });
  },

  // === BLOG ===
  async createBlogPost(data: any) {
    return callApi('createBlogPost', data);
  },

  async getBlogPosts(limit = 50) {
    return callApi('getBlogPosts', { limit });
  },

  async updateBlogPost(postId: string, updates: any) {
    return callApi('updateBlogPost', { postId, updates });
  },

  async deleteBlogPost(postId: string) {
    return callApi('deleteBlogPost', { postId });
  },

  // === EMAIL LOGS ===
  async getEmailLogs(limit = 100) {
    return callApi('getEmailLogs', { limit });
  },

  // === ACTIVITY LOGS ===
  async getActivityLogs(limit = 100) {
    return callApi('getActivityLogs', { limit });
  },

  async logActivity(data: any) {
    return callApi('logActivity', data);
  },

  // === GIFT CARDS ===
  async createGiftCard(data: any) {
    return callApi('createGiftCard', data);
  },

  async getGiftCards(limit = 100) {
    return callApi('getGiftCards', { limit });
  },

  // === SUBSCRIBERS ===
  async getSubscribers() {
    return callApi('getSubscribers', {});
  },

  async updateSubscriber(id: string, updates: any) {
    return callApi('updateSubscriber', { id, updates });
  },

  // === HEALTH ===
  async ping() {
    return callApi('ping', {});
  },

  // === SECURE METHODS ===
  async adminLogin(password: string) {
    return callApi('adminLogin', { password });
  },

  async validateCouponSecure(code: string, email: string, orderCount?: number) {
    return callApi('validateCouponSecure', { code, email, orderCount });
  },
};

// === Image resize helper for unboxing uploads ===
export function resizeImage(file: File, maxWidth = 800, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth; }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas not supported'));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
