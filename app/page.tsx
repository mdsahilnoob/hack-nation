import UploadBox from "../components/UploadBox";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="bg-linear-to-b from-white to-slate-50 p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold">SkillSense</h1>
        <p className="mt-2 text-gray-600">
          Upload a resume or paste profile text — SkillSense will extract explicit and
          implicit skills with confidence scores.
        </p>
      </section>

      <section>
        <UploadBox />
      </section>

      <section className="text-sm text-gray-500">
        Tip: For best results paste long descriptive experience paragraphs (projects, responsibilities).
      </section>
    </div>
  );
}
