import { useState, useEffect } from 'react';
import { Search, MapPin, Phone, User, PackageSearch, PackageX, Plus, X, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

export default function LostAndFound() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, LOST, FOUND
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ item_name: '', description: '', type: 'LOST', location: '', contact_info: '' });
  
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/lost-and-found`);
      if (response.data.success) {
        setItems(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load items');
    } finally {
      setTimeout(() => setLoading(false), 600); // Skeleton delay
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/v1/lost-and-found`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success('Item reported successfully!');
        setItems([response.data.data, ...items]);
        setShowModal(false);
        setFormData({ item_name: '', description: '', type: 'LOST', location: '', contact_info: '' });
      }
    } catch (error) {
      toast.error('Failed to report item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`${API_BASE_URL}/api/v1/lost-and-found/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setItems(items.map(item => item.id === id ? response.data.data : item));
        toast.success(`Marked as ${newStatus}`);
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredItems = items.filter(item => activeTab === 'ALL' || item.type === activeTab);

  return (
    <div className="max-w-6xl mx-auto py-8 animate-in fade-in duration-700 pb-12">
      
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 dark:bg-[#0B1120] border border-gray-800 p-8 sm:p-12 mb-8 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/2 pointer-events-none"></div>
        
        <div className="relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-4 border border-emerald-500/20">
            <Search size={14} /> Community Watch
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-2">Lost & Found Hub</h1>
          <p className="text-gray-400 font-medium text-lg max-w-lg">Help neighbors reunite with their belongings. Report lost items or post what you've found in the city.</p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="relative z-10 group flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Report Item
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-white dark:bg-slate-800 p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          {['ALL', 'LOST', 'FOUND'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab 
                  ? 'bg-gray-900 dark:bg-blue-600 text-white shadow-md' 
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-gray-200 dark:bg-slate-800/50 rounded-3xl animate-pulse"></div>)}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-slate-700 shadow-sm">
            <PackageSearch size={40} className="text-gray-300 dark:text-slate-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No items reported</h3>
          <p className="text-gray-500 dark:text-slate-400">Be the hero. Report found items here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="group bg-white dark:bg-[#0f172a] rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
              
              <div className={`p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center ${item.type === 'LOST' ? 'bg-red-50/50 dark:bg-red-900/10' : 'bg-emerald-50/50 dark:bg-emerald-900/10'}`}>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${item.type === 'LOST' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                  {item.type === 'LOST' ? <PackageX size={14} /> : <PackageSearch size={14} />} 
                  {item.type}
                </span>
                
                {item.status === 'RESOLVED' && (
                  <span className="flex items-center gap-1 text-xs font-bold text-gray-400 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                    <CheckCircle2 size={14} /> Resolved
                  </span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-2 ${item.status === 'RESOLVED' && 'line-through opacity-50'}`}>{item.item_name}</h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 flex-1">{item.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-300 font-medium">
                    <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300 font-medium">
                    <User size={16} className="text-gray-400 shrink-0" />
                    <span>{item.reporter?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300 font-medium">
                    <Phone size={16} className="text-gray-400 shrink-0" />
                    <span>{item.contact_info}</span>
                  </div>
                </div>

                {item.reporter_id === currentUser.id && item.status === 'ACTIVE' && (
                  <button 
                    onClick={() => handleStatusUpdate(item.id, 'RESOLVED')}
                    className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-xl text-sm font-bold transition-colors"
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 dark:bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="bg-white dark:bg-[#0B1120] rounded-[2rem] shadow-2xl border border-gray-100 dark:border-slate-800/60 w-full max-w-lg relative z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800/60">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Report Item</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setFormData({...formData, type: 'LOST'})} className={`py-4 rounded-2xl font-bold transition-all border-2 ${formData.type === 'LOST' ? 'border-red-500 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400' : 'border-gray-100 dark:border-slate-800 text-gray-500'}`}>Lost Something</button>
                <button type="button" onClick={() => setFormData({...formData, type: 'FOUND'})} className={`py-4 rounded-2xl font-bold transition-all border-2 ${formData.type === 'FOUND' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400' : 'border-gray-100 dark:border-slate-800 text-gray-500'}`}>Found Something</button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Item Name</label>
                <input required type="text" value={formData.item_name} onChange={e => setFormData({...formData, item_name: e.target.value})} placeholder="E.g., Blue Wallet, Car Keys" className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-900 dark:text-white" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Description</label>
                <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Color, brand, distinguishing marks..." className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-900 dark:text-white resize-none"></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Location (Where was it {formData.type.toLowerCase()}?)</label>
                <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="E.g., Central Park Bench, Bus Route 12" className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-900 dark:text-white" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Contact Info</label>
                <input required type="text" value={formData.contact_info} onChange={e => setFormData({...formData, contact_info: e.target.value})} placeholder="Phone number or email" className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-900 dark:text-white" />
              </div>

              <div className="pt-4">
                <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold transition-all disabled:opacity-50 hover:-translate-y-0.5 shadow-lg active:scale-95">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} 
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
