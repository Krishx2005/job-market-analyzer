import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { getSkills } from '../api'

export default function SkillsChart({ dark }) {
  const [data, setData] = useState([])

  useEffect(() => {
    getSkills(15).then(setData).catch(console.error)
  }, [])

  if (!data.length) {
    return (
      <div className="empty-state">
        <svg className={`w-12 h-12 mb-3 ${dark ? 'text-navy-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>No skills data available</p>
        <p className={`text-xs mt-1 ${dark ? 'text-gray-600' : 'text-gray-300'}`}>Try refreshing the data pipeline</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} layout="vertical" margin={{ left: 80, right: 20, top: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={dark ? 'rgba(148,163,184,0.08)' : 'rgba(0,0,0,0.06)'} horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: dark ? '#94a3b8' : '#64748b', fontSize: 12 }}
          axisLine={{ stroke: dark ? '#1c2744' : '#e2e8f0' }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="skill"
          width={75}
          tick={{ fill: dark ? '#cbd5e1' : '#374151', fontSize: 12, fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: dark ? '#151d35' : '#fff',
            border: `1px solid ${dark ? '#253356' : '#e2e8f0'}`,
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            color: dark ? '#e2e8f0' : '#1e293b',
          }}
          cursor={{ fill: dark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.05)' }}
          formatter={(value) => [`${value} jobs`, 'Count']}
        />
        <Bar
          dataKey="count"
          fill="url(#skillGradient)"
          radius={[0, 6, 6, 0]}
          animationDuration={800}
          animationEasing="ease-out"
        />
        <defs>
          <linearGradient id="skillGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  )
}
