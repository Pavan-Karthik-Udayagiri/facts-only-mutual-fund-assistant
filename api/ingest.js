import { browser, knowledge } from "hatchable";
import { docs, KB_DIMENSIONS } from "../lib/rag.js";

export const access = "admin";
export const methods = ["POST"];

const ALLOWED = [
  "sbimf.com","www.sbimf.com",
  "sebi.gov.in","investor.sebi.gov.in","www.sebi.gov.in",
  "amfiindia.com","www.amfiindia.com"
];

function isAllowed(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return ALLOWED.some(d => host === d || host.endsWith("." + d));
  } catch {
    return false;
  }
}

function chunkText(text, maxChars = 2200) {
  const parts = String(text || "").split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
  const chunks = [];
  let buf = "";
  for (const part of parts) {
    if (!buf) buf = part;
    else if ((buf + "\n\n" + part).length <= maxChars) buf += "\n\n" + part;
    else { chunks.push(buf); buf = part; }
  }
  if (buf) chunks.push(buf);
  return chunks;
}

export default async function(req, res) {
  const { url, title, publisher, scheme, updated_date } = req.body || {};
  if (!url || !isAllowed(url)) return res.status(400).json({ error: "Only SBI Mutual Fund, SEBI, and AMFI URLs are allowed." });
  if (!title || !publisher || !scheme || !updated_date) return res.status(400).json({ error: "title, publisher, scheme, and updated_date are required." });

  const page = await browser.html(url);
  const text = typeof page === "string" ? page : String(page?.text || page?.content || "");
  const chunks = chunkText(text);

  const items = chunks.map((text, i) => ({
    id: `source:${encodeURIComponent(url)}:chunk:${i}`,
    text,
    metadata: { title, publisher, scheme, updated_date, url, official: true, kb_dimensions: KB_DIMENSIONS }
  }));
  await docs.add(items);

  return res.json({ ok: true, indexed: items.length, url, title, scheme });
}