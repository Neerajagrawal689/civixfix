import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Tag, ArrowLeft, Activity, Check, CheckCircle, Image as ImageIcon, Camera, Clock, Send, ThumbsUp, Star, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../config/api';

export default function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [resolutionFile, setResolutionFile] = useState(null);
  const [sliderPos, setSliderPos] = useState(50);

  // Comments
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [postingComment, setPostingComment] = useState(false);
  const socketRef = useRef(null);
  const commentsEndRef = useRef(null);

  // Support / Upvote
  const [supportData, setSupportData] = useState({ totalSupports: 0, isSupported: false });
  const [supporting, setSupporting] = useState(false);

  // Feedback
  const [feedbacks, setFeedbacks] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [myRating, setMyRating] = useState(0);
  const [myFeedbackComment, setMyFeedbackComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [alreadyRated, setAlreadyRated] = useState(false);

  const userRole = localStorage.getItem('role') || 'CITIZEN';
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [issueRes, commentsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/v1/issues/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/v1/issues/${id}/comments`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const issueData = await issueRes.json();
        const commentsData = await commentsRes.json();
        if (issueData.success) {
          setIssue(issueData.data);
          if (issueData.data.totalSupports !== undefined) {
            setSupportData({
              totalSupports: issueData.data.totalSupports,
              isSupported: !!issueData.data.isSupported
            });
          } else if (issueData.data._count?.supports !== undefined) {
            setSupportData(prev => ({ ...prev, totalSupports: issueData.data._count.supports }));
          }
          // Fetch support count + status fallback
          try {
            const supportRes = await fetch(`${API_BASE_URL}/api/v1/issues/${id}/support`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (supportRes.ok) {
              const sd = await supportRes.json();
              if (sd.success) setSupportData({ totalSupports: sd.totalSupports, isSupported: sd.isSupported });
            }
          } catch {}
        }
        if (commentsData.success) setComments(commentsData.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFeedbacks = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/issues/${id}/feedback`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setFeedbacks(data.data);
          setAvgRating(data.avgRating);
          const myFb = data.data.find(f => f.citizen?.id === currentUser?.id);
          if (myFb) {
            setAlreadyRated(true);
            setMyRating(myFb.rating);
            setMyFeedbackComment(myFb.comment || '');
          }
        }
      } catch {}
    };

    const fetchWorkers = async () => {
      try {
        if (userRole === 'OFFICER' || userRole === 'ADMIN') {
          const res = await axios.get(`${API_BASE_URL}/api/v1/auth/workers`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data.success) setWorkers(res.data.data);
        }
      } catch {}
    };

    fetchAll();
    fetchFeedbacks();
    fetchWorkers();

    socketRef.current = io(API_BASE_URL);
    socketRef.current.emit('join_issue', id);
    socketRef.current.on('new_comment', (comment) => {
      setComments(prev => [...prev, comment]);
    });

    return () => { if (socketRef.current) socketRef.current.disconnect(); };
  }, [id]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setPostingComment(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/issues/${id}/comments`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: commentInput })
      });
      const data = await res.json();
      if (data.success) {
        setCommentInput('');
        // socket will add it via new_comment event, but add locally too as fallback
        setComments(prev => {
          const exists = prev.find(c => c.id === data.data.id);
          return exists ? prev : [...prev, data.data];
        });
      }
    } catch (error) { toast.error('Failed to post comment'); }
    finally { setPostingComment(false); }
  };

  const handleSupport = async () => {
    if (supporting) return;
    setSupporting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/issues/${id}/support`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setSupportData({ totalSupports: result.data.totalSupports, isSupported: result.data.isSupported });
        if (result.data.isSupported) {
          toast.success(`👍 Support added! ${result.data.totalSupports} citizens support this issue.`);
          if (result.data.newPriority === 'CRITICAL') {
            toast('🚨 Issue escalated to CRITICAL priority!', { icon: '⚠️' });
          }
        } else {
          toast('Support removed.', { icon: '👇' });
        }
      }
    } catch { toast.error('Failed to update support'); }
    finally { setSupporting(false); }
  };

  const handleAssignWorker = async () => {
    if (!selectedWorker) return;
    setAssigning(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/v1/issues/${id}/assign`, { worker_id: selectedWorker }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) { setIssue(res.data.data); setSelectedWorker(''); toast.success('Worker assigned!'); }
    } catch { toast.error('Failed to assign worker'); }
    finally { setAssigning(false); }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('new_status', newStatus);
      formData.append('note', statusNote);
      if (resolutionFile && newStatus === 'RESOLVED') formData.append('image', resolutionFile);
      const res = await fetch(`${API_BASE_URL}/api/v1/issues/${id}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const result = await res.json();
      if (result.success) { toast.success('Status updated!'); window.location.reload(); }
      else toast.error(result.error?.message || 'Failed to update');
    } catch { toast.error('Error updating status'); }
    finally { setUpdating(false); }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!myRating) return toast.error('Please select a star rating');
    setSubmittingFeedback(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/issues/${id}/feedback`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: myRating, comment: myFeedbackComment })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('⭐ Thank you for your feedback!');
        setAlreadyRated(true);
        // Refresh feedbacks
        const fRes = await fetch(`${API_BASE_URL}/api/v1/issues/${id}/feedback`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const fData = await fRes.json();
        if (fData.success) { setFeedbacks(fData.data); setAvgRating(fData.avgRating); }
      } else { toast.error(data.error?.message || 'Failed to submit feedback'); }
    } catch { toast.error('Error submitting feedback'); }
    finally { setSubmittingFeedback(false); }
  };

  const handleTwitterEscalate = () => {
    const text = encodeURIComponent(`🚨 @CityMayor @MunicipalBody Please fix Issue #${issue.issue_number} - "${issue.title}". #CivicFix #SmartCity`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const generatePDF = () => {
    const element = document.getElementById('report-content');
    import('html2pdf.js').then((html2pdf) => {
      const opt = {
        margin: 0.5,
        filename: `Issue_Report_${issue.issue_number}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      html2pdf.default().set(opt).from(element).save();
    });
  };

  const StarRating = ({ value, onChange, readonly = false }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange && onChange(star)}
          className={`text-2xl transition-transform ${readonly ? 'cursor-default' : 'hover:scale-125 cursor-pointer'} ${star <= value ? 'text-amber-400' : 'text-gray-200 dark:text-slate-700'}`}
        >★</button>
      ))}
    </div>
  );

  if (loading) return <div className="p-8 text-center text-gray-500 dark:text-slate-400">Loading issue details...</div>;
  if (!issue) return <div className="p-8 text-center text-red-500">Issue not found or access denied.</div>;

  const stages = ['SUBMITTED', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];
  let currentStageIndex = stages.indexOf(issue.status);
  if (issue.status === 'SUBMITTED' && issue.ai_confidence > 0) currentStageIndex = 1;
  if (currentStageIndex === -1 && issue.status === 'CLOSED') currentStageIndex = 4;
  if (currentStageIndex === -1) currentStageIndex = 0;

  const resolutionImage = issue.images?.find(img => img.image_type === 'RESOLUTION');
  const reportImage = issue.images?.find(img => img.image_type === 'REPORT' || !img.image_type);
  const isResolved = issue.status === 'RESOLVED' || issue.status === 'CLOSED';

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      {/* Top Bar */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-gray-500 dark:text-slate-400 hover:text-blue-600 font-medium transition-colors cursor-pointer">
          <ArrowLeft size={18} className="mr-2" /> Back
        </button>
        <div className="flex flex-wrap gap-3">
          {!isResolved && (
            <button onClick={handleTwitterEscalate} className="flex items-center text-sm font-bold text-[#1DA1F2] bg-[#1DA1F2]/10 px-4 py-2 rounded-xl hover:bg-[#1DA1F2]/20 transition-colors shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mr-2" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" /></svg>
              Escalate to X
            </button>
          )}

          {/* 👍 UPVOTE BUTTON */}
          {!isResolved ? (
            <button
              onClick={handleSupport}
              disabled={supporting}
              className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl border transition-all shadow-sm cursor-pointer ${
                supportData.isSupported
                  ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600'
                  : 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100'
              } disabled:opacity-60`}
            >
              <ThumbsUp size={16} className={supportData.isSupported ? 'fill-white' : ''} />
              {supportData.isSupported ? 'Supported' : 'Support'} · {supportData.totalSupports}
            </button>
          ) : (
            <span className="flex items-center gap-1.5 text-sm font-bold text-orange-600 bg-orange-50 px-3.5 py-2 rounded-xl border border-orange-200">
              <ThumbsUp size={15} /> {supportData.totalSupports} Supported
            </span>
          )}

          {/* Quick Discussion Link */}
          <button
            onClick={() => {
              document.getElementById('discussion-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <MessageCircle size={16} /> Discussion ({comments.length})
          </button>

          {isResolved && (
            <button onClick={generatePDF} className="flex items-center text-sm font-bold text-white bg-blue-600 px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Download PDF
            </button>
          )}
          {isResolved && (
            <span className="flex items-center text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              <CheckCircle size={16} className="mr-1" /> Verified Fixed
            </span>
          )}
        </div>
      </div>

      <div id="report-content" className="bg-transparent rounded-3xl lg:p-0">
        {/* Status Tracker */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 sm:p-10 mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-8">Tracking Status</h2>
          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-100 dark:bg-slate-800 -translate-y-1/2 rounded-full"></div>
            <div className="absolute top-1/2 left-0 h-1.5 bg-blue-500 -translate-y-1/2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}></div>
            <div className="relative flex justify-between">
              {stages.map((stage, idx) => {
                const isCompleted = idx <= currentStageIndex;
                const isActive = idx === currentStageIndex;
                return (
                  <div key={stage} className="flex flex-col items-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10 transition-colors ${isActive ? 'bg-blue-600 text-white animate-pulse' : isCompleted ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400 dark:text-slate-500'}`}>
                      {isCompleted ? <Check size={16} strokeWidth={3} /> : <div className="w-2 h-2 rounded-full bg-current"></div>}
                    </div>
                    <span className={`mt-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center ${isActive ? 'text-blue-700' : isCompleted ? 'text-gray-700 dark:text-slate-300' : 'text-gray-400 dark:text-slate-500'}`}>
                      {stage.replace('_', ' ')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Media + Details */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="bg-gray-900 relative min-h-[400px] flex items-center justify-center">
              {resolutionImage && reportImage ? (
                <div className="relative w-full h-full overflow-hidden select-none" onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); setSliderPos((Math.max(0, Math.min(e.clientX - rect.left, rect.width)) / rect.width) * 100); }} onTouchMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); setSliderPos((Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width)) / rect.width) * 100); }}>
                  <img src={`${API_BASE_URL}${resolutionImage.url}`} alt="After" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">AFTER</div>
                  <div className="absolute inset-0 w-full h-full" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
                    <img src={`${API_BASE_URL}${reportImage.url}`} alt="Before" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">BEFORE</div>
                  </div>
                  <div className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}>
                    <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-500">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 9l-4 3 4 3M16 9l4 3-4 3" /></svg>
                    </div>
                  </div>
                </div>
              ) : reportImage ? (
                <img src={`${API_BASE_URL}${reportImage.url}`} alt="Evidence" className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-500 flex flex-col items-center"><ImageIcon size={48} className="mb-2 opacity-50" /><span>No image</span></div>
              )}
            </div>
            <div className="p-8">
              <div className="flex justify-between items-center mb-4">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider ${isResolved ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                  {issue.status.replace('_', ' ')}
                </span>
                <span className="text-sm font-semibold text-gray-400 bg-gray-50 dark:bg-slate-900/50 px-3 py-1 rounded-lg border border-gray-100 dark:border-slate-700">
                  {issue.issue_number}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{issue.title}</h1>
              <p className="text-gray-600 dark:text-slate-400 mb-8 leading-relaxed text-lg">{issue.description}</p>
              <div className="space-y-4 border-t border-gray-100 dark:border-slate-700 pt-6">
                <div className="flex items-start bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
                  <MapPin size={20} className="text-blue-500 mt-0.5 mr-3" />
                  <div><p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Location</p><p className="text-sm text-gray-900 dark:text-white font-medium">{issue.address}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
                    <Tag size={20} className="text-blue-500 mr-3" />
                    <div><p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Category</p><p className="text-sm text-gray-900 dark:text-white font-medium">{issue.category?.name || 'General'}</p></div>
                  </div>
                  <div className="flex items-center bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
                    <Calendar size={20} className="text-blue-500 mr-3" />
                    <div><p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Reported</p><p className="text-sm text-gray-900 dark:text-white font-medium">{new Date(issue.created_at).toLocaleDateString()}</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* AI Insights */}
            {issue.ai_confidence && (
              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-2xl shadow-sm border border-indigo-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-white text-indigo-600 p-2.5 rounded-xl shadow-sm"><Activity size={24} /></span>
                  <h2 className="text-2xl font-bold text-indigo-900">AI Verification</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                    <p className="text-xs text-indigo-400 uppercase font-bold tracking-wider">Suggested Category</p>
                    <p className="text-lg font-bold text-indigo-900 mt-1">{issue.ai_category || 'N/A'}</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                    <p className="text-xs text-indigo-400 uppercase font-bold tracking-wider">Priority Level</p>
                    <p className="text-lg font-bold text-indigo-900 mt-1">{issue.ai_priority || 'N/A'}</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 col-span-2">
                    <p className="text-xs text-indigo-400 uppercase font-bold tracking-wider mb-2">AI Confidence</p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-indigo-100 rounded-full h-3 overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full" style={{ width: `${Math.round(issue.ai_confidence * 100)}%` }}></div>
                      </div>
                      <span className="text-lg font-black text-indigo-900">{Math.round(issue.ai_confidence * 100)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ⭐ RESOLUTION FEEDBACK SECTION */}
            {isResolved && userRole === 'CITIZEN' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Star size={22} className="text-amber-500 fill-amber-500" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Rate the Resolution</h3>
                  {avgRating && (
                    <span className="ml-auto text-sm font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800/40">
                      ★ {avgRating} avg ({feedbacks.length} ratings)
                    </span>
                  )}
                </div>

                {alreadyRated ? (
                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40 rounded-2xl p-5">
                    <p className="text-green-700 dark:text-green-400 font-bold mb-2">✅ You have rated this resolution</p>
                    <StarRating value={myRating} readonly />
                    {myFeedbackComment && <p className="text-sm text-gray-600 dark:text-slate-400 mt-2 italic">"{myFeedbackComment}"</p>}
                    <button onClick={() => setAlreadyRated(false)} className="mt-3 text-xs text-blue-600 hover:underline font-medium">Edit my rating</button>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <div>
                      <p className="text-sm font-bold text-gray-500 dark:text-slate-400 mb-2">How well was your issue resolved?</p>
                      <StarRating value={myRating} onChange={setMyRating} />
                      <p className="text-xs text-gray-400 mt-1">
                        {myRating === 1 ? 'Poor — Not fixed at all' : myRating === 2 ? 'Below average' : myRating === 3 ? 'Okay — Partially fixed' : myRating === 4 ? 'Good — Mostly fixed' : myRating === 5 ? 'Excellent — Completely resolved! 🎉' : 'Click to rate'}
                      </p>
                    </div>
                    <textarea
                      rows="2"
                      value={myFeedbackComment}
                      onChange={e => setMyFeedbackComment(e.target.value)}
                      placeholder="Optional: Share your experience..."
                      className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-900/50 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                    <button type="submit" disabled={submittingFeedback || !myRating} className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm shadow-md shadow-amber-500/20 transition-all disabled:opacity-50 flex items-center gap-2">
                      <Star size={16} /> {submittingFeedback ? 'Submitting...' : 'Submit Rating'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          <div className="space-y-8">
            {/* Timeline */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Clock className="mr-2 text-blue-600 w-5 h-5" /> Timeline
              </h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:h-full before:w-0.5 before:bg-gray-100">
                {issue.status_history?.map((history) => (
                  <div key={history.id} className="relative flex items-start z-10">
                    <div className="w-8 h-8 rounded-full border-4 border-white bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">{history.new_status.replace('_', ' ')}</h4>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">{history.note || 'Status updated'}</p>
                      <time className="text-xs font-medium text-gray-400 block mt-1">{new Date(history.created_at).toLocaleString()}</time>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Officer Controls */}
            {userRole === 'OFFICER' && (
              <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-6 text-white">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                  <Activity size={20} className="mr-2 text-blue-400" /> Officer Controls
                </h3>
                <form onSubmit={handleStatusUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Update Status</label>
                    <select required className="w-full p-3 border border-slate-700 rounded-xl bg-slate-800 text-white focus:ring-2 focus:ring-blue-500 outline-none" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                      <option value="">Select new status</option>
                      <option value="ASSIGNED">Assign to Field Worker</option>
                      <option value="IN_PROGRESS">Mark In Progress</option>
                      <option value="RESOLVED">Mark as Resolved</option>
                    </select>
                  </div>
                  {newStatus === 'RESOLVED' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Upload After Photo</label>
                      <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-slate-600 rounded-xl hover:border-blue-500 cursor-pointer transition-all">
                        <Camera size={20} className="text-slate-400 mr-2" />
                        <span className="text-slate-300 text-sm">{resolutionFile ? resolutionFile.name : 'Click to select photo...'}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => setResolutionFile(e.target.files[0])} required />
                      </label>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Resolution Note</label>
                    <textarea required rows="3" placeholder="E.g., Team dispatched to location" className="w-full p-3 border border-slate-700 rounded-xl bg-slate-800 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" value={statusNote} onChange={(e) => setStatusNote(e.target.value)} />
                  </div>
                  <button type="submit" disabled={updating || !newStatus} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-colors disabled:opacity-50">
                    {updating ? 'Updating...' : 'Apply Update'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 💬 COMMENTS / DISCUSSION THREAD */}
      <div id="discussion-section" className="mt-8 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 sm:p-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          💬 Discussion Thread
          <span className="ml-auto text-sm font-bold text-gray-400 bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-full">{comments.length} comments</span>
        </h3>

        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-1">
          {comments.map((c) => (
            <div key={c.id} className="p-4 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {c.user?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">{c.user?.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${c.user?.role === 'OFFICER' || c.user?.role === 'DEPT_HEAD' ? 'bg-blue-500/10 text-blue-600' : c.user?.role === 'WORKER' ? 'bg-green-500/10 text-green-600' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'}`}>
                    {c.user?.role}
                  </span>
                </div>
                <span className="text-xs text-gray-400 dark:text-slate-500 shrink-0">{new Date(c.created_at).toLocaleString()}</span>
              </div>
              <p className="text-gray-700 dark:text-slate-300 text-sm pl-10">{c.comment}</p>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-center text-gray-400 dark:text-slate-500 py-8">No comments yet. Be the first to comment!</p>
          )}
          <div ref={commentsEndRef} />
        </div>

        <form onSubmit={handleCommentSubmit} className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0 mt-1">
            {currentUser?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <input
            type="text"
            placeholder="Write a comment..."
            className="flex-1 p-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={!commentInput.trim() || postingComment}
            className="px-5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
