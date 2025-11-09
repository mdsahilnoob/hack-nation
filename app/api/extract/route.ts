import { NextResponse } from "next/server";
import SKILLS from "../../../lib/skills";

type RequestBody = { text: string; threshold?: number };

let cachedSkillEmbeddings: number[][] | null = null;

// Rate limiting: Gemini free tier allows 15 requests per minute
const DELAY_BETWEEN_REQUESTS_MS = 5000; // 5 seconds = ~12 requests per minute (safe margin)

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function embedTexts(texts: string[]) {
  // Prefer Gemini/Google embeddings if endpoint/key provided, otherwise fall back to OpenAI
  const geminiKey = process.env.GEMINI_API_KEY;
  const geminiEndpoint = process.env.GEMINI_EMBED_ENDPOINT; // fully qualified URL

  if (!geminiKey || !geminiEndpoint) {
    throw new Error('GEMINI_API_KEY and GEMINI_EMBED_ENDPOINT must be set to use Gemini embeddings');
  }

  if (geminiKey && geminiEndpoint) {
    // Gemini API uses API key as query parameter, not Bearer token
    // Note: Gemini embedding API processes one text at a time, so we batch them with rate limiting
    const embeddings: number[][] = [];
    
    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];
      const urlWithKey = `${geminiEndpoint}?key=${geminiKey}`;
      
      // Add delay between requests to respect rate limits (except for first request)
      if (i > 0) {
        await delay(DELAY_BETWEEN_REQUESTS_MS);
      }
      
      const res = await fetch(urlWithKey, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: {
            parts: [{ text }]
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
        embeddings.push(j.embedding.values as number[]);
        console.log(`Embedded ${i + 1}/${texts.length} texts`);
      } else {
        throw new Error('Gemini embedding API returned an unexpected response shape');
      }
    }
    
    return embeddings;
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
    // OPTIMIZATION: Limit sentences to reduce API calls and stay within rate limits
    const sentences = text
      .replace(/\r\n/g, " ")
      .replace(/\n/g, " ")
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 10);

    // Limit to max 20 sentences to reduce API calls (was unlimited before)
    // Free tier: 15 requests/min = we can do ~12 safely with delays
    const MAX_SENTENCES = 20;
    const limitedSentences = sentences.slice(0, MAX_SENTENCES);

    // fallback: if no sentences, treat whole text as one
    const toEmbed = limitedSentences.length ? limitedSentences : [text];

    console.log(`Processing ${toEmbed.length} text segments (limited from ${sentences.length} total sentences)`);
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
