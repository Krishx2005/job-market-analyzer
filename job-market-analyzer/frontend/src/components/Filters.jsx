export default function Filters({ dark, filters, onChange }) {
  const update = (key, value) => {
    onChange({ ...filters, [key]: value || undefined })
  }

  const selectClass = `filter-select rounded-xl px-4 py-2.5 text-sm font-medium border transition-all duration-200 cursor-pointer ${
    dark
      ? 'bg-navy-800 border-navy-700 text-gray-300 hover:border-navy-600 focus:border-electric focus:ring-1 focus:ring-electric/30'
      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 focus:border-electric focus:ring-1 focus:ring-electric/30'
  } outline-none`

  const inputClass = `rounded-xl px-4 py-2.5 text-sm font-medium border transition-all duration-200 ${
    dark
      ? 'bg-navy-800 border-navy-700 text-gray-300 placeholder-gray-500 hover:border-navy-600 focus:border-electric focus:ring-1 focus:ring-electric/30'
      : 'bg-white border-gray-200 text-gray-700 placeholder-gray-400 hover:border-gray-300 focus:border-electric focus:ring-1 focus:ring-electric/30'
  } outline-none`

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <select
        value={filters.role_type || ''}
        onChange={(e) => update('role_type', e.target.value)}
        className={selectClass}
      >
        <option value="">All Roles</option>
        <option value="Data Analyst">Data Analyst</option>
        <option value="Data Scientist">Data Scientist</option>
      </select>

      <select
        value={filters.experience_level || ''}
        onChange={(e) => update('experience_level', e.target.value)}
        className={selectClass}
      >
        <option value="">All Experience</option>
        <option value="entry">Entry Level</option>
        <option value="mid">Mid Level</option>
        <option value="senior">Senior Level</option>
      </select>

      <input
        type="text"
        placeholder="Filter by location..."
        value={filters.location || ''}
        onChange={(e) => update('location', e.target.value)}
        className={inputClass}
      />
    </div>
  )
}
