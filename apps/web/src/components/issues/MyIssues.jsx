import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, MapPin, Clock, ArrowRight, Share2, Award, Filter, CheckCircle2, AlertCircle, ThumbsUp, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../config/api';

export default function MyIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, RESOLVED

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const res = await fetch(`${API_BASE_URL}/api/v1/issues`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.success) {
          setIssues(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch issues', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'SUBMITTED': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ASSIGNED': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'IN_PROGRESS': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'RESOLVED': return 'bg-green-50 text-green-700 border-green-200';
      case 'CLOSED': return 'bg-gray-50 dark:bg-slate-900/50 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700';
      default: return 'bg-gray-50 dark:bg-slate-900/50 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700';
    }
  };

  const resolvedCount = issues.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length;
  const xp = resolvedCount * 50 + (issues.length * 10);

  const filteredIssues = issues.filter(issue => {
    if (filter === 'ALL') return true;
    if (filter === 'RESOLVED') return issue.status === 'RESOLVED' || issue.status === 'CLOSED';
    if (filter === 'PENDING') return issue.status !== 'RESOLVED' && issue.status !== 'CLOSED';
    return true;
  });

  if (loading) {
    return <div className="p-8 text-center text-gray-500 dark:text-slate-400 animate-pulse">Loading your civic impact...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Gamification Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-2xl p-6 md:p-8 mb-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
            <Award size={32} className="text-yellow-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Your Civic Impact</h2>
            <p className="text-blue-200 text-sm mt-1">You've helped identify {issues.length} issues in your city.</p>
          </div>
        </div>
        <div className="relative z-10 flex gap-4 w-full md:w-auto">
          <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/10 flex-1 md:flex-none md:min-w-[120px] text-center">
            <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Total XP</p>
            <p className="text-2xl font-black">{xp}</p>
          </div>
          <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/10 flex-1 md:flex-none md:min-w-[120px] text-center">
            <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Resolved</p>
            <p className="text-2xl font-black">{resolvedCount}</p>
          </div>
        </div>
      </div>

      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <Filter size={18} className="text-gray-400 dark:text-slate-500 mr-2" />
          {['ALL', 'PENDING', 'RESOLVED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === f 
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border-2 border-blue-200' 
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 border-2 border-transparent hover:bg-gray-50 dark:bg-slate-900/50'
              }`}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <Link to="/report" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-md shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all text-center flex items-center justify-center">
          + New Report
        </Link>
      </div>

      {/* Issue Grid */}
      {filteredIssues.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-16 text-center rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mb-4">
            {filter === 'ALL' ? <FileText size={40} className="text-gray-300" /> : <CheckCircle2 size={40} className="text-gray-300" />}
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No {filter !== 'ALL' ? filter.toLowerCase() : ''} issues found</h3>
          <p className="text-gray-500 dark:text-slate-400 mb-8 max-w-md">
            {filter === 'ALL' 
              ? "You haven't reported any issues yet. Be the change in your neighborhood!" 
              : `You don't have any ${filter.toLowerCase()} issues at the moment.`}
          </p>
          {filter === 'ALL' && (
            <Link to="/report" className="text-blue-600 font-bold hover:underline flex items-center">
              Start reporting now <ArrowRight size={16} className="ml-1" />
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map(issue => (
            <div key={issue.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 group flex flex-col">
              <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-slate-800">
                {issue.images && issue.images.length > 0 ? (
                  <img src={`${API_BASE_URL}${issue.images[0].url}`} alt="Issue" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText size={40} className="text-gray-300" />
                  </div>
                )}
                
                {/* Floating Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border ${getStatusColor(issue.status).split(' ')[2]} ${getStatusColor(issue.status).split(' ')[1]}`}>
                    {issue.status.replace('_', ' ')}
                  </span>
                </div>
                
                {/* Quick Share Button (UI stub) */}
                <button 
                  onClick={(e) => { e.preventDefault(); toast.success('Share link copied to clipboard!'); }}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center text-gray-600 dark:text-slate-400 hover:text-blue-600 hover:scale-110 transition-all shadow-sm opacity-0 group-hover:opacity-100"
                  title="Share this issue"
                >
                  <Share2 size={14} />
                </button>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs text-gray-400 dark:text-slate-500 font-bold tracking-wider">{issue.issue_number}</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 dark:bg-orange-950/30 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-800/40" title="Community Upvotes">
                      <ThumbsUp size={11} /> {issue._count?.supports || 0}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800/40" title="Comments">
                      <MessageCircle size={11} /> {issue._count?.comments || 0}
                    </span>
                    <div className="flex items-center text-xs text-gray-400 dark:text-slate-500 font-medium bg-gray-50 dark:bg-slate-900/50 px-2 py-1 rounded-md">
                      <Clock size={12} className="mr-1" />
                      {new Date(issue.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
                
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                  {issue.title}
                </h3>
                
                <div className="flex items-start text-sm text-gray-600 dark:text-slate-400 mb-6 flex-1">
                  <MapPin size={16} className="mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2 leading-relaxed">{issue.address}</span>
                </div>
                
                {/* AI Priority Indicator (if verified) */}
                {issue.ai_priority && (
                  <div className="flex items-center gap-2 mb-4 bg-gray-50 dark:bg-slate-900/50 p-2 rounded-lg border border-gray-100 dark:border-slate-700">
                    <AlertCircle size={14} className={issue.ai_priority === 'HIGH' || issue.ai_priority === 'CRITICAL' ? 'text-red-500' : 'text-blue-500'} />
                    <span className="text-xs font-semibold text-gray-600 dark:text-slate-400">AI Priority: <span className={issue.ai_priority === 'HIGH' || issue.ai_priority === 'CRITICAL' ? 'text-red-600' : 'text-blue-600'}>{issue.ai_priority}</span></span>
                  </div>
                )}
                
                <Link to={`/issues/${issue.id}`} className="block w-full text-center py-2.5 bg-blue-50 text-blue-700 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center">
                  Track Progress <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



