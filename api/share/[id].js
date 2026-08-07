import { list } from "@vercel/blob";

export const config = { runtime: "nodejs" };

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id || Array.isArray(id) || !/^[a-zA-Z0-9_-]{6,32}$/.test(id)) {
    res.statusCode = 404;
    return res.end("Not found");
  }

  try {
    const { blobs } = await list({ prefix: `shares/${id}.json`, limit: 1 });
    const metaBlob = blobs[0];

    if (!metaBlob) {
      // Expired or never existed — send humans back to the generator.
      res.writeHead(302, { Location: "/" });
      return res.end();
    }

    const meta = await fetch(metaBlob.url).then((r) => r.json());

    const title = meta.mode === "pfp" ? "My HH Goa 2026 PFP Frame" : "My HH Goa 2026 Builder ID";
    const description = meta.caption || "Made with the HH Goa 2026 frame generator.";
    const pageUrl = `https://${req.headers.host}/s/${id}`;
    const [imgW, imgH] = meta.mode === "pfp" ? [1080, 1080] : [1200, 675];

    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}" />

<meta property="og:type" content="website" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:image" content="${meta.imageUrl}" />
<meta property="og:image:width" content="${imgW}" />
<meta property="og:image:height" content="${imgH}" />
<meta property="og:url" content="${pageUrl}" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${meta.imageUrl}" />

<style>
  body { margin:0; min-height:100vh; display:flex; flex-direction:column; align-items:center;
         justify-content:center; gap:20px; background:#0b0f14; color:#f4ead1;
         font-family:system-ui,-apple-system,sans-serif; padding:24px; text-align:center; }
  img { max-width:min(90vw,480px); width:100%; border-radius:16px;
        box-shadow:0 20px 60px -20px rgba(0,0,0,0.6); }
  a.cta { background:linear-gradient(135deg,#ffc857,#ffe0a3); color:#0b0f14; font-weight:700;
          padding:12px 22px; border-radius:11px; text-decoration:none; }
</style>
</head>
<body>
  <img src="${meta.imageUrl}" alt="${escapeHtml(title)}" />
  <p>${escapeHtml(description)}</p>
  <a class="cta" href="/">Make your own — HH Goa 2026</a>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    // Short edge cache: keeps repeat crawler hits cheap without staling too long.
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=3600");
    return res.status(200).send(html);
  } catch (err) {
    console.error("share/[id] error:", err);
    res.statusCode = 500;
    return res.end("Something went wrong");
  }
}
