import { put } from "@vercel/blob";
import { nanoid } from "nanoid";

export const config = { runtime: "nodejs" };

const MAX_BYTES = 6 * 1024 * 1024; // safety cap, well above a 1080x1080 PNG

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { image, mode, caption } = req.body ?? {};

    if (!image || typeof image !== "string" || !image.startsWith("data:image/png;base64,")) {
      return res.status(400).json({ error: "Expected a base64 PNG data URL in `image`." });
    }
    if (!["pfp", "card"].includes(mode)) {
      return res.status(400).json({ error: "`mode` must be 'pfp' or 'card'." });
    }

    const base64 = image.slice("data:image/png;base64,".length);
    const buffer = Buffer.from(base64, "base64");

    if (buffer.byteLength > MAX_BYTES) {
      return res.status(413).json({ error: "Image too large." });
    }

    const id = nanoid(10);

    // The image itself.
    const imageBlob = await put(`shares/${id}.png`, buffer, {
      access: "public",
      contentType: "image/png",
      addRandomSuffix: false
    });

    // A tiny metadata sidecar so /api/share/[id] can render OG tags
    // without re-deriving anything from the PNG.
    const meta = {
      mode,
      caption: typeof caption === "string" ? caption.slice(0, 280) : "",
      imageUrl: imageBlob.url,
      createdAt: Date.now()
    };

    await put(`shares/${id}.json`, JSON.stringify(meta), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false
    });

    const origin = `https://${req.headers.host}`;
    return res.status(200).json({
      id,
      shareUrl: `${origin}/s/${id}`,
      imageUrl: imageBlob.url
    });
  } catch (err) {
    console.error("share/create error:", err);
    return res.status(500).json({ error: "Failed to create share." });
  }
}
