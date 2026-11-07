import { useState } from 'react';
import { Truck, Calendar, Clock, MapPin, Phone, CheckCircle2, AlertCircle, X, Plus, Sparkles, Trash2, ShieldCheck, ChevronRight, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DoorstepServices() {
  const role = localStorage.getItem('role') || 'CITIZEN';
  const isOfficer = role === 'OFFICER' || role === 'ADMIN' || role === 'DEPT_HEAD';
  const isWorker = role === 'WORKER';

  const [activeTab, setActiveTab] = useState(isWorker ? 'DISPATCH_SQUAD' : isOfficer ? 'FLEET_DISPATCH' : 'CATALOG');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    address: '',
    ward: 'Ward 4 (Central)',
    preferredDate: '',
    timeSlot: 'Morning (08:00 AM - 11:30 AM)',
    notes: ''
  });

  // Services Catalog
  const services = [
    {
      id: 'SRV-01',
      title: 'Bulk E-Waste & Appliance Collection',
      tagline: 'Old refrigerators, washing machines, TVs, monitors & computers',
      category: 'E-Waste & Recycling',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      iconEmoji: '📺',
      turnaround: 'Within 24-48 Hours',
      fee: 'Free Municipal Service',
      description: 'Scheduled door-to-door hydraulic eco-van collects heavy and toxic electronic waste directly from your home for certified safe recycling.'
    },
    {
      id: 'SRV-02',
      title: 'Construction Debris & Malba Clearance',
      tagline: 'Renovation bricks, broken tiles, cement bags & concrete rubble',
      category: 'Solid Waste Clearance',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      iconEmoji: '🧱',
      turnaround: 'Next Working Day',
      fee: 'Subsidized Nominal Rate',
      description: 'Special tipper truck dispatch with ground labor to remove household remodeling debris and keep city footpaths clear of roadside malba dumps.'
    },
    {
      id: 'SRV-03',
      title: 'Vector Disease Colony Fogging Drive',
      tagline: 'Mosquito eradication, thermal smoke & anti-larval spray',
      category: 'Public Health & Sanitization',
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      iconEmoji: '💨',
      turnaround: 'Same-Day Dispatch',
      fee: '100% Free Public Health Service',
      description: 'Rapid squad deployment for thermal insecticide fogging in public gullies, open drains, and colony streets to prevent Dengue, Malaria, and Chikungunya.'
    },
    {
      id: 'SRV-04',
      title: 'Hazardous Tree Branch Trimming & Pruning',
      tagline: 'Overgrown boughs obstructing cables, balconies or streetlights',
      category: 'Horticulture Department',
      badgeColor: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
      iconEmoji: '🌳',
      turnaround: 'Within 48 Hours',
      fee: 'Free Safety Service',
      description: 'Equipped crane and chainsaw unit removes storm-damaged or electric-wire entangling heavy tree boughs safely without harming the tree.'
    }
  ];

  // Initial bookings
  const [myBookings, setMyBookings] = useState([
    {
      id: 'BKG-2026-881',
      serviceTitle: 'Bulk E-Waste & Appliance Collection',
      ward: 'Ward 4 (Central)',
      address: 'Flat 402, Royal Palms, Link Road',
      preferredDate: '14 Oct 2026',
      timeSlot: 'Morning (08:00 AM - 11:30 AM)',
      status: 'CONFIRMED',
      assignedVehicle: 'Municipal Eco-Van #MP-04-EA-1982',
      driverContact: '+91 98260 11442',
      notes: '1 Broken Washing Machine and 1 CRT Monitor'
    },
    {
      id: 'BKG-2026-640',
      serviceTitle: 'Vector Disease Colony Fogging Drive',
      ward: 'Ward 7 (West End)',
      address: 'Sector B, Gulmohar Avenue, Lane 3',
      preferredDate: '10 Oct 2026',
      timeSlot: 'Evening (05:00 PM - 07:30 PM)',
      status: 'COMPLETED',
      assignedVehicle: 'Fogging Squad Unit 3',
      driverContact: '+91 94250 99812',
      notes: 'Waterlogging near open plot causing mosquito breeding'
    }
  ]);

  const openBookingFor = (service) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const handleCreateBooking = (e) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone || !bookingForm.address || !bookingForm.preferredDate) {
      return toast.error('Please fill in all contact & date fields');
    }

    const newBooking = {
      id: `BKG-2026-${Math.floor(100 + Math.random() * 900)}`,
      serviceTitle: selectedService.title,
      ward: bookingForm.ward,
      address: bookingForm.address,
      preferredDate: bookingForm.preferredDate,
      timeSlot: bookingForm.timeSlot,
      status: 'CONFIRMED',
      assignedVehicle: 'Assigning nearest municipal squad...',
      driverContact: 'Will be notified via SMS 2 hrs prior',
      notes: bookingForm.notes || 'Standard doorstep collection requested'
    };

    setMyBookings([newBooking, ...myBookings]);
    setShowBookingModal(false);
    setActiveTab('BOOKINGS');
    toast.success('Service slot booked! Confirmation SMS dispatched. 🚛', { duration: 4000 });
    setBookingForm({
      name: '',
      phone: '',
      address: '',
      ward: 'Ward 4 (Central)',
      preferredDate: '',
      timeSlot: 'Morning (08:00 AM - 11:30 AM)',
      notes: ''
    });
  };

  const cancelBooking = (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setMyBookings(myBookings.filter(b => b.id !== id));
      toast.success('Service booking cancelled');
    }
  };

  const handleStartTrip = (id) => {
    setMyBookings(myBookings.map(b => b.id === id ? { ...b, status: 'EN_ROUTE', assignedVehicle: 'Eco-Van #MP-04-EA-1982 (Driver: En-route to address)' } : b));
    toast.success('Squad dispatched! Citizen notified that driver is on the way. 🚚', { icon: '🟢' });
  };

  const handleCompleteService = (id) => {
    setMyBookings(myBookings.map(b => b.id === id ? { ...b, status: 'COMPLETED' } : b));
    toast.success('Service Completed & Waste Logged! Great job! ✅');
  };

  const handleAssignSquad = (id) => {
    setMyBookings(myBookings.map(b => b.id === id ? {
      ...b,
      status: 'SQUAD_ASSIGNED',
      assignedVehicle: 'Municipal Tipper Unit #04-T-882 (Assigned by Control Room)',
      driverContact: '+91 98261 44520'
    } : b));
    toast.success('Municipal Vehicle Squad Dispatched to Citizen Address!');
  };

  return (
    <div className="max-w-6xl mx-auto py-8 animate-in fade-in duration-700 pb-16">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 border border-emerald-900/40 p-8 sm:p-12 mb-8 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase tracking-widest mb-4 border border-emerald-400/30">
              <Truck size={14} /> {isWorker ? 'Ground Operations & Pickups' : isOfficer ? 'Municipal Fleet Dispatch Desk' : 'Nagar Nigam Doorstep E-Services'}
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-2">
              {isWorker ? 'My Field Pickup Tasks' : isOfficer ? 'Fleet & Squad Operations' : 'On-Demand Civic Services'}
            </h1>
            <p className="text-slate-300 font-medium text-base sm:text-lg max-w-xl">
              {isWorker
                ? 'View scheduled doorstep pickups, start transit, and mark bulky waste / malba clearance completed on-site.'
                : isOfficer
                ? 'Monitor doorstep municipal service requests, assign specialized hydraulic trucks, and oversee field completion.'
                : 'Book specialized municipal squads directly to your doorstep for bulk waste, debris clearance, mosquito fogging, and tree care.'}
            </p>
          </div>

          <div className="flex bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shrink-0">
            {isWorker ? (
              <button
                onClick={() => setActiveTab('DISPATCH_SQUAD')}
                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 flex items-center gap-2"
              >
                Assigned Pickups
                <span className="w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center font-black">
                  {myBookings.filter(b => b.status !== 'COMPLETED').length}
                </span>
              </button>
            ) : isOfficer ? (
              <>
                <button
                  onClick={() => setActiveTab('FLEET_DISPATCH')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                    activeTab === 'FLEET_DISPATCH'
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  All Citizen Bookings
                  <span className="w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center font-black">
                    {myBookings.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('CATALOG')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    activeTab === 'CATALOG'
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Services Catalog
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('CATALOG')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    activeTab === 'CATALOG'
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Services Catalog
                </button>
                <button
                  onClick={() => setActiveTab('BOOKINGS')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                    activeTab === 'BOOKINGS'
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  My Bookings
                  <span className="w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center font-black">
                    {myBookings.length}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Catalog Tab */}
      {activeTab === 'CATALOG' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white dark:bg-[#0B1120] rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                    {srv.iconEmoji}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${srv.badgeColor}`}>
                    {srv.category}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                  {srv.title}
                </h2>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
                  {srv.tagline}
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed mb-6">
                  {srv.description}
                </p>

                <div className="grid grid-cols-2 gap-3 bg-gray-50 dark:bg-slate-900/50 p-3.5 rounded-2xl border border-gray-100 dark:border-slate-800/60 text-xs font-bold mb-6">
                  <div>
                    <span className="text-gray-400 uppercase tracking-wider text-[10px] block">Turnaround Time</span>
                    <span className="text-gray-800 dark:text-slate-200 mt-0.5 block">{srv.turnaround}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase tracking-wider text-[10px] block">Charges</span>
                    <span className="text-emerald-600 dark:text-emerald-400 mt-0.5 block">{srv.fee}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => openBookingFor(srv)}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95"
              >
                Book Doorstep Slot <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Worker Ground Operations View */}
      {activeTab === 'DISPATCH_SQUAD' && (
        <div className="space-y-6">
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 p-4 rounded-2xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
            <span>👷 Field Worker Station: Hydraulic Van #MP-04-EA-1982 Squad</span>
            <span className="font-bold">Active Shift: Morning (Zone 4)</span>
          </div>

          {myBookings.map((bkg) => (
            <div
              key={bkg.id}
              className={`bg-white dark:bg-[#0B1120] rounded-[2rem] border-2 shadow-sm p-6 sm:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 ${
                bkg.status === 'EN_ROUTE' ? 'border-blue-500/50' : bkg.status === 'COMPLETED' ? 'border-gray-200 dark:border-slate-800 opacity-60' : 'border-emerald-500/30'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-gray-400">Order #{bkg.id}</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {bkg.ward}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                    bkg.status === 'COMPLETED'
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : bkg.status === 'EN_ROUTE'
                      ? 'bg-blue-500/10 text-blue-600 animate-pulse'
                      : 'bg-amber-500/10 text-amber-600'
                  }`}>
                    {bkg.status === 'EN_ROUTE' ? '🚚 En-Route to Site' : bkg.status}
                  </span>
                </div>

                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  {bkg.serviceTitle}
                </h3>

                <div className="text-xs font-medium text-gray-600 dark:text-slate-300">
                  Pickup Address: <strong>{bkg.address}</strong>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-800 text-xs">
                  <span className="text-gray-400">Citizen Instructions: </span>
                  <span className="font-semibold text-gray-800 dark:text-slate-200">"{bkg.notes}"</span>
                </div>
              </div>

              {bkg.status !== 'COMPLETED' && (
                <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
                  {bkg.status !== 'EN_ROUTE' && (
                    <button
                      onClick={() => handleStartTrip(bkg.id)}
                      className="flex-1 lg:flex-none px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Truck size={15} /> Start Trip (On The Way)
                    </button>
                  )}
                  <button
                    onClick={() => handleCompleteService(bkg.id)}
                    className="flex-1 lg:flex-none px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={15} /> Mark Collected & Done ✓
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Officer Fleet Management View */}
      {activeTab === 'FLEET_DISPATCH' && (
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 p-4 rounded-2xl flex items-center justify-between text-xs text-blue-800 dark:text-blue-300">
            <span>🛡️ Municipal Transport & Fleet Command Desk</span>
            <span className="font-bold">Total Citizen Requests: {myBookings.length}</span>
          </div>

          {myBookings.map((bkg) => (
            <div
              key={bkg.id}
              className="bg-white dark:bg-[#0B1120] rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm p-6 sm:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-gray-400">Booking #{bkg.id}</span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                    {bkg.ward}
                  </span>
                  <span className="text-xs font-bold text-gray-600 dark:text-slate-300">
                    Slot: {bkg.preferredDate} ({bkg.timeSlot})
                  </span>
                </div>

                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  {bkg.serviceTitle}
                </h3>

                <div className="text-xs text-gray-600 dark:text-slate-300">
                  Target Address: <strong>{bkg.address}</strong>
                </div>

                <div className="text-xs text-gray-500 dark:text-slate-400">
                  Assigned Vehicle Squad: <strong className="text-emerald-600 dark:text-emerald-400">{bkg.assignedVehicle}</strong>
                </div>
              </div>

              <div className="shrink-0">
                <button
                  onClick={() => handleAssignSquad(bkg.id)}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Re-assign / Dispatch Squad
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'BOOKINGS' && (
        <div className="space-y-6">
          {myBookings.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#0B1120] rounded-[2rem] border border-gray-100 dark:border-slate-800">
              <Truck size={48} className="mx-auto text-gray-300 dark:text-slate-600 mb-3" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">No active service bookings</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 mb-6">Explore our catalog and book special doorstep municipal pickups.</p>
              <button
                onClick={() => setActiveTab('CATALOG')}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm"
              >
                View Services Catalog
              </button>
            </div>
          ) : (
            myBookings.map((bkg) => (
              <div
                key={bkg.id}
                className="bg-white dark:bg-[#0B1120] rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">Booking #{bkg.id}</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      {bkg.ward}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                      bkg.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                    }`}>
                      {bkg.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-gray-900 dark:text-white">
                    {bkg.serviceTitle}
                  </h3>

                  <div className="flex flex-wrap gap-y-2 gap-x-6 text-xs font-medium text-gray-600 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-emerald-500" /> {bkg.preferredDate} ({bkg.timeSlot})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-rose-500" /> {bkg.address}
                    </span>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-xl border border-gray-100 dark:border-slate-800 text-xs space-y-1">
                    <div className="text-gray-400">Dispatched Squad: <strong className="text-gray-800 dark:text-slate-200">{bkg.assignedVehicle}</strong></div>
                    <div className="text-gray-400">Driver/Supervisor: <strong className="text-emerald-600 dark:text-emerald-400">{bkg.driverContact}</strong></div>
                    {bkg.notes && <div className="text-gray-400">Notes: <span className="italic text-gray-600 dark:text-slate-300">"{bkg.notes}"</span></div>}
                  </div>
                </div>

                {bkg.status !== 'COMPLETED' && (
                  <button
                    onClick={() => cancelBooking(bkg.id)}
                    className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors shrink-0"
                    title="Cancel Booking"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingModal && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBookingModal(false)}></div>
          <div className="bg-white dark:bg-[#0B1120] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-slate-800 w-full max-w-lg relative z-10 animate-in zoom-in-95 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedService.iconEmoji}</span>
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">Book Doorstep Squad</h3>
                  <p className="text-xs text-gray-400">{selectedService.title}</p>
                </div>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Applicant Name</label>
                  <input
                    required
                    type="text"
                    value={bookingForm.name}
                    onChange={e => setBookingForm({ ...bookingForm, name: e.target.value })}
                    placeholder="e.g., Rohit Sharma"
                    className="w-full p-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Mobile Number</label>
                  <input
                    required
                    type="tel"
                    value={bookingForm.phone}
                    onChange={e => setBookingForm({ ...bookingForm, phone: e.target.value })}
                    placeholder="e.g., 98260 00000"
                    className="w-full p-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Ward Selection</label>
                <select
                  value={bookingForm.ward}
                  onChange={e => setBookingForm({ ...bookingForm, ward: e.target.value })}
                  className="w-full p-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-gray-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Ward 4 (Central)">Ward 4 (Central)</option>
                  <option value="Ward 7 (West End)">Ward 7 (West End)</option>
                  <option value="Ward 12 (North Green)">Ward 12 (North Green)</option>
                  <option value="Ward 18 (East Corridor)">Ward 18 (East Corridor)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Doorstep Address & Landmark</label>
                <input
                  required
                  type="text"
                  value={bookingForm.address}
                  onChange={e => setBookingForm({ ...bookingForm, address: e.target.value })}
                  placeholder="House/Flat No., Building name, Street landmark"
                  className="w-full p-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Preferred Date</label>
                  <input
                    required
                    type="date"
                    value={bookingForm.preferredDate}
                    onChange={e => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                    className="w-full p-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Time Slot</label>
                  <select
                    value={bookingForm.timeSlot}
                    onChange={e => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
                    className="w-full p-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold text-gray-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Morning (08:00 AM - 11:30 AM)">Morning (08:00 - 11:30 AM)</option>
                    <option value="Afternoon (01:00 PM - 04:00 PM)">Afternoon (01:00 - 04:00 PM)</option>
                    <option value="Evening (05:00 PM - 07:30 PM)">Evening (05:00 - 07:30 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Item Details / Special Note (Optional)</label>
                <textarea
                  rows="2"
                  value={bookingForm.notes}
                  onChange={e => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  placeholder="e.g. 1 refrigerator and 2 CPU towers; on 2nd floor"
                  className="w-full p-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/25"
                >
                  Confirm Slot Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
