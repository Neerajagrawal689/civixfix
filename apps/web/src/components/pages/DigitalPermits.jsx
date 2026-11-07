import { useState } from 'react';
import { FileCheck, QrCode, Calendar, Clock, CheckCircle2, AlertCircle, X, Plus, Printer, ShieldCheck, Download, Award, ChevronRight, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DigitalPermits() {
  const role = localStorage.getItem('role') || 'CITIZEN';
  const isOfficer = role === 'OFFICER' || role === 'ADMIN' || role === 'DEPT_HEAD';

  const [activeTab, setActiveTab] = useState(isOfficer ? 'APPROVAL_DESK' : 'CATALOG'); 
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedPermitType, setSelectedPermitType] = useState(null);
  const [viewingPass, setViewingPass] = useState(null);

  const permitTypes = [
    {
      id: 'NOC-PANDAL',
      title: 'Street Pandal & Event Permission',
      tagline: 'Marriage, cultural festival, or community religious gathering',
      fee: '₹ 500 (Municipal Fee)',
      validity: 'Up to 5 Days',
      iconEmoji: '🎪',
      description: 'Official clearance to erect roadside pandals, temporary event barricades, and stage setups with traffic safety compliance.'
    },
    {
      id: 'NOC-SOUND',
      title: 'Loudspeaker & Acoustic Sound NOC',
      tagline: 'Decibel limit compliance under Noise Pollution Rules',
      fee: '₹ 250 (Inspection Fee)',
      validity: 'Valid 06:00 AM - 10:00 PM',
      iconEmoji: '🔊',
      description: 'Pre-approved sound emission certificate for DJ, band, or public address equipment adhering to residential zone noise ceilings.'
    },
    {
      id: 'NOC-PET',
      title: 'Pet Animal Municipal Registration',
      tagline: 'Dog/Cat official registration & digital rabies health tag',
      fee: '₹ 150 (Annual Token)',
      validity: '1 Year Renewable',
      iconEmoji: '🐕',
      description: 'Mandatory civic pet registration badge certifying rabies vaccination and owner pedigree records under municipal bylaws.'
    },
    {
      id: 'NOC-TANKER',
      title: 'Emergency Water Tanker Requisition',
      tagline: 'Domestic drinking water delivery for pipeline failure',
      fee: 'Subsidized Nominal Rate',
      validity: 'Dispatched within 3 Hours',
      iconEmoji: '💧',
      description: 'Priority delivery pass for 5,000L / 10,000L municipal potable water tanker during dry spells, boring failures, or pipeline breakdowns.'
    }
  ];

  const [myPermits, setMyPermits] = useState([
    {
      id: 'CFX-NOC-2026-4491',
      permitName: 'Street Pandal & Event Permission',
      applicantName: 'Vikramaditya Sharma',
      contactPhone: '+91 98260 22341',
      venueAddress: 'Community Center Grounds, Ward 4',
      validFrom: '15 Oct 2026',
      validTill: '18 Oct 2026',
      status: 'APPROVED',
      issuedDate: '10 Oct 2026',
      approvingOfficer: 'Chief Municipal Officer (Zone 2)',
      qrHash: 'CFX-VERIFIED-AUTH-882910'
    },
    {
      id: 'CFX-NOC-2026-9182',
      permitName: 'Loudspeaker & Acoustic Sound NOC',
      applicantName: 'Manoj Kumar Gupta',
      contactPhone: '+91 98930 44512',
      venueAddress: 'Sector C Garden, Ward 7',
      validFrom: '20 Oct 2026',
      validTill: '21 Oct 2026',
      status: 'PENDING_REVIEW',
      issuedDate: '12 Oct 2026',
      approvingOfficer: 'Pending Officer Verification',
      qrHash: 'CFX-PENDING-REV-772109'
    },
    {
      id: 'CFX-NOC-2026-1082',
      permitName: 'Pet Animal Municipal Registration',
      applicantName: 'Priya Verma',
      contactPhone: '+91 94250 88712',
      venueAddress: 'House 88, B-Sector, Green Park, Ward 7',
      validFrom: '01 Jan 2026',
      validTill: '31 Dec 2026',
      status: 'APPROVED',
      issuedDate: '01 Jan 2026',
      approvingOfficer: 'Veterinary Health Inspector (Zone 4)',
      qrHash: 'CFX-VERIFIED-PET-491023'
    }
  ]);

  const [applyForm, setApplyForm] = useState({
    applicantName: '',
    phone: '',
    address: '',
    purpose: '',
    validFrom: '',
    validTill: '',
    additionalNotes: ''
  });

  const handleOpenApply = (permit) => {
    setSelectedPermitType(permit);
    setShowApplyModal(true);
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!applyForm.applicantName || !applyForm.phone || !applyForm.address || !applyForm.validFrom) {
      return toast.error('Please fill in required permit fields');
    }

    const newPass = {
      id: `CFX-NOC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      permitName: selectedPermitType.title,
      applicantName: applyForm.applicantName,
      contactPhone: applyForm.phone,
      venueAddress: applyForm.address,
      validFrom: applyForm.validFrom,
      validTill: applyForm.validTill || applyForm.validFrom,
      status: 'APPROVED',
      issuedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      approvingOfficer: 'Automated E-Governance Clearances (Town Planning)',
      qrHash: `CFX-VERIFIED-PASS-${Math.floor(100000 + Math.random() * 900000)}`
    };

    setMyPermits([newPass, ...myPermits]);
    setShowApplyModal(false);
    setViewingPass(newPass);
    setActiveTab('MY_PASSES');
    toast.success('Digital Permit sanctioned & QR E-Pass generated! 📜', { duration: 4000 });
    setApplyForm({
      applicantName: '',
      phone: '',
      address: '',
      purpose: '',
      validFrom: '',
      validTill: '',
      additionalNotes: ''
    });
  };

  const handleApprovePermit = (id) => {
    setMyPermits(myPermits.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: 'APPROVED',
          approvingOfficer: 'Municipal Town Planning Officer (Verified)',
          qrHash: `CFX-VERIFIED-AUTH-${Math.floor(100000 + Math.random() * 900000)}`
        };
      }
      return p;
    }));
    toast.success('Permit Approved & Digital QR Stamp Generated! 📜', { icon: '✅' });
  };

  const handleRejectPermit = (id) => {
    if (window.confirm('Are you sure you want to reject this permit request?')) {
      setMyPermits(myPermits.map(p => p.id === id ? { ...p, status: 'REJECTED' } : p));
      toast.error('Permit Application Rejected');
    }
  };

  const printPermit = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto py-8 animate-in fade-in duration-700 pb-16">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 border border-purple-900/40 p-8 sm:p-12 mb-8 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs uppercase tracking-widest mb-4 border border-purple-400/30">
              <FileCheck size={14} /> {isOfficer ? 'Municipal Authorization & Clearance' : 'Paperless Citizen Permissions'}
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-2">
              {isOfficer ? 'Permits & NOC Officer Desk' : 'Digital Permits & E-NOC Portal'}
            </h1>
            <p className="text-slate-300 font-medium text-base sm:text-lg max-w-xl">
              {isOfficer 
                ? 'Review citizen permit applications, conduct zoning checks, and issue digitally signed QR-verified E-Passes.' 
                : 'Apply for event pandals, sound NOCs, pet registrations, and emergency water passes with instant QR-verified digital authorization.'}
            </p>
          </div>

          <div className="flex bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shrink-0">
            {isOfficer ? (
              <>
                <button
                  onClick={() => setActiveTab('APPROVAL_DESK')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                    activeTab === 'APPROVAL_DESK'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Pending Applications
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-900 text-xs flex items-center justify-center font-black">
                    {myPermits.filter(p => p.status === 'PENDING_REVIEW').length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('MY_PASSES')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    activeTab === 'MY_PASSES'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Sanctioned Archive ({myPermits.filter(p => p.status === 'APPROVED').length})
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('CATALOG')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    activeTab === 'CATALOG'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Permits Catalog
                </button>
                <button
                  onClick={() => setActiveTab('MY_PASSES')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                    activeTab === 'MY_PASSES'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  My Issued Passes
                  <span className="w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center font-black">
                    {myPermits.length}
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
          {permitTypes.map((pmt) => (
            <div
              key={pmt.id}
              className="bg-white dark:bg-[#0B1120] rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                    {pmt.iconEmoji}
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold border bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
                    Instant E-NOC
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                  {pmt.title}
                </h2>
                <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-3">
                  {pmt.tagline}
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed mb-6">
                  {pmt.description}
                </p>

                <div className="grid grid-cols-2 gap-3 bg-gray-50 dark:bg-slate-900/50 p-3.5 rounded-2xl border border-gray-100 dark:border-slate-800/60 text-xs font-bold mb-6">
                  <div>
                    <span className="text-gray-400 uppercase tracking-wider text-[10px] block">Standard Validity</span>
                    <span className="text-gray-800 dark:text-slate-200 mt-0.5 block">{pmt.validity}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase tracking-wider text-[10px] block">Government Tariff</span>
                    <span className="text-purple-600 dark:text-purple-400 mt-0.5 block">{pmt.fee}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleOpenApply(pmt)}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95"
              >
                Apply for Digital Permit <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Officer Approval Desk */}
      {activeTab === 'APPROVAL_DESK' && (
        <div className="space-y-6">
          {myPermits.filter(p => p.status === 'PENDING_REVIEW').length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#0B1120] rounded-[2rem] border border-gray-100 dark:border-slate-800">
              <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-3" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Desk Cleared! Zero Pending NOCs</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">All citizen permit applications have been reviewed and sanctioned.</p>
            </div>
          ) : (
            myPermits.filter(p => p.status === 'PENDING_REVIEW').map((req) => (
              <div
                key={req.id}
                className="bg-white dark:bg-[#0B1120] rounded-[2rem] border-2 border-amber-500/30 dark:border-amber-500/20 shadow-sm p-6 sm:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
              >
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">Application ID: {req.id}</span>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      Awaiting Officer Sanction
                    </span>
                    <span className="text-xs text-gray-400">Applied on {req.issuedDate}</span>
                  </div>

                  <h3 className="text-xl font-black text-gray-900 dark:text-white">
                    {req.permitName}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-gray-700 dark:text-slate-300 bg-gray-50 dark:bg-slate-900/50 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
                    <div>Applicant: <strong>{req.applicantName}</strong></div>
                    <div>Contact: <strong>{req.contactPhone}</strong></div>
                    <div>Event Venue: <strong>{req.venueAddress}</strong></div>
                    <div>Required Dates: <strong>{req.validFrom} to {req.validTill}</strong></div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
                  <button
                    onClick={() => handleRejectPermit(req.id)}
                    className="flex-1 lg:flex-none px-4 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl font-bold text-xs transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprovePermit(req.id)}
                    className="flex-1 lg:flex-none px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={15} /> Sanction & Issue QR Pass
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* My Passes Tab */}
      {activeTab === 'MY_PASSES' && (
        <div className="space-y-6">
          {myPermits.map((pass) => (
            <div
              key={pass.id}
              className="bg-white dark:bg-[#0B1120] rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-gray-400">Pass Reference: {pass.id}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 size={13} /> {pass.status}
                  </span>
                </div>

                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  {pass.permitName}
                </h3>
                <div className="text-sm font-semibold text-gray-600 dark:text-slate-300">
                  Beneficiary: <strong>{pass.applicantName}</strong> ({pass.contactPhone})
                </div>

                <div className="flex flex-wrap gap-y-1 gap-x-6 text-xs text-gray-500 dark:text-slate-400">
                  <span>Venue: {pass.venueAddress}</span>
                  <span>Valid: {pass.validFrom} to {pass.validTill}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setViewingPass(pass)}
                  className="px-5 py-2.5 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Eye size={15} /> View QR E-Pass
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && selectedPermitType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowApplyModal(false)}></div>
          <div className="bg-white dark:bg-[#0B1120] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-slate-800 w-full max-w-lg relative z-10 animate-in zoom-in-95 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedPermitType.iconEmoji}</span>
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">Apply for Permit</h3>
                  <p className="text-xs text-gray-400">{selectedPermitType.title}</p>
                </div>
              </div>
              <button onClick={() => setShowApplyModal(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Applicant Name</label>
                  <input
                    required
                    type="text"
                    value={applyForm.applicantName}
                    onChange={e => setApplyForm({ ...applyForm, applicantName: e.target.value })}
                    placeholder="e.g., Arvind Saxena"
                    className="w-full p-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Mobile Phone</label>
                  <input
                    required
                    type="tel"
                    value={applyForm.phone}
                    onChange={e => setApplyForm({ ...applyForm, phone: e.target.value })}
                    placeholder="e.g., 98260 12345"
                    className="w-full p-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Premises / Event Venue Location</label>
                <input
                  required
                  type="text"
                  value={applyForm.address}
                  onChange={e => setApplyForm({ ...applyForm, address: e.target.value })}
                  placeholder="Plot/Street Address, Ward Number"
                  className="w-full p-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Start Date</label>
                  <input
                    required
                    type="date"
                    value={applyForm.validFrom}
                    onChange={e => setApplyForm({ ...applyForm, validFrom: e.target.value })}
                    className="w-full p-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">End Date</label>
                  <input
                    type="date"
                    value={applyForm.validTill}
                    onChange={e => setApplyForm({ ...applyForm, validTill: e.target.value })}
                    className="w-full p-3.5 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Purpose / Details</label>
                <textarea
                  rows="2"
                  value={applyForm.purpose}
                  onChange={e => setApplyForm({ ...applyForm, purpose: e.target.value })}
                  placeholder="e.g. Wedding Reception Gathering / Labradoodle 3yr Rabies Booster"
                  className="w-full p-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-500/25"
                >
                  Generate E-Permit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Verified QR E-Pass Modal */}
      {viewingPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setViewingPass(null)}></div>
          <div className="bg-white dark:bg-[#0B1120] rounded-[2.5rem] shadow-2xl border-2 border-purple-500/30 w-full max-w-md relative z-10 animate-in zoom-in-95 p-6 sm:p-8">
            
            <div className="flex justify-between items-center mb-6">
              <span className="text-[11px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400">
                OFFICIAL DIGITAL PASS
              </span>
              <button onClick={() => setViewingPass(null)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full">
                <X size={18} />
              </button>
            </div>

            {/* Official Pass Header */}
            <div className="text-center pb-6 border-b border-dashed border-gray-200 dark:border-slate-800">
              <div className="w-14 h-14 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-purple-500/20">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">
                MUNICIPAL CORPORATION
              </h3>
              <p className="text-xs font-semibold text-gray-400">SMART CITY ADMINISTRATION E-PERMIT</p>
              <div className="inline-block mt-3 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-black uppercase border border-emerald-500/20">
                ✓ VERIFIED & APPROVED
              </div>
            </div>

            {/* QR Code Centerpiece */}
            <div className="py-6 flex flex-col items-center justify-center">
              <div className="p-4 bg-white rounded-2xl shadow-lg border-2 border-gray-100 flex flex-col items-center">
                {/* SVG QR Code Simulation */}
                <div className="w-40 h-40 bg-slate-900 rounded-xl p-3 flex flex-col justify-between items-center relative overflow-hidden">
                  <div className="w-full flex justify-between">
                    <div className="w-8 h-8 border-4 border-white rounded-sm flex items-center justify-center">
                      <div className="w-3 h-3 bg-white"></div>
                    </div>
                    <div className="w-8 h-8 border-4 border-white rounded-sm flex items-center justify-center">
                      <div className="w-3 h-3 bg-white"></div>
                    </div>
                  </div>
                  <div className="w-full flex justify-center py-2">
                    <div className="w-10 h-10 border-2 border-dashed border-purple-400 rounded-lg flex items-center justify-center text-white text-[9px] font-black tracking-tighter">
                      CFX-PASS
                    </div>
                  </div>
                  <div className="w-full flex justify-between">
                    <div className="w-8 h-8 border-4 border-white rounded-sm flex items-center justify-center">
                      <div className="w-3 h-3 bg-white"></div>
                    </div>
                    <div className="w-8 h-8 grid grid-cols-2 gap-1 p-1">
                      <div className="bg-white"></div>
                      <div className="bg-white"></div>
                      <div className="bg-white"></div>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-gray-600 mt-2">{viewingPass.qrHash}</span>
              </div>
            </div>

            {/* Pass Metadata */}
            <div className="space-y-2.5 text-xs bg-gray-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-gray-100 dark:border-slate-800">
              <div className="flex justify-between">
                <span className="text-gray-400">Pass Number:</span>
                <span className="font-bold text-gray-900 dark:text-white font-mono">{viewingPass.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Permit Type:</span>
                <span className="font-bold text-gray-900 dark:text-white">{viewingPass.permitName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Holder Name:</span>
                <span className="font-bold text-gray-900 dark:text-white">{viewingPass.applicantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Validity:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{viewingPass.validFrom} to {viewingPass.validTill}</span>
              </div>
            </div>

            {/* Print Action */}
            <div className="mt-6 pt-4 flex gap-3">
              <button
                onClick={printPermit}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
              >
                <Printer size={16} /> Print / Save E-Pass
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
