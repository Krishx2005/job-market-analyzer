import { useState, useEffect, useRef } from 'react'
import { getSkills } from '../api'

const COLORS = [
  '#3b82f6', '#06b6d4', '#10b981', '#8b5cf6',
  '#f59e0b', '#ef4444', '#ec4899', '#14b8a6',
  '#6366f1', '#f97316', '#84cc16', '#0ea5e9',
]

export default function SkillsBubble({ dark }) {
  const [data, setData] = useState([])
  const [loaded, setLoaded] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    getSkills(20).then((d) => {
      setData(d)
      setTimeout(() => setLoaded(true), 100)
    }).catch(console.error)
  }, [])

  if (!data.length) {
    return (
      <div className="empty-state">
        <svg className={`w-12 h-12 mb-3 ${dark ? 'text-navy-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <p className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>No skills data available yet</p>
        <p className={`text-xs mt-1 ${dark ? 'text-gray-600' : 'text-gray-300'}`}>Try refreshing the data pipeline</p>
      </div>
    )
  }

  const maxCount = Math.max(...data.map(d => d.count))
  const minCount = Math.min(...data.map(d => d.count))

  return (
    <div ref={containerRef} className="flex flex-wrap items-center justify-center gap-3 py-4 px-2 min-h-[320px]">
      {data.map((item, i) => {
        const ratio = maxCount === minCount ? 1 : (item.count - minCount) / (maxCount - minCount)
        const size = 48 + ratio * 72
        const fontSize = 10 + ratio * 6
        const color = COLORS[i % COLORS.length]
        const delay = i * 50

        return (
          <div
            key={item.skill}
            className="skills-bubble flex items-center justify-center rounded-full text-white font-semibold text-center leading-tight"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              fontSize: `${fontSize}px`,
              backgroundColor: color,
              opacity: loaded ? 0.9 : 0,
              transform: loaded ? 'scale(1)' : 'scale(0)',
              transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
              boxShadow: `0 4px 20px ${color}33`,
            }}
            title={`${item.skill}: ${item.count} jobs`}
          >
            <span className="px-1 truncate">{item.skill}</span>
          </div>
        )
      })}
    </div>
  )
}
