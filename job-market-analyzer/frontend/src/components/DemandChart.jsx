import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { getDemand } from '../api'

export default function DemandChart({ dark }) {
  const [data, setData] = useState([])

  useEffect(() => {
    getDemand().then(setData).catch(console.error)
  }, [])

  if (!data.length) {
    return (
      <div className="empty-state">
        <svg className={`w-12 h-12 mb-3 ${dark ? 'text-navy-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <p className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>No demand data available</p>
        <p className={`text-xs mt-1 ${dark ? 'text-gray-600' : 'text-gray-300'}`}>Try refreshing the data pipeline</p>
      </div>
    )
  }

  const formatted = data.map((d) => ({
    name: d.experience_level.charAt(0).toUpperCase() + d.experience_level.slice(1),
    count: d.count,
  }))

  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={formatted} margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={dark ? 'rgba(148,163,184,0.08)' : 'rgba(0,0,0,0.06)'} vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: dark ? '#94a3b8' : '#64748b', fontSize: 13, fontWeight: 500 }}
          axisLine={{ stroke: dark ? '#1c2744' : '#e2e8f0' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: dark ? '#94a3b8' : '#64748b', fontSize: 12 }}
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
          cursor={{ fill: dark ? 'rgba(245,158,11,0.08)' : 'rgba(245,158,11,0.05)' }}
          formatter={(value) => [`${value} jobs`, 'Count']}
        />
        <Bar
          dataKey="count"
          fill="url(#demandGradient)"
          radius={[6, 6, 0, 0]}
          animationDuration={800}
          animationEasing="ease-out"
        />
        <defs>
          <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  )
}
