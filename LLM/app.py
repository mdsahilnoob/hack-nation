from flask import Flask, request, jsonify
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
import tempfile, os, json

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "🚀 Resume Hidden Talent Analyzer is running!",
        "endpoints": {
            "/analyze": "POST with PDF file - Analyzes resume PDF and finds hidden talents",
            "/analyze-text": "POST with JSON {text, prompt} - Analyzes text with custom prompt"
        }
    })


@app.route("/analyze-text", methods=["POST"])
def analyze_text():
    """Analyze text directly with a custom prompt using Groq LLM"""
    try:
        data = request.get_json()
        
        if not data or "text" not in data:
            return jsonify({"error": "Missing 'text' field in request body"}), 400
        
        text = data.get("text", "").strip()
        custom_prompt = data.get("prompt", "").strip()
        
        if not text:
            return jsonify({"error": "Text cannot be empty"}), 400
        
        # Initialize Groq LLM
        llm = ChatGroq(
            groq_api_key=os.getenv("Grok_API_KEY"),
            model_name="llama-3.3-70b-versatile",
            temperature=0.2,
            max_tokens=2048,
        )
        
        # If custom prompt provided, use it directly (it should already contain the text)
        # Otherwise, create a default prompt
        if custom_prompt:
            final_prompt = custom_prompt
        else:
            final_prompt = f"Analyze the following text:\n\n{text}"
        
        # Get LLM response
        response = llm.invoke([HumanMessage(content=final_prompt)])
        
        return jsonify({"analysis": response.content}), 200
        
    except Exception as e:
        return jsonify({"error": f"❌ Error during analysis: {str(e)}"}), 500


@app.route("/analyze", methods=["POST"])
def analyze_resume():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded. Please upload a PDF file."}), 400

    file = request.files["file"]
    if not file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "Invalid file type. Only PDF files are supported."}), 400

    tmp_path = None
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp_path = tmp.name
            file.save(tmp_path)

        # Load PDF text
        loader = PyMuPDFLoader(tmp_path)
        docs = loader.load()
        del loader

        if os.path.exists(tmp_path):
            os.remove(tmp_path)

        text = "\n".join([d.page_content for d in docs]).strip()
        if not text:
            return jsonify({
                "message": "⚠️ No readable text found. The PDF might be scanned or image-based."
            }), 200

        # Resume keyword detection
        resume_keywords = {
            "education", "skills", "experience", "project", "internship",
            "objective", "profile", "career", "summary", "certification",
            "linkedin", "github", "b.tech", "bachelor", "curriculum vitae", "cv"
        }
        found_keywords = [k for k in resume_keywords if k in text.lower()]
        if len(found_keywords) < 3:
            return jsonify({
                "message": "⚠️ This file doesn’t look like a resume. No analysis performed.",
                "detected_keywords": found_keywords
            }), 200

        # Initialize Groq LLM
        llm = ChatGroq(
            groq_api_key=os.getenv("Grok_API_KEY"),
            model_name="llama-3.3-70b-versatile",
            temperature=0.2,
            max_tokens=1500,
        )

        # Step 1: Classify if it's a resume
        classifier_prompt = f"""
You are a document classifier. Determine whether the following text is a *resume* or *something else*.

Text:
{text[:2000]}

Respond with only one word: "resume" or "other".
"""
        decision = llm.invoke([HumanMessage(content=classifier_prompt)]).content.strip().lower()

        if "resume" not in decision:
            return jsonify({
                "message": f"⚠️ This document appears to be '{decision}'. Skipping resume analysis."
            }), 200

        # Step 2: Analyze resume for hidden skills and JSON extraction
        analysis_prompt = f"""
You are an expert technical recruiter and resume analyst.

Analyze the following resume text:

{text}

Return two parts:
1. A **concise textual analysis** including:
   - Hidden Technical Talents
   - Implied Soft Skills
   - Growth Potential
   - Career Recommendations

2. Then, output a **valid JSON array only** (no markdown, no explanation) of top inferred technical skills in this exact format:

[
  {{
    "skill": "Python",
    "score": 0.95,
    "example": "Developed backend services using Python and Django"
  }},
  {{
    "skill": "React",
    "score": 0.88,
    "example": "Built responsive web applications using React"
  }}
]

Make sure:
- Each skill has a confidence score between 0.7 and 1.0.
- Each example is inferred from the text context.
- The JSON is strictly valid and parsable.
"""
        response = llm.invoke([HumanMessage(content=analysis_prompt)]).content

        # Extract JSON array (if present)
        try:
            start = response.index("[")
            end = response.rindex("]") + 1
            skills_json = response[start:end]
            skills_data = json.loads(skills_json)
        except Exception:
            skills_data = []
            skills_json = "[]"

        textual_analysis = response[:response.find("[")].strip() if "[" in response else response.strip()

        return jsonify({
            "textual_analysis": textual_analysis,
            "skills": skills_data
        }), 200

    except Exception as e:
        return jsonify({"error": f"❌ Error during analysis: {str(e)}"}), 500

    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except PermissionError:
                pass


if __name__ == "__main__":
    app.run(debug=True)
