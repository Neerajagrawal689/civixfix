import { useState } from 'react';
import { Phone, Shield, Flame, HeartPulse, AlertOctagon, PhoneCall, ArrowRight, ShieldAlert, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EmergencySOS() {
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const emergencyContacts = [
    { id: 1, name: 'Police Control Room', number: '100', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' },
    { id: 2, name: 'Ambulance / Medical', number: '108', icon: HeartPulse, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-800' },
    { id: 3, name: 'Fire Brigade', number: '101', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800' },
    { id: 4, name: "Women's Helpline", number: '1091', icon: ShieldAlert, color: 'text-fuchsia-500', bg: 'bg-fuchsia-50 dark:bg-fuchsia-900/20', border: 'border-fuchsia-200 dark:border-fuchsia-800' },
    { id: 5, name: 'Cyber Crime', number: '1930', icon: AlertOctagon, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-200 dark:border-indigo-800' },
    { id: 6, name: 'Disaster Management', number: '1078', icon: Navigation, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/20', border: 'border-teal-200 dark:border-teal-800' }
  ];

  const handleSOS = () => {
    setSosActive(true);
    let count = 3;
    const timer = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count === 0) {
        clearInterval(timer);
        toast.success('SOS Alert Sent to nearby authorities with your location!', { duration: 5000, icon: '🚨' });
        setTimeout(() => {
          setSosActive(false);
          setCountdown(3);
        }, 3000);
      }
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 animate-in fade-in duration-700 pb-12">
      
      {/* Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 dark:bg-[#0B1120] border border-gray-800 p-8 sm:p-12 mb-8 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2 pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/2 pointer-events-none"></div>
        
        <div className="relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-bold text-xs uppercase tracking-widest mb-4 border border-red-500/20">
            <PhoneCall size={14} /> 24/7 Helpline
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-2">Emergency SOS</h1>
          <p className="text-gray-400 font-medium text-lg max-w-lg">Quickly connect with city emergency services or trigger an SOS alert if you are in immediate danger.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Quick SOS Action */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-[#0B1120] rounded-[2rem] p-8 border border-red-100 dark:border-red-900/30 shadow-lg shadow-red-500/5 text-center flex flex-col items-center justify-center h-full">
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Panic Button</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-8">Sends your live GPS location to local police.</p>
            
            <button 
              onClick={handleSOS}
              disabled={sosActive}
              className={`relative w-40 h-40 rounded-full flex items-center justify-center font-black text-3xl text-white shadow-2xl transition-all duration-300 active:scale-95
                ${sosActive ? 'bg-red-700 animate-pulse cursor-not-allowed' : 'bg-gradient-to-b from-red-500 to-red-700 hover:shadow-red-500/50 hover:scale-105'}
              `}
            >
              {sosActive ? (
                countdown > 0 ? (
                  <span className="text-5xl">{countdown}</span>
                ) : (
                  <ShieldAlert size={48} className="animate-bounce" />
                )
              ) : (
                'SOS'
              )}
              
              {!sosActive && (
                <div className="absolute inset-0 rounded-full border-4 border-red-400 opacity-50 animate-ping"></div>
              )}
            </button>
            <p className="mt-8 text-xs font-bold text-red-500 uppercase tracking-wider">Tap only in emergency</p>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {emergencyContacts.map((contact) => (
            <a 
              key={contact.id} 
              href={`tel:${contact.number}`}
              className={`group bg-white dark:bg-[#0B1120] p-6 rounded-3xl border ${contact.border} shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex flex-col`}
            >
              <div className={`w-12 h-12 rounded-2xl ${contact.bg} ${contact.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <contact.icon size={24} />
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{contact.name}</h4>
              
              <div className="mt-auto pt-4 flex items-center justify-between">
                <span className={`text-2xl font-black tracking-tight ${contact.color}`}>{contact.number}</span>
                <div className={`w-8 h-8 rounded-full ${contact.bg} ${contact.color} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0`}>
                  <Phone size={14} />
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}
