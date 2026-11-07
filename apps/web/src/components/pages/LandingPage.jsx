import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Map, Camera, Activity, Zap, CheckCircle2, MessageSquare, Download, Info } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-gray-900 dark:text-white font-['Inter',sans-serif] overflow-x-hidden selection:bg-blue-500 selection:text-white">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Floating Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full overflow-hidden -z-10 opacity-60 dark:opacity-40 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
        <div className="absolute top-[15%] right-[10%] w-96 h-96 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[30%] left-[40%] w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Advanced Floating Navigation */}
      <nav className="fixed w-full z-50 top-6 px-4 sm:px-6 flex justify-center">
        <div className="w-full max-w-5xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full shadow-lg shadow-blue-500/20 flex items-center justify-center">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">CivicFix</h1>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-lg">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center mt-12 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative">
          
          {/* Floating UI Elements (Decorative) */}
          <div className="hidden lg:flex absolute -left-20 top-20 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 items-center gap-3 animate-[bounce_6s_infinite]">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><CheckCircle2 className="text-green-600 dark:text-green-400" size={20}/></div>
            <div className="text-left">
              <p className="text-xs font-bold text-gray-900 dark:text-white">Issue Resolved</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">Pothole at Main St.</p>
            </div>
          </div>
          <div className="hidden lg:flex absolute -right-16 top-40 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 items-center gap-3 animate-[bounce_7s_infinite] animation-delay-2000">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"><Zap className="text-blue-600 dark:text-blue-400" size={20}/></div>
            <div className="text-left">
              <p className="text-xs font-bold text-gray-900 dark:text-white">AI Routing</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">98% Confidence</p>
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/80 dark:bg-blue-900/30 backdrop-blur-md border border-blue-200/50 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 font-bold text-xs uppercase tracking-widest mb-8 shadow-sm">
            <Zap size={14} className="text-blue-500" /> Powered by Google Gemini AI
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-gray-900 dark:text-white mb-6 leading-[1.1]">
            Report Civic Issues. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Make Your City Better.
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 dark:text-slate-400 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
            Spot a pothole? See overflowing garbage? Just snap a photo, and our AI automatically routes it to the right department in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold text-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.2)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group">
              Report an Issue <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-medium text-gray-500 dark:text-slate-400">
            <div className="flex -space-x-3">
              {[11, 12, 13, 14, 15].map((i) => (
                <img key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 object-cover" src={`https://i.pravatar.cc/100?img=${i}`} alt="Citizen" />
              ))}
            </div>
            <span>Join <strong>10,000+</strong> citizens actively reporting</span>
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="max-w-4xl mx-auto mt-40 text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600 dark:text-blue-400">
            <Info size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-6">Bridging the gap between citizens and the government.</h2>
          <p className="text-lg text-gray-600 dark:text-slate-400 leading-relaxed font-medium">
            CivicFix was born out of a simple idea: making our cities better shouldn't be complicated. Traditional complaint systems are slow, manual, and lack transparency. We built a platform that empowers every citizen to act as the eyes and ears of the city, ensuring that infrastructure issues, sanitation problems, and hazards are identified instantly and routed to the correct authorities using the power of Artificial Intelligence.
          </p>
        </div>

        {/* Bento Box Feature Grid */}
        <div id="features" className="max-w-6xl mx-auto mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-4">A complete OS for your city.</h2>
            <p className="text-gray-500 dark:text-slate-400 font-medium">Everything you need to report, track, and resolve community issues effectively.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 (Spans 2 columns) */}
            <div className="md:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 p-8 sm:p-10 rounded-[2.5rem] border border-blue-100/50 dark:border-slate-700 overflow-hidden relative group">
              <div className="relative z-10 max-w-sm">
                <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 text-blue-600 shadow-sm">
                  <Zap size={28} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Intelligent AI Routing</h3>
                <p className="text-gray-600 dark:text-slate-400 leading-relaxed font-medium">No more confusion about which department handles what. Simply snap a picture and add a quick description. Our integration with Google Gemini AI instantly analyzes your report, categorizes the grievance, and automatically dispatches it to the exact government division responsible—drastically cutting down response times.</p>
              </div>
              <div className="absolute right-[-10%] bottom-[-20%] w-64 md:w-96 opacity-50 md:opacity-100 group-hover:scale-105 transition-transform duration-500">
                {/* Mockup visual representation */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 transform rotate-[-5deg]">
                  <div className="h-4 w-24 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-3"></div>
                  <div className="h-32 bg-gray-100 dark:bg-slate-700 rounded-xl mb-3 flex items-center justify-center"><Camera className="text-gray-400" /></div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md">Roads & Transport</span>
                    <span className="text-xs font-bold text-gray-400">Assigned ✅</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 (Spans 1 column) */}
            <div className="bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
                <Activity size={28} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Before & After Verification</h3>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed font-medium">Transparency is our priority. Hold officials accountable with a visual proof system. Once a field worker resolves your issue, they upload a completion photo. You can then use our interactive slider to compare the original problem with the verified fix before closing the case.</p>
            </div>

            {/* Feature 3 (Spans 1 column) */}
            <div className="bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-purple-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
                <MessageSquare size={28} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Real-Time Chat Thread</h3>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed font-medium">Eliminate the communication gap. CivicFix features a built-in, real-time messaging thread for every issue. Communicate directly with the assigned field worker to provide exact location details, get live updates on their progress, or answer any questions they might have.</p>
            </div>

            {/* Feature 4 (Spans 2 columns) */}
            <div className="md:col-span-2 bg-gray-900 dark:bg-slate-800 p-8 sm:p-10 rounded-[2.5rem] border border-gray-800 dark:border-slate-700 overflow-hidden relative group text-white hover:shadow-2xl transition-all">
              <div className="relative z-10 max-w-lg">
                <div className="w-14 h-14 bg-gray-800 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-6 text-orange-400">
                  <Download size={28} />
                </div>
                <h3 className="text-2xl font-black text-white mb-4">Download Official PDF Reports</h3>
                <p className="text-gray-400 leading-relaxed font-medium text-lg">Need hard evidence for a community meeting or records? With a single click, instantly generate and download a comprehensive, verified PDF document. It contains the complete lifecycle of your issue—including the initial report, GPS metadata, timestamps, the entire chat log, and the resolution proofs.</p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Advanced Footer */}
      <footer className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] mt-24 pt-16 pb-8 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={28} className="text-blue-600" />
                <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">CivicFix</span>
              </div>
              <p className="text-gray-500 dark:text-slate-400 font-medium max-w-sm mb-6 leading-relaxed">
                The smart city operating system empowering citizens and authorities to collaborate, track, and resolve local issues seamlessly using AI.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-gray-900 dark:text-white font-bold mb-4 uppercase tracking-wider text-xs">Platform</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Report Issue</a></li>
                <li><a href="#" className="text-sm text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">AI Routing</a></li>
                <li><a href="#" className="text-sm text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Analytics</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-gray-900 dark:text-white font-bold mb-4 uppercase tracking-wider text-xs">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-sm text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-sm text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 dark:text-slate-500 font-medium text-sm text-center md:text-left">
              © 2026 CivicFix Smart City OS. Built with React & Node.js for a better tomorrow.
            </p>
            <div className="mt-4 md:mt-0 flex gap-4 text-sm text-gray-400 dark:text-slate-500 font-medium">
              <span>Made with ❤️ for the community</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}



