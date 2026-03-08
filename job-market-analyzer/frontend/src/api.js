const BASE = '/api'

async function fetchJSON(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const getOverview = () => fetchJSON('/stats/overview')
export const getSkills = (limit = 15) => fetchJSON(`/stats/skills?limit=${limit}`)
export const getSalary = (groupType) => fetchJSON(`/stats/salary${groupType ? `?group_type=${groupType}` : ''}`)
export const getWorkType = () => fetchJSON('/stats/work-type')
export const getCompanies = (limit = 10) => fetchJSON(`/stats/companies?limit=${limit}`)
export const getDemand = () => fetchJSON('/stats/demand')
export const getJobs = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return fetchJSON(`/jobs?${qs}`)
}
export const refreshPipeline = () => fetch(`${BASE}/refresh`, { method: 'POST' }).then(r => r.json())
