import { useState, useEffect } from 'react';
import { ClipboardList, MapPin, Calendar, CheckCircle, Clock, CheckCircle2, ChevronRight, HardHat, Camera, UploadCloud, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../config/api';

export default function StaffDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // For resolving modal
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAssignedIssues();
  }, []);

  const fetchAssignedIssues = async () => {
    try {
      const token = localStorage.getItem('token');
      // For WORKER role, getIssues API filters automatically via the backend
      const response = await axios.get(`${API_BASE_URL}/api/v1/issues`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setIssues(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load assignments');
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(`${API_BASE_URL}/api/v1/issues/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast.success(`Task marked as ${status}`);
        fetchAssignedIssues();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const openResolveModal = (issue) => {
    setSelectedIssue(issue);
    setShowResolveModal(true);
    setAfterImage(null);
    setPreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAfterImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('status', 'RESOLVED');
      if (afterImage) {
        formData.append('image', afterImage);
      }
      
      const res = await axios.patch(`${API_BASE_URL}/api/v1/issues/${selectedIssue.id}/status`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        toast.success('Task marked as RESOLVED! 🎉');
        setShowResolveModal(false);
        fetchAssignedIssues();
      }
    } catch (error) {
      toast.error('Failed to resolve task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ASSIGNED': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'RESOLVED': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 animate-in fade-in duration-700 pb-12">
      
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-orange-600 to-amber-600 border border-orange-500/50 p-8 sm:p-12 mb-8 shadow-[0_8px_40px_rgba(234,88,12,0.3)] flex flex-col md:flex-row justify-between items-center gap-8 group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2 pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
        
        <div className="relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs uppercase tracking-widest mb-4 border border-white/20 backdrop-blur-md">
            <HardHat size={14} /> Ground Operations
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-2">My Field Tasks</h1>
          <p className="text-orange-100 font-medium text-lg max-w-lg">Manage your assignments, update statuses, and report resolutions directly from the field.</p>
        </div>
        
        <div className="relative z-10">
          <div className="w-32 h-32 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex flex-col items-center justify-center text-white shadow-inner">
            <span className="text-4xl font-black">{issues.filter(i => i.status !== 'RESOLVED').length}</span>
            <span className="text-xs font-bold uppercase tracking-widest opacity-80 mt-1">Pending</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-200 dark:bg-slate-800/50 rounded-[2rem] animate-pulse"></div>)}
        </div>
      ) : issues.length === 0 ? (
        <div className="text-center py-20 bg-white/70 dark:bg-[#0B1120]/80 backdrop-blur-xl rounded-[2rem] border border-gray-100/50 dark:border-slate-800/60 shadow-sm">
          <div className="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-slate-700">
            <ClipboardList size={40} className="text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No active assignments</h3>
          <p className="text-gray-500 dark:text-slate-400 text-lg">You have no tasks assigned to you right now. Take a break! ☕</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {issues.map((issue) => (
            <div key={issue.id} className="group bg-white/70 dark:bg-[#0B1120]/80 backdrop-blur-xl rounded-[2rem] p-6 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all duration-300 flex flex-col">
              
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(issue.status)}`}>
                  {issue.status.replace('_', ' ')}
                </span>
                <span className="text-xs font-bold text-gray-400 tracking-wider">#{issue.issue_number}</span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{issue.title}</h3>
              <p className="text-gray-500 dark:text-slate-400 text-sm line-clamp-2 mb-6 flex-1">{issue.description}</p>
              
              <div className="space-y-3 mb-6 bg-gray-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-800/60">
                <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-slate-300 font-medium">
                  <MapPin size={16} className="text-orange-500 mt-0.5 shrink-0" />
                  <span>{issue.address || 'Location provided on map'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-slate-300 font-medium">
                  <Calendar size={16} className="text-blue-500 shrink-0" />
                  <span>Reported on {new Date(issue.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-auto">
                {issue.status === 'ASSIGNED' && (
                  <button 
                    onClick={() => handleStatusUpdate(issue.id, 'IN_PROGRESS')}
                    className="col-span-2 flex items-center justify-center gap-2 py-3.5 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 dark:text-blue-400 rounded-xl font-bold transition-colors"
                  >
                    <Clock size={18} /> Start Work (In Progress)
                  </button>
                )}
                
                {issue.status === 'IN_PROGRESS' && (
                  <button 
                    onClick={() => openResolveModal(issue)}
                    className="col-span-2 flex items-center justify-center gap-2 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5 active:scale-95"
                  >
                    <CheckCircle2 size={18} /> Mark as Resolved
                  </button>
                )}

                <Link 
                  to={`/issues/${issue.id}`}
                  className={`${(issue.status === 'ASSIGNED' || issue.status === 'IN_PROGRESS') ? 'col-span-2' : 'col-span-2'} flex items-center justify-center gap-2 py-3 border-2 border-gray-200 dark:border-slate-700 hover:border-gray-900 dark:hover:border-white text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white rounded-xl font-bold transition-all`}
                >
                  View Details <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resolution Modal */}
      {showResolveModal && selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 dark:bg-black/60 backdrop-blur-sm" onClick={() => setShowResolveModal(false)}></div>
          <div className="bg-white dark:bg-[#0B1120] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-slate-800/60 w-full max-w-lg relative z-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 sm:p-8 border-b border-gray-100 dark:border-slate-800/60">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500" /> Complete Task
              </h2>
            </div>
            
            <form onSubmit={handleResolveSubmit} className="p-6 sm:p-8 space-y-6">
              
              <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl p-4 text-emerald-800 dark:text-emerald-400 text-sm font-medium">
                You are marking <strong>#{selectedIssue.issue_number}</strong> as fully resolved. Please provide proof of work if possible.
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Upload 'After' Photo (Optional)</label>
                
                <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl bg-gray-50 dark:bg-slate-900/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all cursor-pointer overflow-hidden group">
                  {preview ? (
                    <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Camera className="w-10 h-10 text-gray-400 mb-3 group-hover:text-emerald-500 transition-colors" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-slate-400 font-medium"><span className="font-bold text-emerald-500">Click to upload</span> or drag and drop</p>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowResolveModal(false)} className="flex-1 py-4 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl font-bold transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all active:scale-95 disabled:opacity-50">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />} 
                  Submit & Resolve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
