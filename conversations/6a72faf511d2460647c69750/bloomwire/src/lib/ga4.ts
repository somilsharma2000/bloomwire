declare global { interface Window { gtag?: (...args: any[]) => void } }
export function trackEvent(n: string, p?: Record<string, any>) { if (typeof window !== 'undefined' && window.gtag) window.gtag('event', n, p || {}) }
export function trackAddToCart(name: string, price: number, qty: number = 1) { trackEvent('add_to_cart', { items: [{ name, price, quantity: qty }], value: price * qty, currency: 'INR' }) }
export function trackBeginCheckout(total: number, items: any[]) { trackEvent('begin_checkout', { value: total, currency: 'INR', items }) }
export function trackPurchase(id: string, total: number, items: any[]) { trackEvent('purchase', { transaction_id: id, value: total, currency: 'INR', items }) }
export function trackReferralClick(code: string) { trackEvent('referral_link_click', { referral_code: code }) }
