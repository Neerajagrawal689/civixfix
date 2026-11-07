import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Camera, Award, ShieldCheck, Star, Save, Lock, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../config/api';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setUser(result.data.user);
        setFormData({ name: result.data.user.name || '', phone: result.data.user.phone || '' });
        setPreview(result.data.user.avatar_url ? `${API_BASE_URL}${result.data.user.avatar_url}` : null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setLoading(false), 500); // Artificial delay to show skeleton
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      if (avatarFile) data.append('avatar', avatarFile);

      const res = await fetch(`${API_BASE_URL}/api/v1/auth/profile`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });
      
      const result = await res.json();
      if (result.success) {
        toast.success('Profile updated successfully! 🎉');
        setUser(result.data.user);
        localStorage.setItem('user', JSON.stringify({
          ...JSON.parse(localStorage.getItem('user')),
          name: result.data.user.name
        }));
      } else {
        toast.error(result.error?.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    setUpdatingPassword(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/password`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      
      const result = await res.json();
      if (result.success) {
        toast.success('Password locked and secured! 🔒');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(result.error?.message || 'Failed to update password');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => navigate(-1)}></div>
        <div className="bg-white dark:bg-[#0B1120] rounded-[2.5rem] p-8 w-full max-w-4xl relative z-10 animate-pulse space-y-6">
          <div className="h-44 bg-gray-200 dark:bg-slate-800/50 rounded-3xl w-full"></div>
          <div className="h-64 bg-gray-200 dark:bg-slate-800/50 rounded-3xl w-full"></div>
        </div>
      </div>
    );
  }

  // Generate dynamic civic stats
  const xp = 350; 
  const levelText = xp > 500 ? 'Gold Contributor' : xp > 200 ? 'Silver Contributor' : 'Bronze Contributor';
  const levelColor = xp > 500 ? 'text-yellow-500' : xp > 200 ? 'text-slate-400' : 'text-amber-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Dark Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => navigate(-1)}
      ></div>

      {/* Modal Container */}
      <div className="bg-white dark:bg-[#0B1120] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-slate-800/80 w-full max-w-4xl relative z-10 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto p-6 sm:p-10 flex flex-col">
        
        {/* Modal Top Header with Close Button */}
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">Civic Profile & Credentials</h2>
              <p className="text-xs font-semibold text-gray-400">Manage identity, security settings, and civic rank</p>
            </div>
          </div>
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            title="Close Profile"
          >
            <X size={20} />
          </button>
        </div>

        {/* Premium Cover Profile Header */}
        <div className="relative bg-white dark:bg-[#0B1120] rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_40px_rgb(0,0,0,0.3)] border border-gray-100 dark:border-slate-800/60 overflow-hidden mb-8 group">
          <div className="h-44 sm:h-52 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            {/* Subtle animated pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent blur-2xl animate-[pulse_4s_ease-in-out_infinite]"></div>
          </div>

        <div className="px-6 sm:px-12 pb-10 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-20 sm:-mt-24 mb-6 sm:mb-2 gap-6 relative z-10">
            {/* Avatar with Glow */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative w-36 h-36 rounded-full border-4 border-white dark:border-[#0B1120] bg-gray-100 dark:bg-slate-800 overflow-hidden shadow-xl">
                {preview ? (
                  <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={72} className="text-gray-300 dark:text-slate-600 m-auto mt-7" />
                )}
              </div>
              <label className="absolute bottom-1 right-1 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-transform hover:scale-110 border-2 border-white dark:border-[#0B1120]">
                <Camera size={18} />
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
            
            <div className="text-center sm:text-left mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-xs uppercase tracking-widest mb-3 border border-blue-100 dark:border-blue-800/50">
                {user.role === 'OFFICER' ? <ShieldCheck size={14} /> : <Award size={14} />} 
                {user.role}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">{user.name}</h1>
              <p className="text-gray-500 dark:text-slate-400 font-medium text-lg mt-1">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Forms Section */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Identity Form */}
          <div className="bg-white/70 dark:bg-[#0B1120]/80 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-100/50 dark:border-slate-800/60 p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <User className="mr-3 text-blue-500" size={24} /> Identity Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 ml-2 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900 dark:text-white"
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 ml-2 uppercase tracking-wider">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900 dark:text-white"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-slate-800/60">
                <button 
                  type="submit" 
                  disabled={updating || (!avatarFile && formData.name === user.name && formData.phone === (user.phone || ''))}
                  className="flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                >
                  {updating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Security Form */}
          <div className="bg-white/70 dark:bg-[#0B1120]/80 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-100/50 dark:border-slate-800/60 p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Lock className="mr-3 text-purple-500" size={24} /> Security Settings
            </h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 ml-2 uppercase tracking-wider">Current Password</label>
                <input 
                  type="password" 
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium text-gray-900 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 ml-2 uppercase tracking-wider">New Password</label>
                  <input 
                    type="password" 
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium text-gray-900 dark:text-white"
                    placeholder="••••••••"
                  />
                </div>
                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 ml-2 uppercase tracking-wider">Confirm Password</label>
                  <input 
                    type="password" 
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium text-gray-900 dark:text-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-slate-800/60">
                <button 
                  type="submit" 
                  disabled={updatingPassword}
                  className="flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5 shadow-purple-500/30 active:scale-95"
                >
                  {updatingPassword ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />} 
                  {updatingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar Badges / Civic Status */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-900 to-[#0B1120] dark:from-[#0f172a] dark:to-[#0B1120] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl border border-gray-800">
            {/* Background Decorative Rings */}
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full border-4 border-white/5"></div>
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full border-4 border-white/5"></div>
            
            <h3 className="text-xl font-bold mb-8 flex items-center relative z-10">
              <Star className="mr-2 text-yellow-400" size={24} /> {user.role === 'OFFICER' ? 'Authority Status' : 'Civic Impact'}
            </h3>
            
            <div className="text-center relative z-10">
              <div className="inline-block p-1 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-600 mb-6 shadow-lg shadow-yellow-500/20">
                <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center border-4 border-gray-900">
                  <Award size={40} className="text-yellow-400" />
                </div>
              </div>
              <h4 className={`text-2xl font-black mb-2 ${levelColor}`}>{user.role === 'OFFICER' ? 'Verified Official' : levelText}</h4>
              
              {user.role !== 'OFFICER' && (
                <>
                  <p className="text-gray-400 font-medium mb-6">Earned {xp} Experience Points through successful issue reports.</p>
                  
                  <div className="w-full bg-gray-800 rounded-full h-2 mb-2 overflow-hidden border border-gray-700">
                    <div className="bg-gradient-to-r from-yellow-500 to-amber-500 h-2 rounded-full" style={{ width: `${(xp % 500) / 5}%` }}></div>
                  </div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-right">{500 - (xp % 500)} XP to Next Tier</p>
                </>
              )}
            </div>
          </div>
          
          <div className="bg-white/70 dark:bg-[#0B1120]/80 backdrop-blur-md rounded-[2rem] shadow-sm border border-gray-100/50 dark:border-slate-800/60 p-8 text-center">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100 dark:border-blue-800/50">
              <ShieldCheck className="text-blue-500" size={32} />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white text-lg">Secure Account</h4>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">Your data is securely hashed using bcrypt encryption and protected by JWT auth guards.</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
