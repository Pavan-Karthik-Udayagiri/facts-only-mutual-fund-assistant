import { db } from "hatchable";
import { normalizeQuestion, classifyQuestion, retrieve, generateGroundedAnswer } from "../lib/rag.js";

export const access = "public";
export const methods = ["POST"];

const refusalText = "I can provide factual information about this scheme, but I can't provide investment advice or recommend whether you should invest. You can ask me about the scheme's expense ratio, exit load, minimum SIP, riskometer, benchmark, or other factual details.";

const unsupportedText = "I couldn't verify this information from the official sources available to me. Please check the latest official scheme documents.";

export default async function(req, res) {
  const question = normalizeQuestion(req.body?.question);
  const scheme = normalizeQuestion(req.body?.scheme);

  if (!question) return res.status(400).json({ error: "Question is required." });

  const classification = classifyQuestion(question);
  await db.query(
    "INSERT INTO question_log (question, scheme, classification) VALUES ($1, $2, $3)",
    [question, scheme || null, classification]
  );

  if (classification === "privacy") {
    return res.json({
      mode: "privacy",
      answer: "Please do not share PAN, Aadhaar, OTPs, bank or account details, phone numbers, email addresses, or other personal information with this chatbot.",
      sources: []
    });
  }

  if (classification === "advice") {
    return res.json({
      mode: "refusal",
      answer: refusalText,
      sources: [{ title: "SEBI Investor Education", url: "https://investor.sebi.gov.in/", publisher: "SEBI", date: "Official" }]
    });
  }

  if (classification === "unsupported") {
    return res.json({ mode: "unsupported", answer: unsupportedText, sources: [] });
  }

  let hits = [];
  let answer = null;
  try {
    hits = await retrieve(question, scheme || undefined);
    answer = await generateGroundedAnswer(question, hits);
  } catch (error) {
    console.warn("RAG unavailable; returning verification-safe response.", String(error));
  }

  if (!answer || !hits.length) {
    return res.json({ mode: "unverified", answer: unsupportedText, sources: [] });
  }

  const source = hits[0].source;
  return res.json({
    mode: "factual",
    answer: answer,
    lastUpdated: source.date,
    sources: [{ title: source.title, url: source.url, publisher: source.publisher, date: source.date }]
  });
}