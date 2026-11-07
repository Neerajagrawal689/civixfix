import { useState } from 'react';
import { Leaf, Wind, Droplets, Sun, Trees, Plus, CheckCircle2, Heart, Sparkles, Award, AlertTriangle, ShieldCheck, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GreenCityHub() {
  const role = localStorage.getItem('role') || 'CITIZEN';
  const isOfficer = role === 'OFFICER' || role === 'ADMIN' || role === 'DEPT_HEAD';
  const isWorker = role === 'WORKER';

  const [selectedWardAqi, setSelectedWardAqi] = useState('Ward 4 (Central)');
  const [showAdoptModal, setShowAdoptModal] = useState(false);
  const [mistCannonActive, setMistCannonActive] = useState(false);

  // Wards AQI Data
  const wardAqiData = {
    'Ward 4 (Central)': { aqi: 68, status: 'Satisfactory', color: 'text-emerald-500', bg: 'bg-emerald-500', pm25: 22, pm10: 54, temp: '28°C', humidity: '52%', advisory: 'Air quality is acceptable for outdoor morning exercise. Sensitive groups should monitor exertion.' },
    'Ward 7 (West End)': { aqi: 42, status: 'Good (Clean Air)', color: 'text-teal-500', bg: 'bg-teal-500', pm25: 14, pm10: 36, temp: '27°C', humidity: '56%', advisory: 'Pristine air quality! Perfect for cycling, open windows, and community outdoor events.' },
    'Ward 12 (North Green)': { aqi: 35, status: 'Pristine (Forest Zone)', color: 'text-green-500', bg: 'bg-green-500', pm25: 11, pm10: 28, temp: '26°C', humidity: '60%', advisory: 'Exceptional clean oxygen pocket shielded by urban tree canopy.' },
    'Ward 18 (East Corridor)': { aqi: 128, status: 'Moderate (Traffic Corridor)', color: 'text-amber-500', bg: 'bg-amber-500', pm25: 48, pm10: 98, temp: '30°C', humidity: '48%', advisory: 'Moderate particulate level near highway junction. Dust suppression mist cannons active.' }
  };

  const currentAqi = wardAqiData[selectedWardAqi];

  // Adopted Trees Community Registry
  const [adoptedTrees, setAdoptedTrees] = useState([
    {
      id: 'TREE-108',
      treeName: 'Peepal Protector #108',
      species: 'Sacred Fig (Peepal)',
      location: 'Central Park, Near Gazebo, Ward 4',
      adopterName: 'Rohan Sharma',
      adoptedSince: '12 Feb 2026',
      wateringCount: 34,
      healthStatus: 'Thriving & Lush Green'
    },
    {
      id: 'TREE-214',
      treeName: 'Neem Amrit #214',
      species: 'Indian Lilac (Neem)',
      location: 'Sector 7 Green Belt Promenade',
      adopterName: 'Priya Mukherjee',
      adoptedSince: '01 Mar 2026',
      wateringCount: 28,
      healthStatus: 'Healthy Foliage'
    },
    {
      id: 'TREE-309',
      treeName: 'Gulmohar Glow #309',
      species: 'Royal Poinciana (Gulmohar)',
      location: 'Ward 12 Lake Bund Avenue',
      adopterName: 'Amitabh Sen',
      adoptedSince: '18 Apr 2026',
      wateringCount: 19,
      healthStatus: 'Blooming Season'
    }
  ]);

  // Eco Pledges Checklist
  const [pledges, setPledges] = useState([
    { id: 1, title: 'Household Wet & Dry Waste Segregation', done: true, points: 25 },
    { id: 2, title: '100% Single-Use Plastic Free Shopping', done: true, points: 20 },
    { id: 3, title: 'Used Public Transit / Metro at least 3x this week', done: false, points: 30 },
    { id: 4, title: 'Rainwater Harvesting / Plant Water Re-use', done: true, points: 25 },
  ]);

  const togglePledge = (id) => {
    setPledges(pledges.map(p => p.id === id ? { ...p, done: !p.done } : p));
  };

  const greenScore = pledges.reduce((acc, p) => p.done ? acc + p.points : acc, 0);

  // Adopt Tree Form
  const [adoptForm, setAdoptForm] = useState({
    treeName: '',
    species: 'Indian Lilac (Neem)',
    location: 'Ward 4 Community Park',
    adopterName: ''
  });

  const handleAdoptSubmit = (e) => {
    e.preventDefault();
    if (!adoptForm.treeName || !adoptForm.adopterName) {
      return toast.error('Please enter tree nickname and your name');
    }
    const createdTree = {
      id: `TREE-${Math.floor(400 + Math.random() * 500)}`,
      treeName: adoptForm.treeName,
      species: adoptForm.species,
      location: adoptForm.location,
      adopterName: adoptForm.adopterName,
      adoptedSince: 'Today',
      wateringCount: 1,
      healthStatus: 'Newly Pledged & Healthy'
    };
    setAdoptedTrees([createdTree, ...adoptedTrees]);
    setShowAdoptModal(false);
    toast.success('Tree Adopted! Green Guardian Badge added to your profile 🌿', { duration: 4500 });
    setAdoptForm({
      treeName: '',
      species: 'Indian Lilac (Neem)',
      location: 'Ward 4 Community Park',
      adopterName: ''
    });
  };

  const handleWaterTree = (id) => {
    setAdoptedTrees(adoptedTrees.map(t => {
      if (t.id === id) {
        return { ...t, wateringCount: t.wateringCount + 1 };
      }
      return t;
    }));
    toast.success('Watering Logged! +20 Eco-Points earned 💧');
  };

  return (
    <div className="max-w-6xl mx-auto py-8 animate-in fade-in duration-700 pb-16">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 border border-emerald-900/40 p-8 sm:p-12 mb-8 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase tracking-widest mb-4 border border-emerald-400/30">
              <Leaf size={14} /> Climate Action & Eco-Citizen Hub
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-2">Green City & Ward AQI Hub</h1>
            <p className="text-slate-300 font-medium text-base sm:text-lg max-w-xl">
              Track live air quality in your ward, adopt public urban trees, and elevate your citizen green score through community environmental stewardship.
            </p>
          </div>

          <button
            onClick={() => setShowAdoptModal(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <Trees size={18} /> Adopt a Public Tree
          </button>
        </div>
      </div>

      {/* Grid: AQI Live Monitor & Citizen Eco Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Left: Ward Live AQI Gauge */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0B1120] rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Wind size={14} className="text-emerald-500" /> Continuous Ambient Air Quality Monitor
                </span>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">Live Ward AQI Index</h3>
              </div>

              <select
                value={selectedWardAqi}
                onChange={e => setSelectedWardAqi(e.target.value)}
                className="px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold text-gray-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
              >
                {Object.keys(wardAqiData).map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            {/* AQI Big Stat & Dial */}
            <div className="flex flex-col sm:flex-row items-center gap-8 bg-gray-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-gray-100 dark:border-slate-800/80 mb-6">
              <div className="relative w-36 h-36 rounded-full flex flex-col items-center justify-center bg-white dark:bg-slate-800 shadow-md border-4 border-emerald-500/30 shrink-0">
                <span className={`text-5xl font-black ${currentAqi.color}`}>{currentAqi.aqi}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">AQI US</span>
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase ${currentAqi.color} bg-white dark:bg-slate-800 border border-current shadow-sm`}>
                  {currentAqi.status}
                </div>
                <p className="text-xs text-gray-600 dark:text-slate-300 font-medium leading-relaxed">
                  {currentAqi.advisory}
                </p>
              </div>
            </div>

            {/* Environmental Parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-gray-400 block uppercase">PM 2.5</span>
                <span className="text-base font-black text-gray-900 dark:text-white mt-0.5 block">{currentAqi.pm25} µg/m³</span>
              </div>
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-gray-400 block uppercase">PM 10</span>
                <span className="text-base font-black text-gray-900 dark:text-white mt-0.5 block">{currentAqi.pm10} µg/m³</span>
              </div>
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-gray-400 block uppercase">Temperature</span>
                <span className="text-base font-black text-gray-900 dark:text-white mt-0.5 block">{currentAqi.temp}</span>
              </div>
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-gray-400 block uppercase">Humidity</span>
                <span className="text-base font-black text-gray-900 dark:text-white mt-0.5 block">{currentAqi.humidity}</span>
              </div>
            </div>

            {isOfficer && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 flex flex-wrap justify-between items-center gap-3">
                <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">
                  Municipal Smog Mitigation Protocol:
                </span>
                <button
                  onClick={() => {
                    setMistCannonActive(true);
                    toast.success(`Anti-Smog Dust Suppressor Truck deployed to ${selectedWardAqi}! 💨`, { icon: '🚨' });
                    setTimeout(() => setMistCannonActive(false), 5000);
                  }}
                  disabled={mistCannonActive}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {mistCannonActive ? '⚡ Mist Cannon Spraying Active...' : 'Deploy Anti-Pollution Mist Cannon'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Eco-Score & Pledges */}
        <div className="bg-white dark:bg-[#0B1120] rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Citizen Score</span>
              <Award className="text-emerald-500" size={20} />
            </div>

            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Eco-Citizen Rating</h3>
            
            <div className="flex items-baseline gap-2 my-4">
              <span className="text-5xl font-black text-emerald-600 dark:text-emerald-400">{greenScore}</span>
              <span className="text-gray-400 font-bold text-sm">/ 100 Pts (Gold Tier)</span>
            </div>

            <div className="space-y-3 mt-6">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Eco-Pledges Checklist</span>
              {pledges.map(p => (
                <button
                  key={p.id}
                  onClick={() => togglePledge(p.id)}
                  className={`w-full p-3 rounded-xl text-left text-xs font-medium border flex items-center justify-between transition-all ${
                    p.done
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                      : 'bg-gray-50 dark:bg-slate-900/40 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-800'
                  }`}
                >
                  <span className="truncate pr-2">{p.title}</span>
                  <CheckCircle2 size={16} className={p.done ? 'text-emerald-500 shrink-0' : 'text-gray-300 dark:text-slate-600 shrink-0'} />
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Adopt-a-Tree Community Section */}
      <div className="bg-white dark:bg-[#0B1120] rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 mb-2">
              <Trees size={13} /> Harit Shahar Initiative
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Adopt-a-Tree Community Registry</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Civic champions taking custody of saplings and shade trees in neighborhood public parks.</p>
          </div>

          <button
            onClick={() => setShowAdoptModal(true)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <Plus size={15} /> Adopt New Tree
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {adoptedTrees.map((tree) => (
            <div
              key={tree.id}
              className="bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-colors"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-2xl">🌳</span>
                  <span className="text-[10px] font-mono font-bold text-gray-400">{tree.id}</span>
                </div>

                <h4 className="text-lg font-black text-gray-900 dark:text-white leading-tight">
                  {tree.treeName}
                </h4>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  Species: {tree.species}
                </p>

                <div className="mt-4 space-y-1.5 text-xs text-gray-600 dark:text-slate-300">
                  <div>Location: <strong>{tree.location}</strong></div>
                  <div>Guardian: <strong>{tree.adopterName}</strong></div>
                  <div>Health: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{tree.healthStatus}</span></div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200/60 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 dark:text-slate-400 flex items-center gap-1">
                  <Droplets size={14} className="text-blue-500" /> {tree.wateringCount} Waterings
                </span>
                <button
                  onClick={() => handleWaterTree(tree.id)}
                  className="px-3.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors"
                >
                  Log Watering
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adopt Tree Modal */}
      {showAdoptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAdoptModal(false)}></div>
          <div className="bg-white dark:bg-[#0B1120] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-slate-800 w-full max-w-lg relative z-10 animate-in zoom-in-95 p-6 sm:p-8">
            
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Trees className="text-emerald-500" />
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Adopt a Public Tree</h3>
              </div>
              <button onClick={() => setShowAdoptModal(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAdoptSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tree Nickname / Dedication</label>
                <input
                  required
                  type="text"
                  value={adoptForm.treeName}
                  onChange={e => setAdoptForm({ ...adoptForm, treeName: e.target.value })}
                  placeholder="e.g., Peepal of Peace / Grandfather Neem"
                  className="w-full p-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tree Species</label>
                  <select
                    value={adoptForm.species}
                    onChange={e => setAdoptForm({ ...adoptForm, species: e.target.value })}
                    className="w-full p-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold text-gray-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Indian Lilac (Neem)">Indian Lilac (Neem)</option>
                    <option value="Sacred Fig (Peepal)">Sacred Fig (Peepal)</option>
                    <option value="Banyan Tree (Bargad)">Banyan Tree (Bargad)</option>
                    <option value="Royal Poinciana (Gulmohar)">Royal Poinciana (Gulmohar)</option>
                    <option value="Golden Shower (Amaltas)">Golden Shower (Amaltas)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Park Location</label>
                  <input
                    required
                    type="text"
                    value={adoptForm.location}
                    onChange={e => setAdoptForm({ ...adoptForm, location: e.target.value })}
                    placeholder="e.g. Ward 4 Public Garden"
                    className="w-full p-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Guardian / Adopter Name</label>
                <input
                  required
                  type="text"
                  value={adoptForm.adopterName}
                  onChange={e => setAdoptForm({ ...adoptForm, adopterName: e.target.value })}
                  placeholder="Your Name / Family Name"
                  className="w-full p-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                Pledge: "I commit to caring for this public tree, ensuring regular watering and reporting municipal branch maintenance when required."
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAdoptModal(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/25"
                >
                  Confirm Tree Adoption
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
