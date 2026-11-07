import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900/50 dark:bg-slate-900 text-gray-900 dark:text-white dark:text-gray-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F8FAFC] dark:bg-slate-950 p-4 md:p-8 transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  );
}



