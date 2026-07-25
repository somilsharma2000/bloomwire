export const formatPrice = (price: number): string => {
  return `₹${price.toLocaleString('en-IN')}`
}

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const calculateDeliveryFee = (subtotal: number): number => {
  return subtotal >= 499 ? 0 : 50 // Free delivery above ₹499
}

export const calculateDiscount = (subtotal: number, coupon?: { discountType: string; discountValue: number }): number => {
  if (!coupon) {
    // Apply spin wheel discount
    if (subtotal >= 999) return Math.floor(subtotal * 0.1)
    if (subtotal >= 499) return Math.floor(subtotal * 0.05)
    return 0
  }

  if (coupon.discountType === 'percentage') {
    return Math.floor(subtotal * (coupon.discountValue / 100))
  }
  return coupon.discountValue
}

export const generateOrderId = (): string => {
  return `BW${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}

export const generateCouponCode = (): string => {
  return `BLOOM${Math.random().toString(36).substr(2, 8).toUpperCase()}`
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}
