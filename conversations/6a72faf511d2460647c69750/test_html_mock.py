import subprocess

html_content = """<!DOCTYPE html>
<html>
<head>
<style>
  body {
    background-color: #0F172A;
    color: #F8FAFC;
    font-family: system-ui, -apple-system, sans-serif;
    padding: 40px;
  }
  .card {
    background: #1E293B;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 20px;
    max-width: 500px;
  }
  .gold { color: #D4AF37; }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(212, 175, 55, 0.15);
    border: 1px solid rgba(212, 175, 55, 0.3);
    color: #E5C158;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
  }
  .nav-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #E2E8F0;
  }
  .reward-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #D4AF37, #AA7C11);
    color: #FFF;
    border-radius: 16px;
    padding: 30px;
    text-align: center;
  }
  svg { display: inline-block; vertical-align: middle; }
</style>
</head>
<body>

<h2>Bloomwire UI Context Mockup with New PetalIcon</h2>

<div class="card">
  <div class="nav-item">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2.5C8.8 7 8.5 12.5 12 21.5C15.5 12.5 15.2 7 12 2.5Z" />
      <path d="M12 21.5C7.5 19 3.5 14.5 3.5 10C3.5 6.5 6.5 5 9 6.2C10.5 7 11.5 8.5 12 10.5" />
      <path d="M12 21.5C16.5 19 20.5 14.5 20.5 10C20.5 6.5 17.5 5 15 6.2C13.5 7 12.5 8.5 12 10.5" />
      <path d="M12 21.5V13" />
    </svg>
    <span>150 Petals Balance</span>
  </div>
</div>

<div class="card">
  <div class="badge">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2.5C8.8 7 8.5 12.5 12 21.5C15.5 12.5 15.2 7 12 2.5Z" />
      <path d="M12 21.5C7.5 19 3.5 14.5 3.5 10C3.5 6.5 6.5 5 9 6.2C10.5 7 11.5 8.5 12 10.5" />
      <path d="M12 21.5C16.5 19 20.5 14.5 20.5 10C20.5 6.5 17.5 5 15 6.2C13.5 7 12.5 8.5 12 10.5" />
      <path d="M12 21.5V13" />
    </svg>
    <span>+25 Petals Earned</span>
  </div>
</div>

<div class="card" style="max-width:300px;">
  <div class="reward-hero">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2.5C8.8 7 8.5 12.5 12 21.5C15.5 12.5 15.2 7 12 2.5Z" />
      <path d="M12 21.5C7.5 19 3.5 14.5 3.5 10C3.5 6.5 6.5 5 9 6.2C10.5 7 11.5 8.5 12 10.5" />
      <path d="M12 21.5C16.5 19 20.5 14.5 20.5 10C20.5 6.5 17.5 5 15 6.2C13.5 7 12.5 8.5 12 10.5" />
      <path d="M12 21.5V13" />
    </svg>
    <h3 style="margin:8px 0 4px 0;">500 Petals</h3>
    <p style="margin:0; font-size:12px; opacity:0.9;">Gold VIP Rewards Tier</p>
  </div>
</div>

</body>
</html>
"""

with open("mock_preview.html", "w") as f:
    f.write(html_content)

print("Created mock_preview.html")
