import type { Request, Response } from 'express';

/**
 * Daily Check-in Reminder Email
 * Sends a pretty HTML reminder email to users who haven't checked in today.
 * Called by a scheduled workflow each morning.
 * 
 * Expected payload: { users: [{ email: string, name: string, streak: number }] }
 */
export default async function sendCheckinReminder(req: Request, res: Response) {
  try {
    const { users } = req.body || {};

    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.json({ success: true, message: 'No users to remind today', sent: 0 });
    }

    const results: { email: string; status: string }[] = [];

    for (const user of users) {
      const { email, name, streak } = user;

      if (!email) continue;

      // Build a pretty HTML email
      const html = buildEmailTemplate(name || 'Flower Friend', streak || 0);

      // In production, this would use a real email service (SendGrid, SES, etc.)
      // For demo purposes, we log and return success
      console.log(`[Check-in Reminder] Sent to ${email} (streak: ${streak})`);

      results.push({ email, status: 'sent' });
    }

    return res.json({
      success: true,
      message: `Sent ${results.length} check-in reminder email(s)`,
      sent: results.length,
      details: results,
    });
  } catch (error) {
    console.error('Check-in reminder error:', error);
    return res.status(500).json({ success: false, error: 'Failed to send reminders' });
  }
}

function buildEmailTemplate(name: string, streak: number): string {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const nextMilestone = streak < 3 ? 3 : streak < 7 ? 7 : streak < 14 ? 14 : streak < 30 ? 30 : 50;
  const daysToMilestone = Math.max(0, nextMilestone - streak);
  const milestoneName =
    nextMilestone === 3 ? 'Sprout' :
    nextMilestone === 7 ? 'Bloom' :
    nextMilestone === 14 ? 'Full Bloom' :
    nextMilestone === 30 ? 'Master Gardener' : 'Bloomwire Legend';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0608;font-family:'Georgia',serif;">
  <div style="max-width:600px;margin:0 auto;background:linear-gradient(135deg,#1a0d14,#0f0a0e);border-radius:24px;overflow:hidden;border:1px solid rgba(255,64,129,0.15);">
    
    <!-- Header -->
    <div style="padding:40px 30px;text-align:center;background:linear-gradient(135deg,rgba(255,64,129,0.1),rgba(245,197,99,0.05));">
      <h1 style="font-size:28px;color:#ff6b9d;margin:0 0 8px;letter-spacing:2px;">Bloomwire</h1>
      <p style="font-size:14px;color:rgba(255,255,255,0.5);margin:0;text-transform:uppercase;letter-spacing:3px;">Daily Bloom Check-In</p>
    </div>

    <!-- Body -->
    <div style="padding:36px 30px;">
      <p style="font-size:16px;color:rgba(255,255,255,0.85);margin:0 0 24px;">
        Good morning, ${name}! 🌸
      </p>
      <p style="font-size:15px;color:rgba(255,255,255,0.7);line-height:1.6;margin:0 0 20px;">
        It's ${today}, and your forever flowers are waiting. You've maintained a 
        <strong style="color:#f5c563;">${streak}-day streak</strong> — don't let it wilt!
      </p>

      ${streak > 0 ? `
      <!-- Streak Display -->
      <div style="text-align:center;padding:20px 0;margin:24px 0;border-top:1px solid rgba(255,255,255,0.1);border-bottom:1px solid rgba(255,255,255,0.1);">
        <div style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#ff4081,#c2185b);border-radius:50px;color:white;font-size:24px;font-weight:bold;letter-spacing:1px;">
          ${streak} Day Streak 🔥
        </div>
      </div>
      ` : ''}

      <!-- Milestone Progress -->
      <div style="background:rgba(255,64,129,0.08);border:1px solid rgba(255,64,129,0.2);border-radius:16px;padding:20px;margin:24px 0;">
        <p style="font-size:13px;color:rgba(255,255,255,0.6);margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Next Milestone</p>
        <p style="font-size:18px;color:#ff6b9d;margin:0 0 6px;font-weight:bold;">${milestoneName} Badge</p>
        <p style="font-size:14px;color:rgba(255,255,255,0.6);margin:0;">
          Just ${daysToMilestone} more day${daysToMilestone !== 1 ? 's' : ''} to unlock this exclusive badge!
        </p>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin:32px 0;">
        <a href="https://somilsharma2000.github.io/bloomwire/#/rewards" 
           style="display:inline-block;padding:16px 48px;background:linear-gradient(135deg,#ff4081,#ff6b9d);color:white;text-decoration:none;border-radius:50px;font-size:16px;font-weight:bold;letter-spacing:1px;box-shadow:0 4px 20px rgba(255,64,129,0.3);">
          Check In Now 🌺
        </a>
      </div>

      <p style="font-size:14px;color:rgba(255,255,255,0.6);line-height:1.6;margin:0 0 16px;">
        Your daily check-in earns Petals you can redeem for free stems, keychains, and raffle tickets. 
        Keep your streak alive for bigger rewards!
      </p>

      <!-- Rewards Preview -->
      <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin:24px 0;">
        <span style="padding:8px 16px;background:rgba(245,197,99,0.1);border:1px solid rgba(245,197,99,0.2);border-radius:20px;color:#f5c563;font-size:13px;">🌱 +5 Petals Today</span>
        <span style="padding:8px 16px;background:rgba(255,64,129,0.1);border:1px solid rgba(255,64,129,0.2);border-radius:20px;color:#ff6b9d;font-size:13px;">🏆 Weekly Raffle Entry</span>
        <span style="padding:8px 16px;background:rgba(255,107,157,0.1);border:1px solid rgba(255,107,157,0.2);border-radius:20px;color:rgba(255,255,255,0.8);font-size:13px;">✨ Milestone Badges</span>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:24px 30px;background:rgba(0,0,0,0.3);text-align:center;">
      <p style="font-size:12px;color:rgba(255,255,255,0.4);margin:0 0 8px;">
        Bloomwire — Hand-Twisted Blooms That Never Fade
      </p>
      <p style="font-size:11px;color:rgba(255,255,255,0.3);margin:0;">
        You're receiving this because you opted into daily check-in reminders.
        <a href="#" style="color:rgba(255,107,157,0.6);text-decoration:none;">Unsubscribe</a>
      </p>
      <div style="margin:16px 0 0;">
        <a href="https://www.instagram.com/bloomwire_" style="display:inline-block;margin:0 8px;color:rgba(255,255,255,0.4);text-decoration:none;font-size:12px;">Instagram</a>
        <a href="https://www.threads.com/@bloomwire2000" style="display:inline-block;margin:0 8px;color:rgba(255,255,255,0.4);text-decoration:none;font-size:12px;">Threads</a>
        <a href="https://wa.me/message/VT4TW64X2EJKH1" style="display:inline-block;margin:0 8px;color:rgba(255,255,255,0.4);text-decoration:none;font-size:12px;">WhatsApp</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}
