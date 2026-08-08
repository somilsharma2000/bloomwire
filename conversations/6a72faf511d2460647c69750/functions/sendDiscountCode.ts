import type { Request, Response } from 'express';

/**
 * Generate a unique discount code, store the subscriber in Base44 + Supabase,
 * and return the code. A workflow will trigger on the new Subscriber record
 * to send the email via Gmail.
 */
export default async function sendDiscountCode(req: Request, res: Response) {
  try {
    const { email } = req.body || {};
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already subscribed
    const existing = await base44.entities.Subscriber.list({
      filter: { email: normalizedEmail }
    }).catch(() => null);

    if (existing && existing.data && existing.data.length > 0) {
      const existingCode = existing.data[0].data.discountCode;
      return res.json({
        success: true,
        code: existingCode,
        message: 'already_subscribed',
        discountPercent: 15
      });
    }

    // Generate unique code: WELCOME-XXXX (4 random alphanumeric chars)
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let suffix = '';
    for (let i = 0; i < 4; i++) {
      suffix += chars[Math.floor(Math.random() * chars.length)];
    }
    const code = `WELCOME-${suffix}`;

    // Create Subscriber record in Base44
    const subscriber = await base44.entities.Subscriber.create({
      email: normalizedEmail,
      discountCode: code,
      discountPercent: 15,
      emailed: false,
      source: 'popup'
    });

    // Also store in Supabase (fire-and-forget)
    const SUPABASE_URL = `https://kvumxwxthwfzhgxuxwzr.supabase.co/rest/v1/subscribers`;
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || '';
    
    if (SUPABASE_KEY) {
      fetch(SUPABASE_URL, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          email: normalizedEmail,
          discount_code: code,
          discount_percent: 15,
          source: 'popup'
        })
      }).catch(err => console.warn('[Supabase] Insert failed:', err.message));
    }

    return res.json({
      success: true,
      code: code,
      message: 'created',
      discountPercent: 15
    });
  } catch (error) {
    console.error('sendDiscountCode error:', error);
    return res.status(500).json({ success: false, error: 'Failed to generate discount code' });
  }
}
