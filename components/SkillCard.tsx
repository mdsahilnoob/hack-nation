export default function SkillCard({ skill, score, example }: { skill: string; score: number; example?: string }) {
  const pct = Math.round(score * 100);
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <div className="font-medium">{skill}</div>
        <div className="text-sm text-gray-500">{pct}%</div>
      </div>

      <div className="mt-2 h-2 bg-slate-100 rounded overflow-hidden">
        <div style={{ width: `${pct}%` }} className="h-full bg-indigo-500" />
      </div>

      {example && <div className="mt-3 text-sm text-gray-600">Example: {example}</div>}
    </div>
  );
}
