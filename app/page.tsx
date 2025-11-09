import UploadBox from "../components/UploadBox";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="bg-linear-to-b from-white to-slate-50 p-8 rounded-2xl shadow">
        <h1 className="text-4xl font-bold text-indigo-600">SkillSense AI</h1>
        <p className="mt-3 text-lg text-gray-700">
          🚀 AI-Powered Resume Parser - Extracts Skills Directly from Your Text
        </p>
        <p className="mt-2 text-gray-600">
          Copy-paste your resume and our AI will intelligently identify ALL skills mentioned - 
          no predefined lists, just pure AI analysis of your actual experience!
        </p>
      </section>

      <section>
        <UploadBox />
      </section>

      <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Tips for Best Results:</h3>
        <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
          <li>Include detailed work experience, project descriptions, and responsibilities</li>
          <li>Paste complete resume sections (Summary, Experience, Projects, Education)</li>
          <li>More context = better skill detection and accuracy</li>
          <li>Adjust the threshold slider to control sensitivity (lower = more skills detected)</li>
        </ul>
      </section>
    </div>
  );
}
