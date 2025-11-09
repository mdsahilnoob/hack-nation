import { NextResponse } from "next/server";
import SKILLS from "../../../lib/skills";

/* eslint-disable @typescript-eslint/no-explicit-any */

type RequestBody = { text: string; threshold?: number };

let cachedSkillEmbeddings: number[][] | null = null;

async function embedTexts(texts: string[]) {
  // Prefer Gemini/Google embeddings if endpoint/key provided, otherwise fall back to OpenAI
  const geminiKey = process.env.GEMINI_API_KEY;
  const geminiEndpoint = process.env.GEMINI_EMBED_ENDPOINT; // fully qualified URL

  if (!geminiKey || !geminiEndpoint) {
    throw new Error('GEMINI_API_KEY and GEMINI_EMBED_ENDPOINT must be set to use Gemini embeddings');
  }

  if (geminiKey && geminiEndpoint) {
    // Gemini API uses API key as query parameter, not Bearer token
    const urlWithKey = `${geminiEndpoint}?key=${geminiKey}`;
    
    const res = await fetch(urlWithKey, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: {
          parts: [{ text: texts.join('\n') }]
        }
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Gemini embedding API failed: ${txt}`);
    }

    const j = await res.json();

    // Gemini API returns: { embedding: { values: [...] } }
    if (j?.embedding?.values && Array.isArray(j.embedding.values)) {
      // Return array of embeddings for each text (currently combined, may need batch processing)
      return [j.embedding.values as number[]];
    }
    
    // Support multiple response shapes (best-effort):
    // - { data: [{ embedding: [...] }, ...] } (OpenAI-like)
    // - { embeddings: [[...], ...] }
    // - { data: [{ embeddings: [...] }]} or other variants
    if (Array.isArray(j?.data) && j.data.length && Array.isArray(j.data[0]?.embedding)) {
      return j.data.map((d: any) => d.embedding as number[]);
    }
    if (Array.isArray(j?.embeddings) && Array.isArray(j.embeddings[0])) {
      return j.embeddings as number[][];
    }
    // Some Vertex/Generative APIs return { responses: [{ embedding: [...] }] }
    if (Array.isArray(j?.responses) && Array.isArray(j.responses[0]?.embedding)) {
      return j.responses.map((r: any) => r.embedding as number[]);
    }

    // As a last resort, try to find any array of numbers in the response
    const found: number[][] = [];
    const walk = (obj: any) => {
      if (!obj) return;
      if (Array.isArray(obj) && typeof obj[0] === 'number') {
        found.push(obj as number[]);
        return;
      }
      if (Array.isArray(obj)) {
        for (const v of obj) walk(v);
      } else if (typeof obj === 'object') {
        for (const k of Object.keys(obj)) walk(obj[k]);
      }
    };
    walk(j);
    if (found.length >= texts.length) return found.slice(0, texts.length);

    throw new Error('Gemini embedding API returned an unexpected response shape');
  }

  // Should never reach here because we throw earlier if not configured
  throw new Error('Embedding provider not configured');

}

function cosine(a: number[], b: number[]) {
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-12);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const text = body.text ?? "";
    const threshold = typeof body.threshold === "number" ? body.threshold : 0.5;
    if (!text || text.trim().length < 10) {
      return NextResponse.json({ skills: [] });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    const geminiEndpoint = process.env.GEMINI_EMBED_ENDPOINT;
    if (!geminiKey || !geminiEndpoint) {
      return new NextResponse("GEMINI_API_KEY or GEMINI_EMBED_ENDPOINT not set in environment", { status: 500 });
    }

    // Prepare skill embeddings (cached)
    if (!cachedSkillEmbeddings) {
      cachedSkillEmbeddings = await embedTexts(SKILLS);
    }

    // Embed incoming text. We will split into sentences to provide example matches.
    const sentences = text
      .replace(/\r\n/g, " ")
      .replace(/\n/g, " ")
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 10);

    // fallback: if no sentences, treat whole text as one
    const toEmbed = sentences.length ? sentences : [text];

  const sentEmbeddings = await embedTexts(toEmbed);

    // compute best skill matches with example sentence
    const resultsMap: Record<string, { score: number; example: string }> = {};

    for (let i = 0; i < sentEmbeddings.length; i++) {
      const sVec = sentEmbeddings[i];
      if (!cachedSkillEmbeddings) continue;
      for (let j = 0; j < cachedSkillEmbeddings.length; j++) {
        const skillVec = cachedSkillEmbeddings[j];
        const sim = cosine(sVec, skillVec);
        if (sim >= threshold || sim === Math.max(...cachedSkillEmbeddings.map(() => sim))) {
          const skill = SKILLS[j];
          if (!resultsMap[skill] || resultsMap[skill].score < sim) {
            resultsMap[skill] = { score: sim, example: toEmbed[i] };
          }
        }
      }
    }

    // convert to array, sort by score
    const items = Object.entries(resultsMap)
      .map(([skill, { score, example }]) => ({ skill, score: Number(score.toFixed(4)), example }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);

    return NextResponse.json({ skills: items });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : typeof err === "string"
        ? err
        : "Unknown error";
    return new NextResponse(message, { status: 500 });
  }
}
