import { useInView } from 'react-intersection-observer'
import SkillsChart from './SkillsChart'
import SalaryChart from './SalaryChart'
import WorkTypeChart from './WorkTypeChart'
import TopCompanies from './TopCompanies'
import DemandChart from './DemandChart'
import SkillsBubble from './SkillsBubble'

export default function Dashboard({ dark, filters }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
      <AnimatedCard dark={dark} title="Top Skills in Demand" delay={0}>
        <SkillsChart dark={dark} />
      </AnimatedCard>
      <AnimatedCard dark={dark} title="Skills Cloud" delay={1}>
        <SkillsBubble dark={dark} />
      </AnimatedCard>
      <AnimatedCard dark={dark} title="Average Salary by Role" delay={2}>
        <SalaryChart groupType="role" dark={dark} />
      </AnimatedCard>
      <AnimatedCard dark={dark} title="Work Type Distribution" delay={3}>
        <WorkTypeChart dark={dark} />
      </AnimatedCard>
      <AnimatedCard dark={dark} title="Top Hiring Companies" delay={4}>
        <TopCompanies dark={dark} />
      </AnimatedCard>
      <AnimatedCard dark={dark} title="Experience Level Demand" delay={5}>
        <DemandChart dark={dark} />
      </AnimatedCard>
      <AnimatedCard dark={dark} title="Salary by Experience" delay={6} className="lg:col-span-2">
        <SalaryChart groupType="experience" dark={dark} />
      </AnimatedCard>
    </div>
  )
}

function AnimatedCard({ dark, title, children, delay = 0, className = '' }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <div
      ref={ref}
      className={`chart-card rounded-2xl p-6 transition-all duration-300 ${
        dark
          ? 'bg-gradient-to-br from-navy-800/80 to-navy-900 border border-navy-700 shadow-lg shadow-black/20'
          : 'bg-white border border-gray-100 shadow-lg shadow-gray-200/50'
      } ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay * 0.08}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay * 0.08}s`,
      }}
    >
      <h3 className={`text-lg font-semibold mb-5 flex items-center gap-2 ${
        dark ? 'text-white' : 'text-gray-800'
      }`}>
        <div className={`w-1 h-5 rounded-full bg-gradient-to-b from-electric to-cyan-400`} />
        {title}
      </h3>
      <div className="chart-enter">
        {children}
      </div>
    </div>
  )
}
