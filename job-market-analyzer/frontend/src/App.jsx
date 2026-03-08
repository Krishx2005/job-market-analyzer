import { useState, useEffect, useCallback } from 'react'
import { getOverview, getSkills, getCompanies, refreshPipeline } from './api'
import Dashboard from './components/Dashboard'
import Filters from './components/Filters'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StatsRow from './components/StatsRow'
import Footer from './components/Footer'

export default function App() {
  const [dark, setDark] = useState(true)
  const [overview, setOverview] = useState(null)
  const [topSkill, setTopSkill] = useState(null)
  const [topCompany, setTopCompany] = useState(null)
  const [filters, setFilters] = useState({})
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [ov, skills, companies] = await Promise.all([
        getOverview(),
        getSkills(1),
        getCompanies(1),
      ])
      setOverview(ov)
      setTopSkill(skills[0]?.skill || 'N/A')
      setTopCompany(companies[0]?.company || 'N/A')
      setLastUpdated(new Date())
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refreshPipeline()
      await fetchData()
    } catch (e) {
      console.error(e)
    }
    setRefreshing(false)
  }

  return (
    <div className={`${dark ? 'dark' : 'light'} min-h-screen transition-colors duration-300`}>
      <Navbar dark={dark} setDark={setDark} />
      <Hero
        dark={dark}
        lastUpdated={lastUpdated}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <StatsRow
          dark={dark}
          overview={overview}
          topSkill={topSkill}
          topCompany={topCompany}
          loading={loading}
        />
        <Filters dark={dark} filters={filters} onChange={setFilters} />
        <Dashboard dark={dark} filters={filters} />
      </main>
      <Footer dark={dark} />
    </div>
  )
}
