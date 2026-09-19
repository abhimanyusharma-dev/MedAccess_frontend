import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoSend, IoMicOutline, IoCloseOutline, IoRefreshOutline,
  IoHardwareChip, IoDocumentTextOutline, IoImageOutline,
  IoPersonOutline, IoBulbOutline, IoWaterOutline,
  IoShieldCheckmark, IoCallOutline, IoHeartOutline,
  IoInformationCircleOutline, IoChatbubblesOutline, IoTimeOutline
} from 'react-icons/io5';
import toast from 'react-hot-toast';

// ── AI Response Engine (local mock) ───────────────────────────────────────────
const AI_RESPONSES = {
  default: "I'm your AI Health Assistant. I can help with medicine information, dosage guidance, side effects, drug interactions, and general health queries. How can I assist you today?",
  prescription: "I've analyzed your prescription details. The medicines are typically prescribed for a course of 5-7 days. Make sure to take them after meals and drink plenty of water. Avoid skipping doses. Would you like to know more about any specific medicine?",
  'side effects': "Common side effects depend on the specific medicine. For antibiotics like Azithromycin, side effects include nausea, diarrhea, and stomach cramps. For pain relievers like Paracetamol, side effects are rare but may include allergic reactions. Always consult your doctor if side effects are severe.",
  dosage: "Dosage depends on the medicine, your age, weight, and medical condition. For adults, Paracetamol is typically 500–650 mg every 4–6 hours (max 4g/day). For children, dosage is weight-based. Always follow your doctor's prescription and never self-medicate.",
  'drug interactions': "Drug interactions can be serious. Common ones to watch: Aspirin + Blood Thinners (increased bleeding risk), Antibiotics + Dairy (reduced absorption), NSAIDs + ACE Inhibitors (reduced effectiveness). Please share the specific medicines you're concerned about for a detailed analysis.",
  pharmacies: "Based on your location in Data Colony, Bhopal, nearby pharmacies include:\n\n1. HealthPlus Pharmacy – 0.4 KM (Trust Score: 95/100)\n2. Care Pharmacy – 0.8 KM (Trust Score: 90/100)\n3. MediPlus Pharmacy – 1.2 KM (Trust Score: 87/100)\n\nAll are verified MedAccess partners. Shall I help you reserve medicines at any of them?",
  'health tips': "Here are today's health tips:\n\n💧 Drink at least 8 glasses of water daily\n🥗 Include fresh vegetables in every meal\n🏃 Aim for 30 minutes of physical activity\n😴 Get 7–9 hours of quality sleep\n🧘 Practice mindfulness or meditation for stress\n💊 Never skip prescribed medications\n\nWould you like more specific advice?",
  'first aid': "Basic First Aid guidance:\n\n🩹 Minor cuts: Clean with water, apply antiseptic, cover with bandage\n🔥 Burns: Cool under running water for 10 minutes (not ice)\n🤕 Sprains: RICE – Rest, Ice, Compression, Elevation\n🫀 Chest pain: Call emergency (102) immediately\n\nFor any serious emergency, always call 102 immediately!",
  'common diseases': "Common seasonal diseases in India:\n\n🤧 Cold/Flu: Rest, hydration, paracetamol for fever\n🦟 Dengue: Watch for high fever, body pain, rash\n💧 Typhoid: Prolonged fever, consult doctor for antibiotics\n🤢 Gastritis: Avoid spicy food, stay hydrated\n\nAlways consult a qualified doctor for diagnosis and treatment.",
};

const getAIResponse = (input) => {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(AI_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  if (lower.includes('hello') || lower.includes('hi')) return "Hello! 👋 I'm your AI Health Assistant. How can I help you today? You can ask me about medicines, dosages, side effects, nearby pharmacies, or general health advice.";
  if (lower.includes('medicine') || lower.includes('tablet') || lower.includes('capsule')) return "I can help you with medicine information. Please specify the medicine name and I'll provide details about its uses, dosage, and precautions. Alternatively, you can upload your prescription for a complete analysis.";
  if (lower.includes('fever') || lower.includes('pain') || lower.includes('headache')) return "For fever and pain, Paracetamol (500–650 mg) is commonly recommended for adults. Drink plenty of fluids and rest. If fever exceeds 103°F or persists beyond 3 days, please consult a doctor immediately. Shall I help you find a nearby pharmacy?";
  if (lower.includes('emergency') || lower.includes('urgent') || lower.includes('serious')) return "⚠️ For medical emergencies, please call:\n\n🚨 Emergency: 112\n🏥 Ambulance: 102\n☎️ Poison Control: 1800-116-117\n\nDo not delay emergency care. Is there a specific emergency situation I can guide you through?";
  return `I understand you're asking about "${input}". While I can provide general health information, please consult a qualified healthcare professional for personalized medical advice. Is there anything specific about medicines, dosages, or nearby pharmacies I can help you with?`;
};

const QUICK_SUGGESTIONS = [
  { icon: IoDocumentTextOutline, text: 'Analyze my prescription', color: 'emerald' },
  { icon: IoInformationCircleOutline, text: 'Explain this medicine', color: 'blue' },
  { icon: IoShieldCheckmark, text: 'Nearby pharmacies', color: 'emerald' },
  { icon: IoHeartOutline, text: 'Medicine side effects', color: 'red' },
  { icon: IoTimeOutline, text: 'Dosage information', color: 'amber' },
  { icon: IoHardwareChip, text: 'Drug interactions', color: 'purple' },
  { icon: IoBulbOutline, text: 'Health tips', color: 'emerald' },
  { icon: IoCallOutline, text: 'First aid guidance', color: 'blue' },
];

const HEALTH_INSIGHTS = [
  { title: "Today's Health Tip", content: "Stay hydrated! Aim for 8+ glasses of water. Dehydration can mimic symptoms of fatigue and headache." },
  { title: "Medicine Safety", content: "Never share prescription medicines. What works for one person may be harmful for another." },
  { title: "Emergency Numbers", content: "Ambulance: 102 · Emergency: 112 · Poison Control: 1800-116-117" },
];

const FAQS = [
  "What medicines interact with Metformin?",
  "How to store insulin properly?",
  "Is Paracetamol safe during pregnancy?",
  "What are signs of antibiotic resistance?",
];

const MessageBubble = ({ msg }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
  >
    {/* Avatar */}
    <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center border ${
      msg.role === 'user'
        ? 'bg-dark-bg/50 border-dark-border/60'
        : 'bg-electric-blue/10 border-electric-blue/30 shadow-[0_0_10px_rgba(0,195,255,0.2)]'
    }`}>
      {msg.role === 'user'
        ? <IoPersonOutline className="text-muted-text" size={16} />
        : <IoHardwareChip className="text-electric-blue" size={16} />
      }
    </div>

    {/* Bubble */}
    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
      msg.role === 'user'
        ? 'bg-emerald-green/15 border border-emerald-green/25 text-white rounded-tr-sm'
        : 'bg-dark-bg/60 border border-dark-border/50 text-white/90 rounded-tl-sm'
    }`}>
      {msg.content}
      <div className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-emerald-green/60 text-right' : 'text-muted-text/50'}`}>
        {msg.time}
      </div>
    </div>
  </motion.div>
);

export const AIHealthAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      content: "👋 Hello! I'm your AI Health Assistant.\n\nI can help you with:\n• Medicine information & dosage\n• Prescription analysis\n• Side effects & drug interactions\n• Nearby pharmacies\n• General health guidance & first aid\n\nHow can I assist you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const query = text || input.trim();
    if (!query) return;
    setInput('');

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        content: getAIResponse(query),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      role: 'ai',
      content: "Chat cleared. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
  };

  return (
    <div className="text-left font-poppins h-full flex flex-col" style={{ minHeight: 'calc(100vh - 160px)' }}>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <IoChatbubblesOutline className="text-electric-blue" /> AI Health Assistant
          </h2>
          <p className="text-sm text-muted-text mt-0.5">Powered by MedAccess AI · Healthcare guidance at your fingertips</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-green/10 border border-emerald-green/20 text-xs text-emerald-green">
            <span className="w-2 h-2 rounded-full bg-emerald-green animate-pulse" />
            AI Online
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden min-h-0">

        {/* LEFT PANEL — Quick Suggestions */}
        <div className="w-full lg:w-56 flex-shrink-0 flex flex-col gap-4 overflow-y-auto scrollbar-hide">
          <div className="glass-panel rounded-2xl border border-dark-border/40 p-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <IoBulbOutline className="text-emerald-green" /> Quick Suggestions
            </h4>
            <div className="space-y-2">
              {QUICK_SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s.text)}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-dark-bg/40 border border-dark-border/40 hover:border-emerald-green/30 hover:bg-white/5 transition-all text-left group"
                >
                  <s.icon size={15} className="text-muted-text group-hover:text-emerald-green transition-colors flex-shrink-0" />
                  <span className="text-[11px] text-muted-text group-hover:text-white transition-colors leading-tight">{s.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="glass-panel rounded-2xl border border-dark-border/40 p-4 hidden lg:block">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Frequent Questions</h4>
            <div className="space-y-1.5">
              {FAQS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="w-full text-left text-[10px] text-muted-text hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all leading-snug"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER — Chat Area */}
        <div className="flex-1 flex flex-col glass-panel rounded-2xl border border-dark-border/40 overflow-hidden min-h-0">

          {/* Chat Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-dark-border/40 bg-dark-bg/30 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-electric-blue/10 border border-electric-blue/30 flex items-center justify-center shadow-[0_0_10px_rgba(0,195,255,0.2)]">
                <IoHardwareChip className="text-electric-blue" size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">MedAccess AI</p>
                <p className="text-[10px] text-emerald-green flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-green animate-pulse inline-block" /> Online · Responds instantly
                </p>
              </div>
            </div>
            <button onClick={clearChat} className="p-2 text-muted-text hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Clear chat">
              <IoRefreshOutline size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
            {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-3 items-end"
                >
                  <div className="w-9 h-9 rounded-full bg-electric-blue/10 border border-electric-blue/30 flex items-center justify-center">
                    <IoHardwareChip className="text-electric-blue animate-pulse" size={16} />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-dark-bg/60 border border-dark-border/50">
                    <div className="flex gap-1 items-center h-4">
                      <span className="w-2 h-2 rounded-full bg-electric-blue/70 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-electric-blue/70 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-electric-blue/70 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-dark-border/40 bg-dark-bg/30 flex-shrink-0 space-y-3">
            {/* Suggested Replies */}
            <div className="flex gap-2 flex-wrap">
              {['Tell me about side effects', 'Find nearby pharmacies', 'What dosage is safe?', 'First aid for burns'].map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-[10px] px-3 py-1 rounded-full border border-dark-border/60 bg-dark-bg/50 text-muted-text hover:text-white hover:border-emerald-green/40 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Text Input Row */}
            <div className="flex items-center gap-2">
              {/* Upload buttons */}
              <button
                onClick={() => toast.success('Prescription upload coming soon!', { style: { background: '#0B1728', color: '#FFF', border: '1px solid rgba(255,255,255,0.08)' } })}
                className="p-2.5 rounded-xl border border-dark-border/60 text-muted-text hover:text-emerald-green hover:border-emerald-green/40 transition-colors"
                title="Upload Prescription"
              >
                <IoDocumentTextOutline size={18} />
              </button>
              <button
                onClick={() => toast.success('Image upload coming soon!', { style: { background: '#0B1728', color: '#FFF', border: '1px solid rgba(255,255,255,0.08)' } })}
                className="p-2.5 rounded-xl border border-dark-border/60 text-muted-text hover:text-electric-blue hover:border-electric-blue/40 transition-colors"
                title="Upload Medicine Image"
              >
                <IoImageOutline size={18} />
              </button>

              {/* Text Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about medicines, dosage, side effects..."
                  className="w-full bg-dark-bg/70 border border-dark-border/60 rounded-full py-3 px-5 pr-12 text-sm text-white placeholder:text-muted-text/60 focus:outline-none focus:border-electric-blue/50 transition-colors"
                />
              </div>

              {/* Mic */}
              <button
                className="p-2.5 rounded-xl border border-dark-border/60 text-muted-text hover:text-red-400 hover:border-red-400/40 transition-colors"
                title="Voice input"
              >
                <IoMicOutline size={18} />
              </button>

              {/* Send */}
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isTyping}
                className={`p-2.5 rounded-xl border font-bold transition-all ${
                  input.trim() && !isTyping
                    ? 'bg-emerald-green border-emerald-green text-dark-bg shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                    : 'border-dark-border/60 text-muted-text cursor-not-allowed'
                }`}
              >
                <IoSend size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — Health Insights */}
        <div className="w-full lg:w-56 flex-shrink-0 flex flex-col gap-4 overflow-y-auto scrollbar-hide">

          {/* Health Insights */}
          <div className="glass-panel rounded-2xl border border-dark-border/40 p-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <IoHeartOutline className="text-red-400" /> Health Insights
            </h4>
            <div className="space-y-3">
              {HEALTH_INSIGHTS.map((insight, i) => (
                <div key={i} className="p-3 rounded-xl bg-dark-bg/40 border border-dark-border/40">
                  <h5 className="text-[11px] font-bold text-white mb-1">{insight.title}</h5>
                  <p className="text-[10px] text-muted-text leading-relaxed">{insight.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Water Reminder */}
          <div className="glass-panel rounded-2xl border border-electric-blue/20 p-4 bg-electric-blue/5">
            <div className="flex items-center gap-2 mb-2">
              <IoWaterOutline className="text-electric-blue text-lg" />
              <h4 className="text-xs font-bold text-white">Water Reminder</h4>
            </div>
            <p className="text-[10px] text-muted-text mb-3">You should drink your next glass of water soon!</p>
            <div className="flex gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={`h-5 w-full rounded ${i < 5 ? 'bg-electric-blue/60' : 'bg-dark-bg/50 border border-dark-border/40'}`} />
              ))}
            </div>
            <p className="text-[10px] text-electric-blue mt-1.5 text-right">5/8 glasses</p>
          </div>

          {/* AI Capabilities */}
          <div className="glass-panel rounded-2xl border border-dark-border/40 p-4 hidden lg:block">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">AI Can Help With</h4>
            <ul className="space-y-1.5">
              {['Medicine information', 'Prescription explanation', 'Dosage calculator', 'Side effects lookup', 'Drug interactions', 'Nearby pharmacies', 'Health advice', 'Common diseases', 'First aid guide', 'General wellness'].map(cap => (
                <li key={cap} className="flex items-center gap-2 text-[10px] text-muted-text">
                  <span className="w-1 h-1 rounded-full bg-emerald-green flex-shrink-0" />
                  {cap}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AIHealthAssistant;
