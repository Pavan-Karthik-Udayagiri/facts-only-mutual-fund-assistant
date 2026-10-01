import { knowledge, ai } from "hatchable";

export const KB_NAME = "mf_official_sources";
export const KB_DIMENSIONS = 1536;
export const MIN_SIMILARITY = 0.72;

export const docs = knowledge.base(KB_NAME, { dimensions: KB_DIMENSIONS });

export function normalizeQuestion(input) {
  return String(input || "").trim().replace(/\s+/g, " ").slice(0, 500);
}

export function classifyQuestion(question) {
  const q = question.toLowerCase();
  const pii = /(pan|aadhaar|aadhar|otp|bank account|account number|phone number|mobile number|email address|personal email)/i.test(q);
  if (pii) return "privacy";
  const advice = [
    /should i (buy|invest|sell)/i, /is this (a )?good (fund|scheme)/i, /which fund is best/i,
    /which .*fund.*(choose|select)/i, /recommend/i, /advise me/i, /highest return/i,
    /will .*give .*return/i, /target return/i, /guaranteed return/i, /make .*money/i
  ].some(r => r.test(question));
  if (advice) return "advice";
  const factual = /(expense ratio|ter|exit load|min(imum)? sip|min(imum)? investment|lock[- ]?in|riskometer|risk level|benchmark|scheme objective|plan information|statement|capital gains|scheme document|sid|kim|factsheet)/i.test(question);
  return factual ? "factual" : "unsupported";
}

function sourceShape(metadata = {}) {
  return {
    title: metadata.title || "Official scheme document",
    url: metadata.url || "https://www.sbimf.com/",
    publisher: metadata.publisher || "SBI Mutual Fund",
    date: metadata.updated_date || "Not specified"
  };
}

export async function retrieve(question, scheme) {
  const hits = await docs.search(
    scheme ? `${scheme}: ${question}` : question,
    { topK: 6, filter: scheme ? { scheme } : undefined }
  );
  return hits
    .filter(h => Number(h.similarity || 0) >= MIN_SIMILARITY)
    .slice(0, 5)
    .map(h => ({ ...h, source: sourceShape(h.metadata) }));
}

export async function generateGroundedAnswer(question, hits) {
  if (!hits.length) return null;
  const primary = hits[0];
  const context = `[SOURCE 1] ${primary.source.title}\nPublisher: ${primary.source.publisher}\nUpdated: ${primary.source.date}\nURL: ${primary.source.url}\nCONTENT:\n${primary.metadata._text}`;

  const result = await ai.generateText({
    model: "sonnet",
    purpose: "mf-facts-only-rag",
    system: `You are a facts-only mutual fund assistant. Use ONLY the supplied source context. Never use outside knowledge. Never give investment advice. Never calculate or compare returns. Never invent or interpolate numbers. Answer in at most 2 short sentences. Return only the answer text, with no citations, URLs, markdown headings, or source labels. If the context does not directly verify the requested fact, return exactly: VERIFICATION_FAILED.`,
    prompt: `Scheme: ${hits[0].source?.scheme || ""}\n\nQuestion: ${question}\n\nOfficial source context:\n${context}`
  });

  const answer = String(result.text || "").trim();
  return answer === "VERIFICATION_FAILED" ? null : answer;
}