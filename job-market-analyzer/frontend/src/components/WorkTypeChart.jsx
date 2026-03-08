import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { getWorkType } from '../api'

const COLORS = [
  { fill: '#3b82f6', shadow: 'rgba(59,130,246,0.3)' },
  { fill: '#10b981', shadow: 'rgba(16,185,129,0.3)' },
  { fill: '#f59e0b', shadow: 'rgba(245,158,11,0.3)' },
  { fill: '#ef4444', shadow: 'rgba(239,68,68,0.3)' },
]

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  if (percent < 0.05) return null
  const RADIAN = Math.PI / 180
  const radius = outerRadius + 28
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="#94a3b8"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
      fontWeight={500}
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function WorkTypeChart({ dark }) {
  const [data, setData] = useState([])

  useEffect(() => {
    getWorkType().then(setData).catch(console.error)
  }, [])

  if (!data.length) {
    return (
      <div className="empty-state">
        <svg className={`w-12 h-12 mb-3 ${dark ? 'text-navy-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
        <p className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>No work type data available</p>
        <p className={`text-xs mt-1 ${dark ? 'text-gray-600' : 'text-gray-300'}`}>Try refreshing the data pipeline</p>
      </div>
    )
  }

  const formatted = data.map((d) => ({
    name: d.work_type.charAt(0).toUpperCase() + d.work_type.slice(1),
    value: d.count,
  }))

  return (
    <ResponsiveContainer width="100%" height={360}>
      <PieChart>
        <Pie
          data={formatted}
          cx="50%"
          cy="50%"
          outerRadius={120}
          innerRadius={60}
          dataKey="value"
          label={renderCustomLabel}
          labelLine={false}
          animationDuration={800}
          animationEasing="ease-out"
          strokeWidth={2}
          stroke={dark ? '#0a0e1a' : '#ffffff'}
        >
          {formatted.map((_, i) => (
            <Cell
              key={i}
              fill={COLORS[i % COLORS.length].fill}
              style={{ filter: `drop-shadow(0 2px 8px ${COLORS[i % COLORS.length].shadow})` }}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: dark ? '#151d35' : '#fff',
            border: `1px solid ${dark ? '#253356' : '#e2e8f0'}`,
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            color: dark ? '#e2e8f0' : '#1e293b',
          }}
          formatter={(value) => [`${value} jobs`, 'Count']}
        />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={10}
          wrapperStyle={{ fontSize: '13px', color: dark ? '#94a3b8' : '#64748b' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
