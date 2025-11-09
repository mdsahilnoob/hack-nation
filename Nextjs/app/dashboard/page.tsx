import SkillCard from '../../components/SkillCard'
import SkillRadar from '../../components/SkillRadar'

// Dashboard page — UI only. The API is located at `app/api/dashboard`.

const demo = [
  { skill: 'React', score: 0.92, example: 'Built multiple SPAs' },
  { skill: 'Node.js', score: 0.84, example: 'Server-side APIs' },
  { skill: 'TypeScript', score: 0.78, example: 'Typed frontend and backend' },
]

export default function DashboardPage() {
  return (
    <main className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Dashboard (Demo)</h1>
        <p className="mb-6">This page is UI-only; the data comes from <code>/api/dashboard</code>.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section>
            <h2 className="text-xl font-semibold mb-2">Skills</h2>
            <div className="space-y-3">
              {demo.map((d) => (
                <SkillCard key={d.skill} skill={d.skill} score={d.score} example={d.example} />
              ))}
            </div>
          </section>

          <aside>
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <div className="p-4 bg-white rounded shadow">
              <SkillRadar data={demo.map((d) => ({ category: d.skill, score: d.score }))} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}