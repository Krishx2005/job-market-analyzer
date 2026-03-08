const BASE = '/api'

// Fallback data for static deployment (no backend)
const FALLBACK = {
  overview: {"total_jobs":304,"avg_salary":105528.82,"unique_companies":30,"unique_locations":15},
  skills: [
    {"skill":"Python","count":134,"role_type":"Data Analyst"},
    {"skill":"SQL","count":119,"role_type":"Data Analyst"},
    {"skill":"Git","count":117,"role_type":"Data Analyst"},
    {"skill":"Pandas","count":115,"role_type":"Data Analyst"},
    {"skill":"Statistics","count":112,"role_type":"Data Analyst"},
    {"skill":"A/B Testing","count":111,"role_type":"Data Analyst"},
    {"skill":"R","count":103,"role_type":"Data Analyst"},
    {"skill":"Looker","count":69,"role_type":"Data Analyst"},
    {"skill":"Data Warehousing","count":68,"role_type":"Data Analyst"},
    {"skill":"Excel","count":61,"role_type":"Data Analyst"},
    {"skill":"BigQuery","count":60,"role_type":"Data Analyst"},
    {"skill":"TensorFlow","count":57,"role_type":"Data Scientist"},
    {"skill":"PostgreSQL","count":56,"role_type":"Data Analyst"},
    {"skill":"Tableau","count":56,"role_type":"Data Analyst"},
    {"skill":"PyTorch","count":54,"role_type":"Data Scientist"},
    {"skill":"Spark","count":53,"role_type":"Data Scientist"},
    {"skill":"Scikit-learn","count":52,"role_type":"Data Scientist"},
    {"skill":"Computer Vision","count":52,"role_type":"Data Scientist"},
    {"skill":"Power BI","count":51,"role_type":"Data Analyst"},
    {"skill":"ETL","count":50,"role_type":"Data Analyst"}
  ],
  salary_role: [
    {"group_key":"role_Data Analyst","group_type":"role","group_value":"Data Analyst","avg_salary":85730.54,"min_salary":51403,"max_salary":139862,"count":154},
    {"group_key":"role_Data Scientist","group_type":"role","group_value":"Data Scientist","avg_salary":125855.04,"min_salary":70163,"max_salary":209614,"count":150}
  ],
  salary_experience: [
    {"group_key":"experience_entry","group_type":"experience","group_value":"Entry","avg_salary":73252.69,"min_salary":51403,"max_salary":99958,"count":87},
    {"group_key":"experience_mid","group_type":"experience","group_value":"Mid","avg_salary":104403.76,"min_salary":70295,"max_salary":139567,"count":149},
    {"group_key":"experience_senior","group_type":"experience","group_value":"Senior","avg_salary":149288.48,"min_salary":95972,"max_salary":209614,"count":68}
  ],
  work_type: [
    {"work_type":"hybrid","count":132},
    {"work_type":"remote","count":88},
    {"work_type":"onsite","count":84}
  ],
  companies: [
    {"company":"Netflix","count":18},
    {"company":"Square","count":15},
    {"company":"Nike","count":15},
    {"company":"Target","count":14},
    {"company":"Capital One","count":13},
    {"company":"Meta","count":13},
    {"company":"Coinbase","count":13},
    {"company":"Snowflake","count":13},
    {"company":"Spotify","count":12},
    {"company":"Twitter","count":11}
  ],
  demand: [
    {"experience_level":"mid","count":149},
    {"experience_level":"entry","count":87},
    {"experience_level":"senior","count":68}
  ]
}

async function fetchJSON(path) {
  try {
    const res = await fetch(`${BASE}${path}`)
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json()
  } catch {
    return null
  }
}

export const getOverview = async () =>
  (await fetchJSON('/stats/overview')) ?? FALLBACK.overview

export const getSkills = async (limit = 15) =>
  (await fetchJSON(`/stats/skills?limit=${limit}`)) ?? FALLBACK.skills.slice(0, limit)

export const getSalary = async (groupType) => {
  const live = await fetchJSON(`/stats/salary${groupType ? `?group_type=${groupType}` : ''}`)
  if (live) return live
  return groupType === 'experience' ? FALLBACK.salary_experience : FALLBACK.salary_role
}

export const getWorkType = async () =>
  (await fetchJSON('/stats/work-type')) ?? FALLBACK.work_type

export const getCompanies = async (limit = 10) =>
  (await fetchJSON(`/stats/companies?limit=${limit}`)) ?? FALLBACK.companies.slice(0, limit)

export const getDemand = async () =>
  (await fetchJSON('/stats/demand')) ?? FALLBACK.demand

export const getJobs = async (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return (await fetchJSON(`/jobs?${qs}`)) ?? { jobs: [], total: 0, page: 1, per_page: 20 }
}

export const refreshPipeline = () => fetch(`${BASE}/refresh`, { method: 'POST' }).then(r => r.json()).catch(() => ({ status: 'unavailable' }))
