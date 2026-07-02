import { useState, useRef, useEffect } from 'react';

interface Props {
  language: string;
  isSidebar?: boolean;
}

export default function AICopilot({ language, isSidebar = false }: Props) {
  const isHi = language === 'hi';
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      text: isHi 
        ? 'नमस्ते। मैं HealthNexus AI हूँ। मैं आज आपकी जिला स्वास्थ्य सुविधाओं के प्रबंधन में कैसे मदद कर सकता हूँ?' 
        : 'Hello. I am HealthNexus AI. How can I help you manage your district health facilities today?',
      isTable: false
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { icon: 'thunderstorm', text: isHi ? 'मानसून के लिए दवाओं की मांग का पूर्वानुमान' : 'Forecast medicine demand for Monsoon season' },
    { icon: 'priority_high', text: isHi ? 'आज किस PHC में सबसे अधिक जोखिम है?' : 'Which PHC has the highest risk score today?', error: true },
    { icon: 'move_up', text: isHi ? 'IV तरल पदार्थों के लिए पुनर्वितरण योजना बनाएं' : 'Generate redistribution plan for IV Fluids' },
    { icon: 'summarize', text: isHi ? 'इस सप्ताह के अलर्ट का सारांश दें' : 'Summarize this week\'s critical alerts' },
    { icon: 'person_search', text: isHi ? 'किन सुविधाओं में कर्मचारियों की कमी है?' : 'Which facilities have staff shortages?' },
    { icon: 'picture_as_pdf', text: isHi ? 'कार्यकारी पीडीएफ रिपोर्ट तैयार करें' : 'Generate executive PDF report' },
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: text, isTable: false }]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      
      // Mock specific response for risk score question
      if (text.toLowerCase().includes('risk') || text.includes('जोखिम')) {
        setMessages(prev => [...prev, {
          type: 'ai',
          text: isHi 
            ? 'उत्तरी-पश्चिमी ब्लॉक में 8 सुविधाओं के रीयल-टाइम डेटा का विश्लेषण किया जा रहा है। मैंने **2 सुविधाओं** की पहचान की है जो स्टॉक की कमी और कर्मचारियों की अनुपस्थिति के कारण सुरक्षा सीमा को पार कर रही हैं।'
            : "Analyzing real-time data for 8 facilities in the North-Western block. I've identified **2 facilities** currently exceeding the safety threshold due to stock depletion and staff absenteeism.",
          isTable: !isSidebar
        }]);
      } else {
        setMessages(prev => [...prev, {
          type: 'ai',
          text: isHi
            ? 'जिला नैदानिक डेटासेट के साथ आपके अनुरोध को संसाधित कर रहा हूँ... मैंने विश्लेषण तैयार कर लिया है। क्या आप चाहते हैं कि मैं इसे एक रिपोर्ट के रूप में निर्यात करूँ?'
            : 'Processing your request with district clinical datasets... I have generated the analysis. Would you like me to export this as a report or break down the specific facility metrics?',
          isTable: false
        }]);
      }
    }, 1500);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className={`w-full ${isSidebar ? 'h-[360px]' : 'h-[600px]'} border border-outline-variant rounded-xl overflow-hidden flex flex-col ${isSidebar ? '' : 'md:flex-row'} bg-surface-bright shadow-sm`}>
      
      {/* Left Panel: Quick Prompts (35%) */}
      {!isSidebar && (
        <section className="w-full md:w-[35%] bg-surface-container-low border-r border-outline-variant p-6 overflow-y-auto flex flex-col">
          <div className="mb-6">
            <h2 className="text-[20px] leading-[28px] font-semibold text-primary mb-2">AI Copilot</h2>
            <p className="text-[13px] leading-[18px] text-on-surface-variant">
              {isHi ? 'सक्रिय जिला प्रबंधन के लिए रीयल-टाइम स्वास्थ्य बुद्धिमत्ता।' : 'Real-time health intelligence for proactive district management.'}
            </p>
          </div>
          
          <div className="flex-1">
            <h3 className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface opacity-60 mb-4 uppercase">
              {isHi ? 'त्वरित संकेत' : 'Quick Prompts'}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {quickPrompts.map((prompt, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSend(prompt.text)}
                  className="text-left p-4 bg-white border border-outline-variant hover:border-primary hover:bg-primary/5 rounded-lg transition-all group flex items-start gap-3 active:scale-[0.98]"
                >
                  <span className={`material-symbols-outlined ${prompt.error ? 'text-error' : 'text-primary-container'}`}>
                    {prompt.icon}
                  </span>
                  <span className="text-[14px] leading-[20px] text-on-surface group-hover:text-primary">
                    {prompt.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-primary-container/5 rounded-xl border border-primary-container/20">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-primary-container text-[18px]">info</span>
              <span className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-primary-container">
                {isHi ? 'सिस्टम स्थिति' : 'System Status'}
              </span>
            </div>
            <p className="text-[13px] leading-[18px] text-on-surface-variant">
              {isHi ? 'अंतिम डेटा सिंक: ' : 'Last data sync: '}<span className="font-mono">2 mins ago</span>. {isHi ? '42 सुविधाओं पर आधारित विश्लेषण।' : 'Analysis based on 42 connected facilities.'}
            </p>
          </div>
        </section>
      )}

      {/* Right Panel: Chat Conversation (65%) */}
      <section className="flex-1 flex flex-col h-full bg-surface-bright relative min-h-0">
        {/* Chat Header */}
        <header className={`${isSidebar ? 'px-3 py-2' : 'px-6 py-4'} border-b border-outline-variant bg-white/80 backdrop-blur-md flex justify-between items-center shrink-0 z-10`}>
          <div className="flex items-center gap-3">
            <div className={`${isSidebar ? 'w-6 h-6' : 'w-8 h-8'} bg-primary rounded-lg flex items-center justify-center text-white shrink-0`}>
              <span className={`material-symbols-outlined ${isSidebar ? 'text-[16px]' : 'text-[20px]'}`}>smart_toy</span>
            </div>
            <div>
              <h1 className={`${isSidebar ? 'text-[13px] leading-tight' : 'text-[16px] leading-[24px]'} font-semibold text-on-surface`}>
                {isSidebar ? (isHi ? 'एआई कोपायलट' : 'AI Copilot') : (isHi ? 'हेल्थनेक्सस एआई कोपायलट' : 'HealthNexus AI Copilot')}
              </h1>
              {!isSidebar && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant opacity-60">
                    {isHi ? 'सिस्टम ऑनलाइन' : 'System Online'}
                  </p>
                </div>
              )}
            </div>
          </div>
          {!isSidebar && (
            <div className="flex items-center gap-2 bg-surface-container-high px-3 py-1.5 rounded-full">
              <span className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-secondary-fixed-variant">
                Powered by Gemini
              </span>
              <div className="w-5 h-5 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[12px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
            </div>
          )}
        </header>

        {/* Chat Canvas */}
        <div className={`flex-1 overflow-y-auto ${isSidebar ? 'p-3 space-y-3' : 'p-6 space-y-6'} min-h-0`}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 max-w-[90%] ${msg.type === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 ${msg.type === 'user' ? 'bg-secondary' : 'bg-primary'}`}>
                <span className="material-symbols-outlined text-[14px]">{msg.type === 'user' ? 'person' : 'smart_toy'}</span>
              </div>
              <div className="space-y-2 flex-1 min-w-0">
                <div className={`p-3 shadow-sm ${msg.type === 'user' ? 'bg-primary text-white rounded-2xl rounded-tr-none' : 'bg-white border border-outline-variant rounded-2xl rounded-tl-none'}`}>
                  <p className={`text-[12px] leading-[18px] ${msg.type === 'user' ? 'text-white' : 'text-on-surface'} break-words`}>{msg.text}</p>
                </div>
                
                {msg.isTable && !isSidebar && (
                  <div className="bg-white border border-outline-variant p-4 rounded-2xl rounded-tl-none shadow-sm space-y-4 mt-2">
                    <div className="overflow-x-auto rounded-lg border border-outline-variant">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-surface-container-low border-b border-outline-variant">
                            <th className="p-3 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant">FACILITY NAME</th>
                            <th className="p-3 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant">RISK SCORE</th>
                            <th className="p-3 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant">PRIMARY ISSUE</th>
                          </tr>
                        </thead>
                        <tbody className="font-mono text-[13px] leading-[18px]">
                          <tr className="border-b border-outline-variant hover:bg-slate-50 transition-colors">
                            <td className="p-3 text-primary">PHC Green Valley</td>
                            <td className="p-3"><span className="px-1.5 py-[2px] bg-red-100 text-red-800 rounded font-bold">8.9/10</span></td>
                            <td className="p-3">Oxygen Supply &lt; 12h</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 text-primary">CHC Mountain View</td>
                            <td className="p-3"><span className="px-1.5 py-[2px] bg-orange-100 text-orange-800 rounded font-bold">7.4/10</span></td>
                            <td className="p-3">Critical Staff Gap</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase tracking-wide">
                        {isHi ? 'अनुशंसित कार्य:' : 'Recommended Actions:'}
                      </p>
                      <ul className="space-y-1 list-none">
                        <li className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">check_circle</span>
                          <span className="text-[14px] leading-[20px] text-on-surface">Redirect 50 cylinders from District HQ to Green Valley.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">check_circle</span>
                          <span className="text-[14px] leading-[20px] text-on-surface">Mobilize standby nursing staff to CHC Mountain View.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
                
                {msg.type === 'ai' && !isSidebar && (
                  <div className="flex items-center gap-4 pl-4">
                    <button className="flex items-center gap-1.5 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[16px]">thumb_up</span> Helpful
                    </button>
                    <button className="flex items-center gap-1.5 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[16px]">content_copy</span> Copy
                    </button>
                    <button className="flex items-center gap-1.5 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[16px]">refresh</span> Regenerate
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-[90%] animate-pulse">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined text-[14px]">smart_toy</span>
              </div>
              <div className="bg-surface-container-high h-10 w-14 rounded-2xl rounded-tl-none flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 bg-on-surface-variant/40 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-on-surface-variant/40 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-on-surface-variant/40 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input Area */}
        <div className={`${isSidebar ? 'p-3' : 'p-6'} bg-white border-t border-outline-variant shrink-0`}>
          <div className="relative group">
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(inputText);
                }
              }}
              className="w-full bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-2 px-3 pr-10 text-[12px] leading-[16px] resize-none transition-all outline-none text-on-surface placeholder:text-on-surface-variant/60" 
              placeholder={isSidebar ? (isHi ? "पूछें..." : "Ask...") : (isHi ? "किसी भी जिला सुविधा, दवा या अलर्ट के बारे में पूछें..." : "Ask about any district facility, medicine, or alert...")}
              rows={1}
            ></textarea>
            <div className="absolute right-1 bottom-1 flex items-center gap-1">
              <button 
                onClick={() => handleSend(inputText)}
                className="w-8 h-8 bg-primary text-white hover:bg-primary/90 rounded-lg shadow-sm transition-all flex items-center justify-center shrink-0" 
                title="Send message"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
              </button>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex gap-4">
              <button className="flex items-center gap-1.5 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined text-[16px]">attach_file</span>
                {isHi ? 'डेटा संलग्न करें' : 'Attach Data'}
              </button>
              <button className="flex items-center gap-1.5 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined text-[16px]">query_stats</span>
                {isHi ? 'KPI डालें' : 'Insert KPI'}
              </button>
            </div>
            <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant opacity-50 hidden sm:block">
              {isHi ? 'भेजने के लिए Enter दबाएं' : 'Press Enter to send'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
