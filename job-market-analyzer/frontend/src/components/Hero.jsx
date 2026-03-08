export default function Hero({ dark, lastUpdated, refreshing, onRefresh }) {
  const formattedDate = lastUpdated
    ? lastUpdated.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : null

  return (
    <div className={`relative overflow-hidden ${dark ? 'bg-navy-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
      {dark && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-electric/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-cyan-500/5 blur-3xl" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="animate-fade-in-up">
            <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              dark ? 'text-white' : 'text-gray-900'
            }`}>
              Job Market{' '}
              <span className="bg-gradient-to-r from-electric to-cyan-400 bg-clip-text text-transparent">
                Analytics
              </span>
            </h1>
            <p className={`mt-2 text-base sm:text-lg ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              Data Analyst & Data Scientist market insights across the US
            </p>
            {formattedDate && (
              <p className={`mt-1 text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                Last updated: {formattedDate}
              </p>
            )}
          </div>

          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="animate-fade-in group flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white
              bg-gradient-to-r from-electric to-blue-600 hover:from-blue-600 hover:to-electric
              shadow-lg shadow-electric/20 hover:shadow-electric/30
              disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <svg
              className={`w-4 h-4 transition-transform ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>
    </div>
  )
}
