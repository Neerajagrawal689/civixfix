import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Bell, CheckCircle, X } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const socket = io(API_BASE_URL);

export default function LiveAlerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const handleIssueCreated = (data) => {
      addAlert({
        id: Date.now(),
        type: 'created',
        title: 'New Issue Reported',
        message: `${data.issue_number}: ${data.title}`
      });
    };

    const handleIssueUpdated = (data) => {
      addAlert({
        id: Date.now(),
        type: 'updated',
        title: 'Issue Status Updated',
        message: `${data.issue_number} is now ${data.new_status}`
      });
    };

    socket.on('issue_created', handleIssueCreated);
    socket.on('issue_updated', handleIssueUpdated);

    return () => {
      socket.off('issue_created', handleIssueCreated);
      socket.off('issue_updated', handleIssueUpdated);
    };
  }, []);

  const addAlert = (alert) => {
    setAlerts((prev) => [...prev, alert]);
    // Auto remove after 5 seconds
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
    }, 5000);
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {alerts.map((alert) => (
        <div 
          key={alert.id} 
          className="bg-white dark:bg-slate-800 border-l-4 border-blue-500 shadow-lg rounded-r-lg p-4 w-72 transform transition-all duration-300 ease-out translate-y-0 opacity-100 flex items-start"
        >
          <div className="flex-shrink-0">
            {alert.type === 'created' ? (
              <Bell className="h-5 w-5 text-blue-500" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.title}</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400 line-clamp-2">{alert.message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button 
              className="bg-white dark:bg-slate-800 rounded-md inline-flex text-gray-400 dark:text-slate-500 hover:text-gray-500 dark:text-slate-400 focus:outline-none"
              onClick={() => removeAlert(alert.id)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}



