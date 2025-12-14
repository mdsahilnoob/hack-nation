"use client";
import React, { useState } from "react";
import SkillCard from "./SkillCard";

type Detected = { skill: string; score: number; example?: string };

export default function UploadBox() {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Detected[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [threshold, setThreshold] = useState<number>(0.45);

  async function handleExtract() {
    setError(null);
    setResults(null);
    if (!text.trim()) {
      setError("Please paste some resume or profile text.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, threshold })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(data.error || `API error: ${res.status}`);
      }
      const data = await res.json();
      setResults(data.skills);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(String(e));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">📄 Paste Your Resume</h2>

      <textarea
        placeholder="Paste your complete resume text here... 

Example:
Software Engineer with 5+ years of experience in full-stack development. 
Proficient in Python, JavaScript, React, Node.js, and cloud technologies.
Led development of scalable microservices using Docker and Kubernetes...
        "
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-48 p-4 border-2 border-gray-300 rounded-lg resize-none focus:border-indigo-500 focus:outline-none font-mono text-sm"
      />

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="threshold-slider" className="text-sm font-medium text-gray-700">Detection Sensitivity:</label>
          <input
            id="threshold-slider"
            type="range"
            min={0.25}
            max={0.8}
            step={0.01}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-32"
            title="Adjust detection sensitivity"
          />
          <div className="text-sm font-semibold text-indigo-600 w-12">{threshold.toFixed(2)}</div>
        </div>

        <button
          onClick={handleExtract}
          className="ml-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          disabled={loading}
        >
          {loading ? "🔍 Analyzing..." : "✨ Extract Skills"}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {results && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              🎯 Detected Skills ({results.length})
            </h3>
            {results.length > 0 && (
              <span className="text-sm text-gray-500">
                Sorted by confidence score
              </span>
            )}
          </div>
          
          {results.length === 0 ? (
            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
              <p className="text-yellow-800 font-medium">No skills found above the threshold.</p>
              <p className="text-sm text-yellow-700 mt-1">Try lowering the sensitivity slider or adding more detailed text.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((r) => (
                <SkillCard
                  key={r.skill}
                  skill={r.skill}
                  score={r.score}
                  example={r.example}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
