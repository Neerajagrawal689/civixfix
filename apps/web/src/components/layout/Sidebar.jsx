import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, LogOut, Shield, ChevronRight, Megaphone, PackageSearch, HardHat } from 'lucide-react';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  
  let navItems = [];

  if (role === 'OFFICER' || role === 'DEPT_HEAD') {
    navItems = [
      { name: 'Dashboard', path: '/dashboard', icon: Home },
      { name: 'Complaint Review', path: '/official-dashboard', icon: Shield },
      { name: 'Notice Board', path: '/notices', icon: Megaphone },
      { name: 'Lost & Found', path: '/lost-found', icon: PackageSearch },
    ];
  } else if (role === 'WORKER') {
    navItems = [
      { name: 'Dashboard', path: '/dashboard', icon: Home },
      { name: 'Field Repair Tasks', path: '/staff-dashboard', icon: HardHat },
      { name: 'Notice Board', path: '/notices', icon: Megaphone },
      { name: 'Lost & Found', path: '/lost-found', icon: PackageSearch },
    ];
  } else {
    navItems = [
      { name: 'Dashboard', path: '/dashboard', icon: Home },
      { name: 'My Issues', path: '/my-issues', icon: FileText },
      { name: 'Notice Board', path: '/notices', icon: Megaphone },
      { name: 'Lost & Found', path: '/lost-found', icon: PackageSearch },
    ];
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  return (
    <div className={`${isCollapsed ? 'w-24' : 'w-72'} bg-white/70 dark:bg-[#0B1120]/80 backdrop-blur-xl border-r border-white/20 dark:border-slate-800/60 flex flex-col h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-10 relative transition-all duration-300`}>
      <div className={`h-24 flex items-center ${isCollapsed ? 'justify-center' : 'px-8 justify-between'} border-b border-gray-100/50 dark:border-slate-800/50 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform" onClick={() => setIsCollapsed(!isCollapsed)}>
            <Shield size={24} className="text-white" />
          </div>
          {!isCollapsed && <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tighter">CivicFix</h1>}
        </div>
      </div>
      
      <nav className={`flex-1 py-8 overflow-y-auto ${isCollapsed ? 'px-3' : 'px-6'}`}>
        {!isCollapsed && <div className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-2">Main Menu</div>}
        <ul className="space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`group flex items-center ${isCollapsed ? 'justify-center p-3' : 'px-5 py-4'} rounded-2xl text-sm font-bold transition-all duration-300 relative overflow-hidden ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-400 shadow-sm border border-blue-500/20 dark:border-blue-400/20' 
                      : 'text-gray-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white hover:shadow-sm border border-transparent'
                  }`}
                  title={isCollapsed ? item.name : ''}
                >
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1/2 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"></div>}
                  <Icon size={20} className={`${isCollapsed ? '' : 'mr-4'} transition-transform duration-300 ${isActive ? 'text-blue-600 dark:text-blue-400 scale-110' : 'group-hover:text-blue-500 group-hover:scale-110'}`} />
                  {!isCollapsed && <span className="flex-1">{item.name}</span>}
                  {!isCollapsed && !isActive && <ChevronRight size={16} className="text-gray-300 dark:text-slate-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className={`p-6 border-t border-gray-100/50 dark:border-slate-800/50 bg-gray-50/30 dark:bg-slate-900/30 backdrop-blur-sm ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button 
          onClick={handleLogout}
          className={`group flex items-center ${isCollapsed ? 'justify-center p-3 w-auto' : 'w-full px-5 py-4'} text-sm font-bold text-gray-500 dark:text-slate-400 rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 border border-transparent hover:border-red-200 dark:hover:border-red-500/20 hover:shadow-sm`}
          title={isCollapsed ? 'Logout' : ''}
        >
          <div className={`w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center ${isCollapsed ? '' : 'mr-4'} shadow-sm border border-gray-100 dark:border-slate-700 group-hover:border-red-200 dark:group-hover:border-red-500/30 transition-colors`}>
            <LogOut size={18} className="text-gray-400 dark:text-slate-500 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
          </div>
          {!isCollapsed && "Secure Logout"}
        </button>
      </div>
    </div>
  );
}



