import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, Clock, Award, Activity, MapPin, ArrowRight, ShieldCheck, Sparkles, ChevronRight, Zap } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    xp: 0
  });
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = localStorage.getItem('role') || 'CITIZEN';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/v1/issues`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const issues = response.data.data;
          
          const resolved = issues.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length;
          const total = issues.length;
          
          setStats({
            total,
            resolved,
            pending: total - resolved,
            xp: resolved * 50 + (total * 10)
          });

          setRecentIssues(issues.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setTimeout(() => setLoading(false), 600); // Artificial delay to show skeleton
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'ASSIGNED': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'IN_PROGRESS': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      case 'RESOLVED': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'CLOSED': return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  const level = Math.floor(stats.xp / 100) + 1;
  const xpProgress = (stats.xp % 100);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-40 bg-gray-200 dark:bg-slate-800/50 rounded-3xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-slate-800/50 rounded-3xl"></div>)}
        </div>
        <div className="h-96 bg-gray-200 dark:bg-slate-800/50 rounded-3xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#0B1120] border border-gray-100 dark:border-slate-800/60 p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] isolate animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-purple-50 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10 -z-10"></div>
        
        {/* Animated Glow Orbs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite] -z-10"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite] -z-10"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-xs uppercase tracking-widest mb-4 shadow-sm border border-blue-200/50 dark:border-blue-700/50">
              <Sparkles size={14} /> Smart City OS
            </div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{user.name?.split(' ')[0] || 'Citizen'}</span>! {role === 'OFFICER' ? '🛡️' : '👋'}
            </h1>
            <p className="text-gray-500 dark:text-slate-400 font-medium max-w-xl text-lg">
              {role === 'OFFICER' ? 'Here is the real-time civic overview of your jurisdiction.' : 'Your actions are shaping a better, smarter city for everyone.'}
            </p>
          </div>
          
          {role !== 'OFFICER' && (
            <Link 
              to="/report" 
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-2xl overflow-hidden transition-transform hover:scale-[1.02] active:scale-95 shadow-xl"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <AlertCircle size={20} className="relative z-10" />
              <span className="relative z-10">Report New Issue</span>
            </Link>
          )}
        </div>
      </div>

      {/* Advanced Glassmorphic Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Reports', value: stats.total, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'hover:border-blue-500/30 dark:hover:border-blue-500/30' },
          { label: 'Resolved Issues', value: stats.resolved, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'hover:border-emerald-500/30 dark:hover:border-emerald-500/30' },
          { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'hover:border-orange-500/30 dark:hover:border-orange-500/30' },
          { label: 'Civic Level', value: `Lv. ${level}`, icon: Award, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'hover:border-purple-500/30 dark:hover:border-purple-500/30', sub: `${xpProgress}% to next level` }
        ].map((stat, i) => (
          <div key={i} className={`group relative bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-gray-100 dark:border-slate-800 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:-translate-y-1 overflow-hidden ${stat.border} animate-in fade-in slide-in-from-bottom-4`} style={{ animationDelay: `${(i+1)*100}ms` }}>
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-current opacity-[0.03] rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700 ${stat.color}`}></div>
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-gray-500 dark:text-slate-400 font-bold uppercase tracking-wider text-xs mb-2">{stat.label}</p>
                <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{stat.value}</h3>
                {stat.sub && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-full bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${stat.color.replace('text-', 'bg-')} rounded-full transition-all duration-1000`} style={{ width: `${xpProgress}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-gray-400 whitespace-nowrap">{stat.sub}</span>
                  </div>
                )}
              </div>
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modern Activity List */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '500ms' }}>
        <div className="p-6 md:px-8 border-b border-gray-100 dark:border-slate-800/60 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/20 backdrop-blur-md">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Zap className="text-amber-500" size={24} /> Recent Activity
          </h2>
          <Link to="/my-issues" className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center group bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-xl transition-colors">
            View All <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="divide-y divide-gray-50 dark:divide-slate-800/40">
          {recentIssues.length > 0 ? (
            recentIssues.map((issue) => (
              <Link 
                key={issue.id} 
                to={`/issues/${issue.id}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 md:px-8 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4 sm:mb-0">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-slate-800/80 flex items-center justify-center shrink-0 border border-gray-200/50 dark:border-slate-700/50 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                    <MapPin size={22} className="text-gray-400 dark:text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{issue.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 line-clamp-1">{issue.address}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs font-medium text-gray-400 dark:text-slate-500">
                      <span className="flex items-center gap-1"><Clock size={12} /> {new Date(issue.created_at).toLocaleDateString()}</span>
                      <span className="text-gray-300 dark:text-slate-700">•</span>
                      <span className="bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded text-gray-500 dark:text-slate-400">ID: {issue.issue_number}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                  <span className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider border ${getStatusColor(issue.status)}`}>
                    {issue.status.replace('_', ' ')}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-300 group-hover:shadow-md">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-16 text-center">
              <div className="w-24 h-24 bg-gray-50 dark:bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gray-100 dark:border-slate-700">
                <CheckCircle size={40} className="text-gray-300 dark:text-slate-600" />
              </div>
              <p className="text-gray-900 dark:text-white text-xl font-bold mb-2">No recent issues reported</p>
              <p className="text-gray-500 dark:text-slate-400 text-sm max-w-xs mx-auto">When you report an issue, it will appear here for you to track its progress.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
