import { NextResponse } from "next/server";

type RequestBody = { text: string; threshold?: number };

// Use Gemini's generative model to extract skills directly from text
async function extractSkillsWithAI(text: string) {
  const geminiKey = process.env.GEMINI_API_KEY;
  
  if (!geminiKey) {
    throw new Error('GEMINI_API_KEY must be set');
  }

  // Use Gemini 2.0 Flash (latest free tier model)
  // v1beta API compatible models:
  // - 'gemini-2.0-flash-exp' (latest experimental, fastest)
  // - 'gemini-1.5-flash' (stable fallback)
  // - 'gemini-pro' (legacy fallback)
  const modelName = 'gemini-2.0-flash-exp'; // Latest Gemini 2.0, Free tier: 15 RPM, 1500 RPD
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`;
  
  const prompt = `Analyze the following resume/profile text and extract ALL technical skills, soft skills, technologies, frameworks, tools, and methodologies mentioned.

For each skill found:
1. List the skill name
2. Rate confidence (0.0 to 1.0) based on how clearly it's mentioned
3. Provide a brief context quote showing where it was mentioned

Resume Text:
${text}

Return ONLY a valid JSON array in this exact format (no markdown, no explanations):
[
  {
    "skill": "Python",
    "score": 0.95,
    "example": "Developed backend services using Python and Django"
  },
  {
    "skill": "React",
    "score": 0.88,
    "example": "Built responsive web applications using React"
  }
]

Extract all skills mentioned, including:
- Programming languages (Python, JavaScript, etc.)
- Frameworks (React, Django, Flask, etc.)
- Databases (MongoDB, PostgreSQL, etc.)
- Cloud platforms (AWS, Azure, GCP, etc.)
- Tools (Git, Docker, Kubernetes, etc.)
- Methodologies (Agile, Scrum, CI/CD, etc.)
- Soft skills (Leadership, Communication, etc.)

Return only the JSON array, nothing else.`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 8192,
      }
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Gemini API failed: ${txt}`);
  }

  const result = await res.json();
  
  // Extract the generated text
  const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!generatedText) {
    throw new Error('No response from Gemini AI');
  }

  // Parse the JSON response
  // Remove markdown code blocks if present
  let cleanedText = generatedText.trim();
  cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  cleanedText = cleanedText.trim();
  
  try {
    const skills = JSON.parse(cleanedText);
    return skills;
  } catch {
    console.error('Failed to parse AI response:', cleanedText);
    throw new Error('Failed to parse AI response as JSON');
  }
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
    if (!geminiKey) {
      return new NextResponse("GEMINI_API_KEY not set in environment", { status: 500 });
    }

    console.log('Extracting skills from resume using Gemini AI...');
    
    // Extract skills directly from the resume text using AI
    const extractedSkills = await extractSkillsWithAI(text);
    
    // Filter by threshold and sort by score
    const filteredSkills = extractedSkills
      .filter((skill: { score: number }) => skill.score >= threshold)
      .sort((a: { score: number }, b: { score: number }) => b.score - a.score);

    console.log(`Extracted ${filteredSkills.length} skills above threshold ${threshold}`);

    return NextResponse.json({ skills: filteredSkills });
  } catch (err: unknown) {
    console.error('Error extracting skills:', err);
    const message =
      err instanceof Error
        ? err.message
        : typeof err === "string"
        ? err
        : "Unknown error";
    return new NextResponse(message, { status: 500 });
  }
}
