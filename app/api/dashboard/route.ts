import { NextResponse } from 'next/server'

// Simple mock dashboard API — returns saved skill profiles.
// This was previously embedded inside the page component; moved here to conform to Next.js App Router API structure.

const mockProfiles = [
  {
    id: '1',
    name: 'Alice',
    skills: [
      { skill: 'JavaScript', score: 0.93, example: 'Built several React apps' },
      { skill: 'TypeScript', score: 0.86, example: 'Added types across a codebase' },
      { skill: 'Node.js', score: 0.8, example: 'Auth and APIs' },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Bob',
    skills: [
      { skill: 'Python', score: 0.9, example: 'Data processing scripts' },
      { skill: 'Machine Learning', score: 0.77, example: 'Built a proof-of-concept model' },
    ],
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    // In future this should fetch from the database (e.g. via Mongoose or Prisma client).
    return NextResponse.json({ ok: true, profiles: mockProfiles })
  } catch (error) {
    console.error('Dashboard GET error:', error)
    return NextResponse.json({ ok: false, error: 'Failed to load profiles' }, { status: 500 })
  }
}
