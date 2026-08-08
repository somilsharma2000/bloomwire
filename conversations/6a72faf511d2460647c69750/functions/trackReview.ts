// Server-side review tracking — prevents review farming for Petals
// Requires: proof of purchase (completed+paid order containing product)
export default async function trackReview(req: any) {
  const { userEmail, productId } = req.body || {};
  
  if (!userEmail || !productId) {
    return { success: false, message: "User email and product ID required" };
  }
  
  // Check if user already reviewed this product
  try {
    const existingReviews = await base44.entities.ReviewRecord.filter({ 
      userEmail, 
      productId 
    }).list();
    
    if (existingReviews && existingReviews.length > 0) {
      return { success: false, message: "You have already reviewed this product" };
    }
  } catch (e) {
    console.log("Review check failed:", e);
  }
  
  // Check if user has purchased this product (proof of purchase)
  try {
    const orders = await base44.entities.Order.filter({ userEmail }).list();
    const hasPurchased = orders && orders.some((order: any) => {
      const items = order.data?.items || order.items || [];
      return items.some((item: any) => item.slug === productId || item.productId === productId);
    });
    
    if (!hasPurchased) {
      return { success: false, message: "You can only review products you have purchased" };
    }
  } catch (e) {
    console.log("Purchase verification failed:", e);
    // In production, fail closed — don't award petals without verification
    return { success: false, message: "Unable to verify purchase" };
  }
  
  // Record the review
  try {
    await base44.entities.ReviewRecord.create({
      userEmail,
      productId,
      reviewedAt: new Date().toISOString()
    });
  } catch (e) {
    console.log("Review record failed:", e);
  }
  
  return {
    success: true,
    petalsAwarded: 10,
    message: "Review submitted! You earned 10 Petals!"
  };
}
