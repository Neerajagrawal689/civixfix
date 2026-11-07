import { useState, useEffect } from 'react';
import { Megaphone, AlertTriangle, Info, ShieldAlert, Plus, X, Trash2, Clock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({ title: '', content: '', type: 'INFO' });
  const role = localStorage.getItem('role') || 'CITIZEN';

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/notices`);
      if (response.data.success) {
        setNotices(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load notices');
    } finally {
      setTimeout(() => setLoading(false), 500); // UI skeleton demo
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/v1/notices`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success('Notice published successfully');
        setNotices([response.data.data, ...notices]);
        setShowModal(false);
        setFormData({ title: '', content: '', type: 'INFO' });
      }
    } catch (error) {
      toast.error('Failed to publish notice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/v1/notices/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotices(notices.filter(n => n.id !== id));
      toast.success('Notice deleted');
    } catch (error) {
      toast.error('Failed to delete notice');
    }
  };

  const getTypeStyles = (type) => {
    switch(type) {
      case 'EMERGENCY': return { icon: ShieldAlert, bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20', glow: 'shadow-red-500/20' };
      case 'WARNING': return { icon: AlertTriangle, bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20', glow: 'shadow-amber-500/10' };
      default: return { icon: Info, bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20', glow: 'shadow-blue-500/10' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 animate-in fade-in duration-700 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest mb-3 border border-blue-500/20">
            <Megaphone size={14} /> City Updates
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">Smart Notice Board</h1>
          <p className="text-gray-500 dark:text-slate-400 font-medium mt-2">Real-time alerts and official announcements from the municipal corporation.</p>
        </div>
        
        {(role === 'OFFICER' || role === 'ADMIN') && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={18} /> New Notice
          </button>
        )}
      </div>

      {/* Notices Feed */}
      {loading ? (
        <div className="space-y-6">
          {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-200 dark:bg-slate-800/50 rounded-2xl animate-pulse"></div>)}
        </div>
      ) : notices.length === 0 ? (
        <div className="text-center py-20 bg-white/70 dark:bg-[#0B1120]/80 backdrop-blur-xl rounded-[2rem] border border-gray-100/50 dark:border-slate-800/60 shadow-sm">
          <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-slate-700">
            <Megaphone size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Active Notices</h3>
          <p className="text-gray-500 dark:text-slate-400">Everything is running smoothly in the city.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {notices.map((notice) => {
            const styles = getTypeStyles(notice.type);
            const Icon = styles.icon;
            return (
              <div key={notice.id} className={`group relative bg-white/70 dark:bg-[#0B1120]/80 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 border ${styles.border} shadow-sm hover:shadow-lg ${styles.glow} transition-all duration-300 hover:-translate-y-1 overflow-hidden`}>
                
                {/* Decorative glow blob */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 -translate-y-16 translate-x-16 pointer-events-none ${styles.bg.replace('/10', '')}`}></div>

                <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                  <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center ${styles.bg} ${styles.text} border ${styles.border}`}>
                    <Icon size={28} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{notice.title}</h2>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${styles.border} ${styles.text} ${styles.bg}`}>
                        {notice.type}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-slate-300 mb-6 leading-relaxed whitespace-pre-line">{notice.content}</p>
                    
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-slate-800/60">
                      <div className="flex items-center gap-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(notice.created_at).toLocaleString()}</span>
                        <span>•</span>
                        <span>By {notice.author?.name || 'Authority'}</span>
                      </div>
                      
                      {(role === 'OFFICER' || role === 'ADMIN') && (
                        <button 
                          onClick={() => handleDelete(notice.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="bg-white dark:bg-[#0B1120] rounded-[2rem] shadow-2xl border border-gray-100 dark:border-slate-800/60 w-full max-w-xl relative z-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800/60">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Megaphone className="text-blue-500" /> Publish Notice
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Notice Title</label>
                <input 
                  required type="text" 
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900 dark:text-white"
                  placeholder="E.g., Heavy Rainfall Alert Tomorrow"
                />
              </div>

              <div className="group">
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Type</label>
                <select 
                  value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-gray-900 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="INFO">ℹ️ General Information</option>
                  <option value="WARNING">⚠️ Warning</option>
                  <option value="EMERGENCY">🚨 Critical Emergency</option>
                </select>
              </div>

              <div className="group">
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Content</label>
                <textarea 
                  required rows="5"
                  value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900 dark:text-white resize-none"
                  placeholder="Provide full details of the notice..."
                ></textarea>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting || !formData.title || !formData.content}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Megaphone size={18} />} 
                  Publish Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
