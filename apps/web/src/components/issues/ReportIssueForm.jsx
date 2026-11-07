import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, UploadCloud, X, Loader2, FileText, CheckCircle, AlertTriangle, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

export default function ReportIssueForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    address: '',
    image: null
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  const categories = [
    { id: 'cat-1', name: 'Roads & Potholes' },
    { id: 'cat-2', name: 'Garbage & Solid Waste' },
    { id: 'cat-3', name: 'Streetlights & Electricity' },
    { id: 'cat-4', name: 'Water & Drainage' }
  ];

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFormData({ ...formData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      toast.error('Please upload a valid image file');
    }
  };

  const handleImageChange = (e) => processFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category_id', formData.category_id);
      submitData.append('address', formData.address);
      submitData.append('latitude', '28.6139'); // Mocked
      submitData.append('longitude', '77.2090'); // Mocked
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      const res = await axios.post(`${API_BASE_URL}/api/v1/issues`, submitData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        toast.success('Issue reported successfully!');
        navigate('/my-issues');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 dark:bg-black/60 backdrop-blur-sm"
        onClick={() => navigate('/dashboard')}
      ></div>

      {/* Modal Container */}
      <div className="bg-white dark:bg-[#0B1120] rounded-[2rem] shadow-2xl border border-gray-100 dark:border-slate-800/60 w-full max-w-3xl relative z-10 animate-in zoom-in-95 duration-200 max-h-[95vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800/60 bg-gray-50/50 dark:bg-slate-900/20 rounded-t-[2rem]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">Report an Issue</h2>
              <p className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Official Complaint Form</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body (Scrollable Form) */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Issue Title</label>
            <input 
              required 
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="E.g., Large Pothole on Main Street" 
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-900 dark:text-white" 
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Category</label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({...formData, category_id: cat.id})}
                  className={`p-3 rounded-xl text-sm font-bold transition-all border-2 flex items-center gap-2 ${
                    formData.category_id === cat.id 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                      : 'border-gray-100 dark:border-slate-800 text-gray-600 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-600'
                  }`}
                >
                  {formData.category_id === cat.id ? <CheckCircle size={16} className="text-blue-500" /> : <FileText size={16} className="opacity-50" />}
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Description</label>
            <textarea 
              required 
              rows="3" 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              placeholder="Please describe the issue in detail..." 
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-900 dark:text-white resize-none"
            ></textarea>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Location / Landmark</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                required 
                type="text" 
                value={formData.address} 
                onChange={e => setFormData({...formData, address: e.target.value})} 
                placeholder="Where is this located exactly?" 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-900 dark:text-white" 
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Photo Evidence (Optional)</label>
            <div 
              className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl transition-all cursor-pointer overflow-hidden group
                ${isDragging 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 hover:bg-gray-100 dark:hover:bg-slate-800'
                }
              `}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover group-hover:opacity-40 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-gray-900/80 text-white px-3 py-1.5 rounded-lg text-sm font-bold backdrop-blur-sm flex items-center gap-2">
                      <Camera size={16} /> Replace
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <UploadCloud size={24} className="text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" />
                  <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">
                    <span className="font-bold text-blue-600 dark:text-blue-400">Upload</span> or drag photo
                  </p>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>
          </div>

          {/* Modal Footer (Submit) */}
          <div className="pt-4 mt-2 flex gap-3">
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-3.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl font-bold transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || !formData.title || !formData.category_id || !formData.address}
              className="flex-[2] flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
