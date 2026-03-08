import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { getSalary } from '../api'

const GRADIENTS = {
  role: { id: 'salaryRoleGrad', from: '#10b981', to: '#06b6d4' },
  experience: { id: 'salaryExpGrad', from: '#8b5cf6', to: '#ec4899' },
}

export default function SalaryChart({ groupType = 'role', dark }) {
  const [data, setData] = useState([])

  useEffect(() => {
    getSalary(groupType).then(setData).catch(console.error)
  }, [groupType])

  if (!data.length) {
    return (
      <div className="empty-state">
        <svg className={`w-12 h-12 mb-3 ${dark ? 'text-navy-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>No salary data available</p>
        <p className={`text-xs mt-1 ${dark ? 'text-gray-600' : 'text-gray-300'}`}>Try refreshing the data pipeline</p>
      </div>
    )
  }

  const formatted = data.map((d) => ({
    name: d.group_value,
    salary: Math.round(d.avg_salary),
    count: d.count,
    min: d.min_salary,
    max: d.max_salary,
  }))

  const grad = GRADIENTS[groupType] || GRADIENTS.role

  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={formatted} margin={{ left: 20, right: 20, top: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={dark ? 'rgba(148,163,184,0.08)' : 'rgba(0,0,0,0.06)'} vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: dark ? '#94a3b8' : '#64748b', fontSize: 11, fontWeight: 500 }}
          angle={-20}
          textAnchor="end"
          height={60}
          axisLine={{ stroke: dark ? '#1c2744' : '#e2e8f0' }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
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
          cursor={{ fill: dark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.05)' }}
          formatter={(value, name) => {
            if (name === 'salary') return [`$${value.toLocaleString()}`, 'Avg Salary']
            return [value, name]
          }}
        />
        <Bar
          dataKey="salary"
          fill={`url(#${grad.id})`}
          radius={[6, 6, 0, 0]}
          animationDuration={800}
          animationEasing="ease-out"
        />
        <defs>
          <linearGradient id={grad.id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={grad.from} />
            <stop offset="100%" stopColor={grad.to} />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  )
}
