import { useState } from 'react';
import { Building2, Search, Filter, Calendar, IndianRupee, CheckCircle2, Clock, AlertCircle, Star, Plus, ChevronRight, UserCheck, ShieldCheck, BarChart3, X, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WardProjects() {
  const [selectedWard, setSelectedWard] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProjectForFeedback, setSelectedProjectForFeedback] = useState(null);
  const [updatingProject, setUpdatingProject] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');

  const role = localStorage.getItem('role') || 'CITIZEN';
  const isOfficer = role === 'OFFICER' || role === 'ADMIN' || role === 'DEPT_HEAD';

  // Rich initial municipal projects
  const [projects, setProjects] = useState([
    {
      id: 'PRJ-2026-01',
      title: 'Ward 4 Stormwater Drainage & Culvert Overhaul',
      category: 'Drainage & Flood Control',
      ward: 'Ward 4 (Central)',
      allocatedBudget: '74.5 Lakhs',
      spentBudget: '52.0 Lakhs',
      contractor: 'Vanguard Infra & Construction Pvt Ltd',
      startDate: '15 Jan 2026',
      estimatedCompletion: '30 Nov 2026',
      progress: 72,
      status: 'IN_PROGRESS',
      description: 'Widening of trunk sewer lines, desilting of nullahs, and reinforced concrete culvert installation to prevent monsoon waterlogging.',
      milestones: [
        { name: 'Survey & Geo-Technical Approval', done: true },
        { name: 'Demolition & Trench Excavation', done: true },
        { name: 'Pipe Laying & Culvert Casting', done: true },
        { name: 'Chamber Fitting & Surface Paving', done: false },
        { name: 'Final Flow Audit & Handover', done: false }
      ],
      citizenRating: 4.6,
      feedbackCount: 38
    },
    {
      id: 'PRJ-2026-02',
      title: 'Smart Solar Street Lighting & High-Mast Grid',
      category: 'Energy & Electrical',
      ward: 'Ward 7 (West End)',
      allocatedBudget: '38.0 Lakhs',
      spentBudget: '34.2 Lakhs',
      contractor: 'Surya Green Tech Solutions',
      startDate: '01 Feb 2026',
      estimatedCompletion: '20 Oct 2026',
      progress: 90,
      status: 'IN_PROGRESS',
      description: 'Deployment of 450 dusk-to-dawn automated LED streetlights and 4 high-mast junction towers with centralized remote tele-monitoring.',
      milestones: [
        { name: 'Tender Award & Cable Survey', done: true },
        { name: 'Pole Erection & Cabling', done: true },
        { name: 'Solar Hybrid Inverter Setup', done: true },
        { name: 'Central Command Cloud Sync', done: true },
        { name: 'Department Safety Sign-off', done: false }
      ],
      citizenRating: 4.8,
      feedbackCount: 52
    },
    {
      id: 'PRJ-2026-03',
      title: 'Sector 9 Ecological Park & Rainwater Recharging Pond',
      category: 'Parks & Environment',
      ward: 'Ward 12 (North Green)',
      allocatedBudget: '1.20 Crore',
      spentBudget: '48.0 Lakhs',
      contractor: 'EcoShilp Landscaping Consortium',
      startDate: '10 Mar 2026',
      estimatedCompletion: '15 Feb 2027',
      progress: 40,
      status: 'IN_PROGRESS',
      description: 'Creation of a 4-acre urban oxygen park with native tree canopy, jogging track, outdoor gym equipment, and 2 percolation wells.',
      milestones: [
        { name: 'Boundary Wall & Ground Leveling', done: true },
        { name: 'Pond Deepening & Bunding', done: true },
        { name: 'Jogging Track Paver Work', done: false },
        { name: 'Plantation & Irrigation Line', done: false },
        { name: 'Public Inauguration', done: false }
      ],
      citizenRating: 4.7,
      feedbackCount: 29
    },
    {
      id: 'PRJ-2026-04',
      title: 'Main Arterial Ring Road Bituminous Resurfacing',
      category: 'Roads & Transport',
      ward: 'Ward 18 (East Corridor)',
      allocatedBudget: '95.0 Lakhs',
      spentBudget: '95.0 Lakhs',
      contractor: 'National Highway Builders Corp',
      startDate: '10 Nov 2025',
      estimatedCompletion: '25 Aug 2026',
      progress: 100,
      status: 'COMPLETED',
      description: 'Full cold-milling, 50mm Bituminous Concrete layer, thermo-plastic retroreflective lane markings, and cat-eye reflectors on 4.2 km stretch.',
      milestones: [
        { name: 'Milling & Base Rectification', done: true },
        { name: 'Asphalt Laying & Compaction', done: true },
        { name: 'Pedestrian Crossing Markings', done: true },
        { name: 'Signage & Speed Radar Setup', done: true },
        { name: 'Third-Party Quality Clearance', done: true }
      ],
      citizenRating: 4.9,
      feedbackCount: 84
    },
    {
      id: 'PRJ-2026-05',
      title: 'Automated Wet & Dry Waste Transfer Station',
      category: 'Sanitation & Solid Waste',
      ward: 'Ward 4 (Central)',
      allocatedBudget: '55.0 Lakhs',
      spentBudget: '10.0 Lakhs',
      contractor: 'Swachh Bharat Engineering Works',
      startDate: '01 Sep 2026',
      estimatedCompletion: '30 Apr 2027',
      progress: 20,
      status: 'TENDER_AWARDED',
      description: 'Hydraulic waste compactor unit with odor neutralization mist sprayers and enclosed transfer bays for odor-free neighborhood handling.',
      milestones: [
        { name: 'Environmental Clearance', done: true },
        { name: 'Civil Platform Foundation', done: false },
        { name: 'Machinery Import & Delivery', done: false },
        { name: 'Trial Run & Worker Training', done: false }
      ],
      citizenRating: 4.4,
      feedbackCount: 16
    }
  ]);

  // New Project Form
  const [newProject, setNewProject] = useState({
    title: '',
    category: 'Roads & Transport',
    ward: 'Ward 4 (Central)',
    allocatedBudget: '',
    contractor: '',
    estimatedCompletion: '',
    description: ''
  });

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProject.title || !newProject.allocatedBudget || !newProject.contractor) {
      return toast.error('Please fill all mandatory project fields');
    }
    const created = {
      id: `PRJ-2026-0${projects.length + 1}`,
      ...newProject,
      spentBudget: '0.0 Lakhs',
      startDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      progress: 5,
      status: 'TENDER_AWARDED',
      milestones: [
        { name: 'Tender Sanctioned & Contractor Onboarded', done: true },
        { name: 'Ground Mobilization', done: false },
        { name: 'Core Work Phase 1', done: false },
        { name: 'Final Audit & Commissioning', done: false }
      ],
      citizenRating: 5.0,
      feedbackCount: 1
    };
    setProjects([created, ...projects]);
    setShowAddModal(false);
    toast.success('New City Project announced to public register!');
    setNewProject({
      title: '',
      category: 'Roads & Transport',
      ward: 'Ward 4 (Central)',
      allocatedBudget: '',
      contractor: '',
      estimatedCompletion: '',
      description: ''
    });
  };

  const submitFeedback = (e) => {
    e.preventDefault();
    if (!feedbackComment.trim()) return toast.error('Please write an observation comment');
    setProjects(projects.map(p => {
      if (p.id === selectedProjectForFeedback.id) {
        const newCount = p.feedbackCount + 1;
        const newRating = Number(((p.citizenRating * p.feedbackCount + feedbackRating) / newCount).toFixed(1));
        return { ...p, feedbackCount: newCount, citizenRating: newRating };
      }
      return p;
    }));
    toast.success('Your citizen audit observation has been submitted!');
    setSelectedProjectForFeedback(null);
    setFeedbackComment('');
  };

  const filteredProjects = projects.filter(p => {
    const matchesWard = selectedWard === 'ALL' || p.ward.toLowerCase().includes(selectedWard.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.contractor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesWard && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"><CheckCircle2 size={13} /> Completed</span>;
      case 'IN_PROGRESS':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"><Clock size={13} className="animate-spin" /> In Progress</span>;
      case 'TENDER_AWARDED':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"><AlertCircle size={13} /> Tender Sanctioned</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 animate-in fade-in duration-700 pb-16">
      
      {/* Cinematic Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 border border-indigo-900/50 p-8 sm:p-12 mb-8 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs uppercase tracking-widest mb-4 border border-blue-400/30">
              <Building2 size={14} /> Public Works & Budget Transparency
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-2">Ward Projects Tracker</h1>
            <p className="text-slate-300 font-medium text-base sm:text-lg max-w-xl">
              Real-time monitoring of municipal civil works, contractor details, budget allocation, and milestone progress in your city.
            </p>
          </div>

          {(role === 'OFFICER' || role === 'ADMIN' || role === 'DEPT_HEAD') && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <Plus size={18} /> Announce Project
            </button>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 relative z-10">
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Works</div>
            <div className="text-2xl font-black text-white mt-1">{projects.length} Projects</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sanctioned</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">₹3.82 Cr</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Rate</div>
            <div className="text-2xl font-black text-blue-400 mt-1">
              {Math.round((projects.filter(p => p.status === 'COMPLETED').length / projects.length) * 100)}%
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Citizen Audit Score</div>
            <div className="text-2xl font-black text-amber-400 mt-1 flex items-center gap-1">
              <Star size={20} className="fill-amber-400 text-amber-400" /> 4.7 / 5
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white/80 dark:bg-[#0B1120]/90 backdrop-blur-xl rounded-2xl p-4 mb-8 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search projects, contractor, ward..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 text-sm font-medium text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Ward Filter */}
          <select
            value={selectedWard}
            onChange={e => setSelectedWard(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-gray-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Wards</option>
            <option value="Ward 4">Ward 4 (Central)</option>
            <option value="Ward 7">Ward 7 (West End)</option>
            <option value="Ward 12">Ward 12 (North Green)</option>
            <option value="Ward 18">Ward 18 (East Corridor)</option>
          </select>

          {/* Status Tabs */}
          <div className="flex bg-gray-100 dark:bg-slate-800/80 p-1 rounded-xl">
            {['ALL', 'IN_PROGRESS', 'COMPLETED', 'TENDER_AWARDED'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {st === 'ALL' ? 'All' : st === 'IN_PROGRESS' ? 'Active' : st === 'COMPLETED' ? 'Finished' : 'Sanctioned'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white dark:bg-[#0B1120] rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 p-6 sm:p-8 overflow-hidden group"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {getStatusBadge(project.status)}
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700">
                    {project.category}
                  </span>
                  <span className="text-xs font-bold text-gray-400">ID: {project.id}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-snug">
                  {project.title}
                </h2>
                <p className="text-gray-500 dark:text-slate-400 text-sm mt-2 max-w-3xl leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Citizen Rating Badge */}
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-3 sm:px-4 text-center shrink-0 flex items-center gap-3">
                <Star size={24} className="fill-amber-400 text-amber-400 shrink-0" />
                <div className="text-left">
                  <div className="text-lg font-black text-amber-700 dark:text-amber-400 leading-none">
                    {project.citizenRating} <span className="text-xs font-medium text-amber-600/70">/ 5</span>
                  </div>
                  <div className="text-[11px] font-bold text-amber-800/70 dark:text-amber-400/70 mt-0.5">
                    {project.feedbackCount} Citizen Reviews
                  </div>
                </div>
              </div>
            </div>

            {/* Financials & Contractor Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-800/60 mb-6">
              <div>
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Sanctioned Budget</div>
                <div className="text-base font-black text-gray-900 dark:text-white mt-0.5 flex items-center">
                  ₹ {project.allocatedBudget}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Executing Agency</div>
                <div className="text-sm font-bold text-gray-800 dark:text-slate-200 mt-0.5 truncate" title={project.contractor}>
                  {project.contractor}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Ward & Zone</div>
                <div className="text-sm font-bold text-gray-800 dark:text-slate-200 mt-0.5">
                  {project.ward}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Target Handover</div>
                <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {project.estimatedCompletion}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="text-gray-600 dark:text-slate-300 flex items-center gap-1.5">
                  <BarChart3 size={14} className="text-blue-500" /> Physical Completion Progress
                </span>
                <span className="text-blue-600 dark:text-blue-400 text-sm font-black">{project.progress}%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000 ease-out shadow-sm"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Milestones Checklist */}
            <div className="pt-4 border-t border-gray-100 dark:border-slate-800/80">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Work Milestones Audit</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {project.milestones.map((milestone, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border transition-colors ${
                      milestone.done
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-900/40'
                        : 'bg-gray-50/50 dark:bg-slate-900/30 text-gray-500 dark:text-slate-400 border-gray-200/40 dark:border-slate-800'
                    }`}
                  >
                    <CheckCircle2 size={15} className={milestone.done ? 'text-emerald-500 shrink-0' : 'text-gray-300 dark:text-slate-600 shrink-0'} />
                    <span className="truncate">{milestone.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800/60 flex flex-wrap justify-between items-center gap-4">
              <span className="text-xs font-medium text-gray-400">
                Started on {project.startDate} • Monitored under Smart City Mission
              </span>
              <div className="flex items-center gap-2">
                {isOfficer && (
                  <button
                    onClick={() => setUpdatingProject(JSON.parse(JSON.stringify(project)))}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
                  >
                    <BarChart3 size={14} /> Update Progress & Milestones
                  </button>
                )}
                <button
                  onClick={() => setSelectedProjectForFeedback(project)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 transition-colors"
                >
                  <Star size={14} /> {isOfficer ? 'Audit Logs' : 'Submit Citizen Review'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Citizen Feedback Modal */}
      {selectedProjectForFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProjectForFeedback(null)}></div>
          <div className="bg-white dark:bg-[#0B1120] rounded-[2rem] shadow-2xl border border-gray-100 dark:border-slate-800 w-full max-w-lg relative z-10 animate-in zoom-in-95 p-6 sm:p-8">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Citizen Work Observation</h3>
                <p className="text-xs text-gray-400 mt-0.5">{selectedProjectForFeedback.title}</p>
              </div>
              <button onClick={() => setSelectedProjectForFeedback(null)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submitFeedback} className="mt-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ground Quality Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFeedbackRating(star)}
                      className={`p-2 rounded-xl text-2xl transition-transform hover:scale-110 ${
                        star <= feedbackRating ? 'text-amber-400' : 'text-gray-300 dark:text-slate-700'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Your Observation / Comment</label>
                <textarea
                  required
                  rows="3"
                  value={feedbackComment}
                  onChange={e => setFeedbackComment(e.target.value)}
                  placeholder="e.g., Work is progressing fast, but safety barricades need to be placed properly near the culvert..."
                  className="w-full p-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProjectForFeedback(null)}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20"
                >
                  Submit Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Officer Progress Update Modal */}
      {updatingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setUpdatingProject(null)}></div>
          <div className="bg-white dark:bg-[#0B1120] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-slate-800 w-full max-w-lg relative z-10 animate-in zoom-in-95 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Officer Work Monitoring</h3>
                <p className="text-xs text-gray-400 mt-0.5">{updatingProject.title}</p>
              </div>
              <button onClick={() => setUpdatingProject(null)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full">
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {/* Progress Slider */}
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-slate-300 mb-2">
                  <span>Physical Completion:</span>
                  <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{updatingProject.progress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={updatingProject.progress}
                  onChange={(e) => setUpdatingProject({
                    ...updatingProject,
                    progress: Number(e.target.value),
                    status: Number(e.target.value) === 100 ? 'COMPLETED' : updatingProject.status
                  })}
                  className="w-full accent-indigo-600 h-2 bg-gray-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Project Sanction Status</label>
                <select
                  value={updatingProject.status}
                  onChange={(e) => setUpdatingProject({ ...updatingProject, status: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-gray-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="TENDER_AWARDED">Tender Sanctioned</option>
                  <option value="IN_PROGRESS">In Progress (Active Ground Work)</option>
                  <option value="COMPLETED">Completed & Commissioned</option>
                </select>
              </div>

              {/* Milestones Toggles */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Milestone Checklist</label>
                <div className="space-y-2">
                  {updatingProject.milestones.map((ms, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        const updatedMs = [...updatingProject.milestones];
                        updatedMs[idx].done = !updatedMs[idx].done;
                        setUpdatingProject({ ...updatingProject, milestones: updatedMs });
                      }}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors text-xs font-semibold ${
                        ms.done
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                          : 'bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-800'
                      }`}
                    >
                      <span>{ms.name}</span>
                      <CheckCircle2 size={16} className={ms.done ? 'text-emerald-500' : 'text-gray-300 dark:text-slate-600'} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setUpdatingProject(null)}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProjects(projects.map(p => p.id === updatingProject.id ? updatingProject : p));
                    toast.success('Project Progress & Milestones Updated by Authority! 🏗️');
                    setUpdatingProject(null);
                  }}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-500/20"
                >
                  Save Updates
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal (Admin/Officer) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="bg-white dark:bg-[#0B1120] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-slate-800 w-full max-w-xl relative z-10 animate-in zoom-in-95 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Building2 className="text-blue-500" />
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Announce City Project</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddProject} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Project Title</label>
                <input
                  required
                  type="text"
                  value={newProject.title}
                  onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="e.g., Ward 5 Underground Pipeline Laying"
                  className="w-full p-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={newProject.category}
                    onChange={e => setNewProject({ ...newProject, category: e.target.value })}
                    className="w-full p-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-gray-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Roads & Transport">Roads & Transport</option>
                    <option value="Drainage & Flood Control">Drainage & Flood Control</option>
                    <option value="Parks & Environment">Parks & Environment</option>
                    <option value="Energy & Electrical">Energy & Electrical</option>
                    <option value="Sanitation & Solid Waste">Sanitation & Solid Waste</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Ward</label>
                  <select
                    value={newProject.ward}
                    onChange={e => setNewProject({ ...newProject, ward: e.target.value })}
                    className="w-full p-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-gray-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Ward 4 (Central)">Ward 4 (Central)</option>
                    <option value="Ward 7 (West End)">Ward 7 (West End)</option>
                    <option value="Ward 12 (North Green)">Ward 12 (North Green)</option>
                    <option value="Ward 18 (East Corridor)">Ward 18 (East Corridor)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Allocated Budget</label>
                  <input
                    required
                    type="text"
                    value={newProject.allocatedBudget}
                    onChange={e => setNewProject({ ...newProject, allocatedBudget: e.target.value })}
                    placeholder="e.g., 42.5 Lakhs"
                    className="w-full p-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Estimated Completion</label>
                  <input
                    required
                    type="text"
                    value={newProject.estimatedCompletion}
                    onChange={e => setNewProject({ ...newProject, estimatedCompletion: e.target.value })}
                    placeholder="e.g., 28 Feb 2027"
                    className="w-full p-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Awarded Contractor Name</label>
                <input
                  required
                  type="text"
                  value={newProject.contractor}
                  onChange={e => setNewProject({ ...newProject, contractor: e.target.value })}
                  placeholder="e.g., Apex Urban Infrastructure Ltd"
                  className="w-full p-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Project Scope & Description</label>
                <textarea
                  required
                  rows="3"
                  value={newProject.description}
                  onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Detailed breakdown of the civil works..."
                  className="w-full p-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25"
                >
                  Publish Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
