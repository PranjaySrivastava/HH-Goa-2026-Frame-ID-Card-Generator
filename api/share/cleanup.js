import { list, del } from "@vercel/blob";

export const config = { runtime: "nodejs" };

const MAX_AGE_MS = 48 * 60 * 60 * 1000; // 48h retention for shared graphics

export default async function handler(req, res) {
  // Only Vercel Cron (or someone holding the secret) may trigger this.
  const auth = req.headers.authorization;
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    let cursor;
    let deleted = 0;

    do {
      const { blobs, cursor: nextCursor } = await list({ prefix: "shares/", cursor, limit: 100 });
      const stale = blobs.filter((b) => Date.now() - new Date(b.uploadedAt).getTime() > MAX_AGE_MS);
      if (stale.length) {
        await del(stale.map((b) => b.url));
        deleted += stale.length;
      }
      cursor = nextCursor;
    } while (cursor);

    return res.status(200).json({ ok: true, deleted });
  } catch (err) {
    console.error("share/cleanup error:", err);
    return res.status(500).json({ error: "Cleanup failed" });
  }
}
