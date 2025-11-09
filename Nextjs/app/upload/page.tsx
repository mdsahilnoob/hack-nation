import UploadBox from '../../components/UploadBox';

export default function UploadPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">Upload Resume</h1>
      <p className="mt-2 text-gray-600">Upload a PDF or paste text to extract skills.</p>
      <div className="mt-6">
        <UploadBox />
      </div>
    </main>
  );
}
