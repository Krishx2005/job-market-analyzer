const STATS_CONFIG = [
  {
    key: 'total_jobs',
    label: 'Total Jobs',
    format: (v) => v?.toLocaleString() || '0',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: 'from-blue-500 to-blue-600',
    glow: 'shadow-blue-500/20',
  },
  {
    key: 'avg_salary',
    label: 'Avg Salary',
    format: (v) => v ? `$${Math.round(v).toLocaleString()}` : '$0',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'from-emerald-500 to-emerald-600',
    glow: 'shadow-emerald-500/20',
  },
  {
    key: 'top_skill',
    label: 'Top Skill',
    format: (v) => v || 'N/A',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: 'from-amber-500 to-orange-500',
    glow: 'shadow-amber-500/20',
  },
  {
    key: 'top_company',
    label: 'Top Company',
    format: (v) => v || 'N/A',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    color: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/20',
  },
]

function SkeletonCard({ dark }) {
  return (
    <div className={`rounded-2xl p-5 ${dark ? 'bg-navy-800 border border-navy-700' : 'bg-white border border-gray-200'}`}>
      <div className={`h-4 w-20 rounded skeleton mb-3`} />
      <div className={`h-8 w-28 rounded skeleton`} />
    </div>
  )
}

export default function StatsRow({ dark, overview, topSkill, topCompany, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 -mt-6 relative z-10 mb-8">
        {[0,1,2,3].map(i => <SkeletonCard key={i} dark={dark} />)}
      </div>
    )
  }

  const values = {
    total_jobs: overview?.total_jobs,
    avg_salary: overview?.avg_salary,
    top_skill: topSkill,
    top_company: topCompany,
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 -mt-6 relative z-10 mb-8">
      {STATS_CONFIG.map((stat, i) => (
        <div
          key={stat.key}
          className={`animate-fade-in-up stagger-${i + 1} rounded-2xl p-5 shadow-lg ${stat.glow} ${
            dark
              ? 'bg-navy-800/90 backdrop-blur border border-navy-700'
              : 'bg-white border border-gray-100'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-1.5 rounded-lg bg-gradient-to-br ${stat.color} text-white`}>
              {stat.icon}
            </div>
            <span className={`text-xs font-medium uppercase tracking-wider ${
              dark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {stat.label}
            </span>
          </div>
          <p className={`text-2xl font-bold truncate ${dark ? 'text-white' : 'text-gray-900'}`}>
            {stat.format(values[stat.key])}
          </p>
        </div>
      ))}
    </div>
  )
}
