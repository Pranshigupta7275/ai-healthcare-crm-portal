import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createInteraction } from '../redux/interactionsSlice';
import axios from 'axios';

const Dashboard = () => {
  const dispatch = useDispatch();
  
  // Left Panel Form State
  const [formData, setFormData] = useState({ 
    hcp_name: '', 
    interaction_type: 'Meeting',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    attendees: '',
    topics: '',
    sentiment: 'Neutral',
    outcomes: '',
    followUp: ''
  });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });

  // Right Panel Chat State
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Log interaction details here (e.g., "Met Dr. Smith, discussed Product X efficacy...") or ask for help.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Handle Form Submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ type: 'loading', message: 'Saving interaction to CRM...' });
    
    const compiledNotes = `
Date: ${formData.date} ${formData.time}
Attendees: ${formData.attendees || 'None specified'}
Topics: ${formData.topics}
Sentiment: ${formData.sentiment}
Outcomes: ${formData.outcomes}
Follow-up: ${formData.followUp}
    `.trim();

    try {
      const payload = {
        hcp_name: formData.hcp_name,
        hospital: 'Not Specified (See Notes)', 
        specialty: 'General',
        interaction_type: formData.interaction_type,
        notes: compiledNotes,
        summary: formData.topics.substring(0, 100) || 'Manual Log'
      };
      
      await dispatch(createInteraction(payload)).unwrap();
      
      setFormStatus({ type: 'success', message: 'Successfully logged interaction!' });
      setFormData(prev => ({ ...prev, hcp_name: '', attendees: '', topics: '', outcomes: '', followUp: '' }));
      setTimeout(() => setFormStatus({ type: '', message: '' }), 3000);
    } catch (error) {
      setFormStatus({ type: 'error', message: 'Failed to save entry.' });
    }
  };

  // Handle Chat Submission
  const handleChatSend = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'user', text: chatInput };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/agent/chat', { message: userMsg.text });
      setMessages(prev => [...prev, { sender: 'ai', text: response.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Error connecting to AI agent.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-slate-900 mb-6 mt-0">Log HCP Interaction</h2>
      
      {/* Grid container: 2 parts form, 1 part AI chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: The Detailed Form */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="text-lg font-semibold text-slate-800 mb-5 pb-2 border-b border-slate-200">
            Interaction Details
          </div>
          
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">HCP Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent" 
                  placeholder="Search or select HCP..."
                  value={formData.hcp_name}
                  onChange={e => setFormData({...formData, hcp_name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Interaction Type</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-white"
                  value={formData.interaction_type}
                  onChange={e => setFormData({...formData, interaction_type: e.target.value})}
                >
                  <option>Meeting</option>
                  <option>Email</option>
                  <option>Phone Call</option>
                  <option>Event</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Date</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent" 
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Time</label>
                <input 
                  type="time" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent" 
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">Attendees</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent" 
                placeholder="Enter names or search..."
                value={formData.attendees}
                onChange={e => setFormData({...formData, attendees: e.target.value})}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">Topics Discussed</label>
              <textarea 
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent" 
                rows="3" 
                placeholder="Enter key discussion points..."
                value={formData.topics}
                onChange={e => setFormData({...formData, topics: e.target.value})}
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">Observed/Inferred HCP Sentiment</label>
              <div className="flex gap-5 mt-2">
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input type="radio" name="sentiment" value="Positive" checked={formData.sentiment === 'Positive'} onChange={e => setFormData({...formData, sentiment: e.target.value})} className="text-sky-500 focus:ring-sky-400" /> 
                  😊 Positive
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input type="radio" name="sentiment" value="Neutral" checked={formData.sentiment === 'Neutral'} onChange={e => setFormData({...formData, sentiment: e.target.value})} className="text-sky-500 focus:ring-sky-400" /> 
                  😐 Neutral
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input type="radio" name="sentiment" value="Negative" checked={formData.sentiment === 'Negative'} onChange={e => setFormData({...formData, sentiment: e.target.value})} className="text-sky-500 focus:ring-sky-400" /> 
                  😞 Negative
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">Outcomes</label>
              <textarea 
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent" 
                rows="2" 
                placeholder="Key outcomes or agreements..."
                value={formData.outcomes}
                onChange={e => setFormData({...formData, outcomes: e.target.value})}
              ></textarea>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">Follow-up Actions</label>
              <textarea 
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent" 
                rows="2" 
                placeholder="Enter next steps or tasks..."
                value={formData.followUp}
                onChange={e => setFormData({...formData, followUp: e.target.value})}
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-sky-700 bg-sky-50 p-3 rounded-md border border-sky-100 w-full sm:w-auto flex-1">
                <strong className="block mb-1">AI Suggested Follow-ups:</strong>
                <span className="block">+ Schedule follow-up meeting in 2 weeks</span>
                <span className="block">+ Send updated efficacy brochure</span>
              </div>
              <button 
                type="submit" 
                className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-2.5 rounded-md font-medium transition-colors shadow-sm disabled:opacity-70 whitespace-nowrap"
                disabled={formStatus.type === 'loading'}
              >
                {formStatus.type === 'loading' ? 'Saving...' : 'Save Interaction'}
              </button>
            </div>
            
            {formStatus.message && (
              <div className={`mt-4 p-3 rounded-md text-sm font-medium ${
                formStatus.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
                formStatus.type === 'loading' ? 'bg-sky-100 text-sky-800 border border-sky-200' :
                'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {formStatus.message}
              </div>
            )}
          </form>
        </div>

        {/* RIGHT COLUMN: The AI Assistant */}
        <div className="lg:col-span-1 flex flex-col h-[calc(100vh-120px)] sticky top-6 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <div>
              <div className="font-semibold text-sky-700 text-base">AI Assistant</div>
              <div className="text-xs text-slate-500">Log interaction via chat</div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col gap-3">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-lg text-sm max-w-[85%] leading-relaxed ${
                  m.sender === 'user' 
                    ? 'bg-slate-200 border border-slate-300 text-slate-900 self-end rounded-br-none' 
                    : 'bg-white border border-slate-200 text-slate-700 self-start rounded-bl-none shadow-sm'
                }`}
              >
                {m.text}
              </div>
            ))}
            {chatLoading && (
              <div className="p-3 bg-white border border-slate-200 text-slate-500 italic self-start rounded-lg rounded-bl-none text-sm shadow-sm">
                Processing...
              </div>
            )}
          </div>

          <form onSubmit={handleChatSend} className="flex p-3 bg-white border-t border-slate-200">
            <input 
              type="text" 
              className="flex-1 w-full text-sm border-none bg-transparent focus:outline-none focus:ring-0 px-2" 
              placeholder="Describe interaction..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              disabled={chatLoading}
            />
            <button 
              type="submit" 
              className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors disabled:opacity-70"
              disabled={chatLoading}
            >
              Log
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;