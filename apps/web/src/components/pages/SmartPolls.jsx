import { useState, useEffect } from 'react';
import { BarChart3, Users, Plus, X, Loader2, CheckCircle2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

export default function SmartPolls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']); // Start with 2 empty options

  const role = localStorage.getItem('role') || 'CITIZEN';

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/v1/polls`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setPolls(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load polls');
    } finally {
      setTimeout(() => setLoading(false), 500); // Skeleton delay
    }
  };

  const handleAddOption = () => setOptions([...options, '']);
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  const handleRemoveOption = (index) => {
    if (options.length <= 2) return;
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    const validOptions = options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      return toast.error('Please provide at least 2 valid options');
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/v1/polls`, 
        { question, options: validOptions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Poll published successfully!');
      setShowModal(false);
      setQuestion('');
      setOptions(['', '']);
      fetchPolls();
    } catch (error) {
      toast.error('Failed to publish poll');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (pollId, optionId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/v1/polls/${pollId}/vote`, 
        { option_id: optionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Vote cast successfully! 🗳️');
      fetchPolls(); // Refresh to get updated percentages
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to cast vote');
    }
  };

  const handleClosePoll = async (pollId) => {
    if (!window.confirm('Are you sure you want to close this poll?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE_URL}/api/v1/polls/${pollId}/close`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Poll closed');
      fetchPolls();
    } catch (error) {
      toast.error('Failed to close poll');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 animate-in fade-in duration-700 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest mb-3 border border-indigo-500/20">
            <BarChart3 size={14} /> E-Democracy
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">Smart City Polls</h1>
          <p className="text-gray-500 dark:text-slate-400 font-medium mt-2">Have your say in city development. Vote on official proposals.</p>
        </div>
        
        {(role === 'OFFICER' || role === 'ADMIN') && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={18} /> Create Poll
          </button>
        )}
      </div>

      {/* Polls Feed */}
      {loading ? (
        <div className="space-y-6">
          {[1,2].map(i => <div key={i} className="h-64 bg-gray-200 dark:bg-slate-800/50 rounded-[2rem] animate-pulse"></div>)}
        </div>
      ) : polls.length === 0 ? (
        <div className="text-center py-20 bg-white/70 dark:bg-[#0B1120]/80 backdrop-blur-xl rounded-[2rem] border border-gray-100/50 dark:border-slate-800/60 shadow-sm">
          <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-slate-700">
            <BarChart3 size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Active Polls</h3>
          <p className="text-gray-500 dark:text-slate-400">The administration hasn't posted any questions yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {polls.map((poll) => (
            <div key={poll.id} className="relative bg-white dark:bg-[#0B1120] rounded-[2rem] p-6 sm:p-8 border border-gray-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden transition-all duration-300 hover:shadow-xl">
              
              {!poll.active && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-500/10 rounded-full blur-3xl -translate-y-16 translate-x-16 pointer-events-none"></div>
              )}
              {poll.active && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-16 translate-x-16 pointer-events-none"></div>
              )}

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border ${poll.active ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50' : 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}`}>
                      {poll.active ? <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> : <Lock size={12} />}
                      {poll.active ? 'Active Poll' : 'Closed'}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{poll.question}</h2>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {poll.options.map(opt => {
                    const isSelected = poll.userVotedOptionId === opt.id;
                    return (
                      <div key={opt.id} className="relative group">
                        {/* Vote Button / Bar */}
                        <button 
                          disabled={!poll.active || poll.hasVoted}
                          onClick={() => handleVote(poll.id, opt.id)}
                          className={`w-full relative overflow-hidden rounded-2xl border transition-all duration-300 text-left p-4 ${
                            isSelected 
                              ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50 dark:bg-indigo-900/20' 
                              : poll.hasVoted || !poll.active
                                ? 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50' 
                                : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-[#0B1120] hover:border-indigo-500/50 hover:shadow-md'
                          }`}
                        >
                          {/* Progress Bar Background (Only show if voted or closed) */}
                          {(poll.hasVoted || !poll.active) && (
                            <div 
                              className={`absolute inset-y-0 left-0 transition-all duration-1000 ease-out ${isSelected ? 'bg-indigo-100 dark:bg-indigo-900/40' : 'bg-gray-100 dark:bg-slate-800/60'}`}
                              style={{ width: `${opt.percentage}%` }}
                            ></div>
                          )}
                          
                          <div className="relative z-10 flex justify-between items-center">
                            <span className={`font-semibold flex items-center gap-2 ${isSelected ? 'text-indigo-700 dark:text-indigo-400' : 'text-gray-700 dark:text-slate-300'}`}>
                              {isSelected && <CheckCircle2 size={18} />}
                              {opt.text}
                            </span>
                            {(poll.hasVoted || !poll.active) && (
                              <span className={`font-bold text-sm ${isSelected ? 'text-indigo-700 dark:text-indigo-400' : 'text-gray-500 dark:text-slate-400'}`}>
                                {opt.percentage}%
                              </span>
                            )}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800/60">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-slate-400">
                    <Users size={16} /> {poll.totalVotes} Votes Cast
                  </div>
                  
                  {(role === 'OFFICER' || role === 'ADMIN') && poll.active && (
                    <button 
                      onClick={() => handleClosePoll(poll.id)}
                      className="text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 px-4 py-2 rounded-lg transition-colors"
                    >
                      Close Poll
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 dark:bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="bg-white dark:bg-[#0B1120] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-slate-800/60 w-full max-w-xl relative z-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 sm:p-8 border-b border-gray-100 dark:border-slate-800/60">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="text-indigo-500" /> Create Public Poll
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreatePoll} className="p-6 sm:p-8 space-y-6">
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Question / Proposal</label>
                <input 
                  required type="text" 
                  value={question} onChange={e => setQuestion(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900 dark:text-white text-lg"
                  placeholder="E.g., What should we build in Ward 4?"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Voting Options</label>
                <div className="space-y-3">
                  {options.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <input 
                        required={i < 2} type="text" 
                        value={opt} onChange={e => handleOptionChange(i, e.target.value)}
                        className="flex-1 px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-900 dark:text-white"
                        placeholder={`Option ${i + 1}`}
                      />
                      {options.length > 2 && (
                        <button type="button" onClick={() => handleRemoveOption(i)} className="p-3 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {options.length < 5 && (
                  <button type="button" onClick={handleAddOption} className="mt-3 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                    <Plus size={16} /> Add Option
                  </button>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting || !question}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:scale-95"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <BarChart3 size={18} />} 
                  Publish Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
