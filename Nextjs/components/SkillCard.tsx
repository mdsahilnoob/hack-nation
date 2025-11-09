export default function SkillCard({ skill, score, example }: { skill: string; score: number; example?: string }) {
  const pct = Math.round(score * 100);
  
  // Color based on confidence score
  const getScoreColor = () => {
    if (pct >= 80) return "bg-green-500";
    if (pct >= 60) return "bg-blue-500";
    if (pct >= 40) return "bg-yellow-500";
    return "bg-orange-500";
  };

  const getScoreBadgeColor = () => {
    if (pct >= 80) return "bg-green-100 text-green-800";
    if (pct >= 60) return "bg-blue-100 text-blue-800";
    if (pct >= 40) return "bg-yellow-100 text-yellow-800";
    return "bg-orange-100 text-orange-800";
  };

  return (
    <div className="p-5 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="font-bold text-lg text-gray-800">{skill}</div>
        <div className={`text-xs font-bold px-3 py-1 rounded-full ${getScoreBadgeColor()}`}>
          {pct}%
        </div>
      </div>

      <div className="mt-2 h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <div 
          style={{ width: `${pct}%` }} 
          className={`h-full ${getScoreColor()} transition-all duration-500`} 
        />
      </div>

      {example && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="text-xs font-semibold text-gray-500 mb-1">Context:</div>
          <div className="text-sm text-gray-600 italic line-clamp-2">&quot;{example}&quot;</div>
        </div>
      )}
    </div>
  );
}
