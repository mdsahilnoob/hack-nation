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
        const txt = await res.text();
        throw new Error(txt || "API error");
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
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-3">Paste Resume / Profile</h2>

      <textarea
        placeholder="Paste resume summary, experience bullets, or LinkedIn bio..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-40 p-3 border rounded-md resize-none"
      />

      <div className="mt-3 flex items-center gap-4">
        <label className="text-sm text-gray-600">Threshold</label>
        <input
          type="range"
          min={0.25}
          max={0.8}
          step={0.01}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
        />
        <div className="text-sm text-gray-600">{threshold.toFixed(2)}</div>

        <button
          onClick={handleExtract}
          className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Extracting..." : "Extract Skills"}
        </button>
      </div>

      {error && <div className="mt-4 text-red-600">{error}</div>}

      {results && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {results.length === 0 && <div className="text-gray-600">No skills found.</div>}
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
  );
}
