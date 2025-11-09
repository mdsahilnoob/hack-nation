from flask import Flask, request, jsonify
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
import tempfile, os

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "🚀 Resume Hidden Talent Analyzer is running!",
        "usage": "Send a POST request to /analyze with a PDF file."
    })


@app.route("/analyze", methods=["POST"])
def analyze_resume():
    # Check for uploaded file
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

        # Load PDF text using PyMuPDFLoader
        loader = PyMuPDFLoader(tmp_path)
        docs = loader.load()
        del loader  # release file handle

        # Safely remove temp file (after loader releases handle)
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

        # Combine all extracted text
        text = "\n".join([d.page_content for d in docs]).strip()
        if not text:
            return jsonify({
                "message": "⚠️ No readable text found. The PDF might be scanned or image-based."
            }), 200

        # ----------- STEP 1: Keyword density detection -----------
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

        # ----------- STEP 2: Initialize Groq LLM -----------
        llm = ChatGroq(
            groq_api_key=os.getenv("Grok_API_KEY"),
            model_name="llama-3.3-70b-versatile",
            temperature=0.2,
            max_tokens=1024,
        )

        # ----------- STEP 3: LLM-based resume validation -----------
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

        # ----------- STEP 4: Run final resume analysis -----------
        analysis_prompt = f"""
You are an expert career coach and recruiter.
Analyze this resume text:

{text}

Find **hidden talents, soft skills, and growth potential** that are implied but not directly mentioned.
Be concise and insightful.

Return the answer structured as:

- Hidden Technical Talents
- Implied Soft Skills
- Growth Potential
- Career Recommendations
"""
        response = llm.invoke([HumanMessage(content=analysis_prompt)])
        return jsonify({"analysis": response.content}), 200

    except Exception as e:
        return jsonify({"error": f"❌ Error during analysis: {str(e)}"}), 500

    finally:
        # Ensure file cleanup
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except PermissionError:
                pass


if __name__ == "__main__":
    app.run(debug=True)
