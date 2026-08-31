export const DEMO_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Demo Layout</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:-apple-system,system-ui,sans-serif; background:#f7f8fa; color:#1a1d27; }
  .hero { background:linear-gradient(135deg,#4f8cff,#7c5cff); color:#fff; padding:48px 24px 32px; text-align:center; }
  .hero h1 { font-size:26px; font-weight:800; letter-spacing:-0.5px; margin-bottom:8px; }
  .hero p { font-size:14px; opacity:0.9; line-height:1.5; }
  .card { background:#fff; border-radius:16px; margin:16px; padding:20px; box-shadow:0 2px 12px rgba(0,0,0,0.06); }
  .card h2 { font-size:16px; font-weight:700; margin-bottom:10px; }
  .card p { font-size:13px; line-height:1.6; color:#5b6478; }
  .placeholder { width:100%; height:140px; border-radius:12px; background:#e8ecf4; display:flex; align-items:center; justify-content:center; color:#8b93a8; font-size:12px; margin-bottom:12px; }
  .date-output { font-size:13px; font-weight:600; color:#4f8cff; }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:0 16px 24px; }
  .tile { background:#fff; border-radius:14px; padding:16px; text-align:center; box-shadow:0 2px 8px rgba(0,0,0,0.05); }
  .tile .num { font-size:24px; font-weight:800; color:#4f8cff; }
  .tile .label { font-size:11px; color:#8b93a8; margin-top:4px; }
  .cta { display:block; margin:8px 16px 24px; text-align:center; background:#4f8cff; color:#fff; border-radius:12px; padding:14px; font-size:14px; font-weight:700; text-decoration:none; }
</style>
</head>
<body>
  <section class="hero">
    <h1>Welcome Home</h1>
    <p>Your front-end layout testing sandbox. Load your own file to begin.</p>
  </section>
  <div class="card">
    <div class="placeholder">placeholder image</div>
    <h2>Featured Story</h2>
    <p>This is sample content. Use the Text Mutator to swap words, or the Asset Overwriter to replace the placeholder image above.</p>
    <p class="date-output">Date will appear here</p>
  </div>
  <div class="grid">
    <div class="tile"><div class="num">128</div><div class="label">Sessions</div></div>
    <div class="tile"><div class="num">42</div><div class="label">Events</div></div>
    <div class="tile"><div class="num">7</div><div class="label">Active</div></div>
    <div class="tile"><div class="num">99%</div><div class="label">Uptime</div></div>
  </div>
  <a class="cta" href="#">Get Started</a>
</body>
</html>`;
