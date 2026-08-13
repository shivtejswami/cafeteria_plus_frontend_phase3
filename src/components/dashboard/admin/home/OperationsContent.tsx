export function OperationsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Good afternoon, Emily</h1>
        <p className="text-sm text-slate-500">Tuesday, July 21, 2026 • SFWG internal console</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {/* Top Metric Cards */}
        <div className="bg-white  p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-start">
             <div className="text-sm font-medium text-slate-500">Open surveys</div>
             <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center text-purple-600">📋</div>
          </div>
          <div className="text-3xl font-bold mt-2">34</div>
          <div className="text-xs text-slate-500 mt-1">Collecting responses now.</div>
        </div>

        <div className="bg-white  p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-start">
             <div className="text-sm font-medium text-slate-500">Unresolved support requests</div>
             <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center text-purple-600">🎧</div>
          </div>
          <div className="text-3xl font-bold mt-2">4</div>
          <div className="text-xs text-slate-500 mt-1">Awaiting SPWG response.</div>
        </div>

        <div className="bg-white  p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-start">
             <div className="text-sm font-medium text-slate-500">Active customers</div>
             <div className="w-6 h-6 rounded bg-green-100 flex items-center justify-center text-green-600">🏢</div>
          </div>
          <div className="text-3xl font-bold mt-2">128</div>
          <div className="text-xs text-slate-500 mt-1">112 schools • 16 districts</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-white  p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-semibold text-lg flex items-center gap-2">Reports awaiting review <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">5</span></h3>
             <button className="text-sm text-purple-600 font-medium">View all</button>
          </div>
          <div className="text-slate-500 text-sm">Table placeholder...</div>
        </div>

        <div className="space-y-6">
          <div className="bg-white  p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
             <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">Expiring subscriptions <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">3</span></h3>
             <div className="text-slate-500 text-sm">List placeholder...</div>
          </div>
          <div className="bg-white  p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
             <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">Low participation <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">3</span></h3>
             <div className="text-slate-500 text-sm">List placeholder...</div>
          </div>
          <div className="bg-white  p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
             <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">Support requests <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">3</span></h3>
             <div className="text-slate-500 text-sm">List placeholder...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
