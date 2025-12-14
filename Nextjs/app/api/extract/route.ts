import { NextResponse } from "next/server";

type RequestBody = { text: string; threshold?: number };

// Use Flask backend (Groq LLM) to analyze resume and extract skills
async function extractSkillsWithAI(text: string) {
  const flaskBackendUrl = process.env.FLASK_BACKEND_URL || 'http://127.0.0.1:5000';
  
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

  // Send text analysis request to Flask backend
  const res = await fetch(`${flaskBackendUrl}/analyze-text`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      text: text,
      prompt: prompt
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Flask backend failed: ${txt}`);
  }

  const result = await res.json();
  
  if (!result.analysis) {
    throw new Error('No response from Flask backend');
  }

  // Parse the JSON response from LLM
  let cleanedText = result.analysis.trim();
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

    const flaskBackendUrl = process.env.FLASK_BACKEND_URL || 'http://127.0.0.1:5000';
    console.log('Extracting skills from resume using Flask backend (Groq LLM)...');
    console.log('Flask backend URL:', flaskBackendUrl);
    
    // Extract skills directly from the resume text using Flask backend
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
    return NextResponse.json(
      { error: message, details: err instanceof Error ? err.stack : undefined },
      { status: 500 }
    );
  }
}
