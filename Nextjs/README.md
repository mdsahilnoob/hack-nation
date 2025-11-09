# SkillSense AI - Resume Parser 🚀

An advanced AI-powered resume parser that extracts technical and soft skills from resumes using Google's Gemini AI embedding model. Built with Next.js, TypeScript, and Tailwind CSS.

## 🌟 Features

- **AI-Powered Skill Extraction**: Uses Google Gemini AI embeddings to detect skills from resume text
- **150+ Skills Database**: Comprehensive skill library covering programming languages, frameworks, tools, and soft skills
- **Confidence Scores**: Each detected skill comes with a confidence score (0-100%)
- **Context Examples**: Shows the sentence/context where each skill was detected
- **Adjustable Sensitivity**: Control detection threshold with an interactive slider
- **Beautiful UI**: Modern, responsive design with color-coded confidence indicators
- **Real-time Processing**: Fast skill extraction with caching for better performance

## 📋 How It Works

1. **Copy-Paste Resume**: Users paste their complete resume text into the text area
2. **AI Processing**: The system uses Gemini AI to create embeddings (vector representations) of the resume text
3. **Skill Matching**: Compares resume embeddings with pre-computed skill embeddings using cosine similarity
4. **Results Display**: Shows detected skills sorted by confidence score with visual indicators

### Technical Architecture

**Frontend Flow:**

```
User Input → UploadBox Component → API Request
                ↓
API Response ← Skill Extraction Logic ← Gemini AI
                ↓
SkillCard Components ← Sorted Results
```

**Backend Process:**

```
1. Receive resume text
2. Split into sentences
3. For each sentence:
   - Generate embedding via Gemini API
   - Compare with cached skill embeddings
   - Calculate cosine similarity
4. Filter by threshold
5. Return top matches with examples
```

## 🛠️ Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **AI/ML**: Google Gemini AI (text-embedding-004 model)
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS with custom components
- **Charts**: Chart.js with react-chartjs-2

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the API key

### Step 2: Clone & Install

```bash
git clone https://github.com/mdsahilnoob/hack-nation.git
cd hack-nation
npm install
```

### Step 3: Configure Environment

Create a `.env` file in the root directory:

```env
MONGODB_URI='your_mongodb_connection_string'
GEMINI_API_KEY='paste_your_api_key_here'
GEMINI_EMBED_ENDPOINT='https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent'
```

### Step 4: Run the Application

```bash
npm run dev
```

### Step 5: Test It Out

1. Open [http://localhost:3000](http://localhost:3000)
2. Copy the sample resume from `test-resume-sample.txt`
3. Paste it into the text area
4. Click "Extract Skills"
5. See the magic happen! ✨

---

## 📖 Detailed Usage Guide

### Getting Best Results

#### What to Paste

✅ **Good Examples:**

- Complete resume text with multiple sections
- Detailed job descriptions with responsibilities
- Project descriptions with technologies used
- LinkedIn "About" section with experience details
- Portfolio project descriptions

❌ **Avoid:**

- Very short text (< 50 words)
- Only bullet points without context
- Just a list of skills (defeats the AI purpose!)
- Single sentences without detail

#### Optimizing Detection

1. **Include Context**: Don't just list skills, describe how you used them
2. **Be Specific**: "Built REST APIs with Express" beats "Backend development"
3. **Add Projects**: Project descriptions are goldmines for skill detection
4. **Detail Experience**: Explain what you did with each technology

### Understanding the Threshold

The threshold slider controls detection sensitivity:

| Range         | Description             | Use Case                         |
| ------------- | ----------------------- | -------------------------------- |
| **0.25-0.35** | Detect everything       | Max recall, more false positives |
| **0.40-0.50** | Balanced (default 0.45) | **Recommended for most resumes** |
| **0.55-0.70** | Only strong matches     | High precision, fewer results    |
| **0.75-0.80** | Ultra-strict            | Only explicit skill mentions     |

### Interpreting Results

#### Confidence Score Colors

- 🟢 **Green (80-100%)** - Excellent Match

  - Skill explicitly mentioned multiple times
  - Used in context with specific examples
  - High certainty of proficiency

- 🔵 **Blue (60-79%)** - Strong Match

  - Skill clearly referenced
  - Good contextual evidence
  - Very likely to possess this skill

- 🟡 **Yellow (40-59%)** - Moderate Match

  - Related terms or concepts mentioned
  - Some evidence of familiarity
  - May have adjacent skills

- 🟠 **Orange (<40%)** - Weak Match
  - Tangential references
  - Possible false positive
  - Should verify manually

#### Context Examples

Each skill shows where it was detected in your resume. Use this to:

- Verify the detection is accurate
- See how you mentioned each skill
- Improve your resume wording for ATS systems

---

## 📁 Project Structure

```
hack-nation/
├── app/
│   ├── api/
│   │   ├── dashboard/
│   │   │   └── route.ts          # Dashboard API
│   │   └── extract/
│   │       └── route.ts          # Main skill extraction API
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard page
│   ├── upload/
│   │   └── page.tsx              # Upload page
│   ├── page.tsx                  # Home page (main entry)
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/
│   ├── Navbar.tsx                # Navigation component
│   ├── UploadBox.tsx             # Main resume input component
│   ├── SkillCard.tsx             # Individual skill display card
│   ├── SkillRadar.tsx            # Radar chart visualization
├── lib/
│   └── skills.ts                 # 150+ skills database
├── models/
│   └── SkillProfile.ts           # MongoDB schema
├── config/
│   └── database.ts               # Database configuration
├── public/                       # Static assets
├── test-resume-sample.txt        # Sample resume for testing
├── .env                          # Environment variables (create this)
├── package.json                  # Dependencies
└── README.md                     # This file
```

---

## 🎯 Skills Database (150+)

The system can detect skills across these categories:

### Programming Languages (18)

Python, JavaScript, TypeScript, Java, C++, C#, Go, Rust, Ruby, PHP, Swift, Kotlin, Scala, R, MATLAB, Perl, Shell Scripting, Bash

### Frontend Development (20)

React, Angular, Vue.js, Next.js, Svelte, HTML, CSS, Sass, LESS, Tailwind CSS, Bootstrap, Material-UI, Styled Components, Webpack, Vite, Redux, MobX, jQuery, Responsive Design, Web Accessibility

### Backend Development (14)

Node.js, Express, Django, Flask, FastAPI, Spring Boot, Ruby on Rails, ASP.NET, Laravel, GraphQL, REST API, gRPC, WebSockets, Microservices

### Databases (13)

SQL, PostgreSQL, MySQL, MongoDB, Redis, Cassandra, DynamoDB, Elasticsearch, SQLite, Oracle, MariaDB, Neo4j, Couchbase

### Cloud & DevOps (18)

AWS, Azure, GCP, Docker, Kubernetes, Jenkins, GitLab CI, GitHub Actions, Terraform, Ansible, CircleCI, Travis CI, CI/CD, DevOps, CloudFormation, Heroku, Vercel, Netlify, DigitalOcean

### Data Science & ML (25+)

Machine Learning, Deep Learning, TensorFlow, PyTorch, Keras, scikit-learn, Data Analysis, Pandas, NumPy, Natural Language Processing, Computer Vision, Neural Networks, CNN, RNN, Transformer Models, BERT, GPT, LLM, Data Visualization, Matplotlib, Seaborn, Plotly, Tableau, Power BI, Big Data, Spark, Hadoop

### Mobile Development (5)

React Native, Flutter, iOS Development, Android Development, Mobile App Development

### Testing & QA (11)

Testing, Jest, Mocha, Pytest, Selenium, Cypress, Unit Testing, Integration Testing, Test-Driven Development, Quality Assurance, Debugging

### Design & UI/UX (8)

Figma, Adobe XD, Sketch, UI/UX Design, Wireframing, Prototyping, User Research, Graphic Design

### Soft Skills (13)

Project Management, Agile, Scrum, Leadership, Team Collaboration, Communication, Problem Solving, Critical Thinking, Time Management, Mentoring, Public Speaking, Technical Writing, Documentation

### Security (8)

Cybersecurity, Penetration Testing, Security Best Practices, OAuth, JWT, Encryption, SSL/TLS, Network Security

### Additional Technologies (30+)

API Development, System Design, Architecture, Performance Optimization, Code Review, Technical Documentation, Algorithms, Data Structures, Object-Oriented Programming, Functional Programming, Concurrent Programming, Distributed Systems, Load Balancing, Caching, Message Queues, RabbitMQ, Kafka, Nginx, Apache, Linux, Windows Server, Monitoring, Logging, APM Tools, New Relic, Datadog, Splunk

**Want to add more?** Edit `lib/skills.ts` and add your industry-specific skills!

---

## 📝 API Documentation

### POST `/api/extract`

Extracts skills from resume text using AI embeddings.

**Request:**

```json
{
  "text": "Your complete resume text here...",
  "threshold": 0.45
}
```

**Parameters:**

- `text` (string, required): The resume text to analyze (minimum 10 characters)
- `threshold` (number, optional): Detection sensitivity (0.25-0.80, default: 0.50)

**Response:**

```json
{
  "skills": [
    {
      "skill": "Python",
      "score": 0.8532,
      "example": "Developed backend services using Python and Django..."
    },
    {
      "skill": "React",
      "score": 0.7821,
      "example": "Built responsive web applications using React and TypeScript..."
    }
  ]
}
```

**Response Fields:**

- `skill` (string): Name of the detected skill
- `score` (number): Confidence score (0.0000-1.0000, displayed as percentage)
- `example` (string): Sentence/context where the skill was detected

**Error Responses:**

- `400`: Invalid request body
- `500`: API error (authentication, rate limit, or processing error)

**Performance:**

- First request: ~30 seconds (caches skill embeddings)
- Subsequent requests: ~10-15 seconds
- Processes 150+ skills against resume text

---

## 🧪 Testing

### Using the Sample Resume

A comprehensive sample resume is provided in `test-resume-sample.txt`:

1. Open `test-resume-sample.txt`
2. Copy all the content (Ctrl+A, Ctrl+C)
3. Paste into the application textarea
4. Click "Extract Skills"

**Expected Results:**

- **High confidence (80%+)**: Python, JavaScript, React, Node.js, AWS, Docker, PostgreSQL, Machine Learning
- **Strong matches (60-79%)**: TypeScript, Next.js, MongoDB, Kubernetes, TensorFlow
- **Moderate matches (40-59%)**: Redux, Express, Flask, GraphQL

### Creating Your Own Test Resume

Use this template:

```
[Your Name]
[Job Title]

PROFESSIONAL SUMMARY
[2-3 sentences about your experience and expertise with specific technologies]

TECHNICAL SKILLS
• Languages: [List specific programming languages]
• Frameworks: [List frameworks and libraries]
• Tools: [List tools and platforms]

EXPERIENCE
[Job Title] | [Company] | [Dates]
• [Achievement with specific technologies mentioned]
• [Project description with tools and technologies]
• [Impact metrics with technical implementation details]

PROJECTS
[Project Name]
• [What you built and which technologies you used]
• [Technical challenges solved and how]
• [Results achieved with metrics]
```

---

## 🔧 Customization Guide

### Adding Custom Skills

Edit `lib/skills.ts`:

```typescript
const SKILLS = [
  // Add your skills here
  "Your Industry-Specific Skill",
  "Another Custom Skill",
  "Niche Technology",
  // ... existing skills
];
```

After adding skills, restart the development server. The first request will cache the new embeddings.

### Changing the UI Theme

#### Colors

Edit component files to change the color scheme:

**Primary Color (Indigo):**

- Find: `bg-indigo-600`, `text-indigo-600`, `border-indigo-500`
- Replace with your preferred Tailwind color (e.g., `bg-blue-600`)

**Success/Confidence Colors:**
Edit `components/SkillCard.tsx`:

```typescript
const getScoreColor = () => {
  if (pct >= 80) return "bg-green-500"; // Change green
  if (pct >= 60) return "bg-blue-500"; // Change blue
  if (pct >= 40) return "bg-yellow-500"; // Change yellow
  return "bg-orange-500"; // Change orange
};
```

#### Layout

- **Card Grid**: Modify grid columns in `components/UploadBox.tsx`
- **Spacing**: Adjust padding and margin values
- **Typography**: Change font sizes and weights

### Using a Different AI Model

Update `.env` to use other Gemini embedding models:

```env
# For newer models:
GEMINI_EMBED_ENDPOINT='https://generativelanguage.googleapis.com/v1beta/models/text-embedding-005:embedContent'

# For multilingual support:
GEMINI_EMBED_ENDPOINT='https://generativelanguage.googleapis.com/v1beta/models/text-multilingual-embedding-002:embedContent'
```

---

## 🔍 Troubleshooting

### Common Issues

#### "No skills found"

**Problem**: No results displayed after extraction

**Solutions:**

1. Lower the threshold slider (try 0.30-0.35)
2. Add more detailed text with context (aim for 200+ words)
3. Include project descriptions and specific responsibilities
4. Verify text is in English (current model is English-optimized)

#### "Authentication Error" / 401 Error

**Problem**: `UNAUTHENTICATED` error from Gemini API

**Solutions:**

1. Check your `GEMINI_API_KEY` in `.env` file
2. Verify you copied the complete API key (no extra spaces)
3. Ensure API key is active in Google AI Studio
4. Restart the development server: `npm run dev`

#### "Rate Limit Error" / 429 Error ⚠️

**Problem**: `RESOURCE_EXHAUSTED` error - "You exceeded your current quota"

**What happened:**

- Gemini Free Tier limit: **15 requests per minute**, **1,500 per day**
- Your app makes 150+ calls for skill caching + 20 per resume
- You hit the rate limit!

**Solutions:**

1. **Wait for reset**: Quota resets every 60 seconds (per-minute) or at midnight PT (daily)
2. **Use the optimized code**: Rate limiting is now built-in (5 sec delays)
3. **Check usage**: Visit [https://ai.dev/usage](https://ai.dev/usage?tab=rate-limit)
4. **Upgrade to paid** (recommended): Only ~$0.10 per 100 resumes!

**Free Tier Performance:**

- ⏱️ First run: ~12 minutes (caches 150 skills, one-time)
- ⏱️ Per resume: ~1.5 minutes (processes 20 sentences)
- 📊 Daily capacity: ~10 full runs

**With Paid Plan:**

- ⏱️ First run: ~30 seconds
- ⏱️ Per resume: ~5 seconds
- 📊 Daily capacity: Thousands
- 💰 Cost: ~$0.001 per resume

📖 **See [RATE_LIMIT_GUIDE.md](RATE_LIMIT_GUIDE.md) for detailed information**

#### Skills Loading Slowly

**Problem**: First extraction takes 10+ minutes

**Explanation**: This is **NORMAL with free tier + rate limiting**!

The first run:

- Generates embeddings for 150+ skills
- Adds 5-second delay between each call (rate limiting)
- Total time: ~12 minutes (one-time caching)
- Watch terminal for progress: "Embedded 1/150 texts"

**Subsequent requests:**

- Uses cached skill embeddings
- Only processes resume text (~20 sentences)
- Takes ~1.5 minutes per resume

**If this is too slow:**

- ✅ Upgrade to paid plan for instant processing
- ✅ Reduce skills in `lib/skills.ts` for testing
- ✅ Keep server running (don't restart, cache persists)

#### Results Seem Inaccurate

**Problem**: Detecting wrong skills or missing obvious ones

**Solutions:**

1. Check the context examples to understand why skills matched
2. Adjust threshold (higher = stricter, lower = more lenient)
3. Ensure resume has enough context around skills
4. Add more specific skill names to `lib/skills.ts`

#### TypeScript Errors

**Problem**: Compilation errors in development

**Solutions:**

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart dev server
npm run dev
```

### Getting Help

If you encounter issues not covered here:

1. Check the browser console for error messages
2. Check the terminal for server errors
3. Review the API response in Network tab
4. Ensure all dependencies are installed: `npm install`

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `GEMINI_API_KEY`
   - `GEMINI_EMBED_ENDPOINT`
   - `MONGODB_URI` (if using database)
6. Click "Deploy"

### Deploy to Other Platforms

The app can be deployed to:

- **Netlify**: Use `npm run build` and deploy the `.next` folder
- **Railway**: Connect GitHub repo and add environment variables
- **AWS Amplify**: Use the Next.js build configuration
- **DigitalOcean App Platform**: Deploy from GitHub with auto-build

**Important**: Always set environment variables in your deployment platform!

---

## 💡 Pro Tips & Best Practices

### For Users

1. **First Time Use**: First extraction takes longer due to caching (30 seconds is normal)
2. **Better Accuracy**: Paste 200+ word descriptions with context, not just skill lists
3. **Try Different Thresholds**: Compare results at 0.35, 0.45, and 0.60
4. **Verify Results**: Always check context examples to validate matches
5. **Improve Resume**: Use detected contexts to enhance your resume wording

### For Developers

1. **Caching**: Skill embeddings are cached in memory. Restart clears cache.
2. **Rate Limits**: Gemini API has rate limits. Consider adding request queuing.
3. **Performance**: First 150 API calls are for skill caching (one-time per restart)
4. **Error Handling**: API returns detailed error messages for debugging
5. **Monitoring**: Watch for authentication errors in production logs

### Understanding the AI

- **Embeddings**: Convert text to 768-dimensional numerical vectors
- **Similarity**: Cosine similarity measures how "close" vectors are (0-1 range)
- **Semantic Matching**: AI understands meaning, not just keywords
- **Context Matters**: "Python developer" and "Snake handler" won't match despite keyword similarity

---

## 🎓 Learning Resources

### Understanding the Technology

**What are Embeddings?**

- Numerical representations of text
- Similar meanings = similar vectors
- Enable semantic search beyond keywords

**How Cosine Similarity Works:**

```
similarity = (A · B) / (||A|| × ||B||)
- Range: 0 (no match) to 1 (perfect match)
- Measures angle between vectors
- Threshold filters low-confidence matches
```

**Why This Approach?**

- Better than keyword matching (understands context)
- More flexible than regex patterns
- Scalable to any number of skills
- Language model understands synonyms and related concepts

### Further Reading

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Text Embeddings Explained](https://platform.openai.com/docs/guides/embeddings)
- [Cosine Similarity Tutorial](https://en.wikipedia.org/wiki/Cosine_similarity)
- [Next.js Documentation](https://nextjs.org/docs)

---

## 📈 Future Enhancements

Potential features for future development:

- [ ] **File Upload Support**: Accept PDF and DOCX files
- [ ] **Export Functionality**: Download results as PDF or JSON
- [ ] **Multi-Resume Comparison**: Compare skills across multiple resumes
- [ ] **Skill Gap Analysis**: Compare resume skills with job descriptions
- [ ] **ATS Optimization**: Suggest resume improvements for ATS systems
- [ ] **Dashboard Persistence**: Save parsed profiles to MongoDB
- [ ] **Batch Processing**: Process multiple resumes simultaneously
- [ ] **API Rate Limiting**: Add request throttling and queuing
- [ ] **User Authentication**: Secure personal dashboard
- [ ] **Analytics**: Track most common skills, trends
- [ ] **Multi-language Support**: Support resumes in multiple languages
- [ ] **Skill Categories**: Group results by skill type
- [ ] **Resume Templates**: Suggest improvements based on analysis

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Bugs

1. Check if the issue already exists
2. Create a new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

### Suggesting Features

1. Open an issue describing the feature
2. Explain the use case and benefits
3. Consider implementation complexity

### Submitting Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m "Add some feature"`
6. Push: `git push origin feature/your-feature`
7. Open a Pull Request

### Adding Skills

1. Edit `lib/skills.ts`
2. Add skills in appropriate category
3. Test with sample resumes
4. Submit PR with examples

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

You are free to:

- Use commercially
- Modify
- Distribute
- Private use

With conditions:

- Include original license
- State changes made

---

## 👥 Authors & Contributors

**Created by:**

- [@mdsahilnoob](https://github.com/mdsahilnoob) - Initial work and development

**Built with ❤️ using:**

- Next.js
- TypeScript
- Tailwind CSS
- Google Gemini AI

---

## 🙏 Acknowledgments

- **Google Gemini AI** - For powerful embedding models
- **Next.js Team** - For the amazing React framework
- **Vercel** - For seamless deployment platform
- **Tailwind CSS** - For beautiful utility-first styling
- **Open Source Community** - For inspiration and support

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/mdsahilnoob/hack-nation/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mdsahilnoob/hack-nation/discussions)
- **Email**: Contact through GitHub profile

---

## 📊 Project Status

**Version**: 1.0.0
**Status**: ✅ Production Ready
**Last Updated**: November 2025

**What's Working:**

- ✅ AI-powered skill extraction
- ✅ 150+ skills database
- ✅ Beautiful responsive UI
- ✅ Real-time processing
- ✅ Context examples
- ✅ Confidence scoring

**Known Limitations:**

- English language only (for now)
- First run requires ~30 seconds for caching
- Rate limited by Gemini API quotas
- In-memory caching (clears on restart)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

**🚀 Built for the future of resume parsing 🚀**

[Report Bug](https://github.com/mdsahilnoob/hack-nation/issues) · [Request Feature](https://github.com/mdsahilnoob/hack-nation/issues) · [Documentation](https://github.com/mdsahilnoob/hack-nation)

</div>
