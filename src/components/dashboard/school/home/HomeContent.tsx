export function HomeContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, Sarah</h1>
          <p className="text-sm text-slate-500">Hillside Middle • Wednesday, 15 July 2026</p>
        </div>
        <button className="bg-[#4D6F4D] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
          <span>+</span>
          <span>Create survey</span>
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">At a glance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric Cards */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <div className="text-xs text-slate-500 font-medium">Latest report</div>
              <div className="w-6 h-6 rounded bg-green-100 flex items-center justify-center text-green-600">📄</div>
            </div>
            <div className="text-2xl font-bold">6-8 Spring 2025</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <div className="text-xs text-slate-500 font-medium">Next scheduled</div>
              <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-600">📅</div>
            </div>
            <div>
              <div className="text-2xl font-bold">6-8 Fall 2026</div>
              <div className="text-xs text-slate-500 mt-1">Opens 15 September</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <div className="text-xs text-slate-500 font-medium">Total Reports</div>
              <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center text-purple-600">📄</div>
            </div>
            <div className="text-2xl font-bold">23 reports</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <div className="text-xs text-slate-500 font-medium">Total Surveys</div>
              <div className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center text-orange-600">📋</div>
            </div>
            <div className="text-2xl font-bold">28 surveys</div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
         {/* Live Survey Card placeholder */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-semibold text-lg">Fall 2025 <span className="text-xs font-normal bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-2">Live</span></h3>
            <div className="mt-4 text-sm text-slate-500">Responses placeholder...</div>
         </div>
         {/* Report Card placeholder */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-semibold text-lg">Spring 2025</h3>
            <div className="mt-4 text-sm text-slate-500">Responses placeholder...</div>
         </div>
      </div>
    </div>
  );
}
