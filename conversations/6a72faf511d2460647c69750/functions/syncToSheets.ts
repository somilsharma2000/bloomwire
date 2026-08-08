// Google Sheets sync function — appends user/order data to Bloomwire Live Data Sync spreadsheet
// Uses Base44 SDK to get fresh OAuth token at runtime

import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

const SPREADSHEET_ID = "1gHguy2HEoB5LC6oIibij-RjQ8luu1Px-QmHqaYvPVDI";

Deno.serve(async (req: Request) => {
  try {
    const body = await req.json();
    const action = body.action;
    const data = body.data || {};

    const base44 = createClientFromRequest(req);
    
    // Try to get Google Sheets token from the SDK
    let token: string | null = null;
    try {
      // The SDK may expose connector tokens
      const tokenRes = await base44.connectors?.googlesheets?.getToken?.();
      if (tokenRes?.access_token) token = tokenRes.access_token;
    } catch {}
    
    // Fallback to environment variable
    if (!token) {
      token = Deno.env.get("GOOGLESHEETS_ACCESS_TOKEN") || null;
    }
    
    if (!token) {
      return Response.json({ success: false, error: "No Google Sheets token available" });
    }

    const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values`;

    if (action === "appendUser") {
      const row = [
        new Date().toISOString(),
        data.name || "",
        data.email || "",
        data.phone || "",
        data.petals_balance || 50,
        data.referral_code || "",
        data.referred_by || "",
        data.created_at || new Date().toISOString(),
        data.total_spent || 0,
        data.order_count || 0,
      ];

      const res = await fetch(`${sheetsUrl}/Users!A:J:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ values: [row] }),
      });

      if (!res.ok) {
        const err = await res.text();
        return Response.json({ success: false, error: `Sheets API error: ${err}` });
      }
      return Response.json({ success: true, data: { synced: true } });
    }

    if (action === "appendOrder") {
      const itemsStr = Array.isArray(data.items) 
        ? data.items.map((i: any) => i.name || i.title || "Item").join(", ")
        : JSON.stringify(data.items || []);
      
      const addr = data.shipping_address || data.shippingAddress || {};
      const addrStr = typeof addr === 'object' 
        ? `${addr.name || ""}, ${addr.line1 || addr.address || ""}, ${addr.city || ""} ${addr.pincode || addr.zip || ""}`
        : String(addr);

      const row = [
        new Date().toISOString(),
        data.id || "",
        data.user_email || data.userEmail || "",
        data.customerName || "",
        itemsStr,
        data.subtotal || 0,
        data.total || 0,
        data.payment_method || data.paymentMethod || "",
        data.petals_earned || data.petalsEarned || 0,
        data.status || "pending",
        data.tracking_number || data.trackingNumber || "",
        addrStr,
      ];

      const res = await fetch(`${sheetsUrl}/Orders!A:L:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ values: [row] }),
      });

      if (!res.ok) {
        const err = await res.text();
        return Response.json({ success: false, error: `Sheets API error: ${err}` });
      }
      return Response.json({ success: true, data: { synced: true } });
    }

    return Response.json({ success: false, error: "Unknown action" });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message });
  }
});
