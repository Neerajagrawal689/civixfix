import { Bell, UserCircle, Moon, Sun } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function Header() {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : {};
  const role = localStorage.getItem('role') || 'CITIZEN';
  const displayRole = role === 'OFFICER' || role === 'DEPT_HEAD' 
    ? 'Official / Admin' 
    : role === 'WORKER' 
    ? 'Field Squad / Staff' 
    : 'Verified Citizen';

  const getPageTitle = () => {
    if (location.pathname.includes('official-dashboard')) return 'Complaint Review & Assignment';
    if (location.pathname.includes('staff-dashboard')) return 'Field Repair Tasks';
    if (location.pathname.includes('dashboard')) return 'Command Dashboard';
    if (location.pathname.includes('report')) return 'Report New Issue';
    if (location.pathname.includes('my-issues')) return 'My Reported Complaints';
    if (location.pathname.includes('projects')) return 'Ward Projects & Budget';
    if (location.pathname.includes('services')) return 'Doorstep Municipal Services';
    if (location.pathname.includes('permits')) return 'Digital Permits & E-NOC';
    if (location.pathname.includes('green-city')) return 'Green City & Ward AQI';
    if (location.pathname.includes('notices')) return 'Official Notice Board';
    if (location.pathname.includes('lost-found')) return 'Lost & Found Community Hub';
    if (location.pathname.includes('profile')) return 'Civic Profile & Badges';
    return 'CivicFix Smart City OS';
  };

  return (
    <header className="flex justify-between items-center py-4 px-8 bg-white/60 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-700 dark:border-gray-800 sticky top-0 z-20 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-colors">
      <div className="flex items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 dark:text-white tracking-tight">{getPageTitle()}</h2>
      </div>
      
      <div className="flex items-center space-x-4 md:space-x-6">
        
        <button 
          onClick={toggleTheme}
          className="relative text-gray-400 dark:text-slate-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-full"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="relative text-gray-400 dark:text-slate-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-full">
          <Bell size={20} />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900"></span>
        </button>
        
        <Link to="/profile" className="flex items-center space-x-3 cursor-pointer pl-4 border-l border-gray-200 dark:border-slate-700 dark:border-gray-700 hover:opacity-80 transition-opacity">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800 dark:text-slate-100 dark:text-white">{user.name || 'Citizen'}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{displayRole}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 border border-blue-200 dark:border-blue-700 flex items-center justify-center text-blue-700 dark:text-blue-300 shadow-sm transition-colors">
            <UserCircle size={24} />
          </div>
        </Link>
      </div>
    </header>
  );
}



