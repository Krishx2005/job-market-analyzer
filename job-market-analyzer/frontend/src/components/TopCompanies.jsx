import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { getCompanies } from '../api'

export default function TopCompanies({ dark }) {
  const [data, setData] = useState([])

  useEffect(() => {
    getCompanies(10).then(setData).catch(console.error)
  }, [])

  if (!data.length) {
    return (
      <div className="empty-state">
        <svg className={`w-12 h-12 mb-3 ${dark ? 'text-navy-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <p className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>No company data available</p>
        <p className={`text-xs mt-1 ${dark ? 'text-gray-600' : 'text-gray-300'}`}>Try refreshing the data pipeline</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} layout="vertical" margin={{ left: 120, right: 20, top: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={dark ? 'rgba(148,163,184,0.08)' : 'rgba(0,0,0,0.06)'} horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: dark ? '#94a3b8' : '#64748b', fontSize: 12 }}
          axisLine={{ stroke: dark ? '#1c2744' : '#e2e8f0' }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="company"
          width={115}
          tick={{ fill: dark ? '#cbd5e1' : '#374151', fontSize: 11, fontWeight: 500 }}
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
          cursor={{ fill: dark ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.05)' }}
          formatter={(value) => [`${value} openings`, 'Jobs']}
        />
        <Bar
          dataKey="count"
          fill="url(#companyGradient)"
          radius={[0, 6, 6, 0]}
          animationDuration={800}
          animationEasing="ease-out"
        />
        <defs>
          <linearGradient id="companyGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  )
}
