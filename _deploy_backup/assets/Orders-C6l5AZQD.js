import{i as e,n as t,t as n}from"./jsx-runtime-Cltr0gcK.js";import{G as r,I as i,K as a,O as o,S as s,U as c,V as l,a as u,f as d,i as f,j as p,n as m,o as h,r as g,s as _,u as v}from"./index-Bfex48ub.js";import{t as y}from"./orderStore-B1GPq6Ko.js";var b=e(t(),1),x=n();function S(e){let t=new Date(e.createdAt).toLocaleDateString(`en-IN`,{day:`numeric`,month:`long`,year:`numeric`,hour:`2-digit`,minute:`2-digit`}),n=new Date(e.estimatedDelivery).toLocaleDateString(`en-IN`,{day:`numeric`,month:`long`,year:`numeric`});return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bloomwire Invoice - ${e.id}</title>
  <style>
    * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: #0a0a0f; color: #f3f4f6; margin: 0; padding: 32px 16px; min-height: 100vh; }
    .invoice-box { max-width: 800px; margin: 0 auto; background: #12121a; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 20px; padding: 40px; box-shadow: 0 20px 50px rgba(0,0,0,0.6); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 24px; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
    .brand { font-family: Georgia, serif; font-size: 32px; font-weight: 700; color: #ff4081; letter-spacing: -0.5px; }
    .tagline { color: #9ca3af; font-size: 13px; margin-top: 4px; }
    .invoice-details { text-align: right; }
    .invoice-details h2 { margin: 0; font-size: 24px; color: #f5c563; font-weight: 700; }
    .invoice-details p { margin: 4px 0 0; font-size: 13px; color: #9ca3af; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 32px; }
    .info-card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; }
    .info-card h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #ff4081; margin: 0 0 12px 0; font-weight: 700; }
    .info-card p { margin: 4px 0; font-size: 14px; color: #d1d5db; line-height: 1.5; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
    th { text-align: left; padding: 14px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.15); font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; }
    td { padding: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); font-size: 14px; color: #e5e7eb; }
    .item-cell { display: flex; align-items: center; gap: 12px; }
    .item-img { width: 44px; height: 44px; border-radius: 8px; object-fit: cover; border: 1px solid rgba(255,255,255,0.1); }
    .totals-container { display: flex; justify-content: flex-end; margin-bottom: 32px; }
    .totals-table { width: 320px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; }
    .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #9ca3af; }
    .totals-row.grand-total { border-top: 1px solid rgba(255, 255, 255, 0.15); padding-top: 12px; margin-top: 8px; font-size: 18px; font-weight: 700; color: #ffffff; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: capitalize; }
    .status-processing { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
    .status-shipped { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
    .status-out-for-delivery { background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); }
    .status-delivered { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .status-cancelled { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
    .footer { text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 24px; font-size: 13px; color: #6b7280; }
    @media print {
      body { background: #ffffff; color: #111827; padding: 0; }
      .invoice-box { background: #ffffff; border: none; box-shadow: none; color: #111827; }
      .info-card, .totals-table { background: #f9fafb; border-color: #e5e7eb; }
      th, td { border-color: #e5e7eb; color: #111827; }
      .brand { color: #e91e63; }
      .totals-row.grand-total { color: #111827; border-color: #d1d5db; }
    }
  </style>
</head>
<body>
  <div class="invoice-box">
    <div class="header">
      <div>
        <div class="brand">Bloomwire</div>
        <div class="tagline">Handcrafted Chenille Floral Art</div>
      </div>
      <div class="invoice-details">
        <h2>TAX INVOICE</h2>
        <p>Invoice #: <strong>${e.id}</strong></p>
        <p>Order Date: ${t}</p>
        <p style="margin-top: 6px;">
          <span class="badge status-${e.status.toLowerCase().replace(/\s+/g,`-`)}">${e.status}</span>
        </p>
      </div>
    </div>

    <div class="grid">
      <div class="info-card">
        <h3>Shipping Address</h3>
        <p><strong>${e.shippingAddress.name||`Customer`}</strong></p>
        <p>${e.shippingAddress.address}</p>
        <p>${e.shippingAddress.city}, ${e.shippingAddress.state} - ${e.shippingAddress.pincode}</p>
        <p>Phone: ${e.shippingAddress.phone}</p>
        <p>Email: ${e.shippingAddress.email}</p>
      </div>

      <div class="info-card">
        <h3>Order Details</h3>
        <p><strong>Payment Method:</strong> ${e.paymentMethod.toUpperCase()}</p>
        <p><strong>Delivery Option:</strong> ${e.deliveryTier.toUpperCase()} (${e.deliveryCost===0?`FREE`:`₹`+e.deliveryCost})</p>
        <p><strong>Est. Delivery:</strong> ${n}</p>
        ${e.trackingNumber?`<p><strong>Tracking Number:</strong> <code style="color:#ff4081">${e.trackingNumber}</code></p>`:``}
        <p><strong>Petals Earned:</strong> <span style="color:#f5c563">+${e.petalsEarned} Petals</span></p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Item Description</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Unit Price</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${e.items.map(e=>`
          <tr>
            <td>
              <div class="item-cell">
                <img src="${e.image}" alt="${e.name}" class="item-img" />
                <div>
                  <strong>${e.name}</strong>
                </div>
              </div>
            </td>
            <td style="text-align: center;">${e.qty}</td>
            <td style="text-align: right;">₹${e.price}</td>
            <td style="text-align: right;"><strong>₹${e.price*e.qty}</strong></td>
          </tr>
        `).join(``)}
      </tbody>
    </table>

    <div class="totals-container">
      <div class="totals-table">
        <div class="totals-row">
          <span>Items Subtotal</span>
          <span>₹${e.subtotal}</span>
        </div>
        <div class="totals-row">
          <span>Shipping Fee</span>
          <span>${e.shipping===0?`FREE`:`₹`+e.shipping}</span>
        </div>
        ${e.giftWrap?`
        <div class="totals-row">
          <span>Gift Wrap & Handwritten Note</span>
          <span>₹${e.giftWrapFee}</span>
        </div>`:``}
        ${e.deliveryCost>0?`
        <div class="totals-row">
          <span>Delivery Option (${e.deliveryTier.toUpperCase()})</span>
          <span>₹${e.deliveryCost}</span>
        </div>`:``}
        <div class="totals-row grand-total">
          <span>Total Paid</span>
          <span style="color: #ff4081;">₹${e.total}</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>Thank you for choosing Bloomwire! Each stem is lovingly handcrafted to bloom for years with proper care.</p>
      <p style="margin-top: 4px;">Need assistance? Contact support at <strong>orders@bloomwire.in</strong></p>
    </div>
  </div>
</body>
</html>`}var C=[{key:`Processing`,label:`Processing`,sublabel:`Order Confirmed & Prepared`,description:`Your handcrafted stems are being artfully arranged in our floral studio.`,icon:v},{key:`Shipped`,label:`Shipped`,sublabel:`In Transit with Express Courier`,description:`Package dispatched and secured with protective velvet wrapping.`,icon:d},{key:`Out for Delivery`,label:`Out for Delivery`,sublabel:`Arriving Today`,description:`Our delivery agent is nearby and en route to your shipping address.`,icon:i},{key:`Delivered`,label:`Delivered`,sublabel:`Handed Over with Love`,description:`Order delivered successfully. Enjoy your long-lasting blooms!`,icon:f}],w=e=>{switch(e){case`Processing`:return 0;case`Shipped`:return 1;case`Out for Delivery`:return 2;case`Delivered`:return 3;case`Cancelled`:return-1;default:return 0}};function T(){let e=c(e=>e.user),t=y(e=>e.getUserOrders),n=y(e=>e.orders),v=y(e=>e.cancelOrder),T=c(e=>e.addPetals),E=y(e=>e.createOrder),D=r(e=>e.addItem),O=l(e=>e.showToast),[k,A]=(0,b.useState)({}),[j,M]=(0,b.useState)(null),[N,P]=(0,b.useState)(``),[F,I]=(0,b.useState)(`All`),L=(0,b.useMemo)(()=>e?.email?t(e.email):n,[e?.email,t,n]),R=(0,b.useMemo)(()=>L.filter(e=>{let t=F===`All`||e.status===F,n=N.toLowerCase().trim(),r=!n||e.id.toLowerCase().includes(n)||e.trackingNumber&&e.trackingNumber.toLowerCase().includes(n)||e.items.some(e=>e.name.toLowerCase().includes(n));return t&&r}),[L,F,N]),z=e=>{A(t=>({...t,[e]:!t[e]}))},B=e=>{navigator.clipboard.writeText(e),M(e),O(`Tracking number copied to clipboard`,`info`),setTimeout(()=>M(null),2500)},V=e=>{e.items.forEach(e=>{D({slug:e.slug,name:e.name,price:e.price,image:e.image,qty:e.qty})}),O(`Added ${e.items.length} item${e.items.length>1?`s`:``} to collection!`,`cart`)},H=e=>{let t=v(e);t>0&&(T(-t),O(`Order cancelled. ${t} Petals reversed.`,`info`)),O(`Order #${e} has been cancelled`,`info`)},U=e=>{try{let t=S(e),n=new Blob([t],{type:`text/html;charset=utf-8`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=`Bloomwire_Invoice_${e.id}.html`,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(r),O(`Invoice #${e.id} downloaded!`,`success`)}catch{O(`Failed to download invoice`,`error`)}},W=()=>{let t=e?.email||`customer@bloomwire.in`,n=e?.name||`Bloomwire Customer`,r=E({userEmail:t,items:[{slug:`scarlet-rose-bouquet`,name:`Scarlet Rose Bouquet`,price:1299,image:`https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=600`,qty:1},{slug:`lavender-bliss-stem`,name:`Lavender Bliss Stem`,price:499,image:`https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=600`,qty:2}],subtotal:2297,shipping:0,giftWrap:!0,giftWrapFee:49,deliveryTier:`express`,deliveryCost:99,total:2445,petalsEarned:115,paymentMethod:`UPI`,shippingAddress:{name:n,email:t,phone:`+91 94140 27836`,address:`742 Evergreen Terrace, Sector 15`,city:`Bengaluru`,state:`Karnataka`,pincode:`560001`}});O(`Sample order #${r} created!`,`success`)},G=e=>{switch(e){case`Processing`:return(0,x.jsxs)(`span`,{className:`px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 shadow-sm`,children:[(0,x.jsx)(`span`,{className:`w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping`}),`Processing`]});case`Shipped`:return(0,x.jsxs)(`span`,{className:`px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 shadow-sm`,children:[(0,x.jsx)(i,{size:12}),`Shipped`]});case`Out for Delivery`:return(0,x.jsxs)(`span`,{className:`px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 shadow-sm`,children:[(0,x.jsx)(p,{size:12}),`Out for Delivery`]});case`Delivered`:return(0,x.jsxs)(`span`,{className:`px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 shadow-sm`,children:[(0,x.jsx)(f,{size:12}),`Delivered`]});case`Cancelled`:return(0,x.jsx)(`span`,{className:`px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 shadow-sm`,children:`Cancelled`})}};return L.length===0?(0,x.jsxs)(`div`,{className:`max-w-4xl mx-auto px-4 py-20 text-center relative z-10 animate-fade-up`,children:[(0,x.jsx)(`div`,{className:`w-24 h-24 rounded-3xl bg-gradient-to-br from-bloom-rose/20 to-bloom-wine/10 border border-bloom-rose/30 flex items-center justify-center mx-auto mb-6 neon-glow`,children:(0,x.jsx)(d,{size:48,className:`text-bloom-neon animate-float-soft`})}),(0,x.jsx)(`h1`,{className:`text-3xl sm:text-4xl font-serif font-bold mb-3 text-white`,children:`No Orders Yet`}),(0,x.jsx)(`p`,{className:`text-gray-400 mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed`,children:`You haven't placed any orders yet. Discover our handcrafted lasting flowers and start creating long-lasting floral memories today.`}),(0,x.jsxs)(`div`,{className:`flex flex-col sm:flex-row items-center justify-center gap-4`,children:[(0,x.jsxs)(a,{to:`/shop`,className:`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-full font-medium shimmer-btn neon-glow hover:scale-105 transition`,children:[`Start Shopping `,(0,x.jsx)(m,{size:18})]}),(0,x.jsxs)(`button`,{onClick:W,className:`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 glass text-gray-300 hover:text-white rounded-full font-medium border border-white/10 hover:border-bloom-rose/40 transition text-sm`,children:[(0,x.jsx)(p,{size:16,className:`text-bloom-gold`}),`Create Demo Order`]})]})]}):(0,x.jsxs)(`div`,{className:`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10`,children:[(0,x.jsxs)(`div`,{className:`flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-6`,children:[(0,x.jsxs)(`div`,{children:[(0,x.jsxs)(`div`,{className:`flex items-center gap-3 mb-2`,children:[(0,x.jsx)(`div`,{className:`p-2.5 rounded-2xl bg-bloom-rose/10 border border-bloom-rose/20 text-bloom-neon`,children:(0,x.jsx)(i,{size:24})}),(0,x.jsx)(`h1`,{className:`text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight`,children:`Your Orders`}),(0,x.jsxs)(`span`,{className:`px-3 py-1 bg-bloom-rose/20 text-bloom-neon border border-bloom-rose/40 text-xs font-bold rounded-full`,children:[L.length,` `,L.length===1?`Order`:`Orders`]})]}),(0,x.jsx)(`p`,{className:`text-sm text-gray-400`,children:`Track deliveries, reorder your favorite stems, or download tax invoices.`})]}),(0,x.jsxs)(`div`,{className:`relative w-full md:w-72`,children:[(0,x.jsx)(o,{size:18,className:`absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400`}),(0,x.jsx)(`input`,{type:`text`,value:N,onChange:e=>P(e.target.value),placeholder:`Search by ID, product, or tracking...`,className:`w-full pl-10 pr-4 py-2.5 bg-bloom-darker/80 border border-white/10 rounded-full text-sm text-white placeholder-gray-500 focus:outline-none focus:border-bloom-rose/60 focus:ring-1 focus:ring-bloom-rose/60 transition`})]})]}),(0,x.jsx)(`div`,{className:`flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none`,children:[`All`,`Processing`,`Shipped`,`Out for Delivery`,`Delivered`,`Cancelled`].map(e=>{let t=e===`All`?L.length:L.filter(t=>t.status===e).length,n=F===e;return(0,x.jsxs)(`button`,{onClick:()=>I(e),className:`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition flex items-center gap-2 border ${n?`bg-gradient-to-r from-bloom-rose to-bloom-wine text-white border-bloom-rose/60 neon-glow`:`glass text-gray-400 hover:text-white border-white/5 hover:border-white/20`}`,children:[e,(0,x.jsx)(`span`,{className:`px-1.5 py-0.5 rounded-full text-[10px] ${n?`bg-white/20 text-white`:`bg-white/5 text-gray-400`}`,children:t})]},e)})}),R.length===0?(0,x.jsxs)(`div`,{className:`glass rounded-2xl p-6 sm:p-12 text-center border border-white/10 my-8`,children:[(0,x.jsx)(_,{size:36,className:`text-gray-500 mx-auto mb-3`}),(0,x.jsx)(`h3`,{className:`text-lg font-serif font-bold text-white mb-1`,children:`No Matching Orders`}),(0,x.jsx)(`p`,{className:`text-sm text-gray-400 mb-4`,children:`No orders found matching your search query or filter.`}),(0,x.jsx)(`button`,{onClick:()=>{P(``),I(`All`)},className:`text-xs text-bloom-neon hover:underline font-medium`,children:`Clear filters`})]}):(0,x.jsx)(`div`,{className:`space-y-6`,children:R.map(e=>{let t=!!k[e.id],n=w(e.status),r=new Date(e.createdAt).toLocaleDateString(`en-IN`,{day:`numeric`,month:`short`,year:`numeric`}),a=new Date(e.estimatedDelivery).toLocaleDateString(`en-IN`,{day:`numeric`,month:`short`,year:`numeric`});return(0,x.jsxs)(`div`,{className:`glass-strong rounded-2xl border border-white/10 hover:border-bloom-rose/30 transition-all duration-300 overflow-hidden`,children:[(0,x.jsxs)(`div`,{className:`p-5 bg-white/[0.02] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4`,children:[(0,x.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3`,children:[(0,x.jsxs)(`span`,{className:`font-mono text-xs font-semibold text-bloom-neon tracking-wider bg-bloom-rose/10 px-2.5 py-1 rounded-md border border-bloom-rose/20`,children:[`#`,e.id]}),(0,x.jsxs)(`span`,{className:`text-xs text-gray-400 flex items-center gap-1`,children:[(0,x.jsx)(_,{size:12}),` Placed on `,r]}),e.trackingNumber&&(0,x.jsx)(`button`,{onClick:()=>B(e.trackingNumber),className:`text-xs font-mono text-gray-400 hover:text-white glass px-2 py-0.5 rounded border border-white/10 flex items-center gap-1 transition`,title:`Click to copy tracking number`,children:j===e.trackingNumber?(0,x.jsxs)(`span`,{className:`text-emerald-400 flex items-center gap-1 font-sans`,children:[(0,x.jsx)(u,{size:12}),` Copied`]}):(0,x.jsxs)(x.Fragment,{children:[`TRK: `,e.trackingNumber]})})]}),(0,x.jsxs)(`div`,{className:`flex items-center gap-3`,children:[G(e.status),(0,x.jsxs)(`span`,{className:`text-xs text-gray-400 border-l border-white/10 pl-3`,children:[`Est. Delivery:`,` `,(0,x.jsx)(`strong`,{className:`text-white font-medium`,children:a})]})]})]}),(0,x.jsx)(`div`,{className:`p-5 sm:p-6 border-b border-white/5`,children:(0,x.jsxs)(`div`,{className:`grid grid-cols-1 lg:grid-cols-12 gap-6 items-center`,children:[(0,x.jsxs)(`div`,{className:`lg:col-span-8 space-y-3`,children:[(0,x.jsxs)(`p`,{className:`text-xs text-gray-400 font-medium uppercase tracking-wider mb-2`,children:[`Ordered Items (`,e.items.reduce((e,t)=>e+t.qty,0),`)`]}),(0,x.jsx)(`div`,{className:`flex flex-wrap gap-3`,children:e.items.map((e,t)=>(0,x.jsxs)(`div`,{className:`flex items-center gap-3 p-2.5 glass rounded-xl border border-white/5 hover:border-white/20 transition min-w-[220px] flex-1 sm:flex-initial`,children:[(0,x.jsx)(`img`,{src:e.image,alt:e.name,className:`w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg border border-white/10 flex-shrink-0`}),(0,x.jsxs)(`div`,{className:`min-w-0 pr-2`,children:[(0,x.jsx)(`h4`,{className:`text-xs sm:text-sm font-medium text-white truncate max-w-[160px]`,children:e.name}),(0,x.jsxs)(`p`,{className:`text-xs text-gray-400 mt-0.5`,children:[`Qty: `,(0,x.jsx)(`strong`,{className:`text-white`,children:e.qty}),` × ₹`,e.price]})]})]},t))})]}),(0,x.jsxs)(`div`,{className:`lg:col-span-4 glass rounded-xl p-4 border border-white/5 flex flex-col justify-between h-full`,children:[(0,x.jsxs)(`div`,{className:`space-y-1.5 text-xs text-gray-400 mb-3`,children:[(0,x.jsxs)(`div`,{className:`flex justify-between`,children:[(0,x.jsx)(`span`,{children:`Subtotal:`}),(0,x.jsxs)(`span`,{className:`text-gray-200`,children:[`₹`,e.subtotal]})]}),(0,x.jsxs)(`div`,{className:`flex justify-between`,children:[(0,x.jsx)(`span`,{children:`Delivery Tier:`}),(0,x.jsx)(`span`,{className:`text-gray-200 capitalize`,children:e.deliveryTier})]}),(0,x.jsxs)(`div`,{className:`flex justify-between`,children:[(0,x.jsx)(`span`,{children:`Payment Method:`}),(0,x.jsx)(`span`,{className:`text-gray-200 uppercase`,children:e.paymentMethod})]}),e.giftWrap&&(0,x.jsxs)(`div`,{className:`flex justify-between text-bloom-rose`,children:[(0,x.jsx)(`span`,{children:`Gift Wrap Fee:`}),(0,x.jsxs)(`span`,{children:[`₹`,e.giftWrapFee]})]})]}),(0,x.jsxs)(`div`,{className:`pt-2 border-t border-white/10 flex justify-between items-center`,children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`span`,{className:`text-xs text-gray-400 block`,children:`Total Amount`}),(0,x.jsxs)(`span`,{className:`text-lg font-bold text-white`,children:[`₹`,e.total]})]}),e.petalsEarned>0&&(0,x.jsxs)(`div`,{className:`px-2.5 py-1 bg-bloom-gold/10 text-bloom-gold border border-bloom-gold/30 rounded-full text-[11px] font-semibold flex items-center gap-1`,children:[(0,x.jsx)(s,{size:12}),` +`,e.petalsEarned,` Petals`]})]})]})]})}),t&&(0,x.jsxs)(`div`,{className:`p-6 bg-bloom-darker/60 border-b border-white/10 animate-fade-down`,children:[(0,x.jsxs)(`div`,{className:`flex items-center justify-between mb-6`,children:[(0,x.jsxs)(`h3`,{className:`text-base font-serif font-bold text-white flex items-center gap-2`,children:[(0,x.jsx)(i,{size:18,className:`text-bloom-neon`}),` Live Order Tracking`]}),e.trackingNumber&&(0,x.jsxs)(`span`,{className:`text-xs text-gray-400`,children:[`Carrier Tracking ID:`,` `,(0,x.jsx)(`code`,{className:`text-bloom-gold font-mono`,children:e.trackingNumber})]})]}),e.status===`Cancelled`?(0,x.jsxs)(`div`,{className:`p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center`,children:[(0,x.jsx)(`p`,{className:`text-sm text-red-400 font-medium mb-1`,children:`This order was cancelled.`}),(0,x.jsx)(`p`,{className:`text-xs text-gray-400`,children:`If you have any questions regarding refunds or re-ordering, please reach out to orders@bloomwire.in.`})]}):(0,x.jsx)(`div`,{className:`relative py-2`,children:(0,x.jsx)(`div`,{className:`grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10`,children:C.map((e,t)=>{let r=t<n,i=t===n,a=e.icon;return(0,x.jsxs)(`div`,{className:`flex flex-col p-4 rounded-xl border transition-all ${i?`bg-bloom-rose/10 border-bloom-rose/50 neon-border`:r?`glass border-emerald-500/30`:`bg-white/[0.02] border-white/5 opacity-60`}`,children:[(0,x.jsxs)(`div`,{className:`flex items-center gap-3 mb-3`,children:[(0,x.jsx)(`div`,{className:`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${r?`bg-emerald-500 text-white`:i?`bg-gradient-to-r from-bloom-rose to-bloom-wine text-white animate-pulse`:`bg-white/10 text-gray-500`}`,children:r?(0,x.jsx)(u,{size:16}):(0,x.jsx)(a,{size:16})}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`h4`,{className:`text-xs font-bold uppercase tracking-wider ${i?`text-bloom-neon`:r?`text-emerald-400`:`text-gray-400`}`,children:e.label}),(0,x.jsx)(`span`,{className:`text-[10px] text-gray-400 block`,children:r?`Completed`:i?`Current Status`:`Pending`})]})]}),(0,x.jsx)(`p`,{className:`text-xs text-gray-300 font-medium mb-1`,children:e.sublabel}),(0,x.jsx)(`p`,{className:`text-[11px] text-gray-400 leading-snug`,children:e.description})]},e.key)})})})]}),(0,x.jsxs)(`div`,{className:`p-4 bg-white/[0.02] flex flex-wrap items-center justify-between gap-3`,children:[(0,x.jsxs)(`button`,{onClick:()=>z(e.id),className:`px-4 py-2 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${t?`bg-bloom-rose text-white shadow-md`:`glass text-gray-300 hover:text-white hover:border-bloom-rose/30`}`,children:[(0,x.jsx)(i,{size:14}),t?`Hide Tracking`:`Track Order`,(0,x.jsx)(h,{size:14,className:`transition-transform duration-200 ${t?`rotate-180`:``}`})]}),(0,x.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[(0,x.jsxs)(`button`,{onClick:()=>V(e),className:`px-4 py-2 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white text-xs font-medium rounded-full shimmer-btn hover:scale-105 transition flex items-center gap-1.5 shadow-sm`,children:[(0,x.jsx)(g,{size:14}),` Buy Again`]}),(0,x.jsxs)(`button`,{onClick:()=>U(e),className:`px-4 py-2 glass text-gray-300 hover:text-white text-xs font-medium rounded-full hover:border-white/20 transition flex items-center gap-1.5`,children:[(0,x.jsx)(d,{size:14,className:`text-bloom-gold`}),` Download Invoice`]}),e.status===`Processing`&&(0,x.jsx)(`button`,{onClick:()=>H(e.id),className:`px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 text-xs font-medium rounded-full transition`,children:`Cancel Order`})]})]})]},e.id)})}),(0,x.jsx)(`div`,{className:`mt-12 text-center`,children:(0,x.jsxs)(a,{to:`/shop`,className:`inline-flex items-center gap-2 px-6 py-3 glass text-gray-300 hover:text-white rounded-full text-sm font-medium hover:bg-white/10 transition`,children:[(0,x.jsx)(s,{size:16,className:`text-bloom-rose`}),` Browse More Collections`]})})]})}export{T as default};